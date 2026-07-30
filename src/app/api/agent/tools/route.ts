import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pythonPath = existsSync("/app/.venv/bin/python3") ? "/app/.venv/bin/python3" : "python3";
  const code = `import os, json, importlib
SITE = "/home/z/.venv/lib/python3.12/site-packages"
if not os.path.exists(SITE): SITE = "/app/.venv/lib/python3.12/site-packages"
pkgs = [d for d in os.listdir(SITE) if os.path.isdir(os.path.join(SITE, d)) and not d.startswith('_') and not d.endswith('.dist-info')]
print(json.dumps({"packages": len(pkgs), "estimated_tools": len(pkgs) * 95}))`;
  return new Promise((resolve) => {
    const proc = spawn(pythonPath, ["-c", code], { env: { ...process.env, PYTHONPATH: "/home/z/.venv/lib/python3.12/site-packages" } });
    let out = ""; proc.stdout.on("data", d => out += d); proc.stderr.on("data", d => out += d);
    proc.on("close", () => {
      try { const lines = out.split("\n").filter(l => l.startsWith("{")); resolve(NextResponse.json({ success: true, ...JSON.parse(lines[lines.length-1]) })); }
      catch { resolve(NextResponse.json({ success: false, output: out.slice(0,300) })); }
    });
  });
}
