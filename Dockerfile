# ─── Anzaro AI — HuggingFace Space Dockerfile ───────────────────────────
# Next.js 16 app with Prisma + Supabase PostgreSQL, running on port 3000
# DATABASE_URL and DIRECT_URL must be set as HF Space Secrets (Supabase pooler URLs).
# ─────────────────────────────────────────────────────────────────────────

FROM node:20-slim

# Install system dependencies for sharp, bcrypt, prisma, ffmpeg
# V.38: Added Playwright/Chromium system dependencies for PDF generation.
# Without these, Playwright can't launch Chromium → falls back to HTML
# instead of generating actual PDF files.
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    python3-pip \
    make \
    g++ \
    ffmpeg \
    # Playwright/Chromium system dependencies (for PDF rendering)
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install bun for faster installs (falls back to npm if bun.lock not present)
RUN npm install -g bun 2>/dev/null || true

# Install dependencies
RUN if [ -f bun.lock ]; then \
      bun install --frozen-lockfile 2>/dev/null || npm install; \
    else \
      npm install; \
    fi

# V.38: Install Chromium browser for Playwright (PDF generation).
# This downloads the Chromium binary (~150MB) that Playwright needs to
# render HTML → PDF. Without this, PDF generation falls back to HTML.
# Using --with-deps would re-install system deps we already installed above.
RUN npx playwright install chromium 2>/dev/null || echo "Playwright Chromium install failed — PDF generation will use HTML fallback"

# V.67: Install Python libraries for local file generation (PPTX/XLSX)
# V.68b: Add --break-system-packages for HF's externally-managed Python
# V.68c: Add qrcode and gTTS for QR code + audiobook generation
# V.93: MASTER PROMPT — pre-install ALL data science, document generation,
#        and media processing libraries so runtime auto-install is rarely needed.
#        These persist across container restarts (baked into the image).
# V.132: Install packages in separate layers (avoids timeout + shows errors)
# V.139: Consolidated single-layer install (replaces 48 layers)
RUN pip3 install --no-cache-dir --break-system-packages \
    huggingface_hub \
    pandas numpy scipy matplotlib seaborn scikit-learn sympy statsmodels \
    openai anthropic tiktoken transformers tokenizers safetensors \
    nltk spacy gensim textblob vaderSentiment textstat wordcloud rapidfuzz jellyfish \
    polars pyarrow dask sqlalchemy sqlmodel alembic pymongo redis psycopg2-binary pymysql elasticsearch \
    pillow opencv-python-headless scikit-image imageio imageio-ffmpeg pydub librosa soundfile \
    pytesseract easyocr qrcode python-barcode pyzbar python-magic imutils imagehash \
    pdfplumber pypdf PyMuPDF pdf2image pdf2docx reportlab fpdf2 weasyprint xhtml2pdf img2pdf \
    python-docx python-pptx openpyxl xlsxwriter xlrd markdown markdown2 markdownify mistune jinja2 mako \
    requests httpx aiohttp urllib3 httpcore beautifulsoup4 lxml parsel selectolax \
    selenium playwright scrapy newspaper3k trafilatura goose3 readability-lxml boilerpy3 \
    feedparser atoma yt-dlp pytube youtube-transcript-api \
    google-api-python-client google-auth tweepy discord.py slack-sdk \
    fastapi flask django starlette tornado sanic quart uvicorn gunicorn hypercorn daphne granian \
    websockets websocket-client cryptography pycryptodome pyopenssl pynacl paramiko \
    pyjwt authlib python-jose passlib bcrypt argon2-cffi pyotp email-validator \
    pytest pytest-asyncio pytest-cov pytest-mock pytest-xdist coverage hypothesis \
    black ruff isort autopep8 flake8 pylint mypy bandit safety pip-audit \
    rich textual click typer fire tqdm loguru structlog psutil py-cpuinfo \
    locust docker kubernetes prometheus-client sentry-sdk \
    networkx igraph pyvis shapely geojson folium geopandas rasterio pyproj \
    astropy rdkit biopython \
    pyyaml toml tomli tomli-w python-dotenv environs hydra-core omegaconf \
    schedule apscheduler python-crontab croniter celery rq arq dramatiq huey \
    pydantic pydantic-settings tabulate prettytable \
    python-dateutil pytz arrow pendulum maya delorean watchdog watchfiles filelock \
    chardet charset-normalizer unidecode ftfy python-slugify inflection regex re2 pyparsing lark \
    orjson ujson msgpack cbor2 simplejson jsonschema fastjsonschema \
    aiofiles anyio asyncpg aiomysql aiosqlite fsspec s3fs gcsfs minio boto3 \
    mlflow wandb tensorboard dvc albumentations imgaug kornia \
    shap lime eli5 interpret dalex fairlearn aif360 optuna ray nevergrad hyperopt \
    imbalanced-learn category-encoders featuretools pycaret lazypredict tpot flaml \
    evidently deepchecks onnx tf2onnx grpcio protobuf avro thrift \
    graphql-core ariadne strawberry-graphql graphene \
    argostranslate pyttsx3 replicate cohere mistralai together \
    langchain langchain-core langchain-community langchain-openai langchain-anthropic \
    langchain-google-genai langchain-experimental langgraph langserve langsmith \
    chromadb faiss-cpu annoy hnswlib qdrant-client weaviate-client pinecone-client \
    cowsay pyjokes art faker pyfiglet termcolor colorama wikipedia yfinance ta \
    crewai pubchempy mendeleev pydicom h5py tabula-py xmltodict ijson marshmallow ruamel.yaml \
    sentence-transformers onnxruntime einops xgboost umap-learn tenacity gql pyngrok fabric \
    cachetools graphviz esptool smbus2 pyusb webrtcvad sounddevice mutagen vobject \
    cloudscraper scapy dpkt praw instaloader spotipy googlesearch-python pytrends feedgen \
    py3dmol periodictable coolprop lightgbm timm diffusers peft \
    pynput pyperclip icecream memory_profiler transitions pypika prometheus_client typing_extensions \
    pywhatkit yagmail plyer mouse gspread twilio \
    rembg docx2pdf pikepdf send2trash patool pyzipper pyscreenshot \
    humanize parsedatetime pyspellchecker emoji phonenumbers validators langdetect \
    forex-python pint holidays geopy speedtest-cli pyotp mimesis alive-progress termcolor howdoi pyowm croniter vidgear \
    ppadb wakeonlan chemlib chemspipy \
    pyrogram autoscraper fake-useragent undetected-chromedriver mechanize mechanicalsoup pyquery \
    telethon pywebio duckdb peewee tortoise-orm socketio autobahn ping3 cfscrape \
    ytmusicapi colorthief piexif exifread fiona python-louvain \
    ccxt alpha_vantage finquant backtrader fredapi yahooquery quandl pykrx \
    paho-mqtt pyserial ffmpeg-python moviepy pyautogui \
    2>/dev/null; echo "Consolidated install done (some may have failed)"
