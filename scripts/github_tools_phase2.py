#!/usr/bin/env python3
"""
Phase 2: Extract tools from top 100 GitHub repos.
بيـ load الـ manifest اللي اتجمّع في Phase 1 و يستخرج الأدوات.
"""
import os, sys, json, time, urllib.request, urllib.parse, re, base64
from pathlib import Path
from datetime import datetime

LOG_FILE = Path("/tmp/github_harvester_phase2.log")
TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GH_TOKEN = None
try:
    import subprocess
    result = subprocess.run(["git", "config", "--get", "remote.githubnew.url"], capture_output=True, text=True, cwd="/home/z/my-project")
    if result.returncode == 0:
        url = result.stdout.strip()
        m = re.search(r'ygfiouyg:([^@]+)@github', url)
        if m:
            GH_TOKEN = m.group(1)
except Exception:
    pass

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def gh_request(url, retries=3):
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "AnzaroTools/1.0"}
    if GH_TOKEN:
        headers["Authorization"] = f"token {GH_TOKEN}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 403 and "rate limit" in str(e).lower():
                reset = int(e.headers.get("X-RateLimit-Reset", 0))
                wait = max(0, reset - int(time.time()))
                log(f"   ⚠️ Rate limited, waiting {wait}s")
                time.sleep(min(wait, 60))
                continue
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
        except Exception:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
    return None

def get_repo_tree(full_name, default_branch="main"):
    url = f"https://api.github.com/repos/{full_name}/git/trees/{default_branch}?recursive=1"
    return gh_request(url)

def get_file_content(full_name, path, default_branch="main"):
    url = f"https://api.github.com/repos/{full_name}/contents/{urllib.parse.quote(path, safe='/')}?ref={default_branch}"
    data = gh_request(url)
    if not data or "content" not in data:
        return None
    try:
        return base64.b64decode(data["content"]).decode("utf-8", errors="replace")
    except Exception:
        return None

def extract_tools_from_python(content, repo_name):
    tools = []
    pattern = re.compile(
        r'^(?:async\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?:\s*\n\s*((?:"""[^"]*""")|(?:\'\'\'[^\']*\'\'\')|(?:#[^\n]*\n(?:\s*#[^\n]*\n)*))?',
        re.MULTILINE
    )
    for match in pattern.finditer(content):
        func_name = match.group(1)
        params = match.group(2)
        if func_name.startswith("_") or func_name in ("main", "run", "test", "setup", "init", "cli", "command"):
            continue
        if func_name in ("get", "set", "create", "delete", "update", "load", "save", "open", "close", "execute", "process"):
            continue
        docstring = ""
        doc_match = re.search(r'("""[^"]*?"""|\'\'\'[^\']*?\'\'\')', content[match.end():match.end()+500], re.DOTALL)
        if doc_match:
            docstring = doc_match.group(1).strip('\"\'').strip()[:200]
        param_list = []
        if params.strip():
            for p in [p.strip() for p in params.split(",")]:
                if not p or p.startswith("*") or p.startswith("/"):
                    continue
                if p in ("self", "cls"):
                    continue
                pname = p.split("=")[0].split(":")[0].strip()
                if pname and re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', pname):
                    pdefault = None
                    if "=" in p:
                        pdefault = p.split("=", 1)[1].strip()[:50]
                    param_list.append({"name": pname, "default": pdefault})
        if len(param_list) > 8:
            continue
        # Must have at least 1 param or a docstring
        if not param_list and not docstring:
            continue
        tools.append({
            "name": func_name,
            "params": param_list,
            "docstring": docstring,
        })
    return tools

