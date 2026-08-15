#!/bin/bash
# ═══════════════════════════════════════════════════════════
# تنظيف شامل لكل الحاجات اللي اتعملت
# ═══════════════════════════════════════════════════════════
set -e

echo "🧹 Cleaning up everything..."
echo "=========================="

# 1. إيقاف ومسح Open WebUI
echo "🗑️ Removing Open WebUI..."
cd /opt/delta-ai/open-webui 2>/dev/null
docker compose down -v 2>/dev/null || true
docker rm -f dr-aix-ui 2>/dev/null || true
docker rmi ghcr.io/open-webui/open-webui:main 2>/dev/null || true

# 2. قتل أي Hermes process
echo "🛑 Killing Hermes processes..."
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 4000/tcp 2>/dev/null || true

# 3. إعادة Nginx لـ Anzaro (port 3000)
echo "🌐 Restoring Nginx to Anzaro (port 3000)..."
cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name anov.ddns.net;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        client_max_body_size 100M;
    }
}
NGINXEOF

nginx -t
systemctl restart nginx

# تجديد SSL
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

# 4. إعادة تشغيل Anzaro
echo ""
echo "🚀 Restarting Anzaro..."
cd /opt/delta-ai
docker compose up -d --build

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Cleanup Complete!"
echo "  🌐 Anzaro is back: https://anov.ddns.net"
echo "═══════════════════════════════════════════════════"
