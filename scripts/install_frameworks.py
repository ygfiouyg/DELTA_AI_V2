#!/usr/bin/env python3
"""
Sequential Framework Installer — V.96
=====================================
بيثبّت الـ AI frameworks بشكل تسلسلي مع try/except لكل واحد.
لو واحد فشل، الباقي بيكمل.

Frameworks:
  1. langchain + langchain-community + langchain-core
  2. pyautogen + autogen-agentchat
  3. crewai + crewai-tools
  4. semantic-kernel
  5. autogpt-forge (--no-deps)

Usage:
  python3 scripts/install_frameworks.py
  python3 scripts/install_frameworks.py --skip autogpt  # skip specific framework
  python3 scripts/install_frameworks.py --only langchain  # install only one

The script writes a manifest to skills_manifest.json (via the Node.js registry)
so the JIT Context Injector can recognize these frameworks.
"""

import subprocess
import sys
import json
import os
import time
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────────
FRAMEWORKS = [
    {
        "name": "langchain",
        "packages": ["langchain", "langchain-community", "langchain-core"],
        "description": "LangChain — LLM orchestration framework for chains, agents, and RAG",
        "import_name": "langchain",
        "keywords": ["langchain", "chain", "agent", "rag", "llm"],
        "timeout": 300,
    },
    {
        "name": "autogen",
        "packages": ["pyautogen", "autogen-agentchat"],
        "description": "Microsoft AutoGen — multi-agent conversation framework",
        "import_name": "autogen",
        "keywords": ["autogen", "multi-agent", "agent chat"],
        "timeout": 300,
    },
    {
        "name": "crewai",
        "packages": ["crewai", "crewai-tools"],
        "description": "CrewAI — role-playing autonomous AI agents framework",
        "import_name": "crewai",
        "keywords": ["crewai", "crew", "agent team"],
        "timeout": 300,
    },
    {
        "name": "semantic-kernel",
        "packages": ["semantic-kernel"],
        "description": "Microsoft Semantic Kernel — SDK for AI orchestration with skills/plugins",
        "import_name": "semantic_kernel",
        "keywords": ["semantic kernel", "semantic-kernel", "sk plugin"],
        "timeout": 300,
    },
    {
        "name": "autogpt-forge",
        "packages": ["autogpt-forge"],
        "description": "AutoGPT Forge — framework for building autonomous AI agents (--no-deps)",
        "import_name": "autogpt",
        "keywords": ["autogpt", "auto-gpt", "autonomous agent"],
        "timeout": 180,
        "extra_args": ["--no-deps"],
    },
]

MANIFEST_PATH = Path(__file__).parent.parent / "frameworks_manifest.json"
LOG_PATH = Path(__file__).parent.parent / "frameworks_install.log"


def log(message: str, level: str = "INFO"):
    """يكتب للـ stdout + الـ log file"""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] [{level}] {message}"
    print(line, flush=True)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def install_package(package: str, timeout: int = 300, extra_args: list = None) -> dict:
    """يثبّت package واحد ويرجع النتيجة"""
    cmd = [sys.executable, "-m", "pip", "install", "--no-cache-dir", "--break-system-packages"]
    if extra_args:
        cmd.extend(extra_args)
    cmd.append(package)

    log(f"  Installing: {package} (timeout={timeout}s)")
    start = time.time()
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        elapsed = time.time() - start
        if result.returncode == 0:
            log(f"  ✅ {package} installed in {elapsed:.1f}s")
            return {"package": package, "success": True, "elapsed": elapsed, "output": result.stdout[-500:]}
        else:
            error = result.stderr[-500:] if result.stderr else result.stdout[-500:]
            log(f"  ❌ {package} failed (exit {result.returncode}): {error[:200]}")
            return {"package": package, "success": False, "elapsed": elapsed, "error": error}
    except subprocess.TimeoutExpired:
        elapsed = time.time() - start
        log(f"  ⏰ {package} timed out after {timeout}s")
        return {"package": package, "success": False, "elapsed": elapsed, "error": "timeout"}
    except Exception as e:
        elapsed = time.time() - start
        log(f"  ❌ {package} error: {e}")
        return {"package": package, "success": False, "elapsed": elapsed, "error": str(e)}


