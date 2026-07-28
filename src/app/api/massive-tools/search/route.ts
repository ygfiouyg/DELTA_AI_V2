/**
 * GET /api/massive-tools/search?q=<query>&limit=<n>
 * بيـ search في الـ ToolRegistry (100,000+ tools)
 */
import { NextResponse } from "next/server";
import { searchTools } from "@/lib/massive-tools/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

    if (!q.trim()) {
      return NextResponse.json({ success: false, error: "Query required (?q=...)" }, { status: 400 });
    }

    const results = await searchTools(q, limit);
    return NextResponse.json({
      success: true,
      query: q,
      count: results.length,
      results,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
