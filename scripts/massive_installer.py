#!/usr/bin/env python3
"""
V.111: Massive Tools Installer — بيثبت أكبر عدد ممكن من الأدوات الفعلية.
الهدف: تثبيت 500+ أداة فعلية (pip install + verify) لحد ما نملي الـ disk.

كل أداة:
  1. pip install --break-system-packages
  2. verify بـ import
  3. mark في DB كـ isInstalled=1, installPath='verified'
"""
import subprocess, sys, sqlite3, time, os
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/massive_install.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

# قائمة ضخمة من الأدوات المهمة مقسمة per category
# كل أداة هنا هتثبت فعلياً وتكون callable
TOOLS_BY_CATEGORY = {
    "ai": [
        "openai", "anthropic", "tiktoken", "transformers", "tokenizers",
        # "sentence-transformers",  # skip — too large, causes OOM
        # "diffusers", "accelerate",  # skip — too large, causes OOM
        "peft", "trl",
        "datasets", "evaluate", "optimum", "safetensors",
        "langchain", "langchain-core", "langchain-community", "langchain-openai",
        "langchain-anthropic", "langchain-google-genai", "langchain-experimental",
        "langgraph", "langserve", "langsmith",
        # "llama-index", "llama-index-core", "llama-index-llms-openai",  # skip — large
        "chromadb", "faiss-cpu", "annoy", "hnswlib",
        "huggingface-hub", "inference", "aiml",
        "spacy", "nltk", "gensim", "textblob", "vaderSentiment",
        "textstat", "wordcloud", "language-tool-python",
        "scikit-learn", "xgboost", "lightgbm", "statsmodels",
        # "google-generativeai", "google-cloud-aiplatform",  # skip — large deps
        # "replicate", "cohere", "mistralai", "together",  # skip — large
        # "autogen", "crewai", "semantic-kernel",  # skip — large
        # "llama-cpp-python", "ctransformers",  # skip — needs compilation
        # "whisper", "faster-whisper", "whisperx",  # skip — large
        # "speechbrain", "espnet",  # skip — large
        # "torch", "torchvision", "torchaudio",  # skip — 2GB+, causes OOM
        # "pytorch-lightning", "deepspeed",  # skip — large
        # "tensorflow", "keras",  # skip — 500MB+
        # "jax", "flax", "optax",  # skip — large
        "onnxruntime", "onnx",
        "mlflow", "wandb", "tensorboard",
        # "aim", "clearml", "neptune",  # skip — large
        "dvc", "dagshub",
        # "label-studio", "labelImg", "pylabel",  # skip — GUI deps
        "albumentations", "imgaug", "kornia",
        # "timm", "efficientnet-pytorch",  # skip — large
        # "segmentation-models-pytorch", "pytorchcv",  # skip — large
        "captum", "shap", "lime", "eli5",
        "interpret", "dalex", "fairlearn",
        "optuna", "ray", "nevergrad",
        "hyperopt", "scikit-optimize",
        "sklearn-pandas", "feature-engine",
        "imbalanced-learn", "imblearn",
        "category-encoders", "featuretools",
        "pycaret", "lazypredict", "tpot",
        # "autogluon", "autosklearn",  # skip — large
        "flaml", "fedml",
        "evidently", "deepchecks",
        "fairlearn", "aif360",
    ],
    "data": [
        "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
        "bokeh", "altair", "holoviews", "datashader",
        "polars", "pyarrow", "dask", "modin", "vaex",
        "pyspark", "findspark",
        "sqlalchemy", "sqlmodel", "tortoise-orm", "beanie",
        "alembic", "yoyo-migrations",
        "pymongo", "mongoengine", "motor",
        "redis", "aioredis",
        "psycopg2-binary", "asyncpg", "aiosqlite",
        "pymysql", "mysqlclient", "aiomysql",
        "cassandra-driver", "scylla-driver",
        "elasticsearch", "opensearch-py",
        "meilisearch", "typesense",
        "great-expectations", "pandera",
        "pandas-profiling", "ydata-profiling",
        "dataprep", "lux-api",
        "dtale", "pandasgui",
        "tableauhyperapi", "tableauserverclient",
        "dbt-core", "dbt-postgres",
        "apache-airflow", "prefect", "dagster",
        "kafka-python", "confluent-kafka",
        "pulsar-client",
        "snowflake-connector-python", "snowflake-sqlalchemy",
        "google-cloud-bigquery", "google-cloud-storage",
        "boto3", "azure-storage-blob", "azure-cosmos",
        "minio", "fsspec", "s3fs", "gcsfs",
        "intake", "dvc",
        "feast", "feature-store",
        "tecton",
    ],
    "media": [
        "pillow", "pillow-simd", "opencv-python-headless", "scikit-image",
        "imageio", "imageio-ffmpeg", "pyav",
        "ffmpeg-python", "moviepy", "vidgear",
        "pydub", "librosa", "soundfile", "audioread",
        "pyaudio", "sounddevice",
        "pedalboard", "pedalboard-io",
        "pytesseract", "easyocr", "paddleocr",
        "doctr", "keras-ocr",
        "qrcode", "python-barcode", "pyzbar",
        "wand", "python-magic", "imutils", "imagehash",
        "pillow-heif", "pillow-avif",
        "cairocffi", "cairosvg", "svglib",
        "pymupdf", "fitz", "pdf2image", "pdf2docx",
        "pdfplumber", "pypdf", "pypdf2", "pdfminer.six",
        "reportlab", "fpdf2", "weasyprint", "xhtml2pdf",
        "pdfkit", "wkhtmltopdf",
        "python-docx", "python-docx2python", "docx2python",
        "python-pptx", "python-pptx-template",
        "openpyxl", "xlsxwriter", "xlrd", "xlwt", "xlwings",
        "odfpy",
        "pandas-openpyxl",
        "markdown", "markdown2", "markdownify",
        "mistune", "markdown-it-py",
        "jinja2", "mako", "chameleon",
        "pylatex", "latexify-py",
        "img2pdf", "ocrmypdf",
        "camelot-py", "tabula-py",
    ],
    "web": [
        "requests", "httpx", "aiohttp", "urllib3",
        "httpcore", "requests-html", "grequests",
        "beautifulsoup4", "lxml", "parsel", "selectolax",
        "selenium", "playwright", "pyppeteer",
        "scrapy", "pyspider",
        "newspaper3k", "trafilatura", "goose3",
        "readability-lxml", "boilerpy3",
        "feedparser", "atoma",
        "yt-dlp", "pytube", "youtube-transcript-api",
        "google-api-python-client", "google-auth",
        "tweepy", "python-telegram-bot", "discord.py",
        "slack-sdk", "pymsteams",
        "instaloader", "facebook-sdk",
        "fastapi", "flask", "django", "starlette",
        "tornado", "sanic", "quart",
        "uvicorn", "gunicorn", "hypercorn", "daphne", "granian",
        "websockets", "websocket-client",
        "pyjwt", "authlib", "python-jose",
        "passlib", "bcrypt", "argon2-cffi",
        "cryptography", "pycryptodome", "pyopenssl",
        "nacl", "paramiko",
        "pyotp", "qrcode",
        "email-validator", "aiosmtplib",
        "aiosmtpd", "smtpd",
        "redis", "aiocache", "diskcache",
        "httpx-cache", "aiocache",
        "pydantic", "pydantic-settings",
        "orjson", "ujson", "msgpack", "cbor2",
        "protobuf", "grpcio", "avro",
        "graphql-core", "ariadne", "strawberry-graphql",
        "graphene",
    ],
    "dev": [
        "pytest", "pytest-asyncio", "pytest-cov", "pytest-mock",
        "pytest-xdist", "pytest-benchmark", "pytest-timeout",
        "coverage", "pytest-html", "allure-pytest",
        "hypothesis", "pytest-randomly",
        "tox", "nox",
        "black", "ruff", "isort", "autopep8",
        "flake8", "pylint", "mypy", "pyright",
        "bandit", "safety", "pip-audit",
        "pre-commit", "commitizen",
        "rich", "textual", "click", "typer",
        "fire", "plac", "defopt",
        "tqdm", "progress", "progressbar2",
        "loguru", "structlog", "python-json-logger",
        "logging-tree", "coloredlogs",
        "psutil", "py-cpuinfo", "gpustat",
        "pynvml", "nvitop",
        "py-spy", "memray", "pyinstrument",
        "line-profiler", "memory-profiler",
        "locust", "locustio",
        "pyperf", "pyperformance",
        "docker", "docker-compose",
        "kubernetes", "openshift",
        "ansible", "ansible-core",
        "terraform-python", "pulumi",
        "boto3", "google-cloud-compute",
        "azure-identity", "azure-mgmt-compute",
        "prometheus-client", "grafana-api",
        "datadog", "sentry-sdk",
        "rollbar", "bugsnag", "honeybadger",
        "cachetools", "frozendict", "multidict",
        "wrapt", "decorator", "functools",
        "more-itertools", "toolz", "cytoolz",
        "attrs", "cattrs", "pandas-stubs",
    ],
    "science": [
        "scipy", "sympy", "mpmath",
        "numpy-financial", "numpy-stl",
        "scikit-learn", "statsmodels", "pingouin",
        "biostat", "biopython",
        "astropy", "astroML",
        "chemlab", "rdkit", "openbabel",
        "networkx", "igraph", "graph-tool",
        "pyvis", "d3graph",
        "shapely", "geojson", "folium",
        "geopandas", "rasterio", "gdal",
        "pyproj", "cartopy", "basemap",
        "osmnx", "momepy",
        "metpy", "xarray",
        "dask", "xarray",
        "netCDF4", "h5py", "h5netcdf",
        "zarr", "dask",
        "pint", "quantities", "mendeleev",
        "periodictable", "chempy",
        "thermo", "chemicals",
        "cantera", "pyromat",
        "scikit-image", "napari",
        "cellpose", "stardist",
        "aicsimageio",
        "nibabel", "nilearn", "dipy",
        "mdtraj", "MDAnalysis",
        "openmm", "parmed",
        "biotite", "biopandas",
        "scvi-tools", "scanpy",
        "anndata", "muon",
    ],
    "utility": [
        "pyyaml", "toml", "tomli", "tomli-w",
        "python-dotenv", "environs", "hydra-core", "omegaconf",
        "configargparse", "confuse", "configobj",
        "schedule", "apscheduler", "python-crontab",
        "croniter",
        "cron-descriptor",
        "celery", "redis", "rq", "arq",
        "dramatiq", "huey", "taskiq",
        "procrastinate", "saq",
        "pydantic", "pydantic-settings",
        "sqlalchemy", "sqlmodel",
        "jinja2", "mako",
        "tabulate", "prettytable", "texttable",
        "rich", "textual",
        "click", "typer", "fire",
        "tqdm", "progress",
        "python-dateutil", "pytz", "arrow",
        "pendulum", "maya", "delorean",
        "chrono", "when-changed",
        "watchdog", "watchfiles",
        "pathlib2", "path", "glob2",
        "shutil", "send2trash",
        "filelock", "portalocker",
        "py-filelock",
        "python-magic", "puremagic", "filetype",
        "mimetypes",
        "chardet", "charset-normalizer",
        "cchardet",
        "unidecode", "ftfy",
        "slugify", "python-slugify",
        "inflection", "pluralize",
        "text-unidecode",
        "python-Levenshtein", "fuzzywuzzy",
        "rapidfuzz", "jellyfish",
        "phonetics", "metaphone",
        "py-stringmatching",
        "regex", "re2",
        "parsimonious", "pyparsing",
        "lark", "textx",
        "pyrsistent", "immutables",
        "frozendict", "tree",
        "jsonpath-ng", "jmespath",
        "python-jsonpath", "jsonpickle",
        "orjson", "ujson", "rapidjson",
        "simplejson", "jsonschema",
        "fastjsonschema", "python-fastjsonschema",
    ],
}

