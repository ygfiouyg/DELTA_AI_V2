#!/usr/bin/env node
/**
 * Bulk Skills Sync Script — V.62
 * بيـ fetch skills من GitHub repos ويـ indexهم محلياً
 */

import { promises as fs } from 'fs';
import path from 'path';

interface GitHubSkill {
  name: string;
  description: string;
  url: string;
  category: string;
}

interface SkillIndex {
  version: string;
  totalSkills: number;
  lastSync: string;
  skills: Array<{
    name: string;
    description: string;
    keywords: string[];
    file: string;
  }>;
}

const SKILLS_DIR = path.join(process.cwd(), 'skills');
const INDEX_FILE = path.join(process.cwd(), 'skills-index.json');

async function fetchSkillsFromRepo(repo: string): Promise<GitHubSkill[]> {
  console.log(`[BulkSync] Fetching skills from ${repo}...`);
  const treeUrl = `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`;
  const treeResp = await fetch(treeUrl, { headers: { 'User-Agent': 'DeltaAI-BulkSync' } });
  if (!treeResp.ok) throw new Error(`Failed to fetch tree: ${treeResp.status}`);
  const tree = await treeResp.json();
  const skillFiles = tree.tree.filter((node: any) =>
    node.path.endsWith('SKILL.md') || node.path.endsWith('skill.md')
  );
  console.log(`[BulkSync] Found ${skillFiles.length} SKILL.md files in ${repo}`);
  const skills: GitHubSkill[] = [];
  for (const file of skillFiles) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${file.path}`;
      const content = await (await fetch(rawUrl)).text();
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let name = path.basename(path.dirname(file.path));
      let description = '';
      if (fmMatch) {
        const fm = fmMatch[1];
        const nameMatch = fm.match(/^name:\s*(.+)$/m);
        const descMatch = fm.match(/^description:\s*(.+)$/m);
        if (nameMatch) name = nameMatch[1].trim().replace(/^["']|["']$/g, '');
        if (descMatch) description = descMatch[1].trim().replace(/^["']|["']$/g, '');
      }
      skills.push({ name, description, url: rawUrl, category: path.dirname(file.path).split('/')[0] || 'general' });
    } catch (e) { console.error(`[BulkSync] Failed: ${file.path}`); }
  }
  return skills;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','ال','في','من','على','إلى','عن','مع','هذا','هذه','ذلك','كان','كانت']);
  return [...new Set(text.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w)))].slice(0, 20);
}

function buildIndex(skills: GitHubSkill[]): SkillIndex {
  return {
    version: '1.0.0', totalSkills: skills.length, lastSync: new Date().toISOString(),
    skills: skills.map(s => ({ name: s.name, description: s.description, keywords: extractKeywords(s.name + ' ' + s.description), file: s.name })),
  };
}

async function main() {
  console.log('═══ DeltaAI Bulk Skills Sync ═══\n');
  const repos = ['skillsgate/skillsgate'];
  let allSkills: GitHubSkill[] = [];
  for (const repo of repos) {
    try { const s = await fetchSkillsFromRepo(repo); allSkills = allSkills.concat(s); console.log(`[BulkSync] ✓ ${repo}: ${s.length} skills`); }
    catch (e) { console.error(`[BulkSync] ✗ ${repo} failed`); }
  }
  // Include local skills
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const content = await fs.readFile(path.join(SKILLS_DIR, entry.name, 'SKILL.md'), 'utf-8');
          const fm = content.match(/^---\n([\s\S]*?)\n---/);
          let name = entry.name, desc = '';
          if (fm) { const n = fm[1].match(/^name:\s*(.+)$/m); const d = fm[1].match(/^description:\s*(.+)$/m); if (n) name = n[1].trim().replace(/^["']|["']$/g, ''); if (d) desc = d[1].trim().replace(/^["']|["']$/g, ''); }
          allSkills.push({ name, description: desc, url: `local://${entry.name}`, category: entry.name });
        } catch {}
      } else if (entry.name.endsWith('.md')) {
        const content = await fs.readFile(path.join(SKILLS_DIR, entry.name), 'utf-8');
        const fm = content.match(/^---\n([\s\S]*?)\n---/);
        let name = entry.name.replace('.md', ''), desc = '';
        if (fm) { const n = fm[1].match(/^name:\s*(.+)$/m); const d = fm[1].match(/^description:\s*(.+)$/m); if (n) name = n[1].trim().replace(/^["']|["']$/g, ''); if (d) desc = d[1].trim().replace(/^["']|["']$/g, ''); }
        allSkills.push({ name, description: desc, url: `local://${entry.name}`, category: 'custom' });
      }
    }
  } catch {}
  const index = buildIndex(allSkills);
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`\n[BulkSync] ✓ Indexed ${index.totalSkills} skills total`);
  console.log(`[BulkSync] ✓ Index saved to ${INDEX_FILE}`);
}

main().catch(e => { console.error('[BulkSync] Fatal:', e); process.exit(1); });
