/**
 * Framework Discovery & JIT Integration — V.96
 * ═══════════════════════════════════════════════════════════════════════
 *
 * بيقرا frameworks_manifest.json (اللي بيعمله scripts/install_frameworks.py)
 * ويسجّل الـ frameworks في الـ JIT Context Injector.
 *
 * لما المستخدم يطلب "استخدم LangChain" → الـ JIT بيشوف الـ framework
 * متاح وبيـ allow الـ LLM يستخدمه في كود Python.
 */

import { promises as fs } from "fs";
import path from "path";

const MANIFEST_PATH = path.join(process.cwd(), "frameworks_manifest.json");

export interface FrameworkEntry {
  name: string;
  description: string;
  keywords: string[];
  import_name: string;
  packages: string[];
  available: boolean;
  installed_at: string;
}

export interface FrameworksManifest {
  version: string;
  last_updated: string;
  frameworks: FrameworkEntry[];
}

let _cachedManifest: FrameworksManifest | null = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * بيقرا الـ frameworks manifest.
 */
export async function readFrameworksManifest(force = false): Promise<FrameworksManifest> {
  if (_cachedManifest && !force && Date.now() - _cacheTime < CACHE_TTL_MS) {
    return _cachedManifest;
  }

  try {
    const content = await fs.readFile(MANIFEST_PATH, "utf-8");
    _cachedManifest = JSON.parse(content);
    _cacheTime = Date.now();
    return _cachedManifest!;
  } catch {
    return { version: "1.0", last_updated: "", frameworks: [] };
  }
}

/**
 * بيرجع قائمة الـ frameworks المتاحة (verified).
 */
export async function getAvailableFrameworks(): Promise<FrameworkEntry[]> {
  const manifest = await readFrameworksManifest();
  return manifest.frameworks.filter((f) => f.available);
}

/**
 * بيدور على framework matching طلب المستخدم.
 */
export async function findMatchingFrameworks(userMessage: string): Promise<FrameworkEntry[]> {
  const manifest = await readFrameworksManifest();
  const messageLower = userMessage.toLowerCase();
  const matches: FrameworkEntry[] = [];

  for (const fw of manifest.frameworks) {
    if (!fw.available) continue;

    // exact name match
    if (messageLower.includes(fw.name.toLowerCase())) {
      matches.push(fw);
      continue;
    }

    // keyword match
    for (const kw of fw.keywords) {
      if (messageLower.includes(kw.toLowerCase())) {
        matches.push(fw);
        break;
      }
    }
  }

  return matches;
}

/**
 * بيرجع context للـ frameworks المتاحة (للـ system prompt).
 * ده بيقول للـ LLM: "انت تقدر تستخدم LangChain, CrewAI, AutoGen في كود Python".
 */
export async function getFrameworksContext(): Promise<string> {
  const available = await getAvailableFrameworks();
  if (available.length === 0) {
    return ""; // مفيش frameworks متاحة → مش هضيف حاجة
  }

  const lines = available.map((fw) => {
    return `- **${fw.name}**: ${fw.description} (import: \`${fw.import_name}\`)`;
  });

  return `\n\n## Available AI Frameworks (Python)
انت تقدر تستخدم الـ frameworks دي في كود Python اللي بتكتبه للمستخدم:

${lines.join("\n")}

لما المستخدم يطلب حاجة بتـ match مع framework منهم، استخدمه مباشرة في الكود.
مثال: لو طلب "استخدم LangChain"، اكتب:
\`\`\`python
from langchain.chat_models import ChatOpenAI
# ... باقي الكود
\`\`\``;
}

/**
 * بيتحقق هل framework معين متاح.
 */
export async function isFrameworkAvailable(name: string): Promise<boolean> {
  const manifest = await readFrameworksManifest();
  return manifest.frameworks.some(
    (f) => f.name.toLowerCase() === name.toLowerCase() && f.available
  );
}

/**
 * بيعمل refresh للـ cache (للأدمن).
 */
export function refreshFrameworksCache(): void {
  _cachedManifest = null;
  _cacheTime = 0;
}
