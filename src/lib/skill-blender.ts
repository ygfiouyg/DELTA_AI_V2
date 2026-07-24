/**
 * Skill Blender — V.61
 * ═══════════════════════════════════════════════════════════════════════
 *
 * بيربط الـ skills المكتشفة بـ LLM pipeline.
 * بيحقن محتوى الـ skills في الـ system prompt قبل ما الـ LLM يبدأ شغله.
 */

import { findMatchingSkills, buildSkillSystemPrompt, type Skill } from './skill-discovery';

/**
 * Enhance a system prompt with matched skills
 */
export async function enhancePromptWithSkills(
  userPrompt: string,
  basePrompt: string,
): Promise<{ prompt: string; matchedSkills: Skill[] }> {
  const matchedSkills = await findMatchingSkills(userPrompt, 3);
  const enhanced = await buildSkillSystemPrompt(userPrompt, basePrompt);
  return { prompt: enhanced, matchedSkills };
}

/**
 * Get skills that would match a prompt (for logging/debugging)
 */
export async function previewSkillMatches(userPrompt: string): Promise<string[]> {
  const skills = await findMatchingSkills(userPrompt, 5);
  return skills.map(s => s.name);
}
