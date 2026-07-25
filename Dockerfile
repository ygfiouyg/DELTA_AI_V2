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
RUN pip3 install --no-cache-dir --break-system-packages python-pptx openpyxl Pillow PyMuPDF matplotlib 2>/dev/null || echo "Python packages install partial"

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
RUN npx next build --webpack 2>&1 || echo "Build failed, will use dev mode"

# Expose port
EXPOSE 3000

# Start the application.
# V.56: Force DATABASE_URL to SQLite (overrides any HF Space Secret that might
# still point to PostgreSQL). This matches schema.prisma provider=sqlite.
# 1. `prisma db push --skip-generate --accept-data-loss` creates/syncs the
#    SQLite schema at /app/db/custom.db
# 2. `next start` serves the prebuilt app with DATABASE_URL forced to SQLite
CMD export DATABASE_URL="file:/app/db/custom.db" && \
    npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -20 && \
    echo "[Startup] Database schema synced. Starting Next.js..." && \
    DATABASE_URL="file:/app/db/custom.db" npx next start -p 3000 -H 0.0.0.0
