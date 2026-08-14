#!/bin/bash
# ═══════════════════════════════════════════════════════════
# 🎯 NOVA AGENT SETUP
# ═══════════════════════════════════════════════════════════
# بيـ install Hermes في الـ background
# وبيـ linkه مع منصة Anzaro
# وبيـ renameه لـ "Nova Agent" في الكود
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 Starting Nova Agent Setup..."
echo "==============================="

# ─── 1. تثبيت Hermes (Anova Engine) ─────────────────
echo "📥 [1/4] Installing Hermes (Nova Engine)..."
if [ -d ~/.hermes ]; then
    echo "   ✅ Hermes directory exists"
else
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup
fi

# ─── 2. ربط مفاتيح المنصة بـ Hermes ─────────────────
echo ""
echo "🔑 [2/4] Linking API keys to Hermes..."
if [ -f /opt/delta-ai/.env ]; then
    # نسخ المفاتيح من Anzaro لـ Hermes
    grep -E "^(ZAI_API_KEY|OPENROUTER_API_KEY|DEEPINFRA_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=" /opt/delta-ai/.env > ~/.hermes/.env 2>/dev/null || true
    echo "   ✅ API keys copied to ~/.hermes/.env"
else
    echo "   ⚠️ Anzaro .env not found. Skipping key copy."
fi

# ─── 3. تحديث الكود لـ "Nova Agent" ─────────────────
echo ""
echo "📝 [3/4] Updating code to 'Nova Agent'..."
cd /opt/delta-ai

# تحديث الـ UI
sed -i 's/Hermes Agent/Nova Agent/g' src/app/hermes/page.tsx
sed -i 's/Hermes Agent/Nova Agent/g' src/components/chat/ChatHeader.tsx
sed -i 's/☤ Hermes Agent/Nova Agent/g' src/components/chat/ChatHeader.tsx

# Commit و push (الـ GitHub Actions هيعمل deploy أوتوماتيك)
git add -A
git commit -m "V.163: Rename Hermes to 'Nova Agent' (Anzaro + Hermes merge)" || true
git push origin main || true

echo "   ✅ Code updated and pushed"

# ─── 4. إعادة تشغيل المنصة ──────────────────────────
echo ""
echo "🔄 [4/4] Restarting platform..."
docker compose restart

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Nova Agent Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 Platform:  https://anov.ddns.net"
echo "  🧠 Nova Page: https://anov.ddns.net/hermes"
echo ""
echo "  Nova Agent (Hermes) is running in the background."
echo "  Anzaro AI is still active."
echo "═══════════════════════════════════════════════════"
