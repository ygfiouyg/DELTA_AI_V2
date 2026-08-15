#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Dr. AIX Agent — Final Deploy (Hermes Web UI + API)
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 Dr. AIX Agent — Final Deployment"
echo "===================================="

# ─── 1. إعداد Hermes ───────────────────────────────
echo "☤ [1/4] Setting up Hermes Agent..."
cd /opt/delta-ai
git fetch --all
git reset --hard origin/main

# التأكد إن Hermes مثبت
export PATH="$HOME/.hermes/bin:$PATH"
if ! command -v hermes &> /dev/null; then
    echo "   Installing Hermes..."
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup
fi

# نسخ API keys
if [ -f /opt/delta-ai/.env ]; then
    grep -E "^(ZAI_API_KEY|OPENROUTER_API_KEY|DEEPINFRA_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=" /opt/delta-ai/.env > ~/.hermes/.env 2>/dev/null || true
fi

# ─── 2. تشغيل Hermes API Server ────────────────────
echo ""
echo "🚀 [2/4] Starting Hermes API on port 8000..."
pkill -f "hermes serve" 2>/dev/null || true
sleep 2

# تشغيل Hermes serve في الـ background
nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &

echo "   Waiting for Hermes to start..."
sleep 10

# التحقق
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Hermes API running on port 8000"
else
    echo "   ⚠️ Hermes might need more time. Check: tail -f /var/log/hermes.log"
fi

# ─── 3. تشغيل Open WebUI على port 4000 ─────────────
echo ""
echo "🎨 [3/4] Starting Open WebUI on port 4000..."
cd /opt/delta-ai/open-webui
docker compose up -d 2>/dev/null || {
    echo "   Pulling Open WebUI image..."
    docker compose pull
    docker compose up -d
}

echo "   Waiting for Open WebUI..."
sleep 15

if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo "   ✅ Open WebUI running on port 4000"
else
    echo "   ⚠️ Open WebUI still starting..."
fi

# ─── 4. إعداد Nginx ────────────────────────────────
echo ""
echo "🌐 [4/4] Configuring Nginx..."

cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
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

    # Hermes API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Hermes OpenAI-compatible API
    location /v1/ {
        proxy_pass http://127.0.0.1:8000/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/anov.ddns.net /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# SSL
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Dr. AIX Agent is Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 Main UI:     https://anov.ddns.net"
echo "  🤖 Hermes API:  https://anov.ddns.net/v1/"
echo ""
echo "  Setup:"
echo "    1. Open https://anov.ddns.net"
echo "    2. Create admin account"
echo "    3. Settings → Models → Add OpenAI-compatible API"
echo "    4. URL: http://localhost:8000/v1 (or https://anov.ddns.net/v1)"
echo "    5. Key: any-text-here"
echo ""
echo "  Ports:"
echo "    4000 = Open WebUI (Dr. AIX Agent)"
echo "    8000 = Hermes API"
echo "═══════════════════════════════════════════════════"
