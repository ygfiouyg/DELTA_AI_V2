#!/bin/bash
# ═══════════════════════════════════════════════════════════
# 🎯 HERMES AGENT ONLY — Setup Script
# ═══════════════════════════════════════════════════════════
set -e

echo "☤ Hermes Agent — Standalone Installation"
echo "========================================="

# ─── 1. إيقاف Anzaro ───────────────────────────────
echo "🛑 [1/6] Stopping Anzaro..."
cd /opt/delta-ai 2>/dev/null && docker compose down 2>/dev/null || true
echo "   ✅ Anzaro stopped"

# ─── 2. تثبيت Hermes Agent ─────────────────────────
echo ""
echo "📥 [2/6] Installing Hermes Agent..."
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup

# ─── 3. سحب الـ API keys من الريبو البرايفت ────────
echo ""
echo "🔑 [3/6] Fetching API keys from private repo..."
cd /tmp
read -p "Enter GitHub token: " GH_TOKEN && git clone https://ygfiouyg:${GH_TOKEN}@github.com/ygfiouyg/delta-ai-env.git
cp delta-ai-env/.env ~/.hermes/.env
rm -rf delta-ai-env
echo "   ✅ API keys copied to ~/.hermes/.env"

# ─── 4. تشغيل Hermes API Server ────────────────────
echo ""
echo "🚀 [4/6] Starting Hermes API Server on port 8000..."
export PATH="$HOME/.hermes/bin:$PATH"
export HERMES_HOME="$HOME/.hermes"

nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &
sleep 5

if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Hermes API running"
else
    echo "   ⚠️ Check: tail -f /var/log/hermes.log"
fi

# ─── 5. إعداد Nginx ────────────────────────────────
echo ""
echo "🌐 [5/6] Configuring Nginx..."
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
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# ─── 6. SSL ────────────────────────────────────────
echo ""
echo "🔒 [6/6] Setting up SSL..."
certbot --nginx -d anov.ddns.net --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -3

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Hermes Agent is Ready!"
echo "═══════════════════════════════════════════════════"
echo "  🌐 https://anov.ddns.net"
echo "═══════════════════════════════════════════════════"
