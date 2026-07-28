/**
 * V.108: JIT (Just-In-Time) Tool Installer
 * ------------------------------------------
 * لما الموديل يطلب أداة، ده بيـ:
 *  1. يـ search الـ ToolRegistry
 *  2. يـ install الأداة (pip / npm / git clone)
 *  3. يـ mark الأداة installed في الـ DB
 *  4. يـ verify إنها اشتغلت
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { searchTools, markToolInstalled, type ToolEntry } from "./registry";

const sleep = promisify(setTimeout);

export interface InstallResult {
  success: boolean;
  tool?: ToolEntry;
  output: string;
  error?: string;
  durationMs: number;
}

/** بيـ search عن أداة ويرجّع أفضل match. */
export async function findTool(query: string): Promise<ToolEntry | null> {
  const results = await searchTools(query, 5);
  return results[0] ?? null;
}

/** بيـ install أداة بناءً على source. */
export async function installTool(name: string, source?: string): Promise<InstallResult> {
  const start = Date.now();
  const results = await searchTools(name, 5);
  const tool = results.find(t => t.name.toLowerCase() === name.toLowerCase())
            || results.find(t => source && t.source === source)
            || results[0];

  if (!tool) {
    return { success: false, output: "", error: `Tool "${name}" not found in registry`, durationMs: Date.now() - start };
  }

  try {
    let output = "";
    const cmd = tool.installCmd;

    if (tool.source === "pypi") {
      // pip install — use --break-system-packages for PEP 668 (sandbox)
      output = await runCommand("pip", ["install", "--no-cache-dir", "--quiet", "--break-system-packages", tool.name], 120000);
    } else if (tool.source === "npm") {
      // npm install (global)
      output = await runCommand("npm", ["install", "-g", "--silent", tool.name], 120000);
    } else if (tool.source === "github") {
      // git clone to /home/z/my-project/installed-tools/
      const dest = `/home/z/my-project/installed-tools/${tool.name}`;
      output = await runCommand("git", ["clone", "--depth", "1", tool.repository, dest], 60000);
      await markToolInstalled(tool.name, tool.source, dest);
    } else {
      // fallback: run installCmd as shell
      output = await runCommand("bash", ["-c", cmd], 120000);
    }

    // verify install
    const verified = await verifyInstall(tool);
    if (verified) {
      await markToolInstalled(tool.name, tool.source, "");
    }

    return {
      success: verified,
      tool,
      output: output.slice(0, 2000),
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return {
      success: false,
      tool,
      output: "",
      error: e.message || String(e),
      durationMs: Date.now() - start,
    };
  }
}

/** بيـ verify إن الأداة اتباعت بنجاح. */
async function verifyInstall(tool: ToolEntry): Promise<boolean> {
  try {
    if (tool.source === "pypi") {
      const out = await runCommand("python3", ["-c", `import importlib; importlib.import_module('${tool.name.replace(/-/g,"_").split(".")[0]}')`], 15000);
      return !out.toLowerCase().includes("error") && !out.toLowerCase().includes("traceback");
    }
    if (tool.source === "npm") {
      const out = await runCommand("npm", ["list", "-g", tool.name], 10000);
      return out.includes(tool.name);
    }
    if (tool.source === "github") {
      return true; // git clone success = installed
    }
    return true;
  } catch {
    return false;
  }
}

/** بيـ run command ويرجّع stdout+stderr. */
function runCommand(cmd: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd: "/home/z/my-project", env: process.env });
    let stdout = "", stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout + stderr);
      else resolve(stdout + stderr); // نرجّع الـ output حتى لو في error
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

/** بيـ search و install في خطوة واحدة (للـ model). */
export async function searchAndInstall(query: string): Promise<InstallResult> {
  const tool = await findTool(query);
  if (!tool) {
    return { success: false, output: "", error: `No tool found for "${query}"`, durationMs: 0 };
  }
  if (tool.isInstalled) {
    return { success: true, tool, output: "Already installed", durationMs: 0 };
  }
  return installTool(tool.name, tool.source);
}
