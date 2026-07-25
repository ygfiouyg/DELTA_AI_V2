/**
 * Skill Installer — V.64
 * بيـ install skills من GitHub على طول لما الـ LLM يطلبها
 * V.64: SECURITY — validates skill content before saving (blocks IoT instructions)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { validateSkillContent } from './namespace-router';

const SKILLS_DIR = path.join(process.cwd(), 'skills');

/**
 * Known skill repositories for common tasks
 * V.63: Using actual skillsgate test skills + our local skills
 */
const SKILL_CATALOG: Record<string, { repo: string; path: string }> = {
  'presentation': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'powerpoint': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'slides': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'chart': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'pdf': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'image': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'code': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'analysis': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
  'test': { repo: 'skillsgate/skillsgate', path: 'packages/cli/test-skill' },
};

interface InstallResult {
  success: boolean;
  message: string;
  skillName?: string;
  filePath?: string;
}

/**
 * Install a skill from GitHub
 */
export async function installSkillFromGitHub(
  searchQuery: string,
  githubUrl?: string
): Promise<InstallResult> {
  await fs.mkdir(SKILLS_DIR, { recursive: true });

  // If direct GitHub URL provided, download it
  if (githubUrl) {
    return await downloadFromUrl(githubUrl);
  }

  // Search the catalog for a matching skill
  const queryLower = searchQuery.toLowerCase();
  for (const [keyword, source] of Object.entries(SKILL_CATALOG)) {
    if (queryLower.includes(keyword)) {
      console.log(`[SkillInstaller] Found catalog match: ${keyword} → ${source.repo}`);
      const result = await fetchFromRepo(source.repo, source.path);
      if (result.success) return result;
    }
  }

  // Try skills.sh search
  const result = await searchSkillsSh(searchQuery);
  if (result.success) return result;

  return {
    success: false,
    message: `No skill found for "${searchQuery}". Try providing a direct GitHub URL.`,
  };
}

/**
 * Download a SKILL.md from a direct URL
 */
async function downloadFromUrl(url: string): Promise<InstallResult> {
  try {
    let rawUrl = url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      rawUrl = url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }

    const resp = await fetch(rawUrl, { headers: { 'User-Agent': 'DeltaAI' } });
    if (!resp.ok) {
      return { success: false, message: `Download failed: ${resp.status}` };
    }

    const content = await resp.text();
    if (!content.includes('#') && !content.includes('---')) {
      return { success: false, message: 'Content is not a valid skill file' };
    }

    // V.64: SECURITY — validate skill content before saving
    const validation = validateSkillContent(content);
    if (!validation.valid) {
      console.warn(`[SECURITY] Skill from ${url} blocked:`, validation.violations);
      return {
        success: false,
        message: `[BLOCKED] Skill contains IoT/Home Assistant control instructions: ${validation.violations.join('; ')}. Only document/skill tools are allowed.`,
      };
    }

    const urlPath = new URL(rawUrl).pathname;
    const originalName = urlPath.split('/').pop() || `skill-${randomUUID()}.md`;
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = safeName.endsWith('.md') ? safeName : `${safeName}.md`;
    const filePath = path.join(SKILLS_DIR, fileName);

    // V.64: Save the sanitized content (IoT patterns removed)
    await fs.writeFile(filePath, validation.sanitized, 'utf-8');
    console.log(`[SkillInstaller] ✅ Installed skill from URL: ${fileName} (validated safe)`);

    return {
      success: true,
      message: `Skill "${fileName}" installed successfully from GitHub URL (validated safe)`,
      skillName: fileName.replace('.md', ''),
      filePath,
    };
  } catch (e) {
    return { success: false, message: `Download error: ${e instanceof Error ? e.message : String(e)}` };
  }
}

/**
 * Fetch a skill from a GitHub repo
 */
async function fetchFromRepo(repo: string, skillPath: string): Promise<InstallResult> {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${skillPath}/SKILL.md`;
    const resp = await fetch(rawUrl, { headers: { 'User-Agent': 'DeltaAI' } });

    if (!resp.ok) {
      return { success: false, message: `Skill not found at ${repo}/${skillPath}` };
    }

    const content = await resp.text();
    const dirName = path.basename(skillPath);
    const targetDir = path.join(SKILLS_DIR, dirName);
    await fs.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, 'SKILL.md');
    await fs.writeFile(filePath, content, 'utf-8');

    console.log(`[SkillInstaller] ✅ Installed from repo: ${dirName}`);

    return {
      success: true,
      message: `Skill "${dirName}" installed from ${repo}`,
      skillName: dirName,
      filePath,
    };
  } catch (e) {
    return { success: false, message: `Repo fetch error: ${e instanceof Error ? e.message : String(e)}` };
  }
}

/**
 * Search skills.sh for a skill
 */
async function searchSkillsSh(query: string): Promise<InstallResult> {
  try {
    // skills.sh doesn't have a public API, but we can try common patterns
    const searchUrl = `https://www.skills.sh/skills?q=${encodeURIComponent(query)}`;
    const resp = await fetch(searchUrl, { headers: { 'User-Agent': 'DeltaAI' } });

    if (!resp.ok) {
      return { success: false, message: 'skills.sh search unavailable' };
    }

    const html = await resp.text();
    // Look for skill links in the HTML
    const skillLinks = html.match(/href="\/skill\/[^"]+"/g) || [];

    if (skillLinks.length === 0) {
      return { success: false, message: `No skills found on skills.sh for "${query}"` };
    }

    // Try to fetch the first skill
    const firstLink = skillLinks[0].match(/href="([^"]+)"/)?.[1];
    if (firstLink) {
      const skillUrl = `https://www.skills.sh${firstLink}`;
      const skillResp = await fetch(skillUrl, { headers: { 'User-Agent': 'DeltaAI' } });
      if (skillResp.ok) {
        const skillHtml = await skillResp.text();
        // Extract SKILL.md content from the page
        const mdMatch = skillHtml.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
        if (mdMatch) {
          const content = mdMatch[1].replace(/<[^>]+>/g, '').trim();
          const fileName = `skills-sh-${Date.now()}.md`;
          const filePath = path.join(SKILLS_DIR, fileName);
          await fs.writeFile(filePath, content, 'utf-8');
          return {
            success: true,
            message: `Skill "${fileName}" installed from skills.sh`,
            skillName: fileName.replace('.md', ''),
            filePath,
          };
        }
      }
    }

    return { success: false, message: 'Could not extract skill from skills.sh' };
  } catch (e) {
    return { success: false, message: `skills.sh error: ${e instanceof Error ? e.message : String(e)}` };
  }
}
