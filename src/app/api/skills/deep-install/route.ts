import { NextRequest, NextResponse } from 'next/server';
import { installSkillDeep } from '@/lib/deep-skill-installer';

/**
 * POST /api/skills/deep-install
 *
 * Deep skill installation — downloads full directory structure:
 *   - SKILL.md (blueprint)
 *   - scripts/ (.py/.js executables)
 *   - references/ (docs)
 *   - assets/ (images, templates)
 *
 * Returns progress + file list + registered scripts.
 *
 * Body: { search_query: string, github_url?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_query, github_url } = body;

    if (!search_query && !github_url) {
      return NextResponse.json(
        { success: false, error: 'search_query or github_url is required' },
        { status: 400 }
      );
    }

    console.log(`[DeepInstall] Starting: ${search_query || github_url}`);

    const result = await installSkillDeep(
      search_query || '',
      github_url,
      (progress) => {
        // Progress is logged server-side; for real-time UI, use SSE
        console.log(`[DeepInstall] ${progress.progress}% ${progress.step}: ${progress.message}`);
      }
    );

    return NextResponse.json({
      success: result.success,
      message: result.message,
      skillName: result.skillName,
      skillDir: result.skillDir,
      filesDownloaded: result.files.length,
      scriptsRegistered: result.scripts.length,
      files: result.files,
      scripts: result.scripts,
      progressLog: result.progress,
    });
  } catch (error) {
    console.error('[DeepInstall] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Installation failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/skills/deep-install
 * Returns the MCP tool registry (all registered executable scripts)
 */
export async function GET() {
  try {
    const { getMCPRegistry } = await import('@/lib/deep-skill-installer');
    const registry = await getMCPRegistry();
    return NextResponse.json({
      success: true,
      totalTools: registry.tools?.length || 0,
      tools: registry.tools || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get MCP registry' },
      { status: 500 }
    );
  }
}
