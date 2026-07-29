#!/usr/bin/env python3
"""
V.119: تثبيت كل الأدوات الفعلية لحد ما الـ disk يمتلئ.
"""
import subprocess, sys, sqlite3, time, os
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/fill_disk.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

def disk_full():
    try:
        df = subprocess.check_output(["df", "/", "--output=pcent"], text=True).strip().split("\n")[1].strip().replace("%","")
        return int(df) > 88
    except: return False

def disk_usage():
    try:
        return subprocess.check_output(["df", "-h", "/"], text=True).strip().split("\n")[1].split()[2]
    except: return "?"

# كل الأدوات اللي ممكن نثبتها (مرتبة بالأهمية)
ALL_TOOLS = [
    # AI/ML
    "openai","anthropic","tiktoken","transformers","tokenizers","safetensors",
    "huggingface-hub",
    # "datasets","evaluate","accelerate","peft",  # too large, cause OOM
    "scikit-learn","xgboost","lightgbm","statsmodels",
    # NLP
    "spacy","nltk","gensim","textblob","vaderSentiment","textstat","wordcloud",
    "language-tool-python","rapidfuzz","jellyfish","fuzzywuzzy",
    # Data
    "pandas","numpy","scipy","matplotlib","seaborn","plotly","bokeh","altair",
    "polars","pyarrow","dask","modin","vaex",
    "sqlalchemy","sqlmodel","alembic","pymongo","redis","psycopg2-binary",
    "pymysql","elasticsearch","great-expectations","pandera","pandas-profiling",
    # Media
    "pillow","opencv-python-headless","scikit-image","imageio","imageio-ffmpeg",
    "pydub","librosa","soundfile","audioread","pyaudio","sounddevice",
    "pytesseract","easyocr","qrcode","python-barcode","pyzbar",
    "wand","python-magic","imutils","imagehash","pillow-heif",
    "cairocffi","cairosvg","svglib",
    # PDF/Docs
    "pdfplumber","pypdf","pymupdf","fitz","pdf2image","pdf2docx",
    "reportlab","fpdf2","weasyprint","xhtml2pdf","pdfkit","img2pdf","ocrmypdf",
    "python-docx","python-pptx","openpyxl","xlsxwriter","xlrd","xlwt",
    "markdown","markdown2","markdownify","mistune","jinja2","mako",
    # Web
    "requests","httpx","aiohttp","urllib3","httpcore",
    "beautifulsoup4","lxml","parsel","selectolax",
    "selenium","playwright","pyppeteer","scrapy",
    "newspaper3k","trafilatura","goose3","readability-lxml","boilerpy3",
    "feedparser","atoma","yt-dlp","pytube","youtube-transcript-api",
    "google-api-python-client","google-auth","tweepy","discord.py","slack-sdk",
    "fastapi","flask","django","starlette","tornado","sanic","quart",
    "uvicorn","gunicorn","hypercorn","daphne","granian",
    "websockets","websocket-client",
    # Security
    "cryptography","pycryptodome","pyopenssl","nacl","paramiko",
    "pyjwt","authlib","python-jose","passlib","bcrypt","argon2-cffi",
    "pyotp","email-validator","aiosmtplib","aiosmtpd",
    # Dev
    "pytest","pytest-asyncio","pytest-cov","pytest-mock","pytest-xdist",
    "coverage","hypothesis","tox","nox",
    "black","ruff","isort","autopep8","flake8","pylint","mypy",
    "bandit","safety","pip-audit","pre-commit","commitizen",
    "rich","textual","click","typer","fire","plac","defopt",
    "tqdm","progress","progressbar2","loguru","structlog",
    "psutil","py-cpuinfo","gpustat","pynvml","nvitop",
    "py-spy","memray","pyinstrument","line-profiler","memory-profiler",
    "locust","locustio","docker","kubernetes",
    "prometheus-client","grafana-api","datadog","sentry-sdk",
    "loguru","structlog","python-json-logger","coloredlogs",
    # Science
    "sympy","mpmath","numpy-financial","networkx","igraph","pyvis",
    "shapely","geojson","folium","geopandas","rasterio","pyproj","cartopy",
    "astropy","chemlab","rdkit","biopython",
    # Utility
    "pyyaml","toml","tomli","tomli-w","python-dotenv","environs",
    "hydra-core","omegaconf","configargparse","confuse","configobj",
    "schedule","apscheduler","python-crontab","croniter",
    "celery","rq","arq","dramatiq","huey","taskiq",
    "pydantic","pydantic-settings","tabulate","prettytable","texttable",
    "python-dateutil","pytz","arrow","pendulum","maya","delorean",
    "watchdog","watchfiles","filelock","portalocker","send2trash",
    "chardet","charset-normalizer","unidecode","ftfy","python-slugify",
    "inflection","regex","re2","pyparsing","lark","textx",
    "pyrsistent","immutables","jsonpath-ng","jmespath",
    "orjson","ujson","msgpack","cbor2","simplejson","jsonschema","fastjsonschema",
    # Extra
    "faker","art","cowsay","pyjokes","pyfiglet","termcolor","colorama",
    "aiofiles","anyio","async-timeout","asyncpg","aiomysql","aiosqlite",
    "fsspec","s3fs","gcsfs","minio","boto3","google-cloud-storage","azure-storage-blob",
    "snowflake-connector-python","google-cloud-bigquery",
    "mlflow","wandb","tensorboard","dvc","dagshub",
    "albumentations","imgaug","kornia","scikit-image",
    "shap","lime","eli5","interpret","dalex","fairlearn","aif360",
    "optuna","ray","nevergrad","hyperopt","scikit-optimize",
    "imbalanced-learn","category-encoders","featuretools",
    "pycaret","lazypredict","tpot","flaml",
    "evidently","deepchecks",
    "onnxruntime","onnx","onnx-tf","tf2onnx",
    "aiohttp-retry","httpx-cache","aiocache","diskcache",
    "grpcio","protobuf","avro","thrift",
    "graphql-core","ariadne","strawberry-graphql","graphene",
    "deep-translator","googletrans","argostranslate",
    "edge-tts","gTTS","pyttsx3","SpeechRecognition","whisper","faster-whisper",
    "replicate","cohere","mistralai","together","modal",
    "llama-cpp-python","ctransformers","ollama","gpt4all",
    "langchain","langchain-core","langchain-community","langchain-openai",
    "langchain-anthropic","langchain-google-genai","langchain-experimental",
    "langgraph","langserve","langsmith",
    "chromadb","faiss-cpu","annoy","hnswlib","qdrant-client","weaviate-client",
    "pinecone-client","llama-index","haystack-ai","autogen","crewai",
]

