#!/bin/bash
set -e

echo "🔧 Final Fix: Nginx WebSocket + Restore Anzaro..."
echo "================================================"

# 1. إيقاف Hermes Container
echo "🛑 Stopping Hermes Container..."
cd /opt/delta-ai/hermes-container
docker compose down 2>/dev/null || true

# 2. تشغيل Anzaro على port 3000
echo "🚀 Starting Anzaro on port 3000..."
cd /opt/delta-ai
docker compose up -d
sleep 15

# 3. Nginx: Anzaro على / و Hermes API على /v1/
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
    server_name anov.ddns.net;

    # Main site → Anzaro (port 3000) مع دعم WebSocket
    location / {
        proxy_pass http://127.0.0.1:3000;
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
}
NGINXEOF

ln -sf /etc/nginx/sites-available/anov.ddns.net /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "✅ Done!"
echo "🌐 https://anov.ddns.net → Anzaro AI (with WebSocket support)"
