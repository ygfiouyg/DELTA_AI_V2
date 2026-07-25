import { NextRequest, NextResponse } from 'next/server';
import { runAgentLoop, getAvailableTools, checkCapability, searchGitHubTools, installTool } from '@/lib/autonomous-agent';

/**
 * POST /api/agent/loop
 * 
 * Full autonomous agent loop:
 * 1. Check if agent has capability
 * 2. Search GitHub if missing
 * 3. Install tool
 * 4. Return result with steps
 *
 * Body: { message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`[AgentLoop] Running for: ${message.substring(0, 80)}...`);

    const result = await runAgentLoop(message);

    return NextResponse.json({
      success: true,
      hasCapability: result.capabilityCheck.hasCapability,
      missingTools: result.capabilityCheck.missingTools,
      searchResults: result.searchResults?.map(r => ({
        name: r.name,
        repo: r.repo,
        description: r.description,
        installType: r.installType,
        url: r.url,
      })),
      installedTool: result.installedTool ? {
        name: result.installedTool.toolName,
        success: result.installedTool.success,
        available: result.installedTool.available,
        message: result.installedTool.message,
      } : null,
      finalMessage: result.finalMessage,
      steps: result.steps,
    });
  } catch (error) {
    console.error('[AgentLoop] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Agent loop failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent/loop
 * Returns available tools
 */
export async function GET() {
  try {
    const tools = await getAvailableTools();
    return NextResponse.json({
      success: true,
      tools,
      count: tools.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get tools' },
      { status: 500 }
    );
  }
}
