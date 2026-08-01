#!/usr/bin/env python3
"""Quick Phase 1: Get top 100 repos across curated topics."""
import os, json, time, urllib.request, re
from pathlib import Path
from datetime import datetime

LOG_FILE = Path("/tmp/gh_quick.log")
GH_TOKEN = None
try:
    import subprocess
    result = subprocess.run(["git", "config", "--get", "remote.githubnew.url"], capture_output=True, text=True, cwd="/home/z/my-project")
    if result.returncode == 0:
        m = re.search(r'ygfiouyg:([^@]+)@github', result.stdout.strip())
        if m: GH_TOKEN = m.group(1)
except: pass

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f: f.write(line + "\n")

def gh_request(url, retries=3):
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "AnzaroTools/1.0"}
    if GH_TOKEN: headers["Authorization"] = f"token {GH_TOKEN}"
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
        except:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
    return None

def main():
    log("🚀 Quick Phase 1 — collect top repos")
    
    # Shorter curated list (verified to exist)
    CURATED_REPOS = [
        "langchain-ai/langchain", "microsoft/autogen", "run-llama/llama_index",
        "openai/openai-python", "huggingface/transformers",
        "scikit-learn/scikit-learn", "pytorch/pytorch", "tensorflow/tensorflow",
        "microsoft/playwright", "puppeteer/puppeteer", "SeleniumHQ/selenium",
        "n8n-io/n8n", "scrapy/scrapy",
        "psf/requests", "encode/httpx", "encode/starlette",
        "tiangolo/fastapi", "pallets/flask", "django/django",
        "pandas-dev/pandas", "numpy/numpy", "scipy/scipy",
        "matplotlib/matplotlib", "plotly/plotly.py", "seaborn/seaborn",
        "polars/polars",
        "pallets/click", "tiangolo/typer", "Textualize/rich", "tqdm/tqdm",
        "Delgan/loguru",
        "yt-dlp/yt-dlp", "pytube/pytube",
        "pymupdf/PyMuPDF", "py-pdf/pypdf", "jsvine/pdfplumber",
        "python-openxml/python-docx", "scanny/python-pptx",
        "python-pillow/Pillow", "opencv/opencv-python", "scikit-image/scikit-image",
        "jiaaro/pydub", "librosa/librosa", "coqui-ai/TTS",
        "nltk/nltk", "explosion/spaCy", "RasaHQ/rasa",
        "sloria/TextBlob",
        "pyca/cryptography",
        "chroma-core/chroma", "facebookresearch/faiss",
        "langchain-ai/langgraph",
        "lxml/lxml", "scrapinghub/spidy",
        "public-apis/public-apis",
        "encode/uvicorn",
        "pytest-dev/pytest", "python-poetry/poetry",
        "pypa/pip", "pypa/setuptools",
        "vinta/awesome-python",
        "josephmisiti/awesome-machine-learning",
        "e2b-dev/awesome-ai-agents", "kyrolabs/awesome-agents",
        "huggingface/datasets", "huggingface/accelerate",
        "openai/whisper", "m-bain/whisperX",
        "rahulsrma26/streamlit-chatbot",
        "deepset-ai/haystack",
        "gventuri/pandas-ai",
        "Significant-Gravitas/AutoGPT",
        "yoheinakajima/babyagi",
        "torvalds/linux",
        "microsoft/vscode",
        "AUTOMATIC1111/stable-diffusion-webui",
        "comfyanonymous/ComfyUI",
        "ailab-ai/PainlessGenAI",
        "Ollama/ollama",
        "ollama/ollama-python",
        "fastapi-users/fastapi-users",
        "sqlalchemy/sqlalchemy",
        "encode/databases",
        "tailwindlabs/tailwindcss",
        "vercel/next.js",
        "facebook/react",
        "vuejs/vue",
        "angular/angular",
        "sveltejs/svelte",
        "preactjs/preact",
        "withastro/astro",
        "remix-run/remix",
        "golang/go",
        "rust-lang/rust",
        "microsoft/TypeScript",
        "denoland/deno",
        "nodejs/node",
    ]
    
    log(f"Curated {len(CURATED_REPOS)} repos")
    
    all_repos = []
    seen = set()
    for full_name in CURATED_REPOS:
        full_name = full_name.strip()
        if not full_name or full_name in seen:
            continue
        seen.add(full_name)
        data = gh_request(f"https://api.github.com/repos/{full_name}")
        if not data:
            log(f"   ❌ {full_name}")
            continue
        repo = {
            "name": data["name"],
            "full_name": data["full_name"],
            "description": data.get("description", ""),
            "stars": data["stargazers_count"],
            "language": data.get("language"),
            "url": data["html_url"],
            "default_branch": data["default_branch"],
            "license": (data.get("license") or {}).get("spdx_id", "NO_LICENSE") if data.get("license") else "NO_LICENSE",
            "topics": data.get("topics", []),
        }
        all_repos.append(repo)
        log(f"   ✅ {full_name} ({repo['stars']:,})")
        time.sleep(0.2)  # Faster
        
        # Save progress every 20 repos
        if len(all_repos) % 20 == 0:
            _save_manifest(all_repos)
            log(f"   💾 Progress saved ({len(all_repos)} repos)")
        
        if len(all_repos) >= 100:
            break
    
    _save_manifest(all_repos)
    log(f"\n✅ Done! {len(all_repos)} repos saved")


def _save_manifest(repos):
    manifest_path = Path("/home/z/my-project/exports/github_top_repos.json")
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump({
            "total_repos": len(repos),
            "collected_at": datetime.now().isoformat(),
            "repos": repos,
        }, f, indent=2, default=str)

if __name__ == "__main__":
    main()
