/**
 * Deep Skill Installer — V.65
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Full directory cloning for skills — downloads:
 *   - SKILL.md (the skill blueprint)
 *   - scripts/ (executable .py/.js helpers)
 *   - references/ (documentation)
 *   - assets/ (images, templates, data files)
 *
 * Preserves exact tree architecture locally.
 * Registers .py/.js scripts dynamically for model execution.
 * Emits progress events for UI feedback.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { validateSkillContent } from './namespace-router';

const SKILLS_DIR = path.join(process.cwd(), 'skills');
const TOOLS_DIR = path.join(process.cwd(), 'tools');

export interface InstallProgress {
  step: string;
  message: string;
  progress: number;
  details?: string;
}

export interface InstalledFile {
  path: string;
  size: number;
  type: 'skill' | 'script' | 'reference' | 'asset';
  executable: boolean;
}

export interface DeepInstallResult {
  success: boolean;
  message: string;
  skillName: string;
  skillDir: string;
  files: InstalledFile[];
  scripts: string[]; // executable scripts registered
  progress: InstallProgress[];
}

type ProgressCallback = (progress: InstallProgress) => void;

/**
 * Install a skill with FULL directory cloning
 */
export async function installSkillDeep(
  searchQuery: string,
  githubUrl: string | undefined,
  onProgress?: ProgressCallback
): Promise<DeepInstallResult> {
  const progressLog: InstallProgress[] = [];
  const emit = (step: string, message: string, progress: number, details?: string) => {
    const p: InstallProgress = { step, message, progress, details };
    progressLog.push(p);
    onProgress?.(p);
    console.log(`[DeepInstaller] [${progress}%] ${step}: ${message}${details ? ' (' + details + ')' : ''}`);
  };

  emit('init', `Starting deep installation for "${searchQuery}"`, 5);

  await fs.mkdir(SKILLS_DIR, { recursive: true });
  await fs.mkdir(TOOLS_DIR, { recursive: true });

  let repo: string;
  let basePath: string;

  if (githubUrl) {
    // Parse GitHub URL
    emit('parse', 'Parsing GitHub URL', 10, githubUrl);
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      return {
        success: false,
        message: 'Invalid GitHub URL',
        skillName: '',
        skillDir: '',
        files: [],
        scripts: [],
        progress: progressLog,
      };
    }
    repo = parsed.repo;
    basePath = parsed.path;
  } else {
    // Use catalog
    repo = 'skillsgate/skillsgate';
    basePath = 'packages/cli/test-skill';
  }

  emit('fetch', `Fetching repo tree from ${repo}`, 15);

  // Get full repo tree — try API first, fall back to known file list
  let skillFiles: any[] = [];
  const skillName = path.basename(basePath);

  try {
    const treeUrl = `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`;
    const treeResp = await fetch(treeUrl, { headers: { 'User-Agent': 'DeltaAI-DeepInstaller' } });

    if (treeResp.ok) {
      const tree = await treeResp.json();
      skillFiles = tree.tree.filter((node: any) =>
        node.path.startsWith(basePath + '/') && node.type === 'blob'
      );
    }
  } catch (e) {
    // API failed (rate limit) — fall back to known file list
  }

  // Fallback: try common skill files directly
  if (skillFiles.length === 0) {
    emit('fallback', 'API rate limited — trying common files directly', 20);
    const commonFiles = [
      'SKILL.md',
      'scripts/main.py',
      'scripts/main.js',
      'scripts/index.py',
      'scripts/index.js',
      'scripts/utils.py',
      'references/guide.md',
      'references/api.md',
      'assets/template.json',
      'assets/config.json',
    ];

    for (const cf of commonFiles) {
      const fullPath = `${basePath}/${cf}`;
      const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${fullPath}`;
      try {
        const resp = await fetch(rawUrl, { method: 'HEAD', headers: { 'User-Agent': 'DeltaAI' } });
        if (resp.ok) {
          skillFiles.push({ path: fullPath, type: 'blob' });
        }
      } catch {}
    }
  }

  emit('scan', `Found ${skillFiles.length} files in skill directory`, 25, basePath);

  if (skillFiles.length === 0) {
    return {
      success: false,
      message: `No files found in ${basePath}`,
      skillName,
      skillDir: '',
      files: [],
      scripts: [],
      progress: progressLog,
    };
  }

  // Create local skill directory preserving structure
  const skillDir = path.join(SKILLS_DIR, skillName);
  await fs.mkdir(skillDir, { recursive: true });
  emit('mkdir', `Created skill directory: ${skillName}`, 30);

  const installedFiles: InstalledFile[] = [];
  const executableScripts: string[] = [];

  // Download each file
  for (let i = 0; i < skillFiles.length; i++) {
    const file = skillFiles[i];
    const relativePath = file.path.substring(basePath.length + 1);
    const localPath = path.join(skillDir, relativePath);

    // Create subdirectories
    const dir = path.dirname(localPath);
    await fs.mkdir(dir, { recursive: true });

    // Download file
    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${file.path}`;
    const fileResp = await fetch(rawUrl, { headers: { 'User-Agent': 'DeltaAI' } });

    if (!fileResp.ok) {
      emit('skip', `Skipped: ${relativePath} (${fileResp.status})`, 30 + Math.round((i / skillFiles.length) * 50));
      continue;
    }

    const content = await fileResp.text();

    // V.64: Validate SKILL.md content for IoT instructions
    if (relativePath === 'SKILL.md' || relativePath.endsWith('.md')) {
      const validation = validateSkillContent(content);
      if (!validation.valid) {
        emit('block', `BLOCKED IoT instructions in ${relativePath}`, 0, validation.violations.join('; '));
        return {
          success: false,
          message: `Skill contains IoT/Home Assistant instructions: ${validation.violations.join('; ')}`,
          skillName,
          skillDir,
          files: installedFiles,
          scripts: [],
          progress: progressLog,
        };
      }
    }

    await fs.writeFile(localPath, content, 'utf-8');

    // Determine file type
    let fileType: InstalledFile['type'] = 'reference';
    const ext = path.extname(relativePath).toLowerCase();
    const isExecutable = ext === '.py' || ext === '.js' || ext === '.ts';

    if (relativePath === 'SKILL.md') fileType = 'skill';
    else if (relativePath.startsWith('scripts/')) {
      fileType = 'script';
      if (isExecutable) {
        executableScripts.push(relativePath);
        // Also copy to tools/ directory for MCP registration
        const toolPath = path.join(TOOLS_DIR, skillName, relativePath);
        await fs.mkdir(path.dirname(toolPath), { recursive: true });
        await fs.writeFile(toolPath, content, 'utf-8');
        emit('register', `Registered executable: ${relativePath}`, 30 + Math.round((i / skillFiles.length) * 50));
      }
    }
    else if (relativePath.startsWith('references/')) fileType = 'reference';
    else if (relativePath.startsWith('assets/')) fileType = 'asset';

    installedFiles.push({
      path: relativePath,
      size: content.length,
      type: fileType,
      executable: isExecutable,
    });

    const progress = 30 + Math.round(((i + 1) / skillFiles.length) * 50);
    emit('download', `Downloaded: ${relativePath}`, progress, `${content.length} bytes`);
  }

  emit('index', 'Updating skill index', 85);

  // Register scripts in MCP context
  if (executableScripts.length > 0) {
    emit('mcp', `Registering ${executableScripts.length} scripts in MCP context`, 90);
    await registerScriptsInMCP(skillName, skillDir, executableScripts);
  }

  emit('done', `Installation complete: ${skillName}`, 100, `${installedFiles.length} files, ${executableScripts.length} scripts`);

  return {
    success: true,
    message: `Skill "${skillName}" installed with ${installedFiles.length} files (${executableScripts.length} executable scripts)`,
    skillName,
    skillDir,
    files: installedFiles,
    scripts: executableScripts,
    progress: progressLog,
  };
}

