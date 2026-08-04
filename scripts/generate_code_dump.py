#!/usr/bin/env python3
"""
تجميع كل ملفات المشروع المهمة في ملف Markdown واحد.
"""
import os
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path("/home/z/my-project")
OUTPUT_FILE = PROJECT_ROOT / "PROJECT_CODE_DUMP.md"

# الملفات المطلوبة (مرتبة بالأهمية)
FILES_TO_INCLUDE = [
    # ─── Config Files ─────────────────────────────────
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "requirements.txt",
    ".gitignore",
    "components.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "tailwind.config.ts",
    "Caddyfile",

    # ─── Prisma ─────────────────────────────────────
    "prisma/schema.prisma",
    "prisma/seed.ts",

    # ─── Core Lib: Tools Registry ───────────────────
    "src/lib/tools-registry/index.ts",
    "src/lib/tools-registry/gh_tools_registry.ts",
    "src/lib/tools-registry/nodejs/date_utilities.ts",
    "src/lib/tools-registry/nodejs/text_utilities.ts",
    "src/lib/tools-registry/nodejs/json_utilities.ts",
    "src/lib/tools-registry/nodejs/regex_tester.ts",
    "src/lib/tools-registry/nodejs/unit_converter.ts",
    "src/lib/tools-registry/nodejs/color_utilities.ts",
    "src/lib/tools-registry/nodejs/network_utilities.ts",
    "src/lib/tools-registry/nodejs/validation_utilities.ts",
    "src/lib/tools-registry/nodejs/cron_utilities.ts",
    "src/lib/tools-registry/nodejs/hash_utilities.ts",
    "src/lib/tools-registry/python/sentiment_analysis.py",
    "src/lib/tools-registry/python/text_classifier.py",
    "src/lib/tools-registry/python/text_summarizer.py",
    "src/lib/tools-registry/python/keyword_extractor.py",
    "src/lib/tools-registry/python/language_detector.py",
    "src/lib/tools-registry/python/csv_analyzer.py",
    "src/lib/tools-registry/python/statistics_calculator.py",
    "src/lib/tools-registry/python/data_visualizer.py",
    "src/lib/tools-registry/python/web_scraper.py",
    "src/lib/tools-registry/python/http_api_tester.py",
    "src/lib/tools-registry/python/youtube_downloader.py",
    "src/lib/tools-registry/python/image_processor.py",
    "src/lib/tools-registry/python/ocr_extractor.py",
    "src/lib/tools-registry/python/pdf_processor.py",
    "src/lib/tools-registry/python/audio_processor.py",
    "src/lib/tools-registry/python/text_to_speech.py",
    "src/lib/tools-registry/python/qr_code_generator.py",
    "src/lib/tools-registry/python/translator.py",
    "src/lib/tools-registry/python/document_generator.py",
    "src/lib/tools-registry/python/fake_data_generator.py",
    "src/lib/tools-registry/python/file_utilities.py",
    "src/lib/tools-registry/python/crypto_utilities.py",
    "src/lib/tools-registry/python/math_solver.py",

    # ─── Core Lib: Agent ─────────────────────────────
    "src/lib/agent/agent-engine.ts",
    "src/lib/agent/custom-tools.ts",
    "src/lib/agent/standalone-tools.ts",

    # ─── Core Lib: Agents (catalog, recipes, executor) ──
    "src/lib/agents/catalog.ts",
    "src/lib/agents/recipes.ts",
    "src/lib/agents/executor.ts",
    "src/lib/agents/orchestrator.ts",

    # ─── Core Lib: Massive Tools ─────────────────────
    "src/lib/massive-tools/callable-tools.ts",
    "src/lib/massive-tools/registry.ts",

    # ─── Core Lib: Skills ────────────────────────────
    "src/lib/skills/loader.ts",
    "src/lib/skills/context-builder.ts",
    "src/lib/skill-indexer.ts",

    # ─── Core Lib: Models ────────────────────────────
    "src/lib/models.ts",

    # ─── Core Lib: Other ─────────────────────────────
    "src/lib/db.ts",
    "src/lib/auth-nextauth.ts",
    "src/lib/with-auth.ts",
    "src/lib/auth-fetch.ts",
    "src/lib/skill-registry.ts",

    # ─── API Routes: Hermes ──────────────────────────
    "src/app/api/hermes/status/route.ts",
    "src/app/api/hermes/chat/route.ts",
    "src/app/api/hermes/models/route.ts",
    "src/app/api/hermes/skills/route.ts",

    # ─── API Routes: Agents ──────────────────────────
    "src/app/api/agents-list/route.ts",
    "src/app/api/agents/route.ts",
    "src/app/api/agents/recipes/route.ts",
    "src/app/api/agents/[id]/route.ts",
    "src/app/api/agents/[id]/run/route.ts",
    "src/app/api/agent/route.ts",
    "src/app/api/agent/specialized/route.ts",
    "src/app/api/agent/loop/route.ts",
    "src/app/api/agent/tools/route.ts",

    # ─── API Routes: Chat ────────────────────────────
    "src/app/api/chat/agent/route.ts",
    "src/app/api/chat/send/route.ts",
    "src/app/api/chat/stream/route.ts",

    # ─── API Routes: Massive Tools ───────────────────
    "src/app/api/massive-tools/exec/route.ts",
    "src/app/api/massive-tools/dynamic-call/route.ts",
    "src/app/api/massive-tools/stats/route.ts",
    "src/app/api/massive-tools/search/route.ts",
    "src/app/api/massive-tools/install/route.ts",

    # ─── API Routes: AI ──────────────────────────────
    "src/app/api/ai/agent/route.ts",
    "src/app/api/ai/parallel-agents/route.ts",

    # ─── API Routes: Auth ────────────────────────────
    "src/app/api/auth/google/route.ts",
    "src/app/api/auth/google/callback/route.ts",

    # ─── Components: Agents ──────────────────────────
    "src/components/agents/AgentsHub.tsx",
    "src/components/agents/AgentBuilder.tsx",
    "src/components/agents/AgentForm.tsx",
    "src/components/agents/AgentRunner.tsx",
    "src/components/agents/types.ts",

    # ─── Components: Chat ────────────────────────────
    "src/components/chat/ChatApp.tsx",
    "src/components/chat/ChatHeader.tsx",

    # ─── Main Page ───────────────────────────────────
    "src/app/page.tsx",
    "src/app/layout.tsx",

    # ─── Skills Samples ──────────────────────────────
    "skills/LLM/SKILL.md",
    "skills/TTS/SKILL.md",
    "skills/ASR/SKILL.md",
    "skills/VLM/SKILL.md",
    "skills/docx/SKILL.md",
    "skills/charts/SKILL.md",
    "skills/coding-agent/SKILL.md",
    "skills/web-reader/SKILL.md",

    # ─── Docker & Deploy ─────────────────────────────
    "Dockerfile",
    "Dockerfile.prod",
    "docker-compose.yml",
    "docker-entrypoint.sh",
    "deploy-vps.sh",
    "deploy-hp-a8.sh",
    "deploy-termux.sh",
    "deploy-oracle.sh",
    "deploy-gcp.sh",
    "deploy-do.sh",
    "install-hermes-termux.sh",

    # ─── Scripts ─────────────────────────────────────
    "scripts/fast_pypi_rebuild.py",
    "scripts/github_tools_phase2.py",
    "scripts/generate_gh_registry.py",
    "scripts/patch_python_tools.py",
    "scripts/patch_gh_submodules.py",
    "scripts/db_sync_manager.py",

    # ─── Mobile App ──────────────────────────────────
    "mobile-app/package.json",
    "mobile-app/src/App.tsx",
    "mobile-app/src/config.ts",

    # ─── Docs ────────────────────────────────────────
    "README.md",
    "MIGRATION.md",
    "EXECUTION_PLAN.md",
]

