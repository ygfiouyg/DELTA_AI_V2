#!/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Docker Entrypoint
# ═══════════════════════════════════════════════════
set -e

echo "🚀 Delta AI V2 — Starting..."

# ─── 1. Database setup ─────────────────────────────
echo "📦 [1/5] Setting up database..."

# Use persistent volume if available
if [ -f /app/data/custom.db ]; then
    echo "   ✅ Found persistent DB at /app/data/custom.db"
    cp /app/data/custom.db /app/db/custom.db
elif [ -n "$HF_TOKEN" ] && [ -n "$HF_DATASET_REPO" ]; then
    echo "   📥 Downloading DB from HF Dataset..."
    python3 -c "
import os
from huggingface_hub import hf_hub_download
import shutil
path = hf_hub_download(
    repo_id=os.environ['HF_DATASET_REPO'],
    filename='custom.db',
    repo_type='dataset',
    token=os.environ['HF_TOKEN'],
    local_dir='/tmp/hf_db'
)
shutil.copy(path, '/app/db/custom.db')
print(f'   ✅ DB downloaded: {os.path.getsize(\"/app/db/custom.db\")/1024/1024:.1f}MB')
" 2>/dev/null || echo "   ⚠️ Download failed — will use empty DB"
fi

# ─── 2. Run Prisma migrations ──────────────────────
echo "📦 [2/5] Running prisma db push..."
npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -3

# ─── 3. Setup admin user ───────────────────────────
echo "👤 [3/5] Setting up admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
(async () => {
    const db = new PrismaClient();
    const email = (process.env.ADMIN_EMAIL || 'admin@anzaro.local').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'admin123456';
    const existing = await db.user.findFirst({ where: { role: 'admin' } });
    if (existing) {
        console.log('   ✅ Admin exists:', existing.email);
    } else {
        const hash = await bcrypt.hash(password, 12);
        const u = await db.user.create({ data: { email, password: hash, name: 'Admin', role: 'admin', isVerified: true, isActive: true } });
        console.log('   ✅ Admin created:', u.email);
    }
    const guest = await db.user.findUnique({ where: { email: 'guest@anzaro.ai' } });
    if (!guest) {
        const g = await db.user.create({ data: { email: 'guest@anzaro.ai', name: 'زائر', isVerified: true, role: 'user' } });
        console.log('   ✅ Guest created:', g.id);
    }
    await db.\$disconnect();
})().catch(e => { console.error('   ⚠️ Setup failed:', e.message); process.exit(0); });
"

# ─── 4. Save DB to persistent volume ───────────────
echo "💾 [4/5] Saving DB to persistent volume..."
mkdir -p /app/data
cp /app/db/custom.db /app/data/custom.db 2>/dev/null || true

# ─── 5. Start Next.js ──────────────────────────────
echo "🌐 [5/5] Starting Next.js..."
if [ -f /app/.next/BUILD_ID ]; then
    echo "   ✅ Production build — using next start"
    exec npx next start -p 3000 -H 0.0.0.0
else
    echo "   ⚠️ No production build — using next dev"
    exec npx next dev --webpack -p 3000 -H 0.0.0.0
fi