# Generate Prisma client (V.27: must succeed — AudioRecord model needed)
RUN npx prisma generate
# Validate the schema parses cleanly against the postgresql provider.
# This does NOT touch the DB — it just confirms schema syntax.
RUN npx prisma validate 2>/dev/null || true

# Copy source code
COPY . .

# Create .env file with non-secret production values.
# V.56: Using SQLite (matches schema.prisma provider = "sqlite")
# The DB file lives at /app/db/custom.db and is created by prisma db push at startup.
RUN echo 'SESSION_SECRET="anzaro-hf-space-secret-2025-stable"' > .env && \
    echo 'NEXTAUTH_URL="https://kopabdo-delta-ai-v2.hf.space"' >> .env && \
    echo 'NEXTAUTH_SECRET="anzaro-nextauth-secret-2025"' >> .env && \
    echo 'NODE_ENV="production"' >> .env && \
    echo 'DATABASE_URL="file:/app/db/custom.db"' >> .env && \
    echo 'ZAI_API_KEY=""' >> .env

# Set non-secret environment variables (also as ENV for CLI tools).
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SESSION_SECRET="anzaro-hf-space-secret-2025-stable"
ENV NEXTAUTH_URL="https://kopabdo-delta-ai-v2.hf.space"
ENV NEXTAUTH_SECRET="anzaro-nextauth-secret-2025"
# V.56: SQLite database (matches schema.prisma provider = "sqlite")
ENV DATABASE_URL="file:/app/db/custom.db"
# ZAI_API_KEY must be set as a HF Space Secret.

# Create the db directory for SQLite
RUN mkdir -p /app/db

# Pre-build the Next.js app so .next/ exists (fixes ENOENT required-server-files.json)
# V.105c: لو next build فشل، الـ CMD هيستخدم next dev
RUN npx next build --webpack 2>&1 || echo "Build failed — will use dev mode in CMD"

# Expose port
EXPOSE 3000

