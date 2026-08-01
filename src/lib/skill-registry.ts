/**
 * Global Skill Registry — V.94
 * ═══════════════════════════════════════════════════════════════════════
 *
 * المشكلة: على HF Spaces، أي ملف في `/app/` بيمسح مع الـ rebuild.
 * الأدوات اللي بتـ install وقت التشغيل بتضيع.
 *
 * الحل: نستخدم HF Hub API كـ persistent storage:
 *   1. كل skill جديد → upload لـ repo الـ Space في `/skills/`
 *   2. manifest JSON → upload لـ repo root
 *   3. عند الـ startup، الـ repo بيتـ pull تلقائياً → skills بتبقى موجودة
 *   4. Dockerfile CMD بينسخها لـ `/app/global_skills/` ويـ load
 *
 * Flow:
 *   User A يثبت tool →
 *     installSkillGlobal('yfinance', {type: 'pip'}) →
 *       1. pip install (runtime - فوري لـ User A)
 *       2. update skills_manifest.json (محلي + HF repo)
 *       3. upload لـ HF repo في `/skills/yfinance.json`
 *
 *   الـ rebuild الجاي →
 *     repo بيتـ pull → `/skills/yfinance.json` موجود
 *     Dockerfile CMD بيقرا manifest ويثبت كل الـ skills
 *
 *   User B بعد الـ rebuild →
 *     listGlobalSkills() بيلقى yfinance → متاح فوراً
 */

import { promises as fs } from "fs";
import path from "path";

const GLOBAL_SKILLS_DIR = path.join(process.cwd(), "global_skills");
const MANIFEST_PATH = path.join(process.cwd(), "skills_manifest.json");
const HF_REPO_ID = process.env.HF_REPO_ID || "ebsaya/delta_ai";
const HF_TOKEN = process.env.HF_TOKEN || "";

export interface SkillEntry {
  name: string;
  type: "pip" | "npm" | "github" | "local" | "system";
  installCommand?: string;
  githubUrl?: string;
  description?: string;
  installedBy?: string;
  installedAt: string;
  available: boolean;
  category?: string;
}

export interface SkillsManifest {
  version: string;
  lastUpdated: string;
  skills: SkillEntry[];
}

/**
 * بيقرا الـ manifest المحلي (لو موجود).
 */
export async function readManifest(): Promise<SkillsManifest> {
  try {
    const content = await fs.readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return { version: "1.0", lastUpdated: new Date().toISOString(), skills: [] };
  }
}

/**
 * بيـ write الـ manifest محلياً.
 */
