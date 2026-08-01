# ═══════════════════════════════════════════════════
# Delta AI V2 — VPS Deployment Script
# ═══════════════════════════════════════════════════
# Runs on: Ubuntu 22.04+ VPS (Hetzner, DO, Linode, etc.)
# 
# Usage:
#   wget https://raw.githubusercontent.com/ygfiouyg/DELTA_AI_V2/main/deploy-vps.sh
#   chmod +x deploy-vps.sh
#   sudo ./deploy-vps.sh

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — VPS Deployment"
echo "================================"

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Run as root: sudo ./deploy-vps.sh"
    exit 1
fi

# Check system
echo "📊 System info:"
echo "   CPU: $(nproc) cores"
echo "   RAM: $(free -h | grep Mem | awk '{print $2}')"
echo "   Disk: $(df -h / | tail -1 | awk '{print $4}') free"

# ─── 1. Install Docker ─────────────────────────────
echo ""
echo "📦 [1/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed: $(docker --version)"
fi

# ─── 2. Install Docker Compose ─────────────────────
if ! command -v docker compose &> /dev/null; then
    echo "📦 [2/6] Installing Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin
    echo "   ✅ Docker Compose installed"
else
    echo "📦 [2/6] Docker Compose already installed"
fi

# ─── 3. Clone repository ───────────────────────────
echo ""
echo "📂 [3/6] Cloning repository..."
APP_DIR="/opt/delta-ai"
if [ -d "$APP_DIR" ]; then
    cd $APP_DIR
    git pull origin main || true
    echo "   ✅ Repository updated"
else
    git clone https://github.com/ygfiouyg/DELTA_AI_V2.git $APP_DIR
    cd $APP_DIR
    echo "   ✅ Repository cloned"
fi

# ─── 4. Setup environment ──────────────────────────
echo ""
echo "⚙️ [4/6] Setting up environment..."
if [ ! -f .env ]; then
    cat > .env << 'ENVFILE'
# ─── Required ────────────────────────────────────
SESSION_SECRET=change-this-to-random-64-chars
NEXTAUTH_SECRET=change-this-to-random-64-chars
NEXTAUTH_URL=http://YOUR_SERVER_IP:3000

# ─── Admin ───────────────────────────────────────
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456

# ─── AI Providers ────────────────────────────────
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

# ─── HF (optional) ───────────────────────────────
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE
    echo "   ⚠️ Created .env — please edit it: nano $APP_DIR/.env"
    echo "   ⚠️ Set NEXTAUTH_URL to your server IP/domain"
else
    echo "   ✅ .env already exists"
fi

# ─── 5. Setup swap (if low RAM) ────────────────────
RAM_GB=$(free -g | grep Mem | awk '{print $2}')
if [ "$RAM_GB" -lt 4 ]; then
    echo ""
    echo "💾 [5/6] Setting up swap (low RAM detected: ${RAM_GB}GB)..."
    if [ ! -f /swapfile ]; then
        fallocate -l 4G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "   ✅ 4GB swap created"
    else
        echo "   ✅ Swap already exists"
    fi
else
    echo "💾 [5/6] Sufficient RAM (${RAM_GB}GB) — no swap needed"
fi

# ─── 6. Build and start ────────────────────────────
echo ""
echo "🏗️ [6/6] Building and starting Delta AI V2..."
echo "   This will take 10-20 minutes for first build..."
docker compose build --no-cache 2>&1 | tail -5
docker compose up -d

echo ""
echo "⏳ Waiting for container to start..."
sleep 30

# Check status
if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo "   URL: http://$(curl -s ifconfig.me):3000"
    echo "   Admin: admin@anzaro.local / admin123456"
    echo ""
    echo "📋 Logs: docker compose logs -f"
    echo "🛑 Stop: docker compose down"
    echo "🔄 Update: git pull && docker compose up -d --build"
else
    echo ""
    echo "❌ Container failed to start. Check logs:"
    echo "   docker compose logs"
fi

# ─── Optional: Setup Nginx reverse proxy ───────────
echo ""
echo "🌐 Optional: Setup Nginx + SSL?"
echo "   Run: sudo apt install nginx certbot python3-certbot-nginx"
echo "   Then configure /etc/nginx/sites-available/delta-ai"
