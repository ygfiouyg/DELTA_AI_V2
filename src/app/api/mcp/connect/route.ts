import { NextRequest, NextResponse } from 'next/server';
import { connectMCP, getMCPServers } from '@/lib/autonomous-agent';

/**
 * POST /api/mcp/connect
 * 
 * Connect to an MCP server.
 * When user provides an MCP link, the agent starts using it immediately.
 *
 * Body: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'MCP server URL is required' },
        { status: 400 }
      );
    }

    console.log(`[MCP] Connecting to: ${url}`);

    const result = await connectMCP(url);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      tools: result.tools || [],
      toolCount: result.tools?.length || 0,
    });
  } catch (error) {
    console.error('[MCP] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'MCP connection failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mcp/connect
 * Returns connected MCP servers
 */
export async function GET() {
  try {
    const servers = await getMCPServers();
    return NextResponse.json({
      success: true,
      servers,
      count: servers.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get MCP servers' },
      { status: 500 }
    );
  }
}
