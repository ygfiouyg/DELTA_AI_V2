#!/bin/bash
# ═══════════════════════════════════════════════════════════
# إصلاح مشكلة "web UI disabled" في Hermes
# ═══════════════════════════════════════════════════════════
set -e

echo "🔧 Fixing Hermes Web UI..."
echo "========================="

export PATH="$HOME/.hermes/bin:$PATH"

# 1. إيقاف Hermes الحالي
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 3

# 2. تشغيل Hermes Dashboard (اللي فيه Web UI)
echo "🚀 Starting Hermes Dashboard on port 8000..."
nohup hermes dashboard --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &

echo "   Waiting..."
sleep 15

# 3. فحص
if curl -s http://localhost:8000 | head -1 | grep -q "html\|HTML\|<!DOCTYPE"; then
    echo "   ✅ Hermes Web UI is running!"
else
    echo "   ⚠️ Checking logs..."
    tail -10 /var/log/hermes.log
fi

echo ""
echo "✅ Done! Open: https://anov.ddns.net"
