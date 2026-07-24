/**
 * Skill Discovery System — V.61
 * ═══════════════════════════════════════════════════════════════════════
 *
 * بيقرأ ملفات الـ skills من مجلد skills/ وبيعملهم index
 * لما المستخدم يبعت رسالة، بيدور على أفضل skill match
 * وبيحقن محتوى الـ skill في الـ LLM system prompt
 *
 * Architecture:
 * 1. loadSkills() - بيقرأ كل ملفات .md من skills/
 * 2. findMatchingSkills() - بيدور على أفضل skills بناءً على keywords
 * 3. buildSkillSystemPrompt() - بيبني system prompt فيه الـ skills
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface Skill {
  name: string;
  description: string;
  category: string;
  priority: string;
  content: string;
  filePath: string;
}

let _skillsCache: Skill[] | null = null;
let _lastLoadTime = 0;
const CACHE_TTL = 60_000; // 1 minute

/**
 * Read all SKILL.md and *.md files from the skills/ directory
 * Scans both top-level .md files AND subdirectory/SKILL.md files
 */
export async function loadSkills(): Promise<Skill[]> {
  // Cache for 1 minute
  if (_skillsCache && Date.now() - _lastLoadTime < CACHE_TTL) {
    return _skillsCache;
  }

  const skillsDir = path.join(process.cwd(), 'skills');
  const skills: Skill[] = [];

  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      try {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          // Top-level .md file (our custom skills)
          const filePath = path.join(skillsDir, entry.name);
          const content = await fs.readFile(filePath, 'utf-8');
          const skill = parseSkillFile(content, filePath);
          if (skill) skills.push(skill);
        } else if (entry.isDirectory()) {
          // Subdirectory — look for SKILL.md
          const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
          try {
            const content = await fs.readFile(skillFile, 'utf-8');
            const skill = parseSkillFile(content, skillFile);
            if (skill) skills.push(skill);
          } catch {
            // No SKILL.md in this directory — skip
          }
        }
      } catch (e) {
        // Skip this entry on error
      }
    }
  } catch (e) {
    // skills/ directory doesn't exist
    console.log('[SkillDiscovery] No skills/ directory found');
  }

  _skillsCache = skills;
  _lastLoadTime = Date.now();
  console.log(`[SkillDiscovery] Loaded ${skills.length} skills from skills/`);
  return skills;
}

/**
 * Parse a skill .md file - extract frontmatter + content
 */
function parseSkillFile(content: string, filePath: string): Skill | null {
  // Parse YAML frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    // No frontmatter, use filename as name
    const name = path.basename(filePath, '.md');
    return {
      name,
      description: '',
      category: 'general',
      priority: 'medium',
      content: content.trim(),
      filePath,
    };
  }

  const frontmatter = fmMatch[1];
  const body = fmMatch[2].trim();

  const name = extractYamlField(frontmatter, 'name') || path.basename(filePath, '.md');
  const description = extractYamlField(frontmatter, 'description') || '';
  const category = extractYamlField(frontmatter, 'category') || 'general';
  const priority = extractYamlField(frontmatter, 'priority') || 'medium';

  return {
    name,
    description,
    category,
    priority,
    content: body,
    filePath,
  };
}

function extractYamlField(yaml: string, field: string): string | null {
  const match = yaml.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
}

/**
 * Find the best matching skills for a user prompt
 * Uses keyword matching + category scoring
 */
export async function findMatchingSkills(
  userPrompt: string,
  maxResults: number = 3,
): Promise<Skill[]> {
  const skills = await loadSkills();
  if (skills.length === 0) return [];

  const promptLower = userPrompt.toLowerCase();

  // Score each skill based on keyword matches
  const scored = skills.map(skill => {
    let score = 0;
    const descLower = skill.description.toLowerCase();
    const contentLower = skill.content.toLowerCase();
    const nameLower = skill.name.toLowerCase();

    // Score by category keywords
    const categoryKeywords: Record<string, string[]> = {
      'pdf-design': ['pdf', 'ملف', 'مستند', 'تصميم', 'pdf', 'document'],
      'content-quality': ['لخص', 'تلخيص', 'summarize', 'تحليل', 'analysis', 'ملخص'],
      'visual-design': ['تصميم', 'بصري', 'visual', 'kpi', 'timeline', 'chart'],
      'localization': ['عربي', 'arabic', 'rtl', 'ترجمة'],
    };

    const keywords = categoryKeywords[skill.category] || [];
    for (const kw of keywords) {
      if (promptLower.includes(kw)) score += 10;
    }

    // Score by description keywords
    const descWords = descLower.split(/\s+/).filter(w => w.length > 4);
    for (const word of descWords) {
      if (promptLower.includes(word)) score += 2;
    }

    // Score by name match
    if (nameLower.split(/[\s-]+/).some(w => w.length > 3 && promptLower.includes(w))) {
      score += 5;
    }

    // Priority bonus
    if (skill.priority === 'high') score += 3;
    if (skill.priority === 'medium') score += 1;

    return { skill, score };
  });

  // Sort by score and return top results
  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.skill);

  return top;
}

/**
 * Build a system prompt that includes the matched skills
 */
export async function buildSkillSystemPrompt(
  userPrompt: string,
  baseSystemPrompt?: string,
): Promise<string> {
  const matchedSkills = await findMatchingSkills(userPrompt, 3);

  if (matchedSkills.length === 0) {
    return baseSystemPrompt || '';
  }

  let prompt = baseSystemPrompt || 'أنت مساعد ذكي في منصة DeltaAI.';
  prompt += '\n\n═══ المهارات المكتسبة (Acquired Skills) ═══\n\n';
  prompt += 'لديك مهارات خاصة يجب تطبيقها في ردك. اتبع تعليماتها بدقة:\n\n';

  for (const skill of matchedSkills) {
    prompt += `── ${skill.name} ──\n`;
    prompt += `${skill.content}\n\n`;
  }

  prompt += '═══ نهاية المهارات ═══\n\n';
  prompt += 'طبق المهارات دي في ردك على المستخدم.';

  console.log(`[SkillBlender] Injected ${matchedSkills.length} skills: ${matchedSkills.map(s => s.name).join(', ')}`);
  return prompt;
}

/**
 * Get skill metadata for UI display
 */
export async function getSkillsMetadata(): Promise<Array<{name: string; description: string; category: string}>> {
  const skills = await loadSkills();
  return skills.map(s => ({
    name: s.name,
    description: s.description,
    category: s.category,
  }));
}
