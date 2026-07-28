#!/usr/bin/env python3
"""
V.113: Wheels Downloader — بيـ download wheel files لكل الأدوات المهمة.
بدل ما نثبت packages كل مرة (بيتمسح)، هنـ download الـ wheels مرة واحدة.
"""
import subprocess, sys, os, time
from pathlib import Path

WHEELS_DIR = "/home/z/my-project/wheels"
LOG = Path("/home/z/my-project/exports/wheels_download.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

# الأدوات المهمة (51 أداة + dependencies)
TOOLS = [
    # AI
    "openai", "anthropic", "tiktoken",
    # Fun
    "cowsay", "pyjokes", "qrcode",
    # Audio
    "edge-tts", "gTTS",
    # Translation
    "deep-translator",
    # NLP
    "vaderSentiment", "textstat",
    # Docs
    "markdown", "pdfplumber", "pypdf", "python-docx", "python-pptx",
    "openpyxl", "reportlab", "fpdf2",
    # Web
    "requests", "httpx", "beautifulsoup4", "lxml", "yt-dlp",
    # Image
    "pillow", "opencv-python-headless", "pytesseract",
    # Data
    "pandas", "numpy", "scipy", "scikit-learn", "matplotlib", "seaborn", "plotly",
    # Math
    "sympy", "statsmodels",
    # Utils
    "passlib", "bcrypt", "schedule", "loguru",
    "pyyaml", "python-dotenv", "rich", "click", "typer", "tqdm",
    "pydantic", "jinja2", "tabulate",
    # Extra
    "fastapi", "uvicorn", "websockets",
    "psutil", "python-dateutil", "pytz",
]

def download_wheels():
    os.makedirs(WHEELS_DIR, exist_ok=True)
    log(f"🚀 Downloading wheels for {len(TOOLS)} tools...")
    log(f"   Target: {WHEELS_DIR}")

    # use pip download to get all wheels + dependencies
    cmd = [
        sys.executable, "-m", "pip", "download",
        "--no-cache-dir",
        "--dest", WHEELS_DIR,
        "--platform", "manylinux2014_x86_64",
        "--python-version", "312",
        "--only-binary", ":all:",
    ] + TOOLS

    log("   Running pip download...")
    start = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)

    if result.returncode == 0:
        elapsed = time.time() - start
        wheels = list(Path(WHEELS_DIR).glob("*.whl"))
        size_mb = sum(f.stat().st_size for f in wheels) / 1024 / 1024
        log(f"✅ Downloaded {len(wheels)} wheels ({size_mb:.1f}MB) in {elapsed:.1f}s")
        return True, wheels
    else:
        log(f"⚠️ Binary download failed, trying source...")
        # fallback: download without platform restriction
        cmd2 = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir",
            "--dest", WHEELS_DIR,
        ] + TOOLS
        result2 = subprocess.run(cmd2, capture_output=True, text=True, timeout=600)
        if result2.returncode == 0:
            wheels = list(Path(WHEELS_DIR).glob("*.whl")) + list(Path(WHEELS_DIR).glob("*.tar.gz"))
            size_mb = sum(f.stat().st_size for f in wheels) / 1024 / 1024
            log(f"✅ Downloaded {len(wheels)} files ({size_mb:.1f}MB)")
            return True, wheels
        else:
            log(f"❌ Download failed: {result2.stderr[-300:]}")
            return False, []

def main():
    log("=" * 60)
    log("🚀 V.113 Wheels Downloader — START")
    log("=" * 60)
    success, wheels = download_wheels()
    if success:
        log(f"\n📊 Total wheels: {len(wheels)}")
        log(f"💾 Total size: {sum(f.stat().st_size for f in wheels) / 1024 / 1024:.1f}MB")
    log("🏁 DONE")

if __name__ == "__main__":
    main()
