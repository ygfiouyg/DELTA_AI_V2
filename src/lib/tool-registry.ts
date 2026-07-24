/**
 * Tool Registry — V.63 Omni-Agent
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Universal tool registry with JSON schemas compatible with all model providers:
 * - OpenAI function calling format
 * - Anthropic tools format
 * - ZAI/GLM format
 *
 * The autonomous_install_skill tool lets ANY model install skills on demand.
 */

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
 */
export function getToolSchemas(provider: 'openai' | 'anthropic' | 'zai' | 'generic' = 'openai'): any[] {
  const tools = [SEARCH_SKILLS_SCHEMA, AUTONOMOUS_INSTALL_SKILL_SCHEMA];

  // OpenAI format (also works for ZAI/GLM)
  if (provider === 'openai' || provider === 'zai' || provider === 'generic') {
    return tools;
  }

  // Anthropic format
  if (provider === 'anthropic') {
    return tools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
  }

  return tools;
}

/**
 * Execute a tool call and return the result
 */
export async function executeToolCall(
  toolName: string,
  args: any
): Promise<{ success: boolean; result: string; data?: any }> {
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
        return {
          success: false,
          result: `Unknown tool: ${toolName}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      result: `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
