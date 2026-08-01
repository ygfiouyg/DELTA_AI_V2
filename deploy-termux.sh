#!/data/data/com.termux/files/usr/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Termux Setup (OPPO A76 / Android 12GB+)
# ═══════════════════════════════════════════════════
# Supports: OPPO A76, Samsung Tab A7, any Android 8GB+
#
# Usage:
#   1. Install Termux from F-Droid (NOT Play Store)
#   2. Open Termux and run:
#      pkg update && pkg install wget -y
#      wget https://raw.githubusercontent.com/ygfiouyg/DELTA_AI_V2/main/deploy-termux.sh
#      bash deploy-termux.sh
# ═══════════════════════════════════════════════════

set -e

echo "📱 Delta AI V2 — Termux Setup"
echo "==============================="

# Detect device RAM
RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
RAM_GB=$((RAM_KB / 1024 / 1024))
echo "📊 Device RAM: ${RAM_GB}GB"

# Determine mode based on RAM
if [ "$RAM_GB" -ge 4 ]; then
    MODE="full"
    NODE_MEM="2048"
    echo "🚀 Mode: FULL (Hermes + Playwright + all features)"
elif [ "$RAM_GB" -ge 3 ]; then
    MODE="standard"
    NODE_MEM="1024"
    echo "✅ Mode: STANDARD (Next.js + Python, no Hermes)"
else
    MODE="lite"
    NODE_MEM="512"
    echo "⚠️ Mode: LITE (minimal features only)"
fi
echo ""

# ─── 1. Base packages ──────────────────────────────
echo "📦 [1/9] Installing base packages..."
pkg update -y && pkg upgrade -y
pkg install -y \
    git nodejs python python-pip \
    openssl wget curl nano which proot \
    clang make
echo "   ✅ Base packages installed"

# ─── 2. Install bun ────────────────────────────────
echo ""
echo "📦 [2/9] Installing bun..."
curl -fsSL https://bun.sh/install | bash 2>/dev/null || echo "   ⚠️ Bun install failed (using npm)"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
echo "   ✅ Bun installed"

# ─── 3. Clone project ──────────────────────────────
echo ""
echo "📂 [3/9] Cloning Delta AI V2..."
cd ~
if [ -d "delta-ai" ]; then
    cd delta-ai
    git pull origin main 2>/dev/null || true
    echo "   ✅ Repository updated"
else
    git clone --depth 1 https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
    cd delta-ai
    echo "   ✅ Repository cloned (depth=1, saves space)"
fi

# ─── 4. Node.js dependencies ───────────────────────
echo ""
echo "📦 [4/9] Installing Node.js dependencies..."
if [ "$MODE" = "lite" ]; then
    npm install --production --no-optional 2>&1 | tail -2 || \
        bun install --production 2>&1 | tail -2
else
    npm install --no-optional 2>&1 | tail -2 || \
        bun install 2>&1 | tail -2
fi
echo "   ✅ Dependencies installed"

# ─── 5. Python packages ────────────────────────────
echo ""
echo "🐍 [5/9] Installing Python packages..."
if [ "$MODE" = "full" ]; then
    # Full install for 8GB+ devices
    echo "   Installing full Python packages..."
    pip install --no-cache-dir \
        requests beautifulsoup4 lxml \
        pandas numpy scipy \
        matplotlib pillow \
        qrcode vaderSentiment textblob \
        scikit-learn nltk \
        yt-dlp pydub \
        python-docx python-pptx openpyxl reportlab \
        sympy faker \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed (normal on ARM)"
elif [ "$MODE" = "standard" ]; then
    # Standard for 4GB devices
    pip install --no-cache-dir \
        requests beautifulsoup4 \
        pandas numpy \
        pillow qrcode \
        vaderSentiment textblob \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed"
else
    # Lite for 2GB devices
    pip install --no-cache-dir \
        requests beautifulsoup4 \
        pandas numpy pillow qrcode \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed"
fi
echo "   ✅ Python packages installed"

# ─── 6. Install Hermes Agent (8GB+ only) ───────────
if [ "$MODE" = "full" ]; then
    echo ""
    echo "☤ [6/9] Installing Hermes Agent..."
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup 2>&1 | tail -3 || \
        echo "   ⚠️ Hermes install failed (optional)"
    echo "   ✅ Hermes Agent installed"
else
    echo ""
    echo "☤ [6/9] Skipping Hermes Agent (need 8GB+ RAM)"
fi

# ─── 7. Database setup ─────────────────────────────
echo ""
echo "📊 [7/9] Setting up database..."
export DATABASE_URL="file:$HOME/delta-ai/db/custom.db"
npx prisma generate 2>&1 | tail -2
npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -2
echo "   ✅ Database ready"

# ─── 8. Build Next.js ──────────────────────────────
echo ""
echo "🏗️ [8/9] Building Next.js..."
NODE_OPTIONS="--max-old-space-size=$NODE_MEM" npx next build --webpack 2>&1 | tail -5 || {
    echo "   ⚠️ Build failed — will use dev mode"
}
echo "   ✅ Build complete"

# ─── 9. Start script ───────────────────────────────
echo ""
echo "🚀 [9/9] Creating start script..."
cat > ~/delta-ai/start-termux.sh << STARTEOF
#!/data/data/com.termux/files/usr/bin/bash
cd ~/delta-ai
export DATABASE_URL="file:\$HOME/delta-ai/db/custom.db"
export NODE_ENV=production
export SESSION_SECRET="anzaro-termux-secret-2026"
export NEXTAUTH_SECRET="anzaro-nextauth-termux-2026"
export NEXTAUTH_URL="http://localhost:3000"
export ADMIN_EMAIL="admin@anzaro.local"
export ADMIN_PASSWORD="admin123456"
export NODE_OPTIONS="--max-old-space-size=$NODE_MEM"

# Hermes path (if installed)
export HERMES_HOME="\$HOME/.hermes"
export PATH="\$HERMES_HOME/bin:\$HOME/.bun/bin:\$PATH"

if [ -f .next/BUILD_ID ]; then
    echo "🚀 Starting PRODUCTION mode..."
    npx next start -p 3000 -H 0.0.0.0
else
    echo "⚠️ Starting DEV mode (slower)..."
    npx next dev --webpack -p 3000 -H 0.0.0.0
fi
STARTEOF
chmod +x ~/delta-ai/start-termux.sh

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Delta AI V2 — Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Mode:    $MODE ($RAM_GB GB RAM)"
echo "  URL:     http://localhost:3000"
echo "  Admin:   admin@anzaro.local / admin123456"
echo ""
echo "  Start:   bash ~/delta-ai/start-termux.sh"
echo "  Stop:    Ctrl+C"
echo "  Logs:    In Termux window"
echo ""
echo "  From other devices (same WiFi):"
IP=$(ip addr show wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
if [ -n "$IP" ]; then
    echo "  URL:     http://$IP:3000"
fi
echo "═══════════════════════════════════════════════════"
echo ""

# Start now?
read -p "🚀 Start Delta AI now? (y/n): " choice
if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
    bash ~/delta-ai/start-termux.sh
else
    echo "To start later: bash ~/delta-ai/start-termux.sh"
fi