def verify_import(import_name: str) -> bool:
    """يتأكد إن الـ module متاح بعد التثبيت"""
    try:
        result = subprocess.run(
            [sys.executable, "-c", f"import {import_name}; print('OK')"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return result.returncode == 0 and "OK" in result.stdout
    except Exception:
        return False


def install_framework(framework: dict) -> dict:
    """يثبّت framework كامل (كل الـ packages بتاعته)"""
    name = framework["name"]
    packages = framework["packages"]
    timeout = framework.get("timeout", 300)
    extra_args = framework.get("extra_args", [])

    log(f"\n{'='*60}")
    log(f"Installing framework: {name}")
    log(f"{'='*60}")

    results = []
    all_success = True
    for pkg in packages:
        result = install_package(pkg, timeout=timeout, extra_args=extra_args)
        results.append(result)
        if not result["success"]:
            all_success = False

    # verify import
    import_name = framework.get("import_name", name)
    import_ok = verify_import(import_name) if all_success else False

    framework_result = {
        "name": name,
        "description": framework.get("description", ""),
        "keywords": framework.get("keywords", []),
        "import_name": import_name,
        "packages": packages,
        "results": results,
        "all_success": all_success,
        "import_verified": import_ok,
        "installed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

    if import_ok:
        log(f"✅ Framework {name} installed and verified")
    elif all_success:
        log(f"⚠️ Framework {name} packages installed but import failed")
    else:
        log(f"❌ Framework {name} installation partial/failed")

    return framework_result


def update_manifest(framework_results: list):
    """يكتب/يحدّث الـ frameworks manifest"""
    manifest = {
        "version": "1.0",
        "last_updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "frameworks": [],
    }

    # اقرا الـ manifest القديم لو موجود
    if MANIFEST_PATH.exists():
        try:
            existing = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
            manifest["frameworks"] = existing.get("frameworks", [])
        except Exception:
            pass

    # update/add each framework
    for fr in framework_results:
        # شيل أي entry قديم بنفس الاسم
        manifest["frameworks"] = [f for f in manifest["frameworks"] if f.get("name") != fr["name"]]
        manifest["frameworks"].append({
            "name": fr["name"],
            "description": fr["description"],
            "keywords": fr["keywords"],
            "import_name": fr["import_name"],
            "packages": fr["packages"],
            "available": fr["import_verified"],
            "installed_at": fr["installed_at"],
        })

    manifest["last_updated"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    log(f"\n📋 Manifest updated: {MANIFEST_PATH}")


def main():
    log("=" * 60)
    log("Sequential Framework Installer — V.96")
    log("=" * 60)

    # parse args
    skip = set()
    only = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--skip" and i + 1 < len(args):
            skip.add(args[i + 1].lower())
            i += 2
        elif args[i] == "--only" and i + 1 < len(args):
            only = args[i + 1].lower()
            i += 2
        else:
            i += 1

    frameworks_to_install = FRAMEWORKS
    if only:
        frameworks_to_install = [f for f in FRAMEWORKS if f["name"].lower() == only]
        if not frameworks_to_install:
            log(f"❌ Framework '{only}' not found. Available: {[f['name'] for f in FRAMEWORKS]}")
            sys.exit(1)
    else:
        frameworks_to_install = [f for f in FRAMEWORKS if f["name"].lower() not in skip]

    log(f"Frameworks to install: {[f['name'] for f in frameworks_to_install]}")
    log(f"Skip: {skip if skip else 'none'}")

    all_results = []
    for framework in frameworks_to_install:
        try:
            result = install_framework(framework)
            all_results.append(result)
        except Exception as e:
            log(f"❌ Framework {framework['name']} crashed: {e}", "ERROR")
            all_results.append({
                "name": framework["name"],
                "description": framework.get("description", ""),
                "keywords": framework.get("keywords", []),
                "import_name": framework.get("import_name", framework["name"]),
                "packages": framework["packages"],
                "results": [],
                "all_success": False,
                "import_verified": False,
                "installed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "error": str(e),
            })

    # update manifest
    update_manifest(all_results)

    # summary
    log("\n" + "=" * 60)
    log("INSTALLATION SUMMARY")
    log("=" * 60)
    total = len(all_results)
    successful = sum(1 for r in all_results if r["import_verified"])
    partial = sum(1 for r in all_results if r["all_success"] and not r["import_verified"])
    failed = total - successful - partial

    for r in all_results:
        status = "✅" if r["import_verified"] else ("⚠️" if r["all_success"] else "❌")
        log(f"  {status} {r['name']}: verified={r['import_verified']}, packages_ok={r['all_success']}")

    log(f"\nTotal: {total} | Verified: {successful} | Partial: {partial} | Failed: {failed}")
    log(f"Manifest: {MANIFEST_PATH}")
    log(f"Log: {LOG_PATH}")

    # exit code: 0 if at least one verified, 1 if all failed
    sys.exit(0 if successful > 0 else 1)


if __name__ == "__main__":
    main()
