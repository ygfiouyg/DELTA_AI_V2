import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * POST /api/skills/sync
 * Triggers a bulk sync of skills from GitHub repos + local skills
 * Body: { repo?: string } — optional repo to sync from
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const repo = body.repo || 'skillsgate/skillsgate';

    // Fetch skills from GitHub repo
    const treeUrl = `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`;
    const treeResp = await fetch(treeUrl, { headers: { 'User-Agent': 'DeltaAI-SkillSync' } });

    if (!treeResp.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch repo tree: ${treeResp.status}` },
        { status: 502 }
      );
    }

    const tree = await treeResp.json();
    const skillFiles = tree.tree.filter((node: any) =>
      node.path.endsWith('SKILL.md') || node.path.endsWith('skill.md')
    );

    let syncedCount = 0;
    const skillsDir = path.join(process.cwd(), 'skills');

    for (const file of skillFiles) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${file.path}`;
        const content = await (await fetch(rawUrl)).text();

        // Save to skills directory
        const dirName = path.dirname(file.path).split('/')[0] || path.basename(path.dirname(file.path));
        const targetDir = path.join(skillsDir, dirName);
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(path.join(targetDir, 'SKILL.md'), content, 'utf-8');
        syncedCount++;
      } catch (e) {
        // Skip failed files
      }
    }

    // Build index
    const index = await buildLocalIndex();
    const indexPath = path.join(process.cwd(), 'skills-index.json');
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      repo,
      syncedFromRemote: syncedCount,
      totalIndexed: index.totalSkills,
      lastSync: index.lastSync,
    });
  } catch (error) {
    console.error('[SkillSync] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}

async function buildLocalIndex() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const skills: any[] = [];

  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      try {
        if (entry.isDirectory()) {
          const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
          const content = await fs.readFile(skillFile, 'utf-8');
          const fm = content.match(/^---\n([\s\S]*?)\n---/);
          let name = entry.name, desc = '';
          if (fm) {
            const n = fm[1].match(/^name:\s*(.+)$/m);
            const d = fm[1].match(/^description:\s*(.+)$/m);
            if (n) name = n[1].trim().replace(/^["']|["']$/g, '');
            if (d) desc = d[1].trim().replace(/^["']|["']$/g, '');
          }
          skills.push({ name, description: desc, keywords: extractKeywords(name + ' ' + desc), file: entry.name });
        } else if (entry.name.endsWith('.md')) {
          const content = await fs.readFile(path.join(skillsDir, entry.name), 'utf-8');
          const fm = content.match(/^---\n([\s\S]*?)\n---/);
          let name = entry.name.replace('.md', ''), desc = '';
          if (fm) {
            const n = fm[1].match(/^name:\s*(.+)$/m);
            const d = fm[1].match(/^description:\s*(.+)$/m);
            if (n) name = n[1].trim().replace(/^["']|["']$/g, '');
            if (d) desc = d[1].trim().replace(/^["']|["']$/g, '');
          }
          skills.push({ name, description: desc, keywords: extractKeywords(name + ' ' + desc), file: entry.name });
        }
      } catch {}
    }
  } catch {}

  return {
    version: '1.0.0',
    totalSkills: skills.length,
    lastSync: new Date().toISOString(),
    skills,
  };
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','ال','في','من','على','إلى','عن','مع']);
  return [...new Set(text.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w)))].slice(0, 20);
}
