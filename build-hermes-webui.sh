#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Dr. AIX Agent — Build Hermes Web UI from Source
# ═══════════════════════════════════════════════════════════
# بينزل السورس كود بتاع Hermes وبيعمل build للواجهة
# وبعدين بيـ serverها على port 4000
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 Dr. AIX Agent — Building Web UI from Hermes Source..."
echo "========================================================"

# ─── 1. تثبيت المتطلبات ─────────────────────────────
echo "📦 [1/5] Installing prerequisites..."
apt update -y
apt install -y nodejs npm
npm install -g pnpm

# ─── 2. تنزيل السورس كود ────────────────────────────
echo ""
echo "📥 [2/5] Downloading Hermes source code..."
cd /opt
if [ -d hermes-source ]; then
    cd hermes-source
    git pull origin main
else
    git clone --depth 1 https://github.com/NousResearch/hermes-agent.git hermes-source
    cd hermes-source
fi

# ─── 3. تثبيت الـ dependencies ──────────────────────
echo ""
echo "📦 [3/5] Installing frontend dependencies..."
cd apps/desktop

# تثبيت الـ dependencies
pnpm install 2>/dev/null || npm install

# ─── 4. Build الواجهة ──────────────────────────────
echo ""
echo "🏗️ [4/5] Building web UI (this takes 5-10 min)..."
# تعديل بسيط: تخلي الـ build يشتغل بدون Electron
export HERMES_DESKTOP_WEB_ONLY=1
pnpm build 2>/dev/null || npm run build

# ─── 5. تشغيل الـ Web Server ────────────────────────
echo ""
echo "🌐 [5/5] Starting web server on port 4000..."

# تثبيت static file server
npm install -g serve

# تشغيل الـ build output على port 4000
nohup serve -s dist -l 4000 > /var/log/draix-web.log 2>&1 &

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Dr. AIX Web UI is Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🌐 Web UI:    http://localhost:4000"
echo "  🤖 Hermes API: http://localhost:8000"
echo ""
echo "  The UI will connect to Hermes API automatically."
echo "═══════════════════════════════════════════════════"
