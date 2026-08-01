#!/usr/bin/env python3
"""
Auto-generate registry entries for all gh_*.py tools.
بيـ scan الـ tools directory و يـ generate tool definitions.
"""
import os, re, json
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")
OUTPUT_FILE = Path("/home/z/my-project/src/lib/tools-registry/gh_tools_registry.ts")

def extract_metadata(filepath):
    """Extract metadata from a Python tool file."""
    content = filepath.read_text()
    
    # Extract name from filename
    fname = filepath.stem  # gh_flask_create_logger
    parts = fname.replace("gh_", "").rsplit("_", 1)
    if len(parts) == 2:
        repo_name, func_name = parts
        tool_name = f"gh_{repo_name}_{func_name}"
    else:
        tool_name = fname
        repo_name = "unknown"
        func_name = fname
    
    # Extract docstring
    desc_match = re.search(r'^"""\s*\n(.*?)\n^"""', content, re.MULTILINE | re.DOTALL)
    description = ""
    if desc_match:
        desc_block = desc_match.group(1)
        # Get the first non-empty line that's not a "Tool:" / "Source:" / etc header
        for line in desc_block.split("\n"):
            line = line.strip()
            if not line: continue
            if line.startswith(("Tool:", "Source:", "License:", "Original file:", "Parameters:", "Repo URL:", "Description:")):
                continue
            description = line[:200]
            break
    
    # Extract source repo
    source_match = re.search(r'Source:\s*(\S+)', content)
    source_repo = source_match.group(1) if source_match else ""
    
    # Extract license
    license_match = re.search(r'License:\s*(\S+)', content)
    license_name = license_match.group(1) if license_match else "NO_LICENSE"
    
    # Extract params from def execute(...)
    params = []
    exec_match = re.search(r'def execute\s*\(([^)]*)\)', content)
    if exec_match:
        params_str = exec_match.group(1).strip()
        if params_str:
            for p in [p.strip() for p in params_str.split(",")]:
                if p and not p.startswith("*"):
                    pname = p.split("=")[0].split(":")[0].strip()
                    if pname and re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', pname):
                        params.append(pname)
    
    return {
        "name": tool_name,
        "file": filepath.name,
        "description": description or f"Tool from {source_repo}",
        "source_repo": source_repo,
        "license": license_name,
        "params": params,
    }


def main():
    print("🔍 Scanning tools directory...")
    tools = []
    for f in sorted(TOOLS_DIR.glob("gh_*.py")):
        meta = extract_metadata(f)
        tools.append(meta)
        print(f"   ✅ {meta['name']} ({len(meta['params'])} params)")
    
    print(f"\n✅ Found {len(tools)} tools")
    
    # Generate TypeScript registry
    ts_content = """/**
 * GitHub Tools Registry — Auto-generated from src/lib/tools-registry/python/gh_*.py
 *
 * V.146: كل أداة دي implementation مستخرجة من top GitHub repos.
 * لكل أداة:
 *   - الـ source repo (مع عدد stars)
 *   - الـ original function name
 *   - الـ parameters المتوقعة
 *   - install instructions (pip install <package>)
 *
 * Generated at: """ + __import__('datetime').datetime.now().isoformat() + """
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runGhPythonTool(scriptName: string, args: any, timeoutMs: number = 30000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_gh_args_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        const lines = stdout.trim().split("\\n").filter((l) => l.trim());
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-300),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

export interface GhToolDefinition {
  name: string;
  description: string;
  category: "github";
  runtime: "python";
  source_repo: string;
  license: string;
  parameters: Record<string, { type: string; description: string }>;
  execute: (args: any) => Promise<any>;
}

"""
    
    # Generate tool definitions
    ts_content += "export const GH_TOOLS: GhToolDefinition[] = [\n"
    for tool in tools:
        # Sanitize
        safe_name = tool["name"]
        safe_desc = tool["description"].replace('"', '\\"').replace('\n', ' ')[:200]
        safe_repo = tool["source_repo"].replace('"', '\\"')
        safe_license = tool["license"].replace('"', '\\"')
        safe_file = tool["file"]
        
        # Build parameters object
        params_obj = ", ".join(
            f'{p}: {{ type: "string", description: "parameter {p}" }}'
            for p in tool["params"]
        )
        params_str = "{" + params_obj + "}" if tool["params"] else "{}"
        
        ts_content += f"""  {{
    name: "{safe_name}",
    description: "{safe_desc}",
    category: "github",
    runtime: "python",
    source_repo: "{safe_repo}",
    license: "{safe_license}",
    parameters: {params_str},
    execute: async (args) => runGhPythonTool("{safe_file}", args),
  }},
"""
    
    ts_content += "];\n\n"
    
    # Add helper functions
    ts_content += """export function getGhTools(): GhToolDefinition[] {
  return GH_TOOLS;
}

export function findGhTool(name: string): GhToolDefinition | null {
  return GH_TOOLS.find((t) => t.name === name) || null;
}

export async function executeGhTool(name: string, args: any): Promise<{ success: boolean; output?: any; error?: string; durationMs: number }> {
  const start = Date.now();
  const tool = findGhTool(name);
  if (!tool) {
    return { success: false, error: `GitHub tool '${name}' not found`, durationMs: 0 };
  }
  try {
    const result = await tool.execute(args);
    return {
      success: result?.success !== false,
      output: result,
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return { success: false, error: e.message, durationMs: Date.now() - start };
  }
}

export function getGhToolsSchema() {
  return GH_TOOLS.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: `[GitHub:${t.source_repo}] ${t.description}`,
      parameters: {
        type: "object",
        properties: t.parameters,
      },
    },
    category: t.category,
    runtime: t.runtime,
    source_repo: t.source_repo,
    license: t.license,
  }));
}

export function getGhStats() {
  const repos = new Set(GH_TOOLS.map((t) => t.source_repo));
  return {
    total: GH_TOOLS.length,
    unique_repos: repos.size,
  };
}
"""
    
    OUTPUT_FILE.write_text(ts_content)
    print(f"\n✅ Generated {OUTPUT_FILE}")
    print(f"   Total tools: {len(tools)}")
    print(f"   Unique repos: {len(set(t['source_repo'] for t in tools))}")
    
    # Print sample
    if tools:
        print(f"\n   Sample tool:")
        print(f"     {tools[0]['name']}: {tools[0]['description'][:60]}")


if __name__ == "__main__":
    main()
