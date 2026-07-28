#!/usr/bin/env python3
"""
V.111b: Fast Tools Installer — أدوات صغيرة سريعة التثبيت.
بيتجنب الأدوات الكبيرة (torch, tensorflow, transformers deps).
"""
import subprocess, sys, sqlite3, time, os
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/fast_install.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

# أدوات صغيرة سريعة التثبيت (كل واحدة < 50MB)
FAST_TOOLS = [
    # AI/ML (small)
    "openai", "anthropic", "tiktoken",
    "scikit-learn", "xgboost", "lightgbm",
    "nltk", "textblob", "vaderSentiment", "textstat", "wordcloud",
    "huggingface-hub", "safetensors",
    "onnxruntime",
    # "captum",  # needs torch — skip
    "lime", "eli5",
    "optuna", "hyperopt",
    "imbalanced-learn", "category-encoders",
    "lazypredict", "flaml",
    
    # Data
    "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
    "polars", "pyarrow",
    "sqlalchemy", "sqlmodel", "alembic",
    "pymongo", "redis",
    "psycopg2-binary", "pymysql",
    "elasticsearch",
    "great-expectations", "pandera",
    "pandas-profiling",
    
    # Media
    "pillow", "opencv-python-headless", "scikit-image",
    "imageio", "imageio-ffmpeg",
    "pydub", "librosa", "soundfile",
    "pytesseract", # "easyocr",  # needs torch — skip
    "qrcode", "python-barcode", "pyzbar",
    "pdfplumber", "pypdf", "pymupdf",
    "reportlab", "fpdf2", "weasyprint",
    "python-docx", "python-pptx", "openpyxl",
    "xlsxwriter", "xlrd",
    "markdown", "jinja2",
    "img2pdf", "ocrmypdf",
    
    # Web
    "requests", "httpx", "aiohttp",
    "beautifulsoup4", "lxml", "parsel",
    "selenium", "playwright",
    "scrapy",
    "newspaper3k", "trafilatura", "goose3",
    "feedparser",
    "yt-dlp", "pytube",
    "google-api-python-client", "google-auth",
    "tweepy", "python-telegram-bot",
    "fastapi", "flask", "starlette",
    "uvicorn", "gunicorn",
    "websockets", "websocket-client",
    "pyjwt", "authlib",
    "passlib", "bcrypt", "argon2-cffi",
    "cryptography", "pycryptodome",
    "pyotp",
    
    # Dev
    "pytest", "pytest-asyncio", "pytest-cov",
    "coverage", "hypothesis",
    "black", "ruff", "isort",
    "flake8", "pylint", "mypy",
    "bandit", "safety",
    "rich", "textual", "click", "typer",
    "tqdm",
    "loguru", "structlog",
    "psutil", "py-cpuinfo",
    "pyinstrument",
    "locust",
    "docker", # "kubernetes",  # too large — skip
    "prometheus-client", "sentry-sdk",
    
    # Science
    "sympy", "mpmath",
    "networkx", "igraph", "pyvis",
    "shapely", "geojson", "folium",
    "geopandas",
    
    # Utility
    "pyyaml", "toml", "python-dotenv",
    "environs", "hydra-core", "omegaconf",
    "schedule", "apscheduler",
    "celery", "rq", "dramatiq", "huey",
    "pydantic", "pydantic-settings",
    "tabulate", "prettytable",
    "python-dateutil", "pytz", "arrow",
    "pendulum",
    "watchdog", "watchfiles",
    "filelock",
    "python-magic", "puremagic", "filetype",
    "chardet", "charset-normalizer",
    "unidecode", "ftfy",
    "python-slugify",
    "fuzzywuzzy", "rapidfuzz", "jellyfish",
    "regex",
    "pyparsing", "lark",
    "jsonpath-ng", "jmespath",
    "orjson", "ujson", "msgpack",
    "jsonschema", "fastjsonschema",
    
    # Fun
    "cowsay", "pyjokes", "art",
    
    # Audio
    "gTTS", "edge-tts", "SpeechRecognition",
    
    # Translation
    "deep-translator",
    
    # Extra
    "tableauhyperapi", "snowflake-connector-python",
    "minio", "fsspec", "s3fs",
    "kafka-python",
    "pulsar-client",
    "dvc",
    "mlflow", "wandb", "tensorboard",
    "albumentations", "imgaug",
    "shap", "interpret", "dalex",
    "ray", "nevergrad",
    "feature-engine", "featuretools",
    "pycaret", "tpot",
    "evidently", "deepchecks",
    "fairlearn", "aif360",
]

def install_one(name, timeout=60):
    try:
        r = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--no-cache-dir",
             "--quiet", "--break-system-packages", name],
            capture_output=True, text=True, timeout=timeout
        )
        return r.returncode == 0, r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        return False, f"Timeout ({timeout}s)"
    except Exception as e:
        return False, str(e)

def verify(name):
    try:
        base = name.replace("-", "_").replace("[pil]","").replace("[all]","").split("=")[0].split(">")[0].split("<")[0]
        r = subprocess.run([sys.executable, "-c", f"import importlib; importlib.import_module('{base}')"],
                          capture_output=True, text=True, timeout=15)
        return r.returncode == 0, base
    except:
        return False, name

def disk_usage():
    try:
        return subprocess.check_output(["df", "-h", "/"], text=True).strip().split("\n")[1].split()[4]
    except: return "?"

def main():
    log("="*60)
    log(f"🚀 V.111b Fast Tools Installer — {len(FAST_TOOLS)} tools")
    log("="*60)
    
    conn = sqlite3.connect(DB_PATH, timeout=60)
    cur = conn.cursor()
    
    # skip already installed
    cur.execute("SELECT name FROM ToolRegistry WHERE isInstalled=1")
    already = {r[0] for r in cur.fetchall()}
    log(f"📊 Already installed: {len(already)} | disk: {disk_usage()}")
    
    installed = 0
    failed = 0
    skipped = 0
    
    for i, name in enumerate(FAST_TOOLS, 1):
        base = name.replace("-", "_").replace("[pil]","").replace("[all]","").split("=")[0]
        
        if base in already:
            skipped += 1
            continue
        
        # check disk space
        try:
            df_out = subprocess.check_output(["df", "/", "--output=pcent"], text=True).strip().split("\n")[1].strip().replace("%","")
            if int(df_out) > 88:
                log(f"⚠️ Disk {df_out}% full — stopping")
                break
        except: pass
        
        log(f"  [{i}/{len(FAST_TOOLS)}] {name}...")
        start = time.time()
        success, output = install_one(name, timeout=90)
        elapsed = time.time() - start
        
        if success:
            verified, real_name = verify(name)
            if verified:
                log(f"     ✅ {name} ({elapsed:.1f}s) disk:{disk_usage()}")
                cur.execute("UPDATE ToolRegistry SET isInstalled=1, isVerified=1, installPath='verified', updatedAt=datetime('now') WHERE name=? AND source='pypi'", (real_name,))
                conn.commit()
                installed += 1
                already.add(real_name)
            else:
                log(f"     ⚠️ {name} import failed")
                failed += 1
        else:
            err = output[-80:] if output else "unknown"
            log(f"     ❌ {name}: {err[:60]}")
            failed += 1
    
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    total = cur.fetchone()[0]
    log("="*60)
    log(f"📊 RESULTS: +{installed} installed | {skipped} skipped | {failed} failed | total: {total}")
    log(f"💾 Disk: {disk_usage()}")
    log("="*60)
    conn.close()

if __name__ == "__main__":
    main()
