#!/bin/bash
# ═══════════════════════════════════════════════════════════
# إرجاع Nginx لـ Hermes على port 8000
# ═══════════════════════════════════════════════════════════
echo "🔄 إرجاع Nginx لـ Hermes (port 8000)..."

cat > /etc/nginx/sites-available/anov.ddns.net << 'NGINXEOF'
server {
    listen 80;
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
nginx -t && systemctl restart nginx

certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "✅ تم الإرجاع!"
echo "🌐 https://anov.ddns.net دلوقتي بيشاور على Hermes (port 8000)"
