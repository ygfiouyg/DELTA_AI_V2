#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Dr. AIX Agent — Hermes Docker Container Deploy
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 Dr. AIX Agent — Hermes Container Deploy"
echo "============================================"

# ─── 1. سحب الكود ──────────────────────────────────
echo "📥 [1/6] Pulling latest code..."
cd /opt/delta-ai
git fetch --all
git reset --hard origin/main

# ─── 2. إعداد الـ API keys ─────────────────────────
echo ""
echo "🔑 [2/6] Setting up API keys..."

# إنشاء .env للـ Hermes container
HERMES_ENV="/opt/delta-ai/hermes-container/.env"

cat > "$HERMES_ENV" << 'ENVEOF'
ZAI_API_KEY=
ZHIPUAI_API_KEY=
OPENROUTER_API_KEY=
DEEPINFRA_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
HF_TOKEN=
ENVEOF

# نسخ المفاتيح من Anzaro .env
if [ -f /opt/delta-ai/.env ]; then
    for KEY in ZAI_API_KEY ZHIPUAI_API_KEY OPENROUTER_API_KEY DEEPINFRA_API_KEY OPENAI_API_KEY ANTHROPIC_API_KEY GOOGLE_API_KEY HF_TOKEN; do
        VALUE=$(grep "^${KEY}=" /opt/delta-ai/.env 2>/dev/null | cut -d'=' -f2- || true)
        if [ -n "$VALUE" ]; then
            sed -i "s|^${KEY}=.*|${KEY}=${VALUE}|" "$HERMES_ENV"
        fi
    done
    echo "   ✅ API keys copied from Anzaro"
else
    echo "   ⚠️ Anzaro .env not found. Edit $HERMES_ENV manually."
fi

# ─── 3. إيقاف أي Hermes قديم ───────────────────────
echo ""
echo "🛑 [3/6] Stopping old Hermes..."
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

# إيقاف أي container قديم
cd /opt/delta-ai/hermes-container
docker compose down 2>/dev/null || true

# ─── 4. بناء الـ Container ─────────────────────────
echo ""
echo "🏗️ [4/6] Building Hermes Container (this takes 5-10 min)..."
docker compose build --no-cache

# ─── 5. تشغيل الـ Container ────────────────────────
echo ""
echo "🚀 [5/6] Starting Hermes Container..."
docker compose up -d

echo "   Waiting for startup (60s)..."
sleep 60

# فحص
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Hermes Container is running!"
else
    echo "   ⚠️ Still starting. Checking logs..."
    docker compose logs --tail=20
fi

# ─── 6. إعداد Nginx ────────────────────────────────
echo ""
echo "🌐 [6/6] Configuring Nginx..."

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

# SSL
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

# ─── النتيجة ──────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Dr. AIX Agent (Hermes) is Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 URL:          https://anov.ddns.net"
echo "  🐳 Container:    hermes-dashboard"
echo "  🔌 Port:         8000"
echo "  🔄 Auto-restart: enabled"
echo "  📊 Health check: enabled"
echo ""
echo "  Commands:"
echo "    Logs:     cd /opt/delta-ai/hermes-container && docker compose logs -f"
echo "    Restart:  cd /opt/delta-ai/hermes-container && docker compose restart"
echo "    Stop:     cd /opt/delta-ai/hermes-container && docker compose down"
echo "    Status:   docker ps | grep hermes"
echo "═══════════════════════════════════════════════════"
