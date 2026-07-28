/**
 * GET /api/massive-tools/stats
 * بيرجّع إحصائيات الـ tools و skills (total count, by source, by category)
 */
import { NextResponse } from "next/server";
import { getToolStats } from "@/lib/massive-tools/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getToolStats();
    return NextResponse.json({ success: true, ...stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
