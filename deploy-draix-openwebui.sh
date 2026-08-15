#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Dr. AIX Agent — Open WebUI + Hermes Integration
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 Dr. AIX Agent — Deploying Open WebUI..."
echo "================================================"

# ─── 1. سحب الكود ──────────────────────────────────
echo "📥 [1/5] Pulling latest code..."
cd /opt/delta-ai
git fetch --all
git reset --hard origin/main

# ─── 2. تشغيل Open WebUI على port 4000 ─────────────
echo ""
echo "🎨 [2/5] Starting Open WebUI on port 4000..."
cd /opt/delta-ai/open-webui
docker compose down 2>/dev/null || true
docker compose pull 2>/dev/null || true
docker compose up -d

echo "   ⏳ Waiting for Open WebUI to start..."
sleep 15

# ─── 3. التأكد من Hermes على port 8000 ─────────────
echo ""
echo "☤ [3/5] Checking Hermes on port 8000..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Hermes is running on port 8000"
else
    echo "   ⚠️ Hermes not detected on port 8000"
    echo "   Starting Hermes..."
    export PATH="$HOME/.hermes/bin:$PATH"
    nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &
    sleep 5
fi

# ─── 4. إعداد Nginx ────────────────────────────────
echo ""
echo "🌐 [4/5] Configuring Nginx..."

cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
# Dr. AIX Agent — Main site (Open WebUI on port 4000)
server {
    listen 80;
    listen [::]:80;
    server_name anov.ddns.net;

    # Main site → Open WebUI (port 4000)
    location / {
        proxy_pass http://127.0.0.1:4000;
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

    # Hermes API proxy (للأدمن)
    location /hermes/ {
        proxy_pass http://127.0.0.1:8000/;
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

# ─── 5. SSL ────────────────────────────────────────
echo ""
echo "🔒 [5/5] Setting up SSL..."
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -5

# ─── النتيجة ──────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Dr. AIX Agent is Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 Main UI (Users):    https://anov.ddns.net"
echo "  🤖 Hermes API:         https://anov.ddns.net/hermes/"
echo "  🔧 Hermes Dashboard:   http://localhost:8000 (SSH only)"
echo ""
echo "  First time setup:"
echo "    1. Open https://anov.ddns.net"
echo "    2. Create admin account"
echo "    3. Go to Settings → Models"
echo "    4. Hermes models should auto-appear"
echo ""
echo "  Ports:"
echo "    - 4000: Open WebUI (Dr. AIX Agent)"
echo "    - 8000: Hermes Agent API"
echo "    - 3000: Anzaro AI (legacy)"
echo "═══════════════════════════════════════════════════"
