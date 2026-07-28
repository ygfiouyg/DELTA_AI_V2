/**
 * POST /api/massive-tools/exec
 * body: { tool: string, args: object }
 * بيـ execute callable tool فعلياً ويرجّع النتيجة.
 */
import { NextResponse } from "next/server";
import { executeCallableTool, getToolsSchema } from "@/lib/massive-tools/callable-tools";

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

    const result = await executeCallableTool(tool, args || {});
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

/** GET — بيـ رجّع كل الـ callable tools schema */
export async function GET() {
  return NextResponse.json({
    success: true,
    tools: getToolsSchema(),
    count: getToolsSchema().length,
  });
}
