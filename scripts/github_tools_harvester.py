#!/usr/bin/env python3
"""
Top GitHub Tools Harvester
بيجمع top 100 repos في فئات AI/ML/Automation/CLI/Utils
ثم بيستخرج الأدوات/الدوال المفيدة من كل repo
"""
import os, sys, json, time, urllib.request, urllib.parse, re, base64
from pathlib import Path
from datetime import datetime

LOG_FILE = Path("/tmp/github_harvester.log")
TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

# GitHub token from git config
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

# Curated topics for AI/automation tools
TOPICS = [
    # AI/ML frameworks
    "machine-learning", "artificial-intelligence", "deep-learning", "neural-network",
    "natural-language-processing", "llm", "chatbot", "ai-agents",
    "langchain", "openai", "transformers", "pytorch", "tensorflow",
    "rag", "vector-database", "embedding", "agent",
    # Automation
    "automation", "scraper", "crawler", "web-scraping", "browser-automation",
    "playwright", "selenium", "puppeteer",
    # CLI/Tools
    "cli", "command-line", "developer-tools", "terminal", "shell",
    "productivity", "utility", "tools",
    # Data
    "data-analysis", "data-science", "data-visualization",
    "etl", "pipeline", "analytics",
    # Generation
    "text-to-speech", "speech-recognition", "ocr", "image-generation",
    "pdf", "document", "converter",
]

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def gh_request(url, retries=3):
    """Make authenticated GitHub API request."""
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "AnzaroTools/1.0"}
    if GH_TOKEN:
        headers["Authorization"] = f"token {GH_TOKEN}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                # Check rate limit
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining and int(remaining) < 5:
                    reset = int(resp.headers.get("X-RateLimit-Reset", 0))
                    wait = max(0, reset - int(time.time()))
                    log(f"   ⚠️ Rate limit low ({remaining}), waiting {wait}s...")
                    time.sleep(min(wait, 60))
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
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
    return None

def get_top_repos(topic, per_topic=10, max_stars=200000, min_stars=1000):
    """Get top repos by topic."""
    url = f"https://api.github.com/search/repositories?q=topic:{topic}+stars:{min_stars}..{max_stars}&sort=stars&order=desc&per_page={per_topic}"
    data = gh_request(url)
    if not data or "items" not in data:
        return []
    return [
        {
            "name": r["name"],
            "full_name": r["full_name"],
            "description": r.get("description", ""),
            "stars": r["stargazers_count"],
            "language": r.get("language"),
            "url": r["html_url"],
            "default_branch": r["default_branch"],
            "license": (r.get("license") or {}).get("spdx_id", "NO_LICENSE") if r.get("license") else "NO_LICENSE",
            "topics": r.get("topics", []),
        }
        for r in data["items"]
    ]

def get_repo_tree(full_name, default_branch="main"):
    """Get file tree of a repo."""
    url = f"https://api.github.com/repos/{full_name}/git/trees/{default_branch}?recursive=1"
    return gh_request(url)

def get_file_content(full_name, path, default_branch="main"):
    """Get raw content of a file."""
    url = f"https://api.github.com/repos/{full_name}/contents/{urllib.parse.quote(path, safe='/')}?ref={default_branch}"
    data = gh_request(url)
    if not data or "content" not in data:
        return None
    try:
        return base64.b64decode(data["content"]).decode("utf-8", errors="replace")
    except Exception:
        return None

def extract_tools_from_python(content, repo_name):
    """Extract callable functions from Python file."""
    tools = []
    # Find top-level functions with docstrings
    pattern = re.compile(
        r'^(?:async\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?:\s*\n\s*((?:"""[^"]*""")|(?:\'\'\'[^\']*\'\'\')|(?:#[^\n]*\n(?:\s*#[^\n]*\n)*))?',
        re.MULTILINE
    )
    for match in pattern.finditer(content):
        func_name = match.group(1)
        params = match.group(2)
        # Skip private/internal functions
        if func_name.startswith("_") or func_name in ("main", "run", "test", "setup", "init"):
            continue
        # Skip very generic names
        if func_name in ("get", "set", "create", "delete", "update", "load", "save", "open", "close"):
            continue
        # Extract docstring if present
        docstring = ""
        doc_match = re.search(r'("""[^"]*?"""|\'\'\'[^\']*?\'\'\')', content[match.end():match.end()+500], re.DOTALL)
        if doc_match:
            docstring = doc_match.group(1).strip('\"\'').strip()[:200]
        # Parse params (simplified)
        param_list = []
        if params.strip():
            for p in [p.strip() for p in params.split(",")]:
                if not p or p.startswith("*") or p.startswith("/"):
                    continue
                # Skip self/cls
                if p in ("self", "cls"):
                    continue
                # Extract just the name
                pname = p.split("=")[0].split(":")[0].strip()
                if pname and re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', pname):
                    pdefault = None
                    if "=" in p:
                        pdefault = p.split("=", 1)[1].strip()[:50]
                    param_list.append({"name": pname, "default": pdefault})
        if len(param_list) > 10:  # Skip functions with too many params
            continue
        tools.append({
            "name": func_name,
            "params": param_list,
            "docstring": docstring,
            "repo": repo_name,
        })
    return tools