export async function writeManifest(manifest: SkillsManifest): Promise<void> {
  manifest.lastUpdated = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * بيـ upload ملف لـ HF repo (persistent storage).
 * لو HF_TOKEN مش متاح → بيرجع false بصمت.
 */
async function uploadToHFRepo(filePath: string, pathInRepo: string): Promise<boolean> {
  if (!HF_TOKEN) return false;
  try {
    // V.104: استخدم fetch مباشرة بدل Python huggingface_hub
    const fs = await import("fs");
    const fileBuffer = fs.readFileSync(filePath);
    const resp = await fetch(`https://huggingface.co/api/spaces/${HF_REPO_ID}/upload/${pathInRepo}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: fileBuffer,
    });
    if (resp.ok) {
      console.log(`[SkillRegistry] Uploaded ${pathInRepo} to HF repo`);
      return true;
    }
    console.warn(`[SkillRegistry] HF upload ${pathInRepo} failed: ${resp.status}`);
    return false;
  } catch (err: any) {
    console.warn(`[SkillRegistry] HF upload failed for ${pathInRepo}:`, err?.message || String(err));
    return false;
  }
}

/**
 * بيـ upload ملف JSON content لـ HF repo.
 */
async function uploadJsonToHFRepo(jsonContent: string, pathInRepo: string): Promise<boolean> {
  // اكتب مؤقتاً ثم ارفع
  const tempPath = path.join(GLOBAL_SKILLS_DIR, `_temp_${Date.now()}.json`);
  try {
    await fs.mkdir(GLOBAL_SKILLS_DIR, { recursive: true });
    await fs.writeFile(tempPath, jsonContent, "utf-8");
    return await uploadToHFRepo(tempPath, pathInRepo);
  } finally {
    try { await fs.unlink(tempPath); } catch {}
  }
}

/**
 * بيسجّل skill جديد في الـ Global Registry.
 * - بيـ update الـ manifest محلياً + HF repo
 * - بيرجع true لو اتعمل بنجاح
 */
export async function registerSkill(skill: Omit<SkillEntry, "installedAt" | "available">): Promise<boolean> {
  await fs.mkdir(GLOBAL_SKILLS_DIR, { recursive: true });

  const manifest = await readManifest();

  // اتأكد إنه مش موجود بالفعل
  const existing = manifest.skills.find((s) => s.name.toLowerCase() === skill.name.toLowerCase());
  if (existing) {
    existing.available = true;
    existing.installedAt = new Date().toISOString();
    await writeManifest(manifest);
    await uploadJsonToHFRepo(JSON.stringify(manifest, null, 2), "skills_manifest.json");
    return true;
  }

  // أضف skill جديد
  const entry: SkillEntry = {
    ...skill,
    installedAt: new Date().toISOString(),
    available: true,
  };
  manifest.skills.push(entry);
  await writeManifest(manifest);

  // upload manifest لـ HF
  await uploadJsonToHFRepo(JSON.stringify(manifest, null, 2), "skills_manifest.json");

  // upload skill metadata لـ HF في /skills/{name}.json
  const skillMeta = JSON.stringify(entry, null, 2);
  await uploadJsonToHFRepo(skillMeta, `skills/${skill.name}.json`);

  console.log(`[SkillRegistry] Registered skill: ${skill.name}`);
  return true;
}

/**
 * بيرجع قائمة كل الـ skills المسجّلة.
 */
export async function listGlobalSkills(): Promise<SkillEntry[]> {
  const manifest = await readManifest();
  return manifest.skills;
}

/**
 * بيتحقق هل skill معين متاح.
 */
export async function isSkillAvailable(skillName: string): Promise<boolean> {
  const manifest = await readManifest();
  const skill = manifest.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
  return !!skill?.available;
}

/**
 * بيرجع metadata لـ skill معين.
 */
export async function getSkill(skillName: string): Promise<SkillEntry | null> {
  const manifest = await readManifest();
  return manifest.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase()) || null;
}

/**
 * بيـ sync الـ skills من HF repo عند الـ startup.
 * ده بيشتغل لو الـ repo فيه `skills_manifest.json` — الـ Dockerfile CMD بيشوفه.
 */
export async function syncSkillsFromRepo(): Promise<{ synced: number; installed: number; failed: string[] }> {
  const manifest = await readManifest();

  if (manifest.skills.length === 0) {
    return { synced: 0, installed: 0, failed: [] };
  }

  console.log(`[SkillRegistry] Syncing ${manifest.skills.length} skills from manifest...`);

  let installed = 0;
  const failed: string[] = [];

  for (const skill of manifest.skills) {
    if (skill.type === "pip") {
      // اتأكد إنه متثبت
      const modName = skill.name.replace(/-/g, "_").toLowerCase().split("[")[0];
      try {
        const { exec } = await import("child_process");
        const { promisify } = await import("util");
        const execAsync = promisify(exec);
        await execAsync(`python3 -c "import ${modName}; print('OK')"`, { timeout: 5_000 });
        installed++;
        skill.available = true;
      } catch {
        // مش متثبت → ثبّته
        try {
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          const cmd = skill.installCommand || `pip3 install --break-system-packages ${skill.name}`;
          await execAsync(cmd, { timeout: 180_000 });
          installed++;
          skill.available = true;
          console.log(`[SkillRegistry] Installed: ${skill.name}`);
        } catch (err) {
          skill.available = false;
          failed.push(skill.name);
          console.warn(`[SkillRegistry] Failed to install ${skill.name}:`, err);
        }
      }
    } else if (skill.type === "github" && skill.githubUrl) {
      // لو skill من GitHub، نتأكد إنه موجود في /skills/
      const skillDir = path.join(process.cwd(), "skills", skill.name);
      try {
        await fs.access(skillDir);
        skill.available = true;
        installed++;
      } catch {
        // مش موجود → نـ clone
        try {
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          await execAsync(`git clone --depth 1 ${skill.githubUrl} "${skillDir}"`, { timeout: 60_000 });
          installed++;
          skill.available = true;
        } catch (err) {
          skill.available = false;
          failed.push(skill.name);
        }
      }
    }
  }

  await writeManifest(manifest);
  console.log(`[SkillRegistry] Sync complete: ${installed}/${manifest.skills.length} available, ${failed.length} failed`);
  return { synced: manifest.skills.length, installed, failed };
}

/**
 * بيـ import كل الـ skills المتاحة كـ Python modules (for capability inspection).
 */
export async function getAvailableSkillsForLLM(): Promise<string[]> {
  const skills = await listGlobalSkills();
  return skills.filter((s) => s.available).map((s) => s.name);
}