def install_one(name, timeout=120):
    try:
        r = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--no-cache-dir",
             "--break-system-packages", "--quiet",
             "--target", "/home/z/.venv/lib/python3.12/site-packages",
             name],
            capture_output=True, text=True, timeout=timeout
        )
        return r.returncode == 0
    except: return False

def verify(name):
    base = name.replace("-","_").replace("[pil]","").replace("[all]","").split("=")[0]
    mappings = {
        "opencv-python-headless":"cv2","python-docx":"docx","python-pptx":"pptx",
        "beautifulsoup4":"bs4","fpdf2":"fpdf","gTTS":"gtts","edge-tts":"edge_tts",
        "deep-translator":"deep_translator","scikit-learn":"sklearn",
        "scikit-image":"skimage","python-dateutil":"dateutil","python-dotenv":"dotenv",
        "python-magic":"magic","python-slugify":"slugify","python-barcode":"barcode",
        "argon2-cffi":"argon2","async-timeout":"async_timeout","pillow":"PIL",
        "pymupdf":"fitz","faiss-cpu":"faiss","pycryptodome":"Crypto",
        "pyopenssl":"OpenSSL","google-cloud-storage":"google.cloud.storage",
        "google-cloud-bigquery":"google.cloud.bigquery",
    }
    import_name = mappings.get(name, base)
    try:
        r = subprocess.run([sys.executable, "-c", f"import {import_name}"], capture_output=True, timeout=15)
        return r.returncode == 0, import_name
    except: return False, import_name

def main():
    log("="*60)
    log(f"🚀 V.119 Fill Disk — {len(ALL_TOOLS)} tools to install")
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
    
    for i, name in enumerate(ALL_TOOLS, 1):
        if disk_full():
            log(f"⚠️ Disk {disk_usage()} full — stopping")
            break
        
        base = name.replace("-","_").split("=")[0]
        if base in already or name in already:
            skipped += 1
            continue
        
        log(f"  [{i}/{len(ALL_TOOLS)}] {name}...")
        start = time.time()
        success = install_one(name)
        elapsed = time.time() - start
        
        if success:
            verified, real_name = verify(name)
            if verified:
                log(f"     ✅ ({elapsed:.1f}s) disk:{disk_usage()}")
                cur.execute("UPDATE ToolRegistry SET isInstalled=1, isVerified=1, installPath='wheel', updatedAt=datetime('now') WHERE name=? AND source='pypi'", (name,))
                conn.commit()
                installed += 1
                already.add(name)
            else:
                log(f"     ⚠️ import failed")
                failed += 1
        else:
            log(f"     ❌ failed")
            failed += 1
    
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    total = cur.fetchone()[0]
    log("="*60)
    log(f"📊 +{installed} new | {skipped} skipped | {failed} failed | total: {total}")
    log(f"💾 Disk: {disk_usage()}")
    log("="*60)
    conn.close()

if __name__ == "__main__":
    main()
