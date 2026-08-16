#!/bin/bash
set -e

echo "🚀 Dr. AIX Agent — Hermes Container Deploy"
echo "============================================"

echo "📥 [1/6] Pulling latest code..."
cd /opt/delta-ai
git fetch --all
git reset --hard origin/main

echo ""
echo "🔑 [2/6] Setting up API keys..."
HERMES_ENV="/opt/delta-ai/hermes-container/.env"
> "$HERMES_ENV"
if [ -f /opt/delta-ai/.env ]; then
    for KEY in ZAI_API_KEY ZHIPUAI_API_KEY OPENROUTER_API_KEY DEEPINFRA_API_KEY OPENAI_API_KEY ANTHROPIC_API_KEY GOOGLE_API_KEY HF_TOKEN; do
        VALUE=$(awk -F'=' -v k="$KEY" '$1==k {print $2}' /opt/delta-ai/.env 2>/dev/null || true)
        if [ -n "$VALUE" ]; then
            echo "${KEY}=${VALUE}" >> "$HERMES_ENV"
        fi
    done
    echo "   ✅ API keys copied"
fi

echo ""
echo "🛑 [3/6] Stopping old Hermes + removing old volume..."
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
cd /opt/delta-ai/hermes-container
docker compose down -v 2>/dev/null || true
docker volume rm hermes-container_hermes_data 2>/dev/null || true

echo ""
echo "🏗️ [4/6] Building (no cache)..."
docker compose build --no-cache

echo ""
echo "🚀 [5/6] Starting..."
docker compose up -d
echo "   Waiting 90s for startup..."
sleep 90

if curl -s -H "Host: 127.0.0.1" http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Hermes is running!"
else
    echo "   ⚠️ Logs:"
    docker compose logs --tail=20
fi

echo ""
echo "🌐 [6/6] Nginx (with Host header fix)..."
cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
    server_name anov.ddns.net;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host 127.0.0.1;
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
nginx -t && systemctl restart nginx
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "✅ Done! https://anov.ddns.net"
