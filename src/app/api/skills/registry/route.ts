/**
 * GET /api/skills/registry
 * بيرجع الـ Global Skill Registry (للأدمن).
 */

import { NextRequest, NextResponse } from "next/server";
import { listGlobalSkills } from "@/lib/skill-registry";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "مطلوب صلاحيات أدمن" }, { status: 403 });
    }

    const skills = await listGlobalSkills();
    return NextResponse.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "خطأ" }, { status: 500 });
  }
}
