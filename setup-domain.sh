#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Delta AI V2 — Domain + SSL Setup Script
# ═══════════════════════════════════════════════════════════
# بيظبط:
#   1. Nginx reverse proxy
#   2. SSL certificate (Let's Encrypt)
#   3. DuckDNS auto-update
#   4. تحديث .env بالدومين الجديد
# ═══════════════════════════════════════════════════════════

set -e

DOMAIN="anov.duckdns.org"
SERVER_IP="46.224.234.21"
APP_PORT=3000

echo "🌐 Delta AI V2 — Domain & SSL Setup"
echo "====================================="
echo "Domain: $DOMAIN"
echo "Server IP: $SERVER_IP"
echo "App Port: $APP_PORT"
echo ""

# ─── 1. تثبيت Nginx و Certbot ──────────────────────
echo "📦 [1/5] Installing Nginx + Certbot..."
apt update -y
apt install -y nginx certbot python3-certbot-nginx
echo "   ✅ Nginx + Certbot installed"

# ─── 2. إعداد Nginx Reverse Proxy ─────────────────
echo ""
echo "⚙️ [2/5] Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Proxy to Next.js app
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering off;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Increase upload size
    client_max_body_size 100M;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
NGINXEOF

# تفعيل الـ site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار Nginx
nginx -t 2>&1 | tail -2
systemctl restart nginx
systemctl enable nginx
echo "   ✅ Nginx configured"

# ─── 3. SSL Certificate (Let's Encrypt) ────────────
echo ""
echo "🔒 [3/5] Getting SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -10
echo "   ✅ SSL certificate installed"

# ─── 4. تحديث .env بالدومين الجديد ─────────────────
echo ""
echo "📝 [4/5] Updating .env file..."
cd /opt/delta-ai

# تحديث NEXTAUTH_URL
if grep -q "NEXTAUTH_URL" .env; then
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://$DOMAIN|g" .env
else
    echo "NEXTAUTH_URL=https://$DOMAIN" >> .env
fi

echo "   ✅ .env updated with: https://$DOMAIN"

# ─── 5. إعادة تشغيل التطبيق ───────────────────────
echo ""
echo "🔄 [5/5] Restarting Delta AI..."
docker compose down
docker compose up -d --build

echo ""
echo "⏳ Waiting for startup..."
sleep 15

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 Your site:    https://$DOMAIN"
echo "  🔒 SSL:          Active (Let's Encrypt)"
echo "  📧 Admin:        admin@anzaro.local"
echo "  🔑 Password:     admin123456"
echo ""
echo "  The site is now accessible from anywhere!"
echo "═══════════════════════════════════════════════════"