/**
 * Parse a GitHub URL to extract repo and path
 */
function parseGitHubUrl(url: string): { repo: string; path: string } | null {
  // Format: https://github.com/user/repo/tree/branch/path/to/skill
  //      or https://github.com/user/repo/blob/branch/path/to/SKILL.md
  const match = url.match(/github\.com\/([^/]+\/[^/]+)\/(?:tree|blob)\/[^/]+\/(.+)/);
  if (match) {
    return { repo: match[1], path: match[2] };
  }

  // Format: https://raw.githubusercontent.com/user/repo/branch/path/to/SKILL.md
  const rawMatch = url.match(/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\/[^/]+\/(.+)/);
  if (rawMatch) {
    // If it's a file, get the directory
    const filePath = rawMatch[2];
    const dirPath = filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/')) : filePath;
    return { repo: rawMatch[1], path: dirPath };
  }

  return null;
}

/**
 * Register executable scripts in MCP context
 */
async function registerScriptsInMCP(
  skillName: string,
  skillDir: string,
  scripts: string[]
): Promise<void> {
  const mcpRegistryPath = path.join(TOOLS_DIR, 'mcp-registry.json');

  let registry: any = { tools: [] };
  try {
    const existing = await fs.readFile(mcpRegistryPath, 'utf-8');
    registry = JSON.parse(existing);
  } catch {
    // Create new registry
  }

  for (const script of scripts) {
    const ext = path.extname(script).toLowerCase();
    const scriptName = path.basename(script, ext);
    const fullPath = path.join(skillDir, script);

    registry.tools.push({
      name: `${skillName}_${scriptName}`,
      type: ext === '.py' ? 'python' : 'javascript',
      path: fullPath,
      skill: skillName,
      registeredAt: new Date().toISOString(),
      status: 'active',
    });

    console.log(`[MCP] Registered: ${skillName}_${scriptName} (${ext})`);
  }

  await fs.mkdir(TOOLS_DIR, { recursive: true });
  await fs.writeFile(mcpRegistryPath, JSON.stringify(registry, null, 2), 'utf-8');
}

/**
 * Get MCP tool registry
 */
export async function getMCPRegistry(): Promise<any> {
  const mcpRegistryPath = path.join(TOOLS_DIR, 'mcp-registry.json');
  try {
    const content = await fs.readFile(mcpRegistryPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { tools: [] };
  }
}
