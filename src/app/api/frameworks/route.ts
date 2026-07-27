/**
 * GET /api/frameworks
 * بيرجع حالة الـ AI frameworks المتاحة.
 */

import { NextRequest, NextResponse } from "next/server";
import { readFrameworksManifest, getAvailableFrameworks } from "@/lib/framework-discovery";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "مطلوب تسجيل الدخول" }, { status: 401 });
    }

    const manifest = await readFrameworksManifest(true);
    const available = await getAvailableFrameworks();

    return NextResponse.json({
      success: true,
      total: manifest.frameworks.length,
      available: available.length,
      frameworks: manifest.frameworks.map((f) => ({
        name: f.name,
        description: f.description,
        import_name: f.import_name,
        packages: f.packages,
        available: f.available,
        installed_at: f.installed_at,
      })),
      last_updated: manifest.last_updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "خطأ" }, { status: 500 });
  }
}
