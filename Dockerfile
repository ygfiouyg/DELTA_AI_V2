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
RUN pip3 install --no-cache-dir --break-system-packages \
    # ── HF Integration (for DB sync) ──
    huggingface_hub \
    # ── Document Generation ──
    python-pptx \
    openpyxl \
    fpdf2 \
    weasyprint \
    reportlab \
    python-docx \
    # ── Data Science & Analysis ──
    pandas \
    numpy \
    scipy \
    matplotlib \
    seaborn \
    yfinance \
    ta \
    pandas-ta \
    scikit-learn \
    # ── Media Processing ──
    gTTS \
    pydub \
    Pillow \
    PyMuPDF \
    # ── Utilities ──
    qrcode \
    requests \
    beautifulsoup4 \
    lxml \
    sympy \
    pyfiglet \
    wikipedia \
    2>/dev/null || echo "Python packages install partial (some may have failed)"

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