def create_tool_file(tool, repo_info, source_file):
    """Create a Python tool file from extracted function."""
    # Sanitize tool name
    safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', tool["name"]).lower()
    if safe_name.startswith("_"):
        safe_name = safe_name[1:]
    if not safe_name:
        return None
    
    file_name = f"{repo_info['name'].lower().replace('-', '_')}_{safe_name}.py"
    file_path = TOOLS_DIR / file_name
    
    # Skip if file already exists
    if file_path.exists():
        return None
    
    # Build params doc
    params_doc = "\n".join(
        f"  {p['name']}: {p.get('default', 'required')}" 
        for p in tool["params"]
    ) or "  (no parameters)"
    
    # Build function signature for the wrapper
    sig_params = ", ".join(p["name"] for p in tool["params"])
    
    content = f'''"""
Tool: {repo_info["name"]}_{tool["name"]}
Source: {repo_info["full_name"]} ({repo_info["stars"]:,} stars)
License: {repo_info["license"]}
Original file: {source_file}

Description:
{tool["docstring"] or repo_info["description"] or "Tool extracted from " + repo_info["full_name"]}

Parameters:
{params_doc}

Repo URL: {repo_info["url"]}
"""

# Note: This tool wraps a function from {repo_info["full_name"]}.
# To use the original implementation, install the package:
#   pip install {repo_info["name"].lower().replace(" ", "-")}
#
# Or clone the repo:
#   git clone {repo_info["url"]}.git

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute({sig_params}):
    """
    Execute {tool["name"]} from {repo_info["full_name"]}.
    
    Original docstring:
    {tool["docstring"] or "N/A"}
    """
    try:
        # Try to import from the original package
        try:
            import {repo_info["name"].lower().replace("-", "_")}
            mod = {repo_info["name"].lower().replace("-", "_")}
            if hasattr(mod, "{tool["name"]}"):
                fn = getattr(mod, "{tool["name"]}")
                result = fn({sig_params})
                return {{"success": True, "result": str(result)[:2000] if result is not None else "None"}}
        except ImportError:
            pass
        
        return {{
            "success": False,
            "error": f"Package '{repo_info['name']}' not installed. Install with: pip install {repo_info['name'].lower().replace(' ', '-')}",
            "repo_url": "{repo_info['url']}",
            "original_function": "{tool['name']}",
            "original_docstring": """{tool['docstring'] or 'N/A'}""",
            "params_expected": {json.dumps([p["name"] for p in tool["params"]])},
        }}
    except Exception as e:
        return {{"success": False, "error": str(e)[:200]}}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    return execute(**{{k: v for k, v in args.items() if k in {[p["name"] for p in tool["params"]] or [p["name"] for p in tool["params"]]}}})


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
    
    import argparse
    parser = argparse.ArgumentParser(description="Tool from {repo_info['full_name']}")
'''
    # Add args based on params
    for p in tool["params"]:
        if p["default"]:
            content += f'    parser.add_argument("--{p["name"]}", default={p["default"]})\n'
        else:
            content += f'    parser.add_argument("--{p["name"]}", required=True)\n'
    content += f'    args = parser.parse_args()\n'
    content += f'    result = execute(**vars(args))\n'
    content += f'    print(json.dumps(result, ensure_ascii=False, default=str))\n'
    
    file_path.write_text(content, encoding="utf-8")
    return file_path