def install_package(name):
    """بيثبت package واحد ويرجع النتيجة."""
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--no-cache-dir",
             "--quiet", "--break-system-packages", name],
            capture_output=True, text=True, timeout=180
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout (180s)"
    except Exception as e:
        return False, str(e)

def verify_package(name):
    """بيـ verify إن package متثبت."""
    try:
        import_name = name.replace("-", "_").replace("[pil]","").replace("[all]","").split("=")[0].split(">")[0].split("<")[0]
        result = subprocess.run(
            [sys.executable, "-c", f"import importlib; importlib.import_module('{import_name}')"],
            capture_output=True, text=True, timeout=15
        )
        return result.returncode == 0
    except:
        return False

def mark_installed(conn, name, success, path_info=""):
    """بيـ update الـ DB."""
    cur = conn.cursor()
    cur.execute("""UPDATE ToolRegistry SET
        isInstalled=?, isVerified=?, installPath=?, updatedAt=datetime('now')
        WHERE name=? AND source='pypi'""",
        (1 if success else 0, 1 if success else 0, path_info, name))
    conn.commit()

def get_disk_usage():
    """بيرجع نسبة استخدام الـ disk."""
    try:
        usage = subprocess.check_output(["df", "-h", "/"], text=True)
        lines = usage.strip().split("\n")
        if len(lines) >= 2:
            parts = lines[1].split()
            return f"{parts[2]} used / {parts[1]} total ({parts[4]})"
    except: pass
    return "unknown"

