/**
 * GET /api/hermes/skills
 * بيـ list كل الـ skills المتاحة في Hermes Agent.
 */

import { NextResponse } from "next/server";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

export async function GET() {
  try {
    const skillsPath = path.join(HERMES_HOME, "skills");
    if (!existsSync(skillsPath)) {
      return NextResponse.json({
        success: true,
        skills: [],
        count: 0,
      });
    }

    const skills: Array<{
      name: string;
      description: string;
      has_skill_md: boolean;
    }> = [];

    const entries = readdirSync(skillsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const skillMdPath = path.join(skillsPath, entry.name, "SKILL.md");
      let description = "";
      if (existsSync(skillMdPath)) {
        try {
          const content = readFileSync(skillMdPath, "utf-8");
          // Extract first meaningful line after title
          const lines = content.split("\n");
          for (const line of lines.slice(1, 10)) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
              description = trimmed.slice(0, 200);
              break;
            }
          }
        } catch {}
      }
      skills.push({
        name: entry.name,
        description,
        has_skill_md: existsSync(skillMdPath),
      });
    }

    return NextResponse.json({
      success: true,
      skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
      count: skills.length,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      skills: [],
    });
  }
}
