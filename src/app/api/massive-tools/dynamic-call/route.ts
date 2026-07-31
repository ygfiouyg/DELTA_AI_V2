/**
 * V.131: Dynamic Package Caller — بيـ execute أي package + أي function ديناميكياً.
 * بدل 586 wrapper يدوي، ده endpoint واحد بيـ import أي package وينفذ أي function.
 *
 * POST /api/massive-tools/dynamic-call
 * { "package": "pandas", "function": "DataFrame", "kwargs": {"data": [[1,2]]} }
 * { "package": "numpy", "action": "info" }
 * { "package": "requests", "action": "list_functions" }
 */

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, promises as fsPromises } from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PYTHON_PATHS = [
  "python3",
  "/usr/bin/python3",
  "/usr/local/bin/python3",
  "/app/.venv/bin/python3",
  "/home/z/.venv/bin/python3",
];

const SITE_PACKAGES = [
  "/usr/local/lib/python3.11/dist-packages",
  "/usr/lib/python3/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

async function runPython(code: string, timeoutMs = 60000): Promise<string> {
  // V.131d: Use inline -c flag instead of tmpfile (avoids filesystem issues)
  const pythonPath = "python3";
  const pythonpath = SITE_PACKAGES.join(":");

  return new Promise((resolve) => {
    // Use -c flag to pass code directly (no temp file needed)
    const proc = spawn(pythonPath, ["-c", code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1", PYTHONPATH: pythonpath },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve(JSON.stringify({ error: `Timeout after ${timeoutMs}ms` }));
    }, timeoutMs);
    proc.on("close", () => {
      clearTimeout(timer);
      resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : ""));
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve(JSON.stringify({ error: e.message }));
    });
  });
}

