#!/usr/bin/env python3
"""
V.110: تثبيت الأدوات الفعلية (pip install) للموديل.
بيثبت أهم الأدوات اللي الموديل ممكن يحتاجها فعلياً.
"""
import subprocess, sys, json, sqlite3, time
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/install_tools.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

# قائمة الأدوات المهمة اللي الموديل ممكن يحتاجها فعلياً
TOOLS_TO_INSTALL = [
    # ── AI/ML ──
    "openai", "anthropic", "tiktoken", "transformers", "tokenizers",
    "sentence-transformers", "diffusers", "accelerate", "peft",
    "langchain", "langchain-core", "langchain-community",
    "chromadb", "faiss-cpu", "sentencepiece",
    # ── Data ──
    "pandas", "numpy", "scipy", "scikit-learn", "matplotlib", "seaborn",
    "plotly", "polars", "pyarrow",
    # ── Media ──
    "pillow", "opencv-python-headless", "pydub", "librosa",
    "moviepy", "imageio", "imageio-ffmpeg",
    # ── PDF/Docs ──
    "pdfplumber", "pypdf", "python-docx", "python-pptx", "openpyxl",
    "reportlab", "fpdf2", "markdown", "weasyprint",
    # ── Web ──
    "requests", "httpx", "beautifulsoup4", "lxml", "aiohttp",
    "selenium", "playwright", "yt-dlp",
    # ── NLP ──
    "spacy", "nltk", "gensim", "textblob", "vaderSentiment",
    "wordcloud", "textstat",
    # ── Speech ──
    "gTTS", "edge-tts", "SpeechRecognition",
    # ── OCR/Vision ──
    "pytesseract", "easyocr", "qrcode", "pyzbar",
    # ── Charts ──
    "matplotlib", "plotly", "bokeh",
    # ── Utilities ──
    "pyyaml", "python-dotenv", "rich", "click", "typer", "tqdm",
    "pydantic", "jinja2", "tabulate",
    # ── Math/Science ──
    "sympy", "statsmodels",
    # ── Network ──
    "websockets", "websocket-client",
    # ── Crypto ──
    "cryptography", "pyjwt", "passlib", "bcrypt",
    # ── Testing ──
    "pytest",
    # ── Extra AI ──
    "llama-index", "haystack-ai",
    "google-generativeai", "google-cloud-aiplatform",
    "replicate", "modal",
    "huggingface-hub", "datasets",
    # ── Scraping ──
    "scrapy", "newspaper3k", "trafilatura",
    # ── Translation ──
    "deep-translator", "googletrans==4.0.0-rc1",
    # ── Fun ──
    "cowsay", "pyjokes", "art",
    # ── QR/Barcode ──
    "qrcode[pil]", "python-barcode",
    # ── Email ──
    "yagmail", "secure-smtplib",
    # ── Scheduling ──
    "schedule", "apscheduler",
    # ── Monitoring ──
    "psutil", "loguru",
    # ── SQL ──
    "sqlalchemy", "sqlmodel",
]

def install_package(name):
    """بيثبت package واحد ويرجع النتيجة."""
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--no-cache-dir",
             "--quiet", "--break-system-packages", name],
            capture_output=True, text=True, timeout=120
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout"
    except Exception as e:
        return False, str(e)

def verify_package(name):
    """بيـ verify إن package متثبت بالفعل."""
    try:
        import_name = name.replace("-", "_").replace("[pil]","").split("=")[0].split(">")[0].split("<")[0]
        result = subprocess.run(
            [sys.executable, "-c", f"import importlib; importlib.import_module('{import_name}')"],
            capture_output=True, text=True, timeout=15
        )
        return result.returncode == 0
    except:
        return False

def mark_installed(conn, name, success, output):
    """بيـ update الـ DB بـ status التثبيت."""
    cur = conn.cursor()
    cur.execute("""UPDATE ToolRegistry SET
        isInstalled=?, installPath=?, updatedAt=datetime('now')
        WHERE name=? AND source='pypi'""",
        (1 if success else 0, output[:200] if output else "", name))
    conn.commit()

def main():
    log("="*60)
    log("🚀 V.110 Installing ACTUAL tools (pip install)")
    log(f"Target: {len(TOOLS_TO_INSTALL)} packages")
    log("="*60)

    conn = sqlite3.connect(DB_PATH, timeout=60)
    cur = conn.cursor()

    # شوف اللي متثبت بالفعل
    cur.execute("SELECT name FROM ToolRegistry WHERE isInstalled=1 AND source='pypi'")
    already = {r[0] for r in cur.fetchall()}
    log(f"📊 Already installed: {len(already)}")

    installed_count = 0
    failed_count = 0
    already_count = 0

    for i, name in enumerate(TOOLS_TO_INSTALL, 1):
        base_name = name.replace("[pil]","").split("=")[0].split(">")[0].split("<")[0]
        if base_name in already:
            already_count += 1
            log(f"  [{i}/{len(TOOLS_TO_INSTALL)}] {name} — already installed ✅")
            continue

        log(f"  [{i}/{len(TOOLS_TO_INSTALL)}] Installing {name}...")
        start = time.time()
        success, output = install_package(name)

        if success:
            # verify
            verified = verify_package(base_name)
            if verified:
                installed_count += 1
                elapsed = time.time() - start
                log(f"     ✅ {name} installed + verified ({elapsed:.1f}s)")
                mark_installed(conn, base_name, True, f"verified at {time.strftime('%H:%M:%S')}")
            else:
                log(f"     ⚠️ {name} installed but import failed")
                mark_installed(conn, base_name, False, "import failed")
                failed_count += 1
        else:
            err = output[-200:] if output else "unknown error"
            log(f"     ❌ {name} failed: {err[:100]}")
            mark_installed(conn, base_name, False, err)
            failed_count += 1

    # Final stats
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    total_installed = cur.fetchone()[0]
    log("="*60)
    log(f"📊 RESULTS:")
    log(f"   ✅ Newly installed: {installed_count}")
    log(f"   ⚠️ Already installed: {already_count}")
    log(f"   ❌ Failed: {failed_count}")
    log(f"   📦 Total in DB marked installed: {total_installed}")
    log("="*60)
    conn.close()

if __name__ == "__main__":
    main()
