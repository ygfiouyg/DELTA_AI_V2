#!/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — HP AMD A8 Server Deploy
# ═══════════════════════════════════════════════════
# للـ HP AMD A8 (6GB RAM + 500GB HDD)
# محسّن للأجهزة القديمة + HDD
#
# Usage:
#   sudo bash deploy-hp-a8.sh
# ═══════════════════════════════════════════════════

set -e

echo "💻 Delta AI V2 — HP AMD A8 Server Deploy"
echo "=========================================="

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Run as root: sudo bash deploy-hp-a8.sh"
    exit 1
fi

# ─── 0. System info ────────────────────────────────
echo "📊 System info:"
echo "   CPU: $(nproc) cores"
echo "   RAM: $(free -h | grep Mem | awk '{print $2}')"
echo "   Disk: $(df -h / | tail -1 | awk '{print $4}') free"
echo "   CPU model: $(grep 'model name' /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)"
echo ""

# ─── 1. Install zram for faster I/O (HDD optimization) ─
echo "⚡ [1/10] Setting up zram (HDD optimization)..."
apt update -y
apt install -y zram-tools

# Configure zram: use 50% of RAM for compressed swap
cat > /etc/default/zramswap << 'ZRAMEOF'
# zram configuration
ALGO=zstd
PERCENT=50
PRIORITY=100
ZRAMEOF

systemctl enable zramswap
systemctl start zramswap
echo "   ✅ zram enabled (compressed RAM swap)"

# ─── 2. Setup regular swap (8GB) ───────────────────
echo "💾 [2/10] Setting up swap (8GB)..."
if [ ! -f /swapfile ]; then
    fallocate -l 8G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "   ✅ 8GB swap created"
else
    echo "   ✅ Swap already exists"
fi

# ─── 3. Optimize swappiness ────────────────────────
echo "⚙️ [3/10] Optimizing swappiness..."
# Lower swappiness = prefer RAM over swap
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
sysctl -p
echo "   ✅ Swappiness optimized"

# ─── 4. Install Docker ─────────────────────────────
echo "📦 [4/10] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed"
fi

# ─── 5. Install Docker Compose ─────────────────────
if ! command -v docker compose &> /dev/null; then
    echo "📦 [5/10] Installing Docker Compose..."
    apt install -y docker-compose-plugin
    echo "   ✅ Docker Compose installed"
else
    echo "📦 [5/10] Docker Compose already installed"
fi

# ─── 6. Clone repository ───────────────────────────
echo "📂 [6/10] Cloning repository..."
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

# ─── 7. Setup environment ──────────────────────────
echo "⚙️ [7/10] Setting up environment..."
SERVER_IP=$(curl -s ifconfig.me || echo "localhost")

if [ ! -f .env ]; then
    cat > .env << ENVFILE
# ─── Required ────────────────────────────────────
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000

# ─── Admin ───────────────────────────────────────
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456

# ─── AI Providers (add your keys) ────────────────
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

# ─── HF (optional, for DB sync) ──────────────────
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE
    echo "   ⚠️ Created .env — edit it: nano $APP_DIR/.env"
else
    echo "   ✅ .env already exists"
fi

# ─── 8. Create optimized docker-compose ───────────
echo "🏗️ [8/10] Creating optimized docker-compose..."
cat > docker-compose.hp.yml << 'COMPOSEEOF'
version: '3.8'

services:
  delta-ai:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: delta-ai
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - delta_data:/app/data
      - delta_uploads:/app/upload
      - delta_exports:/app/exports
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/custom.db
      - SESSION_SECRET=${SESSION_SECRET}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL:-admin@anzaro.local}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123456}
      - ZAI_API_KEY=${ZAI_API_KEY:-}
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
      - HF_TOKEN=${HF_TOKEN:-}
      - HF_DATASET_REPO=${HF_DATASET_REPO:-}
      - HERMES_HOME=/app/hermes
    # Memory limits optimized for 6GB RAM
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 1G
    # Logging limits (HDD optimization)
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  delta_data:
  delta_uploads:
  delta_exports:
COMPOSEEOF
echo "   ✅ docker-compose.hp.yml created"

# ─── 9. Build and start ────────────────────────────
echo ""
echo "🏗️ [9/10] Building Docker image..."
echo "   ⏳ This will take 20-30 minutes on AMD A8..."
echo "   (First build only — subsequent builds are faster)"
docker compose -f docker-compose.hp.yml build --no-cache 2>&1 | tail -5

echo ""
echo "🚀 [10/10] Starting Delta AI V2..."
docker compose -f docker-compose.hp.yml up -d

# Wait for startup
echo ""
echo "⏳ Waiting for container to start (60s)..."
sleep 60

# Check status
if docker compose -f docker-compose.hp.yml ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  URL:    http://${SERVER_IP}:3000"
    echo "  Admin:  admin@anzaro.local"
    echo "  Pass:   admin123456"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo "📋 Commands:"
    echo "  Logs:       docker compose -f docker-compose.hp.yml logs -f"
    echo "  Stop:       docker compose -f docker-compose.hp.yml down"
    echo "  Restart:    docker compose -f docker-compose.hp.yml restart"
    echo "  Update:     git pull && docker compose -f docker-compose.hp.yml up -d --build"
else
    echo ""
    echo "❌ Container failed to start. Check logs:"
    echo "  docker compose -f docker-compose.hp.yml logs"
fi

# ─── Performance tips ──────────────────────────────
echo ""
echo "💡 Performance Tips for HP AMD A8:"
echo "   1. Add SSD if possible (HDD is the bottleneck)"
echo "   2. Add more RAM (8GB total = much better)"
echo "   3. Close unnecessary background processes"
echo "   4. Use LAN cable (not WiFi)"
echo "   5. Keep the PC well-ventilated"
