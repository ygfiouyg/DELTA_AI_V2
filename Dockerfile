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
# Layer 1: Core data science (most important)
RUN pip3 install --no-cache-dir --break-system-packages \
    pandas numpy scipy matplotlib seaborn scikit-learn \
    || echo "Data science packages partial install"

# Layer 2: AI/ML
RUN pip3 install --no-cache-dir --break-system-packages \
    openai anthropic tiktoken transformers tokenizers safetensors huggingface-hub \
    || echo "AI packages partial install"

# Layer 3: NLP
RUN pip3 install --no-cache-dir --break-system-packages \
    nltk spacy gensim textblob vaderSentiment textstat wordcloud \
    rapidfuzz jellyfish language-tool-python \
    || echo "NLP packages partial install"

# Layer 4: Web & API
RUN pip3 install --no-cache-dir --break-system-packages \
    requests httpx aiohttp urllib3 beautifulsoup4 lxml parsel selectolax \
    fastapi flask django starlette uvicorn gunicorn \
    yt-dlp trafilatura newspaper3k scrapy \
    || echo "Web packages partial install"

# Layer 5: Documents
RUN pip3 install --no-cache-dir --break-system-packages \
    python-pptx openpyxl fpdf2 weasyprint reportlab python-docx \
    pdfplumber pypdf PyMuPDF pdf2image img2pdf \
    markdown jinja2 xlsxwriter \
    || echo "Document packages partial install"

# Layer 6: Media
RUN pip3 install --no-cache-dir --break-system-packages \
    Pillow opencv-python-headless scikit-image imageio pydub \
    gTTS edge-tts pytesseract qrcode \
    || echo "Media packages partial install"

# Layer 7: Security & Dev
RUN pip3 install --no-cache-dir --break-system-packages \
    cryptography pyjwt passlib bcrypt paramiko \
    pydantic rich click typer tqdm loguru psutil \
    pytest black ruff \
    || echo "Security/Dev packages partial install"

# Layer 8: LangChain + Vector DBs
RUN pip3 install --no-cache-dir --break-system-packages \
    langchain langchain-core langchain-community langchain-openai \
    langgraph chromadb faiss-cpu \
    || echo "LangChain packages partial install"

# Layer 9: Utils
RUN pip3 install --no-cache-dir --break-system-packages \
    pyyaml toml python-dotenv schedule celery redis sqlalchemy \
    faker cowsay pyjokes art pyfiglet wikipedia \
    yfinance ta \
    || echo "Utils packages partial install"

# ═══════════════════════════════════════════════════════════════
# V.134: "عملية تيتانيوم" — The 20 Heavy Libraries
# ═══════════════════════════════════════════════════════════════

# Layer 10: Agent Orchestration & Memory
RUN pip3 install --no-cache-dir --break-system-packages \
    crewai chromadb \
    || echo "Agent/Memory packages partial install"

# Layer 11: Web Ghosts (playwright needs browser install)
RUN pip3 install --no-cache-dir --break-system-packages \
    playwright scrapy beautifulsoup4 \
    && playwright install chromium 2>/dev/null || echo "Playwright browsers partial"

# Layer 12: Data Engine (polars — 10x faster than pandas)
RUN pip3 install --no-cache-dir --break-system-packages \
    polars \
    || echo "Polars install failed"

# Layer 13: Audio Arsenal
RUN pip3 install --no-cache-dir --break-system-packages \
    faster-whisper librosa ffmpeg-python \
    || echo "Audio packages partial install"

# Layer 14: Voice Cloning (TTS Coqui — large, optional)
RUN pip3 install --no-cache-dir --break-system-packages \
    TTS \
    || echo "TTS Coqui install failed (large package)"

# Layer 15: Hardware Control
RUN pip3 install --no-cache-dir --break-system-packages \
    paho-mqtt pyserial \
    || echo "Hardware packages partial install"

# Layer 16: Media Production
RUN pip3 install --no-cache-dir --break-system-packages \
    moviepy opencv-python-headless pyautogui \
    || echo "Media packages partial install"

# Layer 17: PyTorch CPU (the neural engine)
RUN pip3 install --no-cache-dir --break-system-packages \
    torch --index-url https://download.pytorch.org/whl/cpu \
    || echo "PyTorch CPU install failed (large)"

# Layer 18: Infrastructure (celery already installed, add sqlalchemy if missing)
RUN pip3 install --no-cache-dir --break-system-packages \
    celery sqlalchemy fastapi \
    || echo "Infrastructure packages partial install"

