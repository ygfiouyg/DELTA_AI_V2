#!/bin/bash
# إعداد Nginx proxy لـ Nova Agent
echo "⚙️ Adding Nova Agent proxy to Nginx..."

cat /opt/delta-ai/nova-agent/nginx-nova.conf >> /etc/nginx/sites-available/anov.ddns.net
nginx -t && systemctl restart nginx

echo "✅ Nova Agent API available at: https://anov.ddns.net/nova/"
