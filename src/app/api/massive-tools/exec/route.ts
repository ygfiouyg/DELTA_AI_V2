/**
 * POST /api/massive-tools/exec
 * body: { tool: string, args: object }
 * بيـ execute callable tool فعلياً ويرجّع النتيجة.
 */
import { NextResponse } from "next/server";
import { executeCallableTool, getToolsSchema } from "@/lib/massive-tools/callable-tools";
import { ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json({ success: false, error: "tool name required" }, { status: 400 });
    }

    // First try massive-tools callable tools
    let result = await executeCallableTool(tool, args || {});
    
    // If not found, try agent tools (includes standalone tools)
    if (!result.success && result.error?.includes("not found")) {
      const agentTool = ALL_AGENT_TOOLS.find(t => t.name === tool);
      if (agentTool) {
        const start = Date.now();
        try {
          const output = await agentTool.execute(args || {});
          result = { success: true, output, durationMs: Date.now() - start };
        } catch (e: any) {
          result = { success: false, output: "", error: e.message, durationMs: Date.now() - start };
        }
      }
    }

    return NextResponse.json({
      success: result.success,
      tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/** GET — بيـ رجّع كل الـ callable tools schema (massive + agent) */
export async function GET() {
  const massiveTools = getToolsSchema();
  const agentTools = ALL_AGENT_TOOLS.map(t => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.parameters } },
    category: t.category,
    package: t.package,
  }));
  return NextResponse.json({
    success: true,
    tools: [...massiveTools, ...agentTools],
    count: massiveTools.length + agentTools.length,
  });
}