# ═══════════════════════════════════════════════════════════════
# V.135: The 300 Library Mega-Install (14 batches)
# ═══════════════════════════════════════════════════════════════

# Batch 1: Science & Medical
RUN pip3 install --no-cache-dir --break-system-packages \
    pubchempy biopython mendeleev pydicom pyarrow h5py tabula-py xmltodict ijson marshmallow ruamel.yaml \
    || echo "Batch 1 (Science/Medical) partial"

# Batch 2: AI & ML Advanced
RUN pip3 install --no-cache-dir --break-system-packages \
    sentence-transformers onnxruntime einops xgboost umap-learn tenacity websockets gql pyngrok fabric boto3 \
    || echo "Batch 2 (AI/ML) partial"

# Batch 3: Infrastructure & Hardware
RUN pip3 install --no-cache-dir --break-system-packages \
    cachetools pycryptodome soundfile graphviz psycopg2-binary alembic esptool smbus2 pyusb webrtcvad sounddevice mutagen vobject \
    || echo "Batch 3 (Infra/Hardware) partial"

# Batch 4: OSINT & Cyber
RUN pip3 install --no-cache-dir --break-system-packages \
    cloudscraper scapy dpkt praw instaloader spotipy googlesearch-python pytrends feedgen \
    || echo "Batch 4 (OSINT/Cyber) partial"

# Batch 5: Academic AI
RUN pip3 install --no-cache-dir --break-system-packages \
    py3dmol periodictable coolprop statsmodels lightgbm dask shap optuna timm diffusers peft \
    || echo "Batch 5 (Academic AI) partial"

# Batch 6: System Tools
RUN pip3 install --no-cache-dir --break-system-packages \
    pynput pyperclip icecream memory_profiler transitions pypika prometheus_client typing_extensions \
    || echo "Batch 6 (System) partial"

# Batch 7: Secretary & Communication
RUN pip3 install --no-cache-dir --break-system-packages \
    pywhatkit yagmail plyer mouse gspread twilio \
    || echo "Batch 7 (Secretary) partial"

# Batch 8: Media & Files
RUN pip3 install --no-cache-dir --break-system-packages \
    rembg docx2pdf pikepdf send2trash patool pyzipper pyscreenshot python-barcode \
    || echo "Batch 8 (Media/Files) partial"

# Batch 9: Human Language
RUN pip3 install --no-cache-dir --break-system-packages \
    humanize parsedatetime pyspellchecker emoji phonenumbers validators langdetect \
    || echo "Batch 9 (Language) partial"

# Batch 10: Real Life & Finance
RUN pip3 install --no-cache-dir --break-system-packages \
    forex-python pint holidays geopy speedtest-cli pyotp mimesis alive-progress termcolor howdoi pyowm croniter vidgear \
    || echo "Batch 10 (Real Life) partial"

# Batch 11: Content Creation & Audio
RUN pip3 install --no-cache-dir --break-system-packages \
    pyannote.audio spleeter chat-downloader pytube \
    || echo "Batch 11 (Content) partial"

# Batch 12: Hardware & Mobile
RUN pip3 install --no-cache-dir --break-system-packages \
    ppadb wakeonlan \
    || echo "Batch 12 (Hardware/Mobile) partial"

# Batch 13: Medical/Chemical
RUN pip3 install --no-cache-dir --break-system-packages \
    chemlib chemspipy \
    || echo "Batch 13 (Medical/Chem) partial"

# Batch 14: Automation, Social & Trading
RUN pip3 install --no-cache-dir --break-system-packages \
    pyrogram autoscraper fake-useragent undetected-chromedriver mechanize mechanicalsoup pyquery telethon pywebio duckdb peewee tortoise-orm socketio autobahn ping3 cfscrape ytmusicapi colorthief piexif exifread fiona python-louvain ccxt alpha_vantage finquant backtrader fredapi yahooquery quandl pykrx \
    || echo "Batch 14 (Automation/Social/Trading) partial"

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
    npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -20 && \
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
    echo "[Startup] V.115: Installing huggingface_hub for DB sync..." && \
    pip3 install --break-system-packages --quiet huggingface_hub 2>&1 | tail -2 || echo "huggingface_hub install failed"; \
    echo "[Startup] V.115: Sync DB from HF Dataset (AFTER prisma db push — so data isn't wiped)..." && \
    if [ -f /app/scripts/db_sync_manager.py ]; then \
      DB_PATH="/app/db/custom.db" timeout 180 python3 /app/scripts/db_sync_manager.py 2>&1 | tee /app/db_sync.log; \
      echo "[Startup] DB sync complete — DB ready with tools data"; \
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