def main():
    log("=" * 60)
    log("🚀 GitHub Tools Harvester — START")
    log(f"   Token: {'✅ available' if GH_TOKEN else '❌ not found (will use unauthenticated)'}")
    log("=" * 60)
    
    # Check rate limit
    rl = gh_request("https://api.github.com/rate_limit")
    if rl:
        core = rl.get("resources", {}).get("core", {})
        log(f"   Rate limit: {core.get('remaining', '?')}/{core.get('limit', '?')}")
        if core.get("remaining", 0) < 100:
            log("   ⚠️ Low rate limit, aborting")
            return
    
    # Phase 1: Collect top repos across topics
    log("\n📥 Phase 1: Collecting top repos by topic...")
    all_repos = {}
    repos_seen = set()
    for topic in TOPICS:
        log(f"   Topic: {topic}")
        repos = get_top_repos(topic, per_topic=5, min_stars=500)
        for r in repos:
            if r["full_name"] not in repos_seen:
                repos_seen.add(r["full_name"])
                all_repos[r["full_name"]] = r
        log(f"      Found {len(repos)} repos (total unique: {len(all_repos)})")
        time.sleep(0.5)  # be nice
    
    log(f"\n✅ Phase 1 done: {len(all_repos)} unique repos collected")
    
    # Sort by stars and take top 100
    top_repos = sorted(all_repos.values(), key=lambda x: x["stars"], reverse=True)[:100]
    log(f"   Selected top {len(top_repos)} repos by stars")
    for i, r in enumerate(top_repos[:10], 1):
        log(f"   {i}. {r['full_name']} ({r['stars']:,} stars) - {(r['description'] or '')[:60]}")
    log(f"   ... and {len(top_repos) - 10} more")
    
    # Save manifest
    manifest_path = Path("/home/z/my-project/exports/github_top_repos.json")
    with open(manifest_path, "w") as f:
        json.dump({
            "total_repos": len(top_repos),
            "collected_at": datetime.now().isoformat(),
            "repos": top_repos,
        }, f, indent=2, default=str)
    log(f"   Manifest saved to {manifest_path}")
    
    # Phase 2: For each repo, get tree and extract Python files
    log(f"\n📥 Phase 2: Extracting tools from repos...")
    tools_created = 0
    repos_processed = 0
    
    for i, repo in enumerate(top_repos, 1):
        if repos_processed >= 50:  # Limit to 50 repos to stay in rate limit
            log(f"   Reached 50 repos limit, stopping")
            break
        log(f"\n[{i}/{len(top_repos)}] {repo['full_name']} ({repo['stars']:,} stars)")
        
        # Get tree
        tree = get_repo_tree(repo["full_name"], repo.get("default_branch", "main"))
        if not tree or "tree" not in tree:
            log(f"   ❌ Failed to get tree")
            continue
        
        # Find Python files (skip tests, docs, examples)
        py_files = []
        for item in tree["tree"]:
            if item["type"] != "blob":
                continue
            path = item["path"]
            if not path.endswith(".py"):
                continue
            # Skip tests/docs/examples
            if any(skip in path.lower() for skip in ["test", "tests/", "docs/", "example", "examples/", "setup.py", "conftest", "__init__", "benchmark", "scripts/"]):
                continue
            # Skip very large files
            if item.get("size", 0) > 50_000:  # 50KB
                continue
            py_files.append(path)
        
        # Limit to first 10 files per repo
        py_files = py_files[:10]
        log(f"   Found {len(py_files)} Python files (capped at 10)")
        
        repo_tools_count = 0
        for py_file in py_files[:5]:  # Only first 5 files per repo
            content = get_file_content(repo["full_name"], py_file, repo.get("default_branch", "main"))
            if not content:
                continue
            tools = extract_tools_from_python(content, repo["name"])
            for tool in tools[:3]:  # Only first 3 tools per file
                file_path = create_tool_file(tool, repo, py_file)
                if file_path:
                    tools_created += 1
                    repo_tools_count += 1
            time.sleep(0.1)  # be nice
        
        log(f"   ✅ Created {repo_tools_count} tools from this repo")
        repos_processed += 1
        time.sleep(0.5)
        
        # Check rate limit periodically
        if i % 10 == 0:
            rl = gh_request("https://api.github.com/rate_limit")
            if rl:
                remaining = rl.get("resources", {}).get("core", {}).get("remaining", 0)
                log(f"   📊 Rate limit remaining: {remaining}")
                if remaining < 100:
                    log(f"   ⚠️ Stopping due to low rate limit")
                    break
    
    log(f"\n{'=' * 60}")
    log(f"🏁 HARVEST COMPLETE")
    log(f"{'=' * 60}")
    log(f"   Repos processed: {repos_processed}")
    log(f"   Tools created: {tools_created}")
    log(f"   Tools directory: {TOOLS_DIR}")
    
    # List all created tools
    final_tools = list(TOOLS_DIR.glob("*.py"))
    log(f"   Total files in tools dir: {len(final_tools)}")

if __name__ == "__main__":
    main()
