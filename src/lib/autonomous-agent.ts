/**
 * Autonomous Agent Loop — V.68
 * ═══════════════════════════════════════════════════════════════════════
 *
 * الـ agent يكتشف بنفسه إنه مش قادر يعمل حاجة، يبحث في GitHub،
 * يثبت الأداة، ويستخدمها في نفس الجلسة.
 *
 * Flow:
 * 1. User request → Capability check
 * 2. If gap detected → GitHub search
 * 3. Install tool (pip/npm/docker/local)
 * 4. Hot-load into session
 * 5. Execute and respond
 *
 * مثال: "اعمل باوربوينت بالصور"
 *   → Agent: محتاج أداة لإدراج الصور في PPTX
 *   → Search GitHub → python-pptx image insertion
 *   → Install → Use → Respond with PPTX
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { validateSkillContent } from './namespace-router';

const execAsync = promisify(exec);
const TOOLS_DIR = path.join(process.cwd(), 'tools');
const SKILLS_DIR = path.join(process.cwd(), 'skills');

export interface CapabilityCheck {
  hasCapability: boolean;
  missingTools: string[];
  searchQuery: string;
  reason: string;
}

export interface GitHubSearchResult {
  repo: string;
  name: string;
  description: string;
  url: string;
  installType: 'pip' | 'npm' | 'docker' | 'local';
  installCommand: string;
  score: number;
}

export interface ToolInstallResult {
  success: boolean;
  toolName: string;
  installType: string;
  message: string;
  available: boolean;
}

export interface AgentLoopResult {
  capabilityCheck: CapabilityCheck;
  searchResults?: GitHubSearchResult[];
  installedTool?: ToolInstallResult;
  finalMessage: string;
  steps: string[];
}

/**
 * Check if the agent has the capability to fulfill a request
 */
export async function checkCapability(
  userMessage: string,
  availableTools: string[]
): Promise<CapabilityCheck> {
  const msg = userMessage.toLowerCase();
  const missingTools: string[] = [];
  let searchQuery = '';
  let reason = '';

  // Define capability requirements
  const capabilities: Array<{
    keywords: string[];
    requiredTools: string[];
    searchQuery: string;
    reason: string;
  }> = [
    {
      keywords: ['كود qr', 'qr code', 'qr', 'كيو ار', 'باركود', 'barcode', 'vcard', 'كارت اتصال'],
      requiredTools: ['qrcode'],
      searchQuery: 'python qrcode vcard generator library',
      reason: 'إنشاء أكواد QR و vCard',
    },
    {
      keywords: ['كتاب صوتي', 'audiobook', 'تحويل النص لصوت', 'text to speech', 'tts', 'mp3 من pdf', 'pdf to mp3', 'كتاب مسموع'],
      requiredTools: ['gtts', 'pymupdf'],
      searchQuery: 'python gtts text to speech pdf to mp3 audiobook',
      reason: 'تحويل PDF إلى كتاب صوتي MP3',
    },
    {
      keywords: ['باور بوينت', 'بوربوينت', 'powerpoint', 'pptx', 'عرض تقديم', 'شرائح', 'presentation', 'slides'],
      requiredTools: ['python-pptx'],
      searchQuery: 'python-pptx powerpoint presentation generator',
      reason: 'إنشاء عروض تقديمية PowerPoint',
    },
    {
      keywords: ['اكسل', 'excel', 'xlsx', 'جدول بيانات', 'spreadsheet'],
      requiredTools: ['openpyxl'],
      searchQuery: 'openpyxl excel spreadsheet generator python',
      reason: 'إنشاء جداول بيانات Excel',
    },
    {
      keywords: ['صورة', 'صور', 'image', 'photo', 'extract image', 'استخرج الصور', 'أضف صور'],
      requiredTools: ['pillow', 'python-pptx'],
      searchQuery: 'python image extraction insertion pillow PIL',
      reason: 'معالجة الصور (إدراج/استخراج)',
    },
    {
      keywords: ['pdf استخراج', 'extract pdf', 'pdf images', 'صور من pdf'],
      requiredTools: ['pymupdf', 'pillow'],
      searchQuery: 'python pdf image extraction pymupdf fitz',
      reason: 'استخراج الصور من PDF',
    },
    {
      keywords: ['تحويل', 'convert', 'mp3', 'mp4', 'صوت', 'audio', 'فيديو', 'video'],
      requiredTools: ['ffmpeg'],
      searchQuery: 'ffmpeg audio video conversion tool',
      reason: 'تحويل الملفات الصوتية/المرئية',
    },
    {
      keywords: ['ترجمة', 'translate', 'translation'],
      requiredTools: ['translator'],
      searchQuery: 'python translation tool google translate',
      reason: 'الترجمة',
    },
    {
      keywords: ['رسم', 'chart', 'بيان', 'graph', 'مخطط'],
      requiredTools: ['matplotlib'],
      searchQuery: 'matplotlib chart graph python',
      reason: 'إنشاء الرسوم البيانية',
    },
  ];

  for (const cap of capabilities) {
    if (cap.keywords.some(kw => msg.includes(kw))) {
      const missing = cap.requiredTools.filter(t => !availableTools.includes(t));
      if (missing.length > 0) {
        missingTools.push(...missing);
        searchQuery = cap.searchQuery;
        reason = cap.reason;
        return {
          hasCapability: false,
          missingTools,
          searchQuery,
          reason,
        };
      }
    }
  }

  return {
    hasCapability: true,
    missingTools: [],
    searchQuery: '',
    reason: '',
  };
}

