# ═══════════════════════════════════════════════════
# Delta AI V2 — Oracle Cloud Deploy Script
# ═══════════════════════════════════════════════════
# للـ Oracle Cloud Always Free (4 ARM cores + 24GB RAM)
#
# خطوات الإعداد:
# 1. سجل في https://www.oracle.com/cloud/free/
# 2. اعمل VM instance:
#    - Image: Canonical Ubuntu 22.04
#    - Shape: VM.Standard.A1.Flex (ARM)
#    - OCPUs: 4
#    - Memory: 24 GB
#    - Block storage: 200 GB
#    - Download SSH keys
# 3. افتح port 3000 في Security List:
#    VCN → Security Lists → Ingress Rules → Add:
#    Source: 0.0.0.0/0, Port: 3000
# 4. اتصل بـ SSH واشغل الـ script ده

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — Oracle Cloud ARM Deploy"
echo "=========================================="

# ─── 1. Update system ──────────────────────────────
echo "📦 [1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# ─── 2. Install Docker ─────────────────────────────
echo "📦 [2/8] Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# ─── 3. Setup swap (24GB RAM كافية بس احتياط) ────
echo "💾 [3/8] Setting up swap (4GB)..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# ─── 4. Clone repository ───────────────────────────
echo "📂 [4/8] Cloning Delta AI V2..."
cd /opt
sudo git clone https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
cd delta-ai
sudo chown -R $USER:$USER /opt/delta-ai

# ─── 5. Setup environment ──────────────────────────
echo "⚙️ [5/8] Setting up environment..."
SERVER_IP=$(curl -s ifconfig.me)
cat > .env << ENVFILE
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456
# Add your API keys here:
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE

# ─── 6. Build Docker image ─────────────────────────
echo "🏗️ [6/8] Building Docker image (ARM)..."
# Use production Dockerfile
docker build -f Dockerfile.prod -t delta-ai:latest .

# ─── 7. Start container ────────────────────────────
echo "🚀 [7/8] Starting container..."
docker compose up -d

# ─── 8. Wait and verify ────────────────────────────
echo "⏳ [8/8] Waiting for startup..."
sleep 30

if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo "   URL: http://${SERVER_IP}:3000"
    echo "   Admin: admin@anzaro.local / admin123456"
    echo ""
    echo "📋 Logs: docker compose logs -f"
    echo "🛑 Stop: docker compose down"
else
    echo "❌ Container failed. Check: docker compose logs"
fi
