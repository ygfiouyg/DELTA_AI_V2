import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * POST /api/skills/install
 * 
 * Downloads a skill from a GitHub URL and saves it locally.
 * Body: { url: string, type: 'skill' | 'tool' | 'app' }
 * 
 * V.61: Supports GitHub raw URLs for .md skill files
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type = 'skill' } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL is a GitHub URL
    if (!url.includes('github.com') && !url.includes('raw.githubusercontent.com') && !url.includes('gist.github.com')) {
      return NextResponse.json(
        { success: false, error: 'Only GitHub URLs are supported' },
        { status: 400 }
      );
    }

    // Convert github.com URL to raw URL if needed
    let rawUrl = url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      // Convert: https://github.com/user/repo/blob/branch/file.md
      // To:      https://raw.githubusercontent.com/user/repo/branch/file.md
      rawUrl = url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }

    // Fetch the content
    const response = await fetch(rawUrl, {
      headers: { 'User-Agent': 'DeltaAI-SkillInstaller' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const content = await response.text();

    // Validate it's a markdown file
    if (!content.includes('#') && !content.includes('---')) {
      return NextResponse.json(
        { success: false, error: 'Content does not appear to be a valid skill file (.md with frontmatter)' },
        { status: 400 }
      );
    }

    // Save to appropriate directory
    const skillsDir = path.join(process.cwd(), 'skills');
    await fs.mkdir(skillsDir, { recursive: true });

    // Generate filename from URL or UUID
    const urlPath = new URL(rawUrl).pathname;
    const originalName = urlPath.split('/').pop() || `skill-${randomUUID()}.md`;
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = safeName.endsWith('.md') ? safeName : `${safeName}.md`;
    const filePath = path.join(skillsDir, fileName);

    await fs.writeFile(filePath, content, 'utf-8');

    // Clear the skills cache so the new skill is picked up
    // The skill-discovery module caches for 60s, so this is fine

    console.log(`[SkillInstall] Saved ${type} from ${url} to ${fileName}`);

    return NextResponse.json({
      success: true,
      message: `Skill installed successfully`,
      fileName,
      type,
      size: content.length,
      url: rawUrl,
    });
  } catch (error) {
    console.error('[SkillInstall] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Installation failed' },
      { status: 500 }
    );
  }
}