/**
 * Search GitHub for tools matching the query
 */
export async function searchGitHubTools(query: string, maxResults: number = 5): Promise<GitHubSearchResult[]> {
  const results: GitHubSearchResult[] = [];

  try {
    // Use GitHub Search API
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${maxResults}`;
    const resp = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'DeltaAI-Agent',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!resp.ok) {
      // Fallback to known tools
      return getKnownTools(query);
    }

    const data = await resp.json();
    const items = data.items || [];

    for (const item of items.slice(0, maxResults)) {
      const installType = detectInstallType(item);
      results.push({
        repo: item.full_name,
        name: item.name,
        description: item.description || '',
        url: item.html_url,
        installType,
        installCommand: getInstallCommand(item, installType),
        score: item.stargazers_count,
      });
    }

    return results.length > 0 ? results : getKnownTools(query);
  } catch {
    return getKnownTools(query);
  }
}

/**
 * Detect install type from repo
 */
function detectInstallType(repo: any): 'pip' | 'npm' | 'docker' | 'local' {
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (desc.includes('docker') || name.includes('docker')) return 'docker';
  if (desc.includes('npm') || name.includes('node') || desc.includes('javascript')) return 'npm';
  if (desc.includes('python') || desc.includes('pip') || name.includes('py')) return 'pip';
  return 'local';
}

/**
 * Get install command for a repo
 */
function getInstallCommand(repo: any, installType: string): string {
  switch (installType) {
    case 'pip':
      return `pip3 install ${repo.name}`;
    case 'npm':
      return `npm install ${repo.name}`;
    case 'docker':
      return `docker pull ${repo.full_name.toLowerCase()}`;
    default:
      return `git clone ${repo.clone_url}`;
  }
}

/**
 * Known tools fallback (when GitHub API is rate-limited)
 */
function getKnownTools(query: string): GitHubSearchResult[] {
  const known: Record<string, GitHubSearchResult[]> = {
    'qrcode': [{
      repo: 'lincolnloop/python-qrcode',
      name: 'qrcode',
      description: 'Python QR Code image generator — creates QR codes with vCard support',
      url: 'https://github.com/lincolnloop/python-qrcode',
      installType: 'pip',
      installCommand: 'pip3 install qrcode[pil]',
      score: 3500,
    }],
    'gtts': [{
      repo: 'pndurette/gTTS',
      name: 'gTTS',
      description: 'Google Text-to-Speech — convert text to MP3 audio',
      url: 'https://github.com/pndurette/gTTS',
      installType: 'pip',
      installCommand: 'pip3 install gTTS',
      score: 2000,
    }],
    'python-pptx': [{
      repo: 'scanny/python-pptx',
      name: 'python-pptx',
      description: 'Create and update PowerPoint .pptx files',
      url: 'https://github.com/scanny/python-pptx',
      installType: 'pip',
      installCommand: 'pip3 install python-pptx',
      score: 2000,
    }],
    'openpyxl': [{
      repo: 'openpyxl/openpyxl',
      name: 'openpyxl',
      description: 'Read/write Excel 2010 xlsx/xlsm files',
      url: 'https://github.com/openpyxl/openpyxl',
      installType: 'pip',
      installCommand: 'pip3 install openpyxl',
      score: 1500,
    }],
    'pillow': [{
      repo: 'python-pillow/Pillow',
      name: 'Pillow',
      description: 'Python image processing library',
      url: 'https://github.com/python-pillow/Pillow',
      installType: 'pip',
      installCommand: 'pip3 install Pillow',
      score: 12000,
    }],
    'pymupdf': [{
      repo: 'pymupdf/PyMuPDF',
      name: 'PyMuPDF',
      description: 'Python bindings for MuPDF — PDF text/image extraction',
      url: 'https://github.com/pymupdf/PyMuPDF',
      installType: 'pip',
      installCommand: 'pip3 install PyMuPDF',
      score: 3000,
    }],
    'matplotlib': [{
      repo: 'matplotlib/matplotlib',
      name: 'matplotlib',
      description: 'Python plotting library for charts and graphs',
      url: 'https://github.com/matplotlib/matplotlib',
      installType: 'pip',
      installCommand: 'pip3 install matplotlib',
      score: 16000,
    }],
    'ffmpeg': [{
      repo: 'FFmpeg/FFmpeg',
      name: 'ffmpeg',
      description: 'Audio/video conversion tool',
      url: 'https://github.com/FFmpeg/FFmpeg',
      installType: 'local',
      installCommand: 'apt-get install -y ffmpeg',
      score: 30000,
    }],
  };

  for (const [key, tools] of Object.entries(known)) {
    if (query.toLowerCase().includes(key)) {
      return tools;
    }
  }

  // Default: return python-pptx as generic fallback
  return known['python-pptx'];
}

/**
 * Install a tool (pip/npm/docker/local)
 */
export async function installTool(
  tool: GitHubSearchResult
): Promise<ToolInstallResult> {
  const steps: string[] = [];
  console.log(`[AgentLoop] Installing ${tool.name} via ${tool.installType}...`);

  try {
    let output = '';

    switch (tool.installType) {
      case 'pip': {
        steps.push(`تثبيت ${tool.name} عبر pip...`);
        // V.68b: Add --break-system-packages for HF's externally-managed Python
        const pipCmd = tool.installCommand.replace('pip3 install', 'pip3 install --break-system-packages').replace('pip install', 'pip3 install --break-system-packages');
        const { stdout, stderr } = await execAsync(pipCmd, { timeout: 120_000 });
        output = stdout + stderr;
        break;
      }
      case 'npm': {
        steps.push(`تثبيت ${tool.name} عبر npm...`);
        const { stdout, stderr } = await execAsync(tool.installCommand, { timeout: 120_000 });
        output = stdout + stderr;
        break;
      }
      case 'docker': {
        steps.push(`تثبيت ${tool.name} عبر Docker...`);
        const { stdout, stderr } = await execAsync(tool.installCommand, { timeout: 180_000 });
        output = stdout + stderr;
        break;
      }
      default: {
        // Local: clone the repo
        steps.push(`استنساخ ${tool.name} من GitHub...`);
        await fs.mkdir(TOOLS_DIR, { recursive: true });
        const targetDir = path.join(TOOLS_DIR, tool.name);
        const { stdout, stderr } = await execAsync(`git clone --depth 1 ${tool.url} "${targetDir}"`, { timeout: 60_000 });
        output = stdout + stderr;
        break;
      }
    }

    // Verify installation
    const isAvailable = await verifyToolAvailable(tool.name, tool.installType);

    return {
      success: isAvailable,
      toolName: tool.name,
      installType: tool.installType,
      message: isAvailable
        ? `✅ تم تثبيت ${tool.name} بنجاح`
        : `⚠️ تم التثبيت لكن التحقق فشل`,
      available: isAvailable,
    };
  } catch (error) {
    return {
      success: false,
      toolName: tool.name,
      installType: tool.installType,
      message: `❌ فشل التثبيت: ${error instanceof Error ? error.message : String(error)}`,
      available: false,
    };
  }
}

/**
 * Verify a tool is available after installation
 */
async function verifyToolAvailable(toolName: string, installType: string): Promise<boolean> {
  try {
    switch (installType) {
      case 'pip': {
        const { stdout } = await execAsync(`python3 -c "import ${toolName.toLowerCase().replace('-', '_')}; print('OK')"`, { timeout: 10_000 });
        return stdout.includes('OK');
      }
      case 'npm': {
        const { stdout } = await execAsync(`npm list -g ${toolName}`, { timeout: 10_000 });
        return !stdout.includes('empty');
      }
      case 'docker': {
        const { stdout } = await execAsync(`docker images --format "{{.Repository}}" | grep -i ${toolName}`, { timeout: 10_000 });
        return stdout.trim().length > 0;
      }
      default: {
        const toolPath = path.join(TOOLS_DIR, toolName);
        await fs.access(toolPath);
        return true;
      }
    }
  } catch {
    return false;
  }
}

/**
 * Get list of currently available tools
 */
export async function getAvailableTools(): Promise<string[]> {
  const tools: string[] = [];

  // Check Python packages
  const pythonPackages = ['pptx', 'openpyxl', 'PIL', 'fitz', 'matplotlib', 'requests', 'bs4', 'qrcode', 'gtts'];
  for (const pkg of pythonPackages) {
    try {
      await execAsync(`python3 -c "import ${pkg}"`, { timeout: 5_000 });
      tools.push(pkg === 'PIL' ? 'pillow' : pkg === 'fitz' ? 'pymupdf' : pkg === 'pptx' ? 'python-pptx' : pkg);
    } catch {}
  }

  // Check system tools
  const systemTools = ['ffmpeg', 'git', 'python3', 'node'];
  for (const tool of systemTools) {
    try {
      await execAsync(`which ${tool}`, { timeout: 5_000 });
      tools.push(tool);
    } catch {}
  }

  // Check locally installed tools in tools/
  try {
    const entries = await fs.readdir(TOOLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        tools.push(entry.name);
      }
    }
  } catch {}

  return Array.from(new Set(tools));
}

/**
 * Connect to an MCP server
 */
export async function connectMCP(mcpUrl: string): Promise<{ success: boolean; message: string; tools?: string[] }> {
  try {
    console.log(`[AgentLoop] Connecting to MCP: ${mcpUrl}`);

    // Save MCP config
    const mcpConfigPath = path.join(TOOLS_DIR, 'mcp-servers.json');
    let config: any = { servers: [] };

    try {
      const existing = await fs.readFile(mcpConfigPath, 'utf-8');
      config = JSON.parse(existing);
    } catch {}

    // Add new server
    const serverId = randomUUID().substring(0, 8);
    config.servers.push({
      id: serverId,
      url: mcpUrl,
      connectedAt: new Date().toISOString(),
      status: 'connected',
    });

    await fs.mkdir(TOOLS_DIR, { recursive: true });
    await fs.writeFile(mcpConfigPath, JSON.stringify(config, null, 2), 'utf-8');

    // Try to get available tools from MCP server
    let mcpTools: string[] = [];
    try {
      const resp = await fetch(mcpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 1 }),
      });

      if (resp.ok) {
        const data = await resp.json();
        mcpTools = (data.result?.tools || []).map((t: any) => t.name);
      }
    } catch {
      // MCP server might use SSE or WebSocket — still register it
    }

    return {
      success: true,
      message: `✅ تم ربط MCP server بنجاح (${mcpTools.length} أدوات متاحة)`,
      tools: mcpTools,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ فشل ربط MCP: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Get connected MCP servers
 */
export async function getMCPServers(): Promise<any[]> {
  try {
    const mcpConfigPath = path.join(TOOLS_DIR, 'mcp-servers.json');
    const content = await fs.readFile(mcpConfigPath, 'utf-8');
    const config = JSON.parse(content);
    return config.servers || [];
  } catch {
    return [];
  }
}

/**
 * Full Autonomous Agent Loop
 * 1. Check capability
 * 2. Search GitHub if needed
 * 3. Install tool
 * 4. Return result
 */
export async function runAgentLoop(
  userMessage: string
): Promise<AgentLoopResult> {
  const steps: string[] = [];

  // Step 1: Get available tools
  steps.push('فحص الأدوات المتاحة...');
  const availableTools = await getAvailableTools();
  steps.push(`الأدوات المتاحة: ${availableTools.join(', ')}`);

  // Step 2: Check capability
  const capabilityCheck = await checkCapability(userMessage, availableTools);

  if (capabilityCheck.hasCapability) {
    return {
      capabilityCheck,
      finalMessage: 'لدي جميع الأدوات اللازمة لتنفيذ طلبك',
      steps,
    };
  }

  steps.push(`⚠️ نقص في الأدوات: ${capabilityCheck.missingTools.join(', ')}`);
  steps.push(`السبب: ${capabilityCheck.reason}`);

  // Step 3: Search GitHub
  steps.push(`🔍 البحث في GitHub عن: ${capabilityCheck.searchQuery}`);
  const searchResults = await searchGitHubTools(capabilityCheck.searchQuery, 3);

  if (searchResults.length === 0) {
    return {
      capabilityCheck,
      finalMessage: 'لم أجد أدوات مناسبة في GitHub',
      steps,
    };
  }

  steps.push(`✅ وجدت ${searchResults.length} أدوات: ${searchResults.map(r => r.name).join(', ')}`);

  // Step 4: Install best match
  const bestMatch = searchResults[0];
  steps.push(`📦 تثبيت ${bestMatch.name}...`);

  const installResult = await installTool(bestMatch);
  steps.push(installResult.message);

  return {
    capabilityCheck,
    searchResults,
    installedTool: installResult,
    finalMessage: installResult.success
      ? `✅ تم تثبيت ${bestMatch.name}! يمكنني الآن ${capabilityCheck.reason}`
      : `❌ فشل تثبيت ${bestMatch.name}`,
    steps,
  };
}
