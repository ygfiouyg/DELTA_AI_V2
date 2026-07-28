/**
 * V.108: Massive Tool Registry Access Layer
 * ------------------------------------------
 * بيوفر وصول للـ ToolRegistry و SkillRegistry في الـ DB.
 * عدد الأدوات: 100,000+ (metadata-only, JIT install).
 */

import { db } from "@/lib/db";

export interface ToolEntry {
  id: string;
  name: string;
  source: string;
  summary: string;
  description?: string;
  category: string;
  installCmd: string;
  homepage: string;
  repository: string;
  keywords: string;
  author: string;
  license: string;
  version: string;
  stars: number;
  isVerified: boolean;
  isInstalled: boolean;
}

export interface SkillEntry {
  id: string;
  name: string;
  source: string;
  summary: string;
  category: string;
  skillType: string;
  installCmd: string;
  repository: string;
  keywords: string;
  isInstalled: boolean;
}

/** بيـ search الـ tools في الـ DB (SQL LIKE، سريع جداً على SQLite). */
export async function searchTools(query: string, limit = 20): Promise<ToolEntry[]> {
  const q = `%${query.toLowerCase()}%`;
  const rows = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry
    WHERE LOWER(name) LIKE ${q}
       OR LOWER(summary) LIKE ${q}
       OR LOWER(keywords) LIKE ${q}
    ORDER BY isVerified DESC, stars DESC, name ASC
    LIMIT ${limit}
  `;
  return rows as unknown as ToolEntry[];
}

/** بيـ search الـ tools في فئة معينة. */
export async function getToolsByCategory(category: string, limit = 50): Promise<ToolEntry[]> {
  const rows = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry
    WHERE category = ${category}
    ORDER BY isVerified DESC, stars DESC, name ASC
    LIMIT ${limit}
  `;
  return rows as unknown as ToolEntry[];
}

/** بيـ رجّع إحصائيات الـ tools (cached لمدة 60 ثانية عشان نتجنب DB load). */
let _statsCache: { data: any; ts: number } | null = null;
const STATS_CACHE_TTL = 60_000; // 60 seconds

export async function getToolStats() {
  // Return cached if fresh
  if (_statsCache && Date.now() - _statsCache.ts < STATS_CACHE_TTL) {
    return _statsCache.data;
  }
  const total = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry`;
  const bySource = await db.$queryRaw<{source: string, c: number}[]>`
    SELECT source, COUNT(*) as c FROM ToolRegistry GROUP BY source ORDER BY c DESC
  `;
  const byCategory = await db.$queryRaw<{category: string, c: number}[]>`
    SELECT category, COUNT(*) as c FROM ToolRegistry GROUP BY category ORDER BY c DESC LIMIT 15
  `;
  const verified = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry WHERE isVerified = 1`;
  const installed = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry WHERE isInstalled = 1`;

  const skillsTotal = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM SkillRegistry`;
  const skillsBySource = await db.$queryRaw<{source: string, c: number}[]>`
    SELECT source, COUNT(*) as c FROM SkillRegistry GROUP BY source
  `;

  const data = {
    tools: {
      total: Number(total[0]?.c ?? 0),
      verified: Number(verified[0]?.c ?? 0),
      installed: Number(installed[0]?.c ?? 0),
      bySource: bySource.map((r: any) => ({ source: r.source, count: Number(r.c) })),
      byCategory: byCategory.map((r: any) => ({ category: r.category, count: Number(r.c) })),
    },
    skills: {
      total: Number(skillsTotal[0]?.c ?? 0),
      bySource: skillsBySource.map((r: any) => ({ source: r.source, count: Number(r.c) })),
    }
  };
  _statsCache = { data, ts: Date.now() };
  return data;
}

/** بيـ رجّع tools عشوائية للـ system prompt (sample). */
export async function getToolSampleForPrompt(limit = 200): Promise<ToolEntry[]> {
  const verified = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry WHERE isVerified = 1 ORDER BY stars DESC LIMIT ${limit}
  `;
  if (verified.length >= limit) return verified as unknown as ToolEntry[];

  const remaining = limit - verified.length;
  const extra = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry WHERE isVerified = 0 ORDER BY RANDOM() LIMIT ${remaining}
  `;
  return [...(verified as unknown as ToolEntry[]), ...(extra as unknown as ToolEntry[])];
}

/** بيـ mark أداة إنها installed بعد الـ JIT install. */
export async function markToolInstalled(name: string, source: string, installPath: string) {
  await db.$executeRaw`
    UPDATE ToolRegistry
    SET isInstalled = 1, installPath = ${installPath}, updatedAt = datetime('now')
    WHERE name = ${name} AND source = ${source}
  `;
}
