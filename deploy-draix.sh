#!/bin/bash
# ═══════════════════════════════════════════════════════════
# DrAix Agent — Force Deploy Script
# ═══════════════════════════════════════════════════════════
set -e

echo "🚀 DrAix Force Deploy"
echo "====================="

cd /opt/delta-ai

# 1. فرض سحب التحديثات (حتى لو git يقول up to date)
echo "📥 [1/4] Force pulling latest code..."
git fetch --all
git reset --hard origin/main
git pull origin main

# 2. مسح الـ Docker cache (مهم جداً!)
echo "🧹 [2/4] Clearing Docker cache..."
docker compose down
docker system prune -f
docker builder prune -f

# 3. إعادة البناء من الصفر (no cache)
echo "🏗️ [3/4] Building with --no-cache (this takes 10-15 min)..."
docker compose build --no-cache

# 4. التشغيل
echo "🚀 [4/4] Starting..."
docker compose up -d

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ DrAix deployed!"
echo "  🌐 https://anov.ddns.net/draix"
echo "═══════════════════════════════════════════════════"
