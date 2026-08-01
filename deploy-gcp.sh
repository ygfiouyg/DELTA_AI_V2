# ═══════════════════════════════════════════════════
# Delta AI V2 — Google Cloud Deploy Script
# ═══════════════════════════════════════════════════
# للـ Google Cloud Platform ($300 credit - 90 يوم)
#
# خطوات الإعداد:
# 1. سجل في https://cloud.google.com/free
# 2. اعمل VM instance:
#    - Image: Ubuntu 22.04 LTS
#    - Machine type: e2-standard-4 (4 vCPU + 16GB)
#    - Allow HTTP/HTTPS traffic
# 3. افتح port 3000 في Firewall
# 4. اتصل بـ SSH واشغل الـ script ده

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — Google Cloud Deploy"
echo "====================================="

# Install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Clone and build
cd /opt
sudo git clone https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
cd delta-ai
sudo chown -R $USER:$USER /opt/delta-ai

# Setup env
SERVER_IP=$(curl -s ifconfig.me)
cat > .env << ENVFILE
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456
ZAI_API_KEY=
OPENAI_API_KEY=
ENVFILE

# Build and start
docker build -f Dockerfile.prod -t delta-ai:latest .
docker compose up -d

sleep 30
echo "✅ Running: http://${SERVER_IP}:3000"