def create_tool_file(tool, repo_info, source_file):
    safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', tool["name"]).lower()
    if safe_name.startswith("_"):
        safe_name = safe_name[1:]
    if not safe_name:
        return None
    
    repo_clean = re.sub(r'[^a-zA-Z0-9_]', '_', repo_info["name"]).lower()[:30]
    file_name = f"gh_{repo_clean}_{safe_name}.py"
    file_path = TOOLS_DIR / file_name
    
    if file_path.exists():
        return None
    
    sig_params = ", ".join(p["name"] for p in tool["params"])
    params_doc = "\n".join(
        f"  {p['name']}: {p.get('default') or 'required'}" 
        for p in tool["params"]
    ) or "  (no parameters)"
    
    # Sanitize strings for f-string
    safe_docstring = (tool["docstring"] or "N/A").replace('"', '\\"').replace('\n', ' ')[:200]
    safe_description = (repo_info["description"] or "Tool from GitHub").replace('"', '\\"').replace('\n', ' ')[:200]
    safe_repo_name = repo_info["name"].replace('"', '\\"')
    safe_pip_name = repo_info["name"].lower().replace('"', '\\"').replace(" ", "-")
    safe_import_name = safe_pip_name.replace("-", "_")
    
    content = f'''"""
Tool: {repo_info["name"]}_{tool["name"]}
Source: {repo_info["full_name"]} ({repo_info["stars"]:,} stars)
License: {repo_info["license"]}
Original file: {source_file}

Description:
{tool["docstring"] or repo_info["description"] or "Tool from " + repo_info["full_name"]}

Parameters:
{params_doc}

Repo URL: {repo_info["url"]}
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute({sig_params}):
    """Execute {tool["name"]} from {repo_info["full_name"]}."""
    try:
        import importlib
        try:
            mod = importlib.import_module("{safe_import_name}")
            if hasattr(mod, "{tool["name"]}"):
                fn = getattr(mod, "{tool["name"]}")
                result = fn({sig_params})
                return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "{repo_info["full_name"]}"}}
        except ImportError:
            pass
        
        return {{
            "success": False,
            "error": f"Package '{safe_repo_name}' not installed. Install: pip install {safe_pip_name}",
            "repo_url": "{repo_info["url"]}",
            "original_function": "{tool["name"]}",
            "docstring": "{safe_docstring}",
            "params": {json.dumps([p["name"] for p in tool["params"]])},
        }}
    except Exception as e:
        return {{"success": False, "error": str(e)[:200]}}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = {[p["name"] for p in tool["params"]] if tool["params"] else []}
    filtered = {{k: v for k, v in args.items() if k in valid_keys}} if valid_keys else args
    return execute(**filtered)


if __name__ == "__main__":
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)
    print(json.dumps({{"usage": "Use --args_file <path> with JSON args", "params": {json.dumps([p["name"] for p in tool["params"]])}}}))
'''
    
    file_path.write_text(content, encoding="utf-8")
    return file_path

def main():
    log("=" * 60)
    log("🚀 Phase 2: GitHub Tools Extraction — START")
    log("=" * 60)
    
    # Load manifest
    manifest_path = Path("/home/z/my-project/exports/github_top_repos.json")
    if not manifest_path.exists():
        log("❌ Manifest not found. Run Phase 1 first.")
        return
    
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    repos = sorted(manifest["repos"], key=lambda x: x["stars"], reverse=True)[:50]
    log(f"Loaded {len(repos)} repos from manifest (top 50 by stars)")
    
    # Check rate limit
    rl = gh_request("https://api.github.com/rate_limit")
    if rl:
        remaining = rl.get("resources", {}).get("core", {}).get("remaining", 0)
        log(f"Rate limit remaining: {remaining}")
        if remaining < 200:
            log("⚠️ Low rate limit, aborting")
            return
    
    tools_created = 0
    repos_processed = 0
    
    for i, repo in enumerate(repos, 1):
        log(f"\n[{i}/{len(repos)}] {repo['full_name']} ({repo['stars']:,} stars)")
        
        tree = get_repo_tree(repo["full_name"], repo.get("default_branch", "main"))
        if not tree or "tree" not in tree:
            log(f"   ❌ Failed to get tree")
            continue
        
        # Find Python files
        py_files = []
        for item in tree["tree"]:
            if item["type"] != "blob":
                continue
            path = item["path"]
            if not path.endswith(".py"):
                continue
            if any(skip in path.lower() for skip in ["test", "tests/", "docs/", "example", "examples/", "setup.py", "conftest", "__init__", "benchmark", "scripts/", "migrations", "vendor", ".github"]):
                continue
            if item.get("size", 0) > 50_000:
                continue
            py_files.append({"path": path, "size": item.get("size", 0)})
        
        # Sort by size (smaller files more likely to be utility modules)
        py_files.sort(key=lambda x: x["size"])
        py_files = py_files[:8]
        log(f"   Found {len(py_files)} candidate Python files")
        
        repo_tools_count = 0
        for py_file in py_files[:5]:
            content = get_file_content(repo["full_name"], py_file["path"], repo.get("default_branch", "main"))
            if not content or len(content) < 100:
                continue
            tools = extract_tools_from_python(content, repo["name"])
            for tool in tools[:3]:
                file_path = create_tool_file(tool, repo, py_file["path"])
                if file_path:
                    tools_created += 1
                    repo_tools_count += 1
            time.sleep(0.1)
        
        log(f"   ✅ Created {repo_tools_count} tools from this repo")
        repos_processed += 1
        time.sleep(0.3)
        
        # Save progress every 10 repos
        if i % 10 == 0:
            log(f"   📊 Progress: {tools_created} tools created so far")
            # Check rate limit
            rl = gh_request("https://api.github.com/rate_limit")
            if rl:
                remaining = rl.get("resources", {}).get("core", {}).get("remaining", 0)
                log(f"   📊 Rate limit remaining: {remaining}")
                if remaining < 50:
                    log(f"   ⚠️ Stopping due to low rate limit")
                    break
    
    log(f"\n{'=' * 60}")
    log(f"🏁 PHASE 2 COMPLETE")
    log(f"{'=' * 60}")
    log(f"   Repos processed: {repos_processed}")
    log(f"   Tools created: {tools_created}")
    
    final_tools = list(TOOLS_DIR.glob("gh_*.py"))
    log(f"   Total GitHub tools in dir: {len(final_tools)}")

if __name__ == "__main__":
    main()
