#!/bin/bash
# ═══════════════════════════════════════════════════════════
# إصلاح مشكلة الـ Auth + Error 500 في Hermes
# ═══════════════════════════════════════════════════════════
set -e

echo "🔧 Fixing Hermes Auth + Error 500..."
echo "===================================="

export PATH="$HOME/.hermes/bin:$PATH"

# 1. إيقاف Hermes الحالي
echo "🛑 Stopping Hermes..."
pkill -f "hermes serve" 2>/dev/null || true
pkill -f "hermes dashboard" 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 3

# 2. إعداد الـ API keys (لو مش موجودة)
echo "🔑 Setting up API keys..."
if [ ! -f ~/.hermes/.env ] || ! grep -q "OPENROUTER_API_KEY" ~/.hermes/.env; then
    echo "   Adding API keys..."
    
    # نسخ المفاتيح من Anzaro
    if [ -f /opt/delta-ai/.env ]; then
        grep -E "^(ZAI_API_KEY|OPENROUTER_API_KEY|DEEPINFRA_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=" /opt/delta-ai/.env > ~/.hermes/.env 2>/dev/null || true
    fi
    
    # لو لسه فاضي، نضيف OpenRouter
    if [ ! -s ~/.hermes/.env ]; then
        echo "OPENROUTER_API_KEY=YOUR_OPENROUTER_KEY" > ~/.hermes/.env
    fi
    echo "   ✅ API keys added"
else
    echo "   ✅ API keys already exist"
fi

# 3. إعداد الـ config.yaml
echo "⚙️ Setting up config..."
if [ ! -f ~/.hermes/config.yaml ]; then
    cat > ~/.hermes/config.yaml << 'CONFIGEOF'
model:
  default: "openrouter:auto-select"
  provider: "openrouter"

database:
  journal_mode: "wal"

terminal:
  backend: "local"
  cwd: "."
  timeout: 180
CONFIGEOF
    echo "   ✅ Config created"
else
    # التأكد إن فيه model configured
    if ! grep -q "default:" ~/.hermes/config.yaml; then
        echo "model:" >> ~/.hermes/config.yaml
        echo '  default: "openrouter:auto-select"' >> ~/.hermes/config.yaml
        echo '  provider: "openrouter"' >> ~/.hermes/config.yaml
        echo "   ✅ Model added to config"
    else
        echo "   ✅ Config already has model"
    fi
fi

# 4. تشغيل Hermes setup (non-interactive)
echo "🏗️ Running Hermes setup..."
hermes setup --skip-setup 2>/dev/null || true

# 5. تشغيل Hermes API Server
echo "🚀 Starting Hermes on port 8000..."
nohup hermes serve --host 0.0.0.0 --port 8000 > /var/log/hermes.log 2>&1 &

echo "   Waiting for startup..."
sleep 15

# 6. فحص
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Hermes is running!"
    curl -s http://localhost:8000/health | head -5
else
    echo "   ⚠️ Checking logs..."
    tail -20 /var/log/hermes.log
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Fix Complete!"
echo "  🌐 https://anov.ddns.net"
echo "═══════════════════════════════════════════════════"