# Language mapping
LANG_MAP = {
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".py": "python",
    ".json": "json",
    ".prisma": "prisma",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".md": "markdown",
    ".sh": "bash",
    ".env": "bash",
    ".toml": "toml",
    ".mjs": "javascript",
    ".ts.j2": "typescript",
}

def get_lang(filepath):
    ext = Path(filepath).suffix
    return LANG_MAP.get(ext, "")

def format_size(size):
    if size < 1024:
        return f"{size}B"
    elif size < 1024 * 1024:
        return f"{size/1024:.1f}KB"
    else:
        return f"{size/1024/1024:.1f}MB"

def main():
    print("📝 Generating PROJECT_CODE_DUMP.md...")

    content = []
    content.append("# 📦 DELTA_AI_V2 — Complete Project Code Dump")
    content.append("")
    content.append(f"> **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    content.append(f"> **Project:** DELTA_AI_V2 / Anzaro AI")
    content.append(f"> **Developer:** Abdelslam (abdelslam-ai)")
    content.append(f"> **Repo:** https://github.com/ygfiouyg/DELTA_AI_V2")
    content.append("")
    content.append("---")
    content.append("")
    content.append("## 📋 Table of Contents")
    content.append("")

    # Group files by category
    categories = {
        "Config Files": [],
        "Prisma": [],
        "Tools Registry": [],
        "Agent Engine": [],
        "Agents (Catalog/Recipes)": [],
        "Massive Tools": [],
        "Skills System": [],
        "Models": [],
        "Core Lib": [],
        "API Routes — Hermes": [],
        "API Routes — Agents": [],
        "API Routes — Chat": [],
        "API Routes — Massive Tools": [],
        "API Routes — AI": [],
        "API Routes — Auth": [],
        "Components — Agents": [],
        "Components — Chat": [],
        "Main App": [],
        "Skills Samples": [],
        "Docker & Deploy": [],
        "Scripts": [],
        "Mobile App": [],
        "Docs": [],
    }

    def categorize(f):
        if f in ["package.json", "tsconfig.json", "next.config.ts", "requirements.txt", ".gitignore", "components.json", "postcss.config.mjs", "eslint.config.mjs", "tailwind.config.ts", "Caddyfile"]:
            return "Config Files"
        elif f.startswith("prisma/"):
            return "Prisma"
        elif "tools-registry" in f:
            return "Tools Registry"
        elif f.startswith("src/lib/agent/"):
            return "Agent Engine"
        elif f.startswith("src/lib/agents/"):
            return "Agents (Catalog/Recipes)"
        elif "massive-tools" in f:
            return "Massive Tools"
        elif "skills" in f and f.startswith("src/lib/"):
            return "Skills System"
        elif f == "src/lib/skill-indexer.ts":
            return "Skills System"
        elif f == "src/lib/models.ts":
            return "Models"
        elif f.startswith("src/lib/"):
            return "Core Lib"
        elif "/hermes/" in f:
            return "API Routes — Hermes"
        elif "/agents" in f and f.startswith("src/app/api/"):
            return "API Routes — Agents"
        elif "/agent" in f and f.startswith("src/app/api/"):
            return "API Routes — Agents"
        elif "/chat/" in f:
            return "API Routes — Chat"
        elif "/massive-tools/" in f:
            return "API Routes — Massive Tools"
        elif "/ai/" in f:
            return "API Routes — AI"
        elif "/auth/" in f:
            return "API Routes — Auth"
        elif f.startswith("src/components/agents/"):
            return "Components — Agents"
        elif f.startswith("src/components/chat/"):
            return "Components — Chat"
        elif f.startswith("src/app/page.tsx") or f.startswith("src/app/layout.tsx"):
            return "Main App"
        elif f.startswith("skills/"):
            return "Skills Samples"
        elif f.startswith("Dockerfile") or f.startswith("docker-") or f.startswith("deploy-") or f == "install-hermes-termux.sh":
            return "Docker & Deploy"
        elif f.startswith("scripts/"):
            return "Scripts"
        elif f.startswith("mobile-app/"):
            return "Mobile App"
        elif f.endswith(".md"):
            return "Docs"
        return "Core Lib"

    for f in FILES_TO_INCLUDE:
        cat = categorize(f)
        categories[cat].append(f)

    # Build TOC
    for cat, files in categories.items():
        if files:
            content.append(f"- **{cat}** ({len(files)} files)")
            for f in files:
                anchor = f.lower().replace("/", "").replace(".", "").replace("_", "-")
                content.append(f"  - [{f}](#{anchor})")
    content.append("")
    content.append("---")
    content.append("")

    # Stats
    total_files = 0
    total_size = 0
    total_lines = 0
    missing_files = []

    for f in FILES_TO_INCLUDE:
        full_path = PROJECT_ROOT / f
        if not full_path.exists():
            missing_files.append(f)
            continue
        size = full_path.stat().st_size
        total_size += size
        total_files += 1

    content.append("## 📊 Project Statistics")
    content.append("")
    content.append(f"| Metric | Value |")
    content.append(f"|--------|-------|")
    content.append(f"| **Total files in dump** | {total_files} |")
    content.append(f"| **Total size** | {format_size(total_size)} |")
    content.append(f"| **Missing files** | {len(missing_files)} |")
    if missing_files:
        content.append(f"| **Missing list** | {', '.join(missing_files[:5])}... |")
    content.append("")
    content.append("---")
    content.append("")

    # Add files by category
    for cat, files in categories.items():
        if not files:
            continue
        content.append(f"# 📂 {cat}")
        content.append("")

        for f in files:
            full_path = PROJECT_ROOT / f
            if not full_path.exists():
                content.append(f"## `{f}`")
                content.append("")
                content.append("```")
                content.append("⚠️ FILE NOT FOUND")
                content.append("```")
                content.append("")
                continue

            try:
                file_content = full_path.read_text(encoding="utf-8", errors="replace")
            except Exception as e:
                content.append(f"## `{f}`")
                content.append("")
                content.append(f"```")
                content.append(f"⚠️ ERROR READING FILE: {e}")
                content.append("```")
                content.append("")
                continue

            lines = file_content.count("\n")
            total_lines += lines
            lang = get_lang(f)
            size = full_path.stat().st_size

            content.append(f"## `{f}`")
            content.append("")
            content.append(f"> Size: {format_size(size)} | Lines: {lines} | Lang: {lang or 'text'}")
            content.append("")

            # Cap very large files
            if lines > 500:
                content.append(f"> ⚠️ File truncated to first 500 lines (total: {lines})")
                content.append("")
                file_lines = file_content.split("\n")[:500]
                file_content = "\n".join(file_lines)

            content.append(f"```{lang}")
            content.append(file_content)
            if not file_content.endswith("\n"):
                content.append("")
            content.append("```")
            content.append("")
            content.append("---")
            content.append("")

        content.append("")

    # Write file
    final_content = "\n".join(content)
    OUTPUT_FILE.write_text(final_content, encoding="utf-8")

    print(f"✅ Generated: {OUTPUT_FILE}")
    print(f"   Files included: {total_files}")
    print(f"   Total lines: {total_lines:,}")
    print(f"   Total size: {format_size(len(final_content.encode('utf-8')))}")
    if missing_files:
        print(f"   ⚠️ Missing files: {len(missing_files)}")
        for m in missing_files[:10]:
            print(f"      - {m}")

if __name__ == "__main__":
    main()
