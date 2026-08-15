#!/bin/bash
echo "🔍 Checking Hermes Container..."
echo "=============================="

# 1. فحص الـ container
echo "1. Container status:"
docker ps | grep hermes
echo ""

# 2. فحص port 8000
echo "2. Port 8000:"
curl -s http://localhost:8000 | head -3
echo ""

# 3. الـ logs
echo "3. Hermes logs (last 30 lines):"
cd /opt/delta-ai/hermes-container
docker compose logs --tail=30
echo ""

# 4. لو مش شغال، استنى أكتر
if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "⚠️ Hermes not responding yet. Waiting 60 more seconds..."
    sleep 60
    echo "Checking again..."
    curl -s http://localhost:8000 | head -3
    echo ""
    docker compose logs --tail=10
fi