function getImportName(pkg: string): string {
  const M: Record<string, string> = {
    "PIL":"PIL","PyPDF2":"PyPDF2","opencv-python-headless":"cv2",
    "python-docx":"docx","python-pptx":"pptx","beautifulsoup4":"bs4",
    "fpdf2":"fpdf","gTTS":"gtts","edge-tts":"edge_tts",
    "deep-translator":"deep_translator","scikit-learn":"sklearn",
    "scikit-image":"skimage","python-dateutil":"dateutil","python-dotenv":"dotenv",
    "python-magic":"magic","python-slugify":"slugify","python-barcode":"barcode",
    "argon2-cffi":"argon2","async-timeout":"async_timeout","pillow":"PIL",
    "pymupdf":"fitz","faiss-cpu":"faiss","pycryptodome":"Crypto",
    "pyopenssl":"OpenSSL","pynacl":"nacl","pyyaml":"yaml","pyjwt":"jwt",
    "google-api-python-client":"googleapiclient","google-auth":"google_auth",
    "youtube-transcript-api":"youtube_transcript_api",
    "readability-lxml":"readability_lxml","discord.py":"discord",
    "slack-sdk":"slack_sdk","websocket-client":"websocket",
  };
  return M[pkg] || pkg.replace(/-/g,"_").replace(/\./g,"_").replace(/\[.*\]/,"").toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pkg = body.package;
    const func = body.function;
    const args = body.args || [];
    const kwargs = body.kwargs || {};
    const action = body.action || (func ? "call" : "info");
    const query = body.query || "";
    
    if (!pkg) return NextResponse.json({ success: false, error: "package required" }, { status: 400 });
    
    const imp = getImportName(pkg);
    
    // Build Python code based on action
    let code = "";
    
    if (action === "info") {
      code = `import importlib, json
imp = "${imp}"
try:
    mod = importlib.import_module(imp)
    ver = getattr(mod, '__version__', getattr(mod, 'VERSION', getattr(mod, '__name__', 'unknown')))
    all_items = [x for x in dir(mod) if not x.startswith('_')]
    fns = [x for x in all_items if callable(getattr(mod, x, None))][:50]
    cls = [x for x in all_items if isinstance(getattr(mod, x, None), type)][:20]
    others = [x for x in all_items if x not in fns and x not in cls][:10]
    print(json.dumps({"package":"${pkg}","import":imp,"version":str(ver),"functions_count":len(fns),"functions":fns,"classes":cls,"others":others}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "list_functions") {
      code = `import importlib, json, inspect
imp = "${imp}"
try:
    mod = importlib.import_module(imp)
    fns = []
    for name in dir(mod):
        if name.startswith('_'): continue
        obj = getattr(mod, name)
        if callable(obj):
            try:
                sig = inspect.signature(obj)
                params = list(sig.parameters.keys())[:5]
                fns.append({"name": name, "params": params})
            except:
                fns.append({"name": name, "params": []})
        if len(fns) >= 100: break
    print(json.dumps({"package":"${pkg}","functions":fns}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "search_functions" && query) {
      code = `import importlib, json, inspect
imp = "${imp}"
q = "${query}".lower()
try:
    mod = importlib.import_module(imp)
    matches = []
    for name in dir(mod):
        if name.startswith('_'): continue
        if q in name.lower():
            obj = getattr(mod, name)
            if callable(obj):
                doc = (inspect.getdoc(obj) or "")[:100]
                matches.append({"name": name, "doc": doc})
        if len(matches) >= 20: break
    print(json.dumps({"package":"${pkg}","query":"${query}","matches":matches}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "call" && func) {
      const argsStr = JSON.stringify(args).replace(/'/g, "\\'");
      const kwargsStr = JSON.stringify(kwargs).replace(/'/g, "\\'");
      code = `import importlib, json, sys
imp = "${imp}"
func_path = "${func}"
args_list = json.loads('${argsStr}')
kwargs_dict = json.loads('${kwargsStr}')
try:
    mod = importlib.import_module(imp)
    obj = mod
    for part in func_path.split('.'):
        if part: obj = getattr(obj, part)
    result = obj(*args_list, **kwargs_dict)
    if hasattr(result, 'to_dict'): result = result.to_dict()
    elif hasattr(result, 'tolist'): result = result.tolist()
    elif hasattr(result, '__dict__'): result = str(result)[:2000]
    else: result = str(result)[:2000]
    print(json.dumps({"success": True, "result": result}, default=str, ensure_ascii=False))
except Exception as e:
    import traceback
    print(json.dumps({"success": False, "error": str(e)[:300], "tb": traceback.format_exc()[-200:]}, default=str, ensure_ascii=False))`;
    } else {
      return NextResponse.json({ success: false, error: "Invalid action. Use: info, list_functions, search_functions, call" }, { status: 400 });
    }
    
    const output = await runPython(code, 60000);
    return NextResponse.json({ success: true, package: pkg, action, result: output });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const code = `import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/lib/python3/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import os, json, sys
pkgs = []
# check all possible site-packages locations
paths = [
    "/app/.venv/lib/python3.12/site-packages",
    "/home/z/.venv/lib/python3.12/site-packages",
    "/usr/lib/python3/dist-packages",
    "/usr/local/lib/python3.11/dist-packages",
    "/usr/local/lib/python3.12/dist-packages",
    "/usr/lib/python3.11/dist-packages",
]
for site in paths:
    if not os.path.exists(site):
        continue
    for d in os.listdir(site):
        if d.startswith('_') or d.endswith('.dist-info') or d.endswith('.egg-info') or d.endswith('.so'):
            continue
        full = os.path.join(site, d)
        if os.path.isdir(full) or (os.path.isfile(full) and d.endswith('.py')):
            pkgs.append(d.replace('.py',''))
pkgs = sorted(set(pkgs))
print(json.dumps({"count": len(pkgs), "packages": pkgs}))`;
  const output = await runPython(code, 10000);
  return NextResponse.json({ success: true, mode: "dynamic", output });
}
