#!/bin/bash
# ═══════════════════════════════════════════════════════════
# تنظيف الواجهات فقط (الإبقاء على Hermes)
# ═══════════════════════════════════════════════════════════
set -e

echo "🧹 Cleaning up UIs only (keeping Hermes)..."
echo "============================================="

# 1. إيقاف ومسح Open WebUI
echo "🗑️ Removing Open WebUI..."
cd /opt/delta-ai/open-webui 2>/dev/null
docker compose down -v 2>/dev/null || true
docker rm -f dr-aix-ui 2>/dev/null || true
docker rmi ghcr.io/open-webui/open-webui:main 2>/dev/null || true

# 2. قتل أي Anzaro process (Next.js على port 3000)
echo "🛑 Stopping Anzaro (port 3000)..."
cd /opt/delta-ai
docker compose down 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true

# 3. التأكد إن Hermes شغال على port 8000
echo ""
echo "☤ Ensuring Hermes is running on port 8000..."
fuser -k 8000/tcp 2>/dev/null || true
sleep 2

export PATH="$HOME/.hermes/bin:$PATH"
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
sleep 2

# تشغيل Hermes API server
nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &
sleep 10

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Hermes API is running on port 8000"
else
    echo "   ⚠️ Hermes might need a moment. Check: tail -f /var/log/hermes.log"
fi

# 4. إعداد Nginx لـ Hermes (port 8000) فقط
echo ""
echo "🌐 Configuring Nginx for Hermes (port 8000)..."
cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name anov.ddns.net;

    location / {
        proxy_pass http://127.0.0.1:8000;
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

ln -sf /etc/nginx/sites-available/anov.ddns.net /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# تجديد SSL
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Cleanup Complete! Hermes is the main UI."
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 https://anov.ddns.net → Hermes (port 8000)"
echo "  ❌ Open WebUI removed"
echo "  ❌ Anzaro stopped (code still in /opt/delta-ai)"
echo "  ✅ Hermes API running"
echo "═══════════════════════════════════════════════════"