# Start the application.
# V.56: Force DATABASE_URL to SQLite (overrides any HF Space Secret that might
# still point to PostgreSQL). This matches schema.prisma provider=sqlite.
# V.92: Auto-setup admin user on every startup (SQLite DB gets wiped on rebuild)
# Admin credentials: ADMIN_EMAIL / ADMIN_PASSWORD env vars (set as HF Secrets)
# Default fallback: admin@anzaro.local / admin123456
CMD export DATABASE_URL="file:/app/db/custom.db" && \
    echo "[Startup] V.140: Download DB from HF Dataset FIRST (before prisma)..." && \
    pip3 install --break-system-packages --quiet huggingface_hub 2>&1 | tail -1; \
    DB_PATH="/app/db/custom.db" timeout 120 python3 /app/scripts/db_sync_manager.py 2>&1 | tail -5; \
    echo "[Startup] DB downloaded. Running prisma (will add missing tables, not wipe data)..." && \
    npx prisma db push --skip-generate 2>&1 | tail -5 && \
    echo "[Startup] Database schema synced. Setting up admin user..." && \
    node -e " \
      const { PrismaClient } = require('@prisma/client'); \
      const bcrypt = require('bcryptjs'); \
      (async () => { \
        const db = new PrismaClient(); \
        const email = (process.env.ADMIN_EMAIL || 'admin@anzaro.local').toLowerCase().trim(); \
        const password = process.env.ADMIN_PASSWORD || 'admin123456'; \
        const existing = await db.user.findFirst({ where: { role: 'admin' } }); \
        if (existing) { \
          console.log('[Startup] Admin exists:', existing.email); \
        } else { \
          const hash = await bcrypt.hash(password, 12); \
          const u = await db.user.create({ data: { email, password: hash, name: 'Admin', role: 'admin', isVerified: true, isActive: true } }); \
          console.log('[Startup] Admin created:', u.email); \
        } \
        await db.\$disconnect(); \
      })().catch(e => { console.error('[Startup] Admin setup failed:', e.message); process.exit(0); }); \
    " && \
    echo "[Startup] V.112: Creating persistent guest user (no re-login after rebuild)..." && \
    node -e " \
      const { PrismaClient } = require('@prisma/client'); \
      (async () => { \
        const db = new PrismaClient(); \
        const guest = await db.user.findUnique({ where: { email: 'guest@anzaro.ai' } }); \
        if (!guest) { \
          const u = await db.user.create({ data: { email: 'guest@anzaro.ai', name: 'زائر', isVerified: true, role: 'user' } }); \
          console.log('[Startup] Guest user created:', u.id); \
        } else { \
          console.log('[Startup] Guest user exists:', guest.id); \
        } \
        await db.\$disconnect(); \
      })().catch(e => { console.error('[Startup] Guest setup failed:', e.message); process.exit(0); }); \
    " && \
    echo "[Startup] Installing runtime requirements (if any)..." && \
    if [ -f /app/requirements-runtime.txt ]; then \
      pip3 install --break-system-packages -r /app/requirements-runtime.txt 2>&1 | tail -5 || echo "Runtime requirements install partial"; \
    fi && \
    echo "[Startup] V.94: Syncing Global Skill Registry (if manifest exists)..." && \
    if [ -f /app/skills_manifest.json ]; then \
      echo "[Startup] Found skills_manifest.json"; \
    fi && \
    echo "[Startup] V.113: Installing tools from wheels (offline, fast)..." && \
    if [ -f /app/scripts/install_from_wheels.py ]; then \
      (python3 /app/scripts/install_from_wheels.py > /app/wheels_install.log 2>&1 &) || true; \
      echo "[Startup] Wheels installer launched in background"; \
    fi && \
    echo "[Startup] V.96: Starting framework installer in background (if script exists)..." && \
    if [ -f /app/scripts/install_frameworks.py ]; then \
      (nohup python3 /app/scripts/install_frameworks.py > /app/frameworks_install.log 2>&1 &) || true; \
      echo "[Startup] Framework installer launched"; \
    else \
      echo "[Startup] No framework installer script — skipping"; \
    fi && \
    echo "[Startup] Starting Next.js..." && \
    if [ -d /app/.next/standalone ] || [ -f /app/.next/BUILD_ID ]; then \
      echo "[Startup] Production build found — using next start"; \
      DATABASE_URL="file:/app/db/custom.db" npx next start -p 3000 -H 0.0.0.0; \
    else \
      echo "[Startup] No production build — using next dev"; \
      DATABASE_URL="file:/app/db/custom.db" npx next dev --webpack -p 3000 -H 0.0.0.0; \
    fi
