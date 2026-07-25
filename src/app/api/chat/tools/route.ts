import { NextRequest, NextResponse } from 'next/server';
import { getToolSchemas, executeToolCall } from '@/lib/tool-registry';

/**
 * GET /api/chat/tools — Get available tool schemas (OpenAI/Anthropic/ZAI format)
 * Query: ?provider=openai|anthropic|zai|generic
 *
 * POST /api/chat/tools — Execute a tool call
 * Body: { tool: string, args: object }
 */
export async function GET(request: NextRequest) {
  const provider = (request.nextUrl.searchParams.get('provider') || 'openai') as any;
  const tools = getToolSchemas(provider);
  return NextResponse.json({ success: true, provider, tools });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      );
    }

    console.log(`[ToolsAPI] Executing tool: ${tool} with args:`, args);
    const result = await executeToolCall(tool, args || {});

    return NextResponse.json({
      success: result.success,
      tool,
      result: result.result,
      data: result.data,
    });
  } catch (error) {
    console.error('[ToolsAPI] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    );
  }
}