def main():
    log("="*60)
    log("🚀 V.111 Massive Tools Installer — START")
    log("="*60)

    conn = sqlite3.connect(DB_PATH, timeout=60)
    cur = conn.cursor()

    # شوف اللي متثبت بالفعل
    cur.execute("SELECT name FROM ToolRegistry WHERE isInstalled=1")
    already = {r[0] for r in cur.fetchall()}
    log(f"📊 Already installed: {len(already)}")
    log(f"💾 Disk: {get_disk_usage()}")

    total_installed = 0
    total_failed = 0
    total_skipped = 0

    for category, tools in TOOLS_BY_CATEGORY.items():
        log(f"\n📋 Category: {category} ({len(tools)} tools)")
        for i, name in enumerate(tools, 1):
            base = name.replace("-", "_").replace("[pil]","").replace("[all]","").split("=")[0]
            
            # skip if already installed
            if base in already or name in already:
                total_skipped += 1
                continue

            # check disk space — stop if > 90% full
            try:
                df = subprocess.check_output(["df", "/", "--output=pcent"], text=True).strip().split("\n")[1].strip().replace("%","")
                if int(df) > 90:
                    log(f"⚠️ Disk {df}% full — stopping")
                    break
            except: pass

            log(f"  [{category} {i}/{len(tools)}] Installing {name}...")
            start = time.time()
            success, output = install_package(name)

            if success:
                verified = verify_package(base)
                if verified:
                    elapsed = time.time() - start
                    log(f"     ✅ {name} installed+verified ({elapsed:.1f}s) | disk: {get_disk_usage()}")
                    mark_installed(conn, base, True, f"verified {time.strftime('%H:%M')}")
                    total_installed += 1
                    already.add(base)
                else:
                    log(f"     ⚠️ {name} installed but import failed")
                    total_failed += 1
            else:
                err = output[-100:] if output else "unknown"
                log(f"     ❌ {name} failed: {err[:80]}")
                total_failed += 1

    # Final stats
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    final_installed = cur.fetchone()[0]
    log("\n" + "="*60)
    log(f"📊 FINAL RESULTS:")
    log(f"   ✅ Newly installed: {total_installed}")
    log(f"   ⏭️ Already installed: {total_skipped}")
    log(f"   ❌ Failed: {total_failed}")
    log(f"   📦 Total in DB: {final_installed}")
    log(f"   💾 Disk: {get_disk_usage()}")
    log("="*60)
    conn.close()

if __name__ == "__main__":
    main()
