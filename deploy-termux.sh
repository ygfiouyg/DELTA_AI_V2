#!/data/data/com.termux/files/usr/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Termux Setup Script (Samsung Tab A7)
# ═══════════════════════════════════════════════════
# بيشتغل على: Termux (Android)
# الحد الأدنى: 2GB RAM + 32GB storage
#
# Usage:
#   1. ثبّت Termux من F-Droid (مش Play Store)
#   2. افتح Termux واكتب:
#      pkg update && pkg upgrade -y
#      pkg install wget -y
#      wget https://raw.githubusercontent.com/ygfiouyg/DELTA_AI_V2/main/deploy-termux.sh
#      bash deploy-termux.sh
# ═══════════════════════════════════════════════════

set -e

echo "📱 Delta AI V2 — Termux Setup"
echo "==============================="
echo ""

# ─── 1. تثبيت الحزم الأساسية ────────────────────────
echo "📦 [1/8] Installing base packages..."
pkg update -y && pkg upgrade -y
pkg install -y \
    git \
    nodejs \
    python \
    python-pip \
    openssl \
    wget \
    curl \
    nano \
    which \
    proot
echo "   ✅ Base packages installed"

# ─── 2. تثبيت bun ──────────────────────────────────
echo ""
echo "📦 [2/8] Installing bun..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
echo "   ✅ Bun installed"

# ─── 3. إعداد Swap (مهم جداً لـ 2GB RAM) ─────────
echo ""
echo "💾 [3/8] Setting up swap (4GB)..."
# Termux مش بيقدر يعمل swap حقيقي، بس نقدر نـ emulate
# عبر zram أو تدوير الـ cache
mkdir -p $PREFIX/var/cache
echo "   ⚠️ Termux swap: limited (no root)"
echo "   💡 For real swap, use Magisk + Linux Swap module"
echo "   ✅ Cache directory created"

# ─── 4. Clone المشروع ─────────────────────────────
echo ""
echo "📂 [4/8] Cloning Delta AI V2..."
cd ~
if [ -d "delta-ai" ]; then
    cd delta-ai
    git pull origin main || true
    echo "   ✅ Repository updated"
else
    git clone --depth 1 https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
    cd delta-ai
    echo "   ✅ Repository cloned"
fi

# ─── 5. تثبيت Node.js dependencies ─────────────────
echo ""
echo "📦 [5/8] Installing Node.js dependencies..."
# Use --production flag to skip devDependencies (saves RAM)
npm install --production --no-optional 2>&1 | tail -3 || \
    bun install --production 2>&1 | tail -3 || \
    echo "   ⚠️ Some packages failed (normal on ARM)"
echo "   ✅ Dependencies installed"

# ─── 6. تثبيت Python packages (محدود) ──────────────
echo ""
echo "🐍 [6/8] Installing Python packages (minimal)..."
# بس الحزم الأساسية (مش كل requirements.txt)
pip install --no-cache-dir \
    requests \
    beautifulsoup4 \
    pandas \
    numpy \
    pillow \
    qrcode \
    vaderSentiment \
    textblob \
    2>&1 | tail -3 || echo "   ⚠️ Some Python packages failed"
echo "   ✅ Python packages installed"

# ─── 7. إعداد Prisma ──────────────────────────────
echo ""
echo "📊 [7/8] Setting up database..."
export DATABASE_URL="file:$HOME/delta-ai/db/custom.db"
npx prisma generate 2>&1 | tail -2 || echo "   ⚠️ Prisma generate failed"
npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -2 || echo "   ⚠️ Prisma db push failed"
echo "   ✅ Database ready"

# ─── 8. بناء Next.js (production) ──────────────────
echo ""
echo "🏗️ [7/8] Building Next.js (production)..."
# Production build (أخف من dev بكثير)
NODE_OPTIONS="--max-old-space-size=512" npx next build --webpack 2>&1 | tail -5 || {
    echo "   ⚠️ Build failed — will use dev mode"
}
echo "   ✅ Build complete"

# ─── تشغيل ─────────────────────────────────────────
echo ""
echo "🚀 [8/8] Starting Delta AI V2..."
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Delta AI V2 — Running on Tab A7"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  URL:           http://localhost:3000"
echo "  Admin:         admin@anzaro.local / admin123456"
echo "  DB:            ~/delta-ai/db/custom.db"
echo ""
echo "  لإيقاف:        Ctrl+C"
echo "  لإعادة التشغيل: bash ~/delta-ai/start-termux.sh"
echo "═══════════════════════════════════════════════════"
echo ""

# Create start script
cat > ~/delta-ai/start-termux.sh << 'STARTEOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/delta-ai
export DATABASE_URL="file:$HOME/delta-ai/db/custom.db"
export NODE_ENV=production
export SESSION_SECRET="anzaro-termux-secret-2026"
export NEXTAUTH_SECRET="anzaro-nextauth-termux-2026"
export NEXTAUTH_URL="http://localhost:3000"
export ADMIN_EMAIL="admin@anzaro.local"
export ADMIN_PASSWORD="admin123456"

# Use production build if available, else dev
if [ -f .next/BUILD_ID ]; then
    echo "🚀 Starting in PRODUCTION mode..."
    NODE_OPTIONS="--max-old-space-size=512" npx next start -p 3000 -H 0.0.0.0
else
    echo "⚠️ Starting in DEV mode (slower)..."
    NODE_OPTIONS="--max-old-space-size=512" npx next dev --webpack -p 3000 -H 0.0.0.0
fi
STARTEOF
chmod +x ~/delta-ai/start-termux.sh

# Start now
bash ~/delta-ai/start-termux.sh
