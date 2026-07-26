/**
 * Skill Indexer & JIT Context Injector — V.95
 * ═══════════════════════════════════════════════════════════════════════
 *
 * الفكرة: بدل ما نـ clone frameworks كبيرة (LangChain, AutoGPT) اللي هتكسر الـ build،
 * نـ index الـ 66 skills الموجودة بالفعل في /skills/ ونـ inject الـ SKILL.md
 * instructions في الـ system prompt عند الحاجة (JIT).
 *
 * Architecture:
 *   1. SkillIndexer — بيـ scan /skills/*/SKILL.md ويعمل index
 *   2. JIT Context Injector — لما الـ LLM يـ detect intent، بيبعت الـ SKILL.md المناسب
 *   3. Skill Registry integration — كل skill جديد يتسجّل تلقائياً
 *
 * الـ index بيتـ cache في الـ memory + على disk (skills_index.json).
 */

import { promises as fs } from "fs";
import path from "path";

const SKILLS_DIR = path.join(process.cwd(), "skills");
const INDEX_PATH = path.join(process.cwd(), "skills_index.json");

export interface IndexedSkill {
  name: string;
  path: string;
  description: string;
  skillMdPath: string;
  skillMdSize: number;
  triggers: string[]; // كلمات مفتاحية من الـ description
  lastIndexed: string;
}

export interface SkillsIndex {
  version: string;
  lastIndexed: string;
  skills: IndexedSkill[];
}

let _cachedIndex: SkillsIndex | null = null;

/**
 * بيـ parse الـ SKILL.md frontmatter ويرجع description + metadata.
 */
function parseSkillMd(content: string): { description: string; name: string } {
  // frontmatter بين --- --- في الأول
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    // fallback: أول سطرين
    const lines = content.split("\n").filter((l) => l.trim()).slice(0, 2);
    return { description: lines.join(" ").slice(0, 300), name: "" };
  }

  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/description:\s*["']?([^"'\n]+)["']?/m);

  return {
    name: nameMatch?.[1]?.trim() || "",
    description: descMatch?.[1]?.trim() || "",
  };
}

/**
 * بيستخرج keywords من نص (للـ matching).
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "this", "that", "these", "those",
    "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "up", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "under", "over", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "any",
    "both", "each", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "just", "don", "now", "tool", "skill", "using", "use",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // رجّع unique keywords (حد 20)
  return Array.from(new Set(words)).slice(0, 20);
}

/**
 * بيـ scan /skills/ directory ويعمل index لكل SKILL.md.
 */
export async function indexSkills(force = false): Promise<SkillsIndex> {
  if (_cachedIndex && !force) return _cachedIndex;

  // اقرا الـ index من disk لو موجود
  if (!force) {
    try {
      const content = await fs.readFile(INDEX_PATH, "utf-8");
      _cachedIndex = JSON.parse(content);
      return _cachedIndex!;
    } catch {}
  }

  const skills: IndexedSkill[] = [];

  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = path.join(SKILLS_DIR, entry.name);
      const skillMdPath = path.join(skillDir, "SKILL.md");

      try {
        const content = await fs.readFile(skillMdPath, "utf-8");
        const parsed = parseSkillMd(content);
        const stat = await fs.stat(skillMdPath);

        skills.push({
          name: parsed.name || entry.name,
          path: skillDir,
          description: parsed.description.slice(0, 300),
          skillMdPath,
          skillMdSize: stat.size,
          triggers: extractKeywords(parsed.description + " " + entry.name),
          lastIndexed: new Date().toISOString(),
        });
      } catch {
        // مفيش SKILL.md — skip
      }
    }
  } catch (err) {
    console.warn("[SkillIndexer] Failed to scan skills dir:", err);
  }

  _cachedIndex = {
    version: "1.0",
    lastIndexed: new Date().toISOString(),
    skills,
  };

  // احفظ على disk
  try {
    await fs.writeFile(INDEX_PATH, JSON.stringify(_cachedIndex, null, 2), "utf-8");
  } catch (err) {
    console.warn("[SkillIndexer] Failed to save index:", err);
  }

  console.log(`[SkillIndexer] Indexed ${skills.length} skills`);
  return _cachedIndex;
}

/**
 * بيدور على skills matching طلب المستخدم.
 * بيرجع أعلى N matches.
 */
export async function findMatchingSkills(userMessage: string, topN = 3): Promise<IndexedSkill[]> {
  const index = await indexSkills();
  const messageLower = userMessage.toLowerCase();
  const messageWords = new Set(
    messageLower
      .replace(/[^\w\s\u0600-\u06FF]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  const scored = index.skills.map((skill) => {
    let score = 0;
    // exact name match
    if (messageLower.includes(skill.name.toLowerCase())) score += 10;
    // keyword match
    for (const trigger of skill.triggers) {
      if (messageWords.has(trigger)) score += 1;
      if (messageLower.includes(trigger)) score += 0.5;
    }
    // description keywords
    const descWords = skill.description.toLowerCase().split(/\s+/);
    for (const w of descWords) {
      if (w.length > 3 && messageLower.includes(w)) score += 0.3;
    }
    return { skill, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.skill);
}

/**
 * JIT Context Injection — بيرجع SKILL.md content لـ skill معين.
 * ده اللي بيتـ inject في الـ system prompt.
 */
export async function getSkillContext(skillName: string, maxChars = 4000): Promise<string | null> {
  const index = await indexSkills();
  const skill = index.skills.find(
    (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.path.endsWith("/" + skillName)
  );
  if (!skill) return null;

  try {
    const content = await fs.readFile(skill.skillMdPath, "utf-8");
    // truncation لو الـ SKILL.md كبير
    if (content.length <= maxChars) return content;
    return content.slice(0, maxChars) + "\n\n[... truncated ...]";
  } catch {
    return null;
  }
}

/**
 * بيرجع context لكل الـ matching skills (للـ system prompt).
 */
export async function getMatchingSkillsContext(userMessage: string, maxTotalChars = 8000): Promise<string> {
  const matches = await findMatchingSkills(userMessage, 3);
  if (matches.length === 0) return "";

  const sections: string[] = [];
  let totalChars = 0;

  for (const skill of matches) {
    const context = await getSkillContext(skill.name, 3000);
    if (!context) continue;

    const section = `\n\n## Skill Available: ${skill.name}\n${context}`;
    if (totalChars + section.length > maxTotalChars) break;

    sections.push(section);
    totalChars += section.length;
  }

  return sections.join("\n");
}

/**
 * بيرجع الـ index كامل (للأدمن).
 */
export async function getSkillsIndex(): Promise<SkillsIndex> {
  return await indexSkills();
}

/**
 * بيعمل refresh للـ index (للأدمن).
 */
export async function refreshSkillsIndex(): Promise<{ indexed: number }> {
  _cachedIndex = null;
  const index = await indexSkills(true);
  return { indexed: index.skills.length };
}
