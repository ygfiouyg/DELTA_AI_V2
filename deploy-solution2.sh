#!/bin/bash
set -e

echo "🚀 Dr. AIX Agent — Solution 2: API + Static UI"
echo "================================================"

# ─── 1. مسح Anzaro نهائياً ─────────────────────────
echo "🗑️ [1/5] Removing Anzaro completely..."
cd /opt/delta-ai
docker compose down -v 2>/dev/null || true
docker rm -f delta-ai 2>/dev/null || true
docker rmi delta-ai-delta-ai 2>/dev/null || true
docker volume rm delta-ai_delta_data delta-ai_delta_uploads delta-ai_delta_exports 2>/dev/null || true
echo "   ✅ Anzaro removed"

# ─── 2. تشغيل Hermes API (Backend فقط) ─────────────
echo ""
echo "🤖 [2/5] Starting Hermes API on port 8000..."
pkill -f "hermes dashboard" 2>/dev/null || true
pkill -f "hermes serve" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 4000/tcp 2>/dev/null || true
sleep 3

export PATH="$HOME/.hermes/bin:$PATH"

# تشغيل Hermes serve (API فقط، بدون Web UI)
nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &
sleep 15

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Hermes API running on port 8000"
else
    echo "   ⚠️ Check: tail -f /var/log/hermes.log"
fi

# ─── 3. بناء واجهة Hermes Web UI (Static) ──────────
echo ""
echo "🎨 [3/5] Building Hermes Web UI (Static)..."
# تثبيت Node.js 20 + pnpm
if ! command -v pnpm &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    npm install -g pnpm
fi

# تنزيل كود Hermes
if [ ! -d /opt/hermes-source ]; then
    git clone --depth 1 https://github.com/NousResearch/hermes-agent.git /opt/hermes-source
fi
cd /opt/hermes-source/apps/desktop

# تثبيت dependencies وبناء الـ Web UI
pnpm install 2>/dev/null || npm install
export HERMES_DESKTOP_WEB_ONLY=1
pnpm build 2>/dev/null || npm run build

# نسخ الـ build لمكان يـ serve منه
mkdir -p /opt/draix-web
cp -r dist/* /opt/draix-web/

# تثبيت static server
npm install -g serve
pkill -f "serve -s" 2>/dev/null || true
nohup serve -s /opt/draix-web -l 4000 > /var/log/draix-web.log 2>&1 &
sleep 5

if curl -s http://localhost:4000 | head -1 | grep -q "html\|HTML\|<!DOCTYPE"; then
    echo "   ✅ Web UI running on port 4000"
else
    echo "   ⚠️ Check: tail -f /var/log/draix-web.log"
fi

# ─── 4. White-Labeling ─────────────────────────────
echo ""
echo "🏷️ [4/5] White-Labeling..."
# تغيير الأسماء في الـ static files
find /opt/draix-web -name "*.html" -exec sed -i 's/Hermes Agent/Dr. AIX Agent/g' {} \;
find /opt/draix-web -name "*.html" -exec sed -i 's/Hermes/Dr. AIX/g' {} \;
find /opt/draix-web -name "*.js" -exec sed -i 's/Hermes Agent/Dr. AIX Agent/g' {} \;
find /opt/draix-web -name "*.js" -exec sed -i 's/Nous Research/ANOVA Ventures/g' {} \;
find /opt/draix-web -name "*.html" -exec sed -i 's/Nous Research/ANOVA Ventures/g' {} \;
find /opt/draix-web -name "*.html" -exec sed -i 's/<title>.*<\/title>/<title>Dr. AIX Agent<\/title>/g' {} \;

# Favicon
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#1A1A1A"/><text x="50" y="68" font-size="60" font-weight="bold" text-anchor="middle" fill="#C5A572" font-family="serif">A</text></svg>' > /opt/draix-web/favicon.svg

echo "   ✅ White-Labeling complete"

# ─── 5. إعداد Nginx ────────────────────────────────
echo ""
echo "🌐 [5/5] Configuring Nginx..."
cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
    server_name anov.ddns.net;

    # Web UI → port 4000
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        client_max_body_size 100M;
    }

    # Hermes API → port 8000
    location /v1/ {
        proxy_pass http://127.0.0.1:8000/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        client_max_body_size 100M;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        client_max_body_size 100M;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/anov.ddns.net /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Dr. AIX Agent is Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 URL:        https://anov.ddns.net"
echo "  🎨 Web UI:     port 4000 (static build)"
echo "  🤖 Hermes API: port 8000 (backend)"
echo ""
echo "  Architecture:"
echo "    User → Nginx → Web UI (4000) for interface"
echo "                 → Hermes API (8000) for data"
echo "═══════════════════════════════════════════════════"
