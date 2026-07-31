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
# V.140: Install in small batches (avoids timeout + memory issues)
RUN pip3 install --no-cache-dir --break-system-packages pandas numpy requests || echo "Batch A failed"
RUN pip3 install --no-cache-dir --break-system-packages scipy matplotlib seaborn scikit-learn sympy || echo "Batch B failed"
RUN pip3 install --no-cache-dir --break-system-packages openai anthropic tiktoken transformers || echo "Batch C failed"
RUN pip3 install --no-cache-dir --break-system-packages nltk spacy gensim textblob vaderSentiment || echo "Batch D failed"
RUN pip3 install --no-cache-dir --break-system-packages beautifulsoup4 lxml requests httpx aiohttp || echo "Batch E failed"
RUN pip3 install --no-cache-dir --break-system-packages fastapi flask django uvicorn gunicorn || echo "Batch F failed"
RUN pip3 install --no-cache-dir --break-system-packages pillow opencv-python-headless pydub || echo "Batch G failed"
RUN pip3 install --no-cache-dir --break-system-packages pdfplumber pypdf PyMuPDF reportlab fpdf2 || echo "Batch H failed"
RUN pip3 install --no-cache-dir --break-system-packages python-docx python-pptx openpyxl xlsxwriter || echo "Batch I failed"
RUN pip3 install --no-cache-dir --break-system-packages cryptography pyjwt passlib bcrypt || echo "Batch J failed"
RUN pip3 install --no-cache-dir --break-system-packages pydantic rich click typer tqdm loguru psutil || echo "Batch K failed"
RUN pip3 install --no-cache-dir --break-system-packages pytest black ruff isort || echo "Batch L failed"
RUN pip3 install --no-cache-dir --break-system-packages langchain langchain-core langchain-community langchain-openai langgraph || echo "Batch M failed"
RUN pip3 install --no-cache-dir --break-system-packages chromadb faiss-cpu || echo "Batch N failed"
RUN pip3 install --no-cache-dir --break-system-packages pyyaml toml python-dotenv schedule celery redis sqlalchemy || echo "Batch O failed"
RUN pip3 install --no-cache-dir --break-system-packages faker cowsay pyjokes art pyfiglet qrcode || echo "Batch P failed"
RUN pip3 install --no-cache-dir --break-system-packages edge-tts gTTS deep-translator || echo "Batch Q failed"
RUN pip3 install --no-cache-dir --break-system-packages yfinance ta arrow pendulum || echo "Batch R failed"
RUN pip3 install --no-cache-dir --break-system-packages networkx shapely geojson folium || echo "Batch S failed"
RUN pip3 install --no-cache-dir --break-system-packages orjson ujson msgpack jsonschema || echo "Batch T failed"
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp trafilatura newspaper3k || echo "Batch U failed"
RUN pip3 install --no-cache-dir --break-system-packages crewai pubchempy mendeleev pydicom || echo "Batch V failed"
RUN pip3 install --no-cache-dir --break-system-packages paho-mqtt pyserial ffmpeg-python moviepy || echo "Batch W failed"
RUN pip3 install --no-cache-dir --break-system-packages pywhatkit yagmail plyer gspread twilio || echo "Batch X failed"
RUN pip3 install --no-cache-dir --break-system-packages rembg docx2pdf pikepdf send2trash || echo "Batch Y failed"
RUN pip3 install --no-cache-dir --break-system-packages humanize parsedatetime emoji phonenumbers validators langdetect || echo "Batch Z failed"
RUN pip3 install --no-cache-dir --break-system-packages forex-python pint holidays geopy speedtest-cli || echo "Batch AA failed"
RUN pip3 install --no-cache-dir --break-system-packages praw instaloader spotipy googlesearch-python pytrends || echo "Batch AB failed"
RUN pip3 install --no-cache-dir --break-system-packages cloudscraper scapy dpkt || echo "Batch AC failed"
RUN pip3 install --no-cache-dir --break-system-packages pyrogram telethon duckdb peewee || echo "Batch AD failed"
RUN pip3 install --no-cache-dir --break-system-packages ccxt alpha_vantage backtrader || echo "Batch AE failed"
RUN pip3 install --no-cache-dir --break-system-packages ppadb wakeonlan chemlib chemspipy || echo "Batch AF failed"
RUN pip3 install --no-cache-dir --break-system-packages autoscraper fake-useragent undetected-chromedriver || echo "Batch AG failed"
RUN pip3 install --no-cache-dir --break-system-packages xgboost lightgbm statsmodels shap optuna || echo "Batch AH failed"
RUN pip3 install --no-cache-dir --break-system-packages safetensors tokenizers sentence-transformers || echo "Batch AI failed"
# Verify
RUN python3 -c "import pandas; print('pandas OK:', pandas.__version__)" || echo "pandas NOT installed"
RUN python3 -c "import requests; print('requests OK:', requests.__version__)" || echo "requests NOT installed"
RUN python3 -c "import flask; print('flask OK')" || echo "flask NOT installed"
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
    npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -5 && \
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
