#!/usr/bin/env python3
"""
V.114: حمل أدوات حقيقية إضافية + وسع الـ callable tools.
"""
import subprocess, sys, os, time, sqlite3
from pathlib import Path

WHEELS_DIR = "/home/z/my-project/wheels"
DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/expand_tools.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

# أدوات إضافية مهمة (مش موجودة في الـ 55 الحالية)
EXTRA_TOOLS = [
    # AI/ML إضافية
    "transformers", "tokenizers", "safetensors", "huggingface-hub",
    "scikit-image", "imageio", "imageio-ffmpeg",
    # Web scraping إضافية
    "scrapy", "newspaper3k", "trafilatura",
    # NLP إضافية
    "nltk", "spacy", "textblob",
    # Audio إضافية
    "pydub", "librosa", "soundfile",
    # PDF إضافية
    "pymupdf", "pdf2image", "img2pdf",
    # Document إضافية
    "xlsxwriter", "xlrd",
    # Data viz إضافية
    "bokeh", "altair", "plotly",
    # Utils إضافية
    "psutil", "python-dateutil", "pytz", "arrow",
    "watchdog", "filelock", "python-magic",
    "chardet", "charset-normalizer", "unidecode",
    "python-slugify", "rapidfuzz", "jellyfish",
    "regex", "pyparsing", "lark",
    "orjson", "ujson", "msgpack", "jsonschema",
    "pyyaml", "toml", "python-dotenv",
    "rich", "textual", "click", "typer", "tqdm",
    "pydantic", "jinja2", "tabulate",
    # Security
    "cryptography", "pyjwt", "passlib", "bcrypt", "argon2-cffi",
    # HTTP
    "httpx", "aiohttp", "websockets",
    # Testing
    "pytest", "hypothesis",
    # API
    "fastapi", "uvicorn", "starlette",
    # Database
    "sqlalchemy", "sqlmodel",
    # Image processing
    "albumentations", "imgaug",
    # Math
    "sympy", "statsmodels", "mpmath",
    # Visualization
    "matplotlib", "seaborn",
    # CLI
    "rich", "click", "typer",
    # Monitoring
    "loguru", "structlog",
    # Scheduling
    "schedule", "apscheduler",
    # Fun
    "art", "faker",
    # QR/Barcode
    "python-barcode",
    # Translation
    "deep-translator",
    # Text analysis
    "textstat", "vaderSentiment",
    # File handling
    "aiofiles",
    # Async
    "anyio", "async-timeout",
    # Data
    "pandas", "numpy", "scipy", "scikit-learn",
    # Web
    "requests", "beautifulsoup4", "lxml",
    # Image
    "pillow", "opencv-python-headless",
    # Docs
    "pdfplumber", "pypdf", "python-docx", "python-pptx", "openpyxl",
    "reportlab", "fpdf2", "markdown",
    # Audio
    "edge-tts", "gTTS",
    # Video
    "yt-dlp",
    # AI APIs
    "openai", "anthropic", "tiktoken",
    # Fun
    "cowsay", "pyjokes", "qrcode",
]

def download_wheels():
    os.makedirs(WHEELS_DIR, exist_ok=True)
    log(f"🚀 Downloading {len(EXTRA_TOOLS)} additional tools...")
    cmd = [
        sys.executable, "-m", "pip", "download",
        "--no-cache-dir",
        "--dest", WHEELS_DIR,
    ] + EXTRA_TOOLS
    start = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
    if result.returncode == 0:
        wheels = list(Path(WHEELS_DIR).glob("*.whl")) + list(Path(WHEELS_DIR).glob("*.tar.gz"))
        size_mb = sum(f.stat().st_size for f in wheels) / 1024 / 1024
        log(f"✅ {len(wheels)} files ({size_mb:.1f}MB) in {time.time()-start:.1f}s")
        return True
    else:
        log(f"⚠️ {result.stderr[-200:]}")
        return False

def install_all_wheels():
    """بيـ install كل الـ wheels."""
    wheels = list(Path(WHEELS_DIR).glob("*.whl"))
    if not wheels:
        log("⚠️ No wheels")
        return False
    log(f"📦 Installing {len(wheels)} wheels...")
    cmd = [
        sys.executable, "-m", "pip", "install",
        "--no-cache-dir", "--no-index",
        "--find-links", WHEELS_DIR,
        "--break-system-packages", "--quiet",
        "--target", "/home/z/.venv/lib/python3.12/site-packages",
    ] + [str(w) for w in wheels]
    start = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if result.returncode == 0:
        log(f"✅ Installed in {time.time()-start:.1f}s")
        return True
    else:
        log(f"⚠️ {result.stderr[-200:]}")
        return False

def mark_installed_in_db():
    """بيـ update الـ DB."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    # كل الأدوات اللي ممكن تكون متثبتة
    all_tools = EXTRA_TOOLS + [
        "openai","anthropic","tiktoken","cowsay","pyjokes","qrcode",
        "edge-tts","gTTS","deep-translator","vaderSentiment","textstat",
        "markdown","pdfplumber","pypdf","python-docx","python-pptx",
        "openpyxl","reportlab","fpdf2","requests","httpx","beautifulsoup4",
        "lxml","yt-dlp","pillow","opencv-python-headless","pytesseract",
        "pandas","numpy","scipy","scikit-learn","matplotlib","seaborn","plotly",
        "sympy","statsmodels","passlib","bcrypt","schedule","loguru",
    ]
    updated = 0
    for name in all_tools:
        base = name.replace("-","_").replace("opencv-python-headless","cv2").replace("python-docx","docx").replace("python-pptx","pptx").replace("beautifulsoup4","bs4").replace("fpdf2","fpdf").replace("gTTS","gtts").replace("edge-tts","edge_tts").replace("deep-translator","deep_translator").replace("scikit-learn","sklearn").replace("scikit-image","skimage").replace("python-dateutil","dateutil").replace("python-dotenv","dotenv").replace("python-magic","magic").replace("python-slugify","slugify").replace("python-barcode","barcode").replace("argon2-cffi","argon2").replace("async-timeout","async_timeout")
        try:
            r = subprocess.run([sys.executable, "-c", f"import {base}"], capture_output=True, timeout=10)
            if r.returncode == 0:
                cur.execute("UPDATE ToolRegistry SET isInstalled=1, isVerified=1, installPath='wheel', updatedAt=datetime('now') WHERE name=? AND source='pypi'", (name,))
                updated += cur.rowcount
        except: pass
    conn.commit()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    total = cur.fetchone()[0]
    log(f"📊 DB: {updated} updated | Total installed: {total}")
    conn.close()

def main():
    log("="*60)
    log("🚀 V.114 Expand Tools — START")
    log("="*60)
    download_wheels()
    install_all_wheels()
    mark_installed_in_db()
    log("🏁 DONE")

if __name__ == "__main__":
    main()
