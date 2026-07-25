/**
 * Tool Registry — V.64 Omni-Agent with Context Isolation
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Universal tool registry with JSON schemas compatible with all model providers.
 * V.64: STRICT CONTEXT ISOLATION — IoT/Home Assistant tools are BLOCKED.
 *
 * The autonomous_install_skill tool lets ANY model install skills on demand.
 * The search_skills tool lets ANY model search local skills.
 *
 * Security: Only safe document/skill tools are exposed to models.
 */

import { filterToolsForChat, isToolBlocked, logBlockedTool } from './namespace-router';

export interface ToolSchema {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

/**
 * The autonomous_install_skill tool — lets the LLM install skills on demand
 */
export const AUTONOMOUS_INSTALL_SKILL_SCHEMA: ToolSchema = {
  type: 'function',
  function: {
    name: 'autonomous_install_skill',
    description: 'Search for and install a skill from SkillsGate/GitHub when the current task requires capabilities not available locally. Use this tool when you encounter a specialized workflow (e.g., creating presentations, analyzing images, generating charts) that needs specific instructions. The skill will be downloaded and made available for immediate use.',
    parameters: {
      type: 'object',
      properties: {
        search_query: {
          type: 'string',
          description: 'A search query describing the skill needed. Examples: "powerpoint presentation builder", "image analysis tool", "chart generator", "code reviewer"'
        },
        github_url: {
          type: 'string',
          description: 'Optional: direct GitHub URL to a SKILL.md file. If provided, skips search and downloads directly.'
        }
      },
      required: ['search_query']
    }
  }
};

/**
 * The search_skills tool — lets the LLM search local skills
 */
export const SEARCH_SKILLS_SCHEMA: ToolSchema = {
  type: 'function',
  function: {
    name: 'search_skills',
    description: 'Search locally installed skills to find matching capabilities. Use this before autonomous_install_skill to check if the needed skill is already available.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query describing what you need'
        }
      },
      required: ['query']
    }
  }
};

/**
 * Get all available tool schemas for a specific model provider
 * V.64: Applies strict context isolation — blocks IoT/Home Assistant tools
 */
export function getToolSchemas(provider: 'openai' | 'anthropic' | 'zai' | 'generic' = 'openai'): any[] {
  // V.64: Only safe tools are registered — IoT tools are NEVER included
  const tools = [SEARCH_SKILLS_SCHEMA, AUTONOMOUS_INSTALL_SKILL_SCHEMA];

  // V.64: Security gate — filter out any blocked tools
  const safeTools = filterToolsForChat(tools);

  // Log if any tools were blocked (shouldn't happen, but safety net)
  if (safeTools.length < tools.length) {
    console.warn(`[SECURITY] ${tools.length - safeTools.length} tools blocked during schema generation`);
  }

  // OpenAI format (also works for ZAI/GLM)
  if (provider === 'openai' || provider === 'zai' || provider === 'generic') {
    return safeTools;
  }

  // Anthropic format
  if (provider === 'anthropic') {
    return safeTools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
  }

  return safeTools;
}

/**
 * Execute a tool call and return the result
 * V.64: SECURITY GATE — blocks IoT/Home Assistant tools
 */
export async function executeToolCall(
  toolName: string,
  args: any
): Promise<{ success: boolean; result: string; data?: any }> {
  // V.64: SECURITY GATE — block IoT/Home Assistant tools
  if (isToolBlocked(toolName)) {
    logBlockedTool(toolName, 'executeToolCall');
    return {
      success: false,
      result: `[BLOCKED] Tool "${toolName}" is an IoT/Home Assistant tool and cannot be executed in chat context. Only document and skill tools are allowed.`,
    };
  }

  try {
    switch (toolName) {
      case 'search_skills': {
        const { findMatchingSkills } = await import('./skill-discovery');
        const skills = await findMatchingSkills(args.query || '', 5);
        if (skills.length === 0) {
          return {
            success: true,
            result: 'No matching skills found locally. Consider using autonomous_install_skill to fetch from GitHub.',
          };
        }
        return {
          success: true,
          result: `Found ${skills.length} matching skills:\n${skills.map(s => `- ${s.name}: ${s.description.substring(0, 100)}`).join('\n')}`,
          data: skills.map(s => ({ name: s.name, description: s.description, category: s.category })),
        };
      }

      case 'autonomous_install_skill': {
        const { installSkillFromGitHub } = await import('./skill-installer');
        const result = await installSkillFromGitHub(args.search_query, args.github_url);
        return {
          success: result.success,
          result: result.message,
          data: result,
        };
      }

      default:
        // V.64: Any other tool is rejected unless explicitly allowed
        logBlockedTool(toolName, 'executeToolCall:unknown');
        return {
          success: false,
          result: `[REJECTED] Tool "${toolName}" is not in the allowed tool scope. Only autonomous_install_skill and search_skills are permitted in chat context.`,
        };
    }
  } catch (error) {
    return {
      success: false,
      result: `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
