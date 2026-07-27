/**
 * Persistent Auto-Installer — V.93
 * ═══════════════════════════════════════════════════════════════════════
 *
 * لما الـ system يـ install أداة جديدة وقت التشغيل، لازم:
 * 1. تـ install فوراً (pip install)
 * 2. تكتب اسمها في `/app/requirements-runtime.txt` عشان تفضل موجودة
 * 3. عند الـ startup، الـ Dockerfile CMD بيشوف الملف ويثبت كل اللي فيه
 *
 * ده "self-healing environment" — الأدوات ما بتتمسحش تاني.
 */

import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const RUNTIME_REQUIREMENTS_FILE = path.join(process.cwd(), "requirements-runtime.txt");

export interface InstallResult {
  success: boolean;
  message: string;
  package: string;
  alreadyInstalled: boolean;
  persisted?: boolean;
}

/**
 * بـثبّت Python package وبيـ persist في requirements-runtime.txt.
 */
export async function installPythonPackagePersistent(
  packageName: string,
  options: { gitUrl?: string; force?: boolean } = {}
): Promise<InstallResult> {
  const { gitUrl, force = false } = options;

  // 1. اتأكد إنه مش متثبت أصلاً (smoke test)
  if (!force) {
    const modName = packageName.replace(/-/g, "_").toLowerCase().split("[")[0];
    try {
      await execAsync(`python3 -c "import ${modName}; print('OK')"`, { timeout: 5_000 });
      return {
        success: true,
        message: `${packageName} متاح محلياً`,
        package: packageName,
        alreadyInstalled: true,
      };
    } catch {
      // مش متاح — نثبته
    }
  }

  // 2. ثبّت
  const installCmd = gitUrl
    ? `pip3 install --break-system-packages "${gitUrl}"`
    : `pip3 install --break-system-packages ${packageName}`;

  try {
    const { stdout, stderr } = await execAsync(installCmd, { timeout: 180_000 });
    const success = !stderr.toLowerCase().includes("error");

    if (success) {
      // 3. اكتب في requirements-runtime.txt (local persist)
      await appendToRuntimeRequirements(packageName, gitUrl);

      // V.94: سجّل في Global Skill Registry (HF repo persist)
      let persisted = false;
      try {
        const { registerSkill } = await import("./skill-registry");
        persisted = await registerSkill({
          name: packageName,
          type: gitUrl ? "github" : "pip",
          installCommand: installCmd,
          githubUrl: gitUrl,
          description: `Python package: ${packageName}`,
          category: "python",
        });
      } catch (err) {
        console.warn("[PersistentInstaller] Skill registry failed:", err);
      }

      return {
        success: true,
        message: `✅ تم تثبيت ${packageName}${persisted ? " وتسجيله في Global Registry" : " وحفظه محلياً"}`,
        package: packageName,
        alreadyInstalled: false,
        persisted,
      };
    } else {
      return {
        success: false,
        message: `فشل تثبيت ${packageName}: ${stderr.slice(0, 200)}`,
        package: packageName,
        alreadyInstalled: false,
      };
    }
  } catch (err: any) {
    const errMsg = err.message || String(err);
    return {
      success: false,
      message: `فشل تثبيت ${packageName}: ${errMsg.slice(0, 200)}`,
      package: packageName,
      alreadyInstalled: false,
    };
  }
}

/**
 * بيضيف package لـ requirements-runtime.txt (persistent).
 */
async function appendToRuntimeRequirements(packageName: string, gitUrl?: string): Promise<void> {
  try {
    const entry = gitUrl ? `${gitUrl} # ${packageName}\n` : `${packageName}\n`;

    // اتأكد إن الملف موجود
    let existing = "";
    try {
      existing = await fs.readFile(RUNTIME_REQUIREMENTS_FILE, "utf-8");
    } catch {
      // ملف جديد
    }

    // اشوف هل الـ package موجود بالفعل
    const lines = existing.split("\n").map((l) => l.trim().split("#")[0].trim());
    const normalized = packageName.toLowerCase().replace(/-/g, "_");
    const alreadyListed = lines.some((l) => {
      const ln = l.toLowerCase().replace(/-/g, "_").split("[")[0].split("==")[0].split(">=")[0].trim();
      return ln === normalized;
    });

    if (!alreadyListed) {
      await fs.appendFile(RUNTIME_REQUIREMENTS_FILE, entry, "utf-8");
      console.log(`[PersistentInstaller] Added ${packageName} to requirements-runtime.txt`);
    }
  } catch (err) {
    console.warn(`[PersistentInstaller] Failed to persist ${packageName}:`, err);
  }
}

/**
 * بيقرا الـ requirements-runtime.txt ويرجع قائمة الـ packages.
 */
export async function getRuntimeInstalledPackages(): Promise<string[]> {
  try {
    const content = await fs.readFile(RUNTIME_REQUIREMENTS_FILE, "utf-8");
    return content
      .split("\n")
      .map((l) => l.trim().split("#")[0].trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * بيعمل install لكل الـ packages في requirements-runtime.txt.
 * بيـ run عند الـ startup.
 */
export async function installRuntimeRequirements(): Promise<{ installed: number; failed: string[] }> {
  const packages = await getRuntimeInstalledPackages();
  if (packages.length === 0) {
    return { installed: 0, failed: [] };
  }

  console.log(`[PersistentInstaller] Installing ${packages.length} runtime packages...`);

  let installed = 0;
  const failed: string[] = [];

  for (const pkg of packages) {
    try {
      const result = await installPythonPackagePersistent(pkg, { force: false });
      if (result.success) {
        installed++;
      } else {
        failed.push(pkg);
      }
    } catch {
      failed.push(pkg);
    }
  }

  console.log(`[PersistentInstaller] Done: ${installed} installed, ${failed.length} failed`);
  return { installed, failed };
}
