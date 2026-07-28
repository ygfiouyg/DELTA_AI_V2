/**
 * POST /api/massive-tools/install
 * body: { name: string, source?: string }
 * بيـ install أداة JIT (pip / npm / git clone) ويرجّع النتيجة.
 */
import { NextResponse } from "next/server";
import { installTool, searchAndInstall } from "@/lib/massive-tools/jit-installer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, source, query } = body;

    if (!name && !query) {
      return NextResponse.json({ success: false, error: "name or query required" }, { status: 400 });
    }

    const result = name
      ? await installTool(name, source)
      : await searchAndInstall(query);

    return NextResponse.json({
      success: result.success,
      tool: result.tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
