#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Delta AI V2 — Hermes Agent Full Installation
# ═══════════════════════════════════════════════════════════
set -e

echo "☤ Hermes Agent — Full Installation"
echo "=================================="

# 1. تثبيت Hermes
echo "📥 [1/3] Installing Hermes..."
if [ -d ~/.hermes/hermes-agent ]; then
    echo "   Hermes exists, updating..."
    cd ~/.hermes/hermes-agent
    git pull origin main
else
    echo "   Installing fresh..."
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup
fi

# 2. نسخ API keys من Delta AI .env
echo ""
echo "🔑 [2/3] Copying API keys from Delta AI..."
if [ -f /opt/delta-ai/.env ]; then
    # استخراج المفاتيح من .env بتاع المنصة
    grep -E "^(ZAI_API_KEY|OPENROUTER_API_KEY|DEEPINFRA_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=" /opt/delta-ai/.env > ~/.hermes/.env 2>/dev/null || true
    echo "   ✅ API keys copied to ~/.hermes/.env"
else
    echo "   ⚠️ Delta AI .env not found. Please add keys manually to ~/.hermes/.env"
fi

# 3. التحقق من التثبيت
echo ""
echo "🔍 [3/3] Verifying installation..."
export PATH="$HOME/.hermes/bin:$PATH"

if command -v hermes &> /dev/null; then
    VERSION=$(hermes --version 2>&1 | head -1)
    echo "   ✅ Hermes installed: $VERSION"
else
    echo "   ❌ Hermes not in PATH. Trying manual link..."
    if [ -f ~/.hermes/bin/hermes ]; then
        ln -sf ~/.hermes/bin/hermes /usr/local/bin/hermes
        echo "   ✅ Linked to /usr/local/bin/hermes"
    else
        echo "   ❌ Hermes binary not found!"
        echo "   Please run: curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"
        exit 1
    fi
fi

# 4. اختبار سريع
echo ""
echo "🧪 Testing Hermes..."
hermes --version
echo ""
echo "✅ Hermes is ready!"
echo "⚠️ You can now test it via: https://anov.ddns.net/hermes"
