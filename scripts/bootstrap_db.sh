#!/bin/bash
# V.110: DB Bootstrap — بيـ restore الـ DB من mini + يـ crawl باقي الأدوات في background
# بيشتغل عند الـ startup على HF Space

set -e
cd /home/z/my-project

echo "[DB Bootstrap] Starting..."

# 1. لو الـ DB الكامل مش موجود، اعمله من mini
if [ ! -f "db/custom.db" ] || [ $(stat -c%s "db/custom.db" 2>/dev/null || echo 0) -lt 1000000 ]; then
    echo "[DB Bootstrap] Restoring from mini DB..."
    cp db/tools_mini.db db/custom.db
    echo "[DB Bootstrap] ✅ Restored mini DB ($(du -sh db/custom.db | cut -f1))"
fi

# 2. شغل الـ crawler في background عشان يكمل لـ 859K
if command -v python3 &> /dev/null; then
    echo "[DB Bootstrap] Starting background crawler..."
    nohup python3 scripts/ultra_pypi.py >> /tmp/crawler.log 2>&1 &
    echo "[DB Bootstrap] Crawler PID: $!"
fi

echo "[DB Bootstrap] Done — DB ready for use"
