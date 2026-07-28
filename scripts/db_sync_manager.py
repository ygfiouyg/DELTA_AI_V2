#!/usr/bin/env python3
"""
V.115: DB Sync Manager — بيـ sync الـ DB مع HF Dataset.
- عند الـ startup: download الـ DB قبل ما الـ Next.js يبدأ (blocking)
- كل تعديل: upload للـ DB لـ HF Dataset (auto-sync)
"""
import os, sys, sqlite3, shutil, time, threading, subprocess
from pathlib import Path

DB_PATH = os.environ.get("DB_PATH", "/home/z/my-project/db/custom.db")
HF_TOKEN = os.environ.get("HF_TOKEN", "")
DATASET_REPO = "kopabdo/anzaro-tools-db"
SYNC_INTERVAL = 300  # 5 minutes
LOG_FILE = "/home/z/my-project/exports/db_sync.log"

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    Path(LOG_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f: f.write(line + "\n")

def db_has_data():
    if not os.path.exists(DB_PATH):
        return False
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        count = cur.fetchone()[0]
        conn.close()
        return count > 1000
    except:
        return False

def download_db():
    """بيـ download الـ DB من HF Dataset (blocking — لازم يخلص قبل الـ Next.js)."""
    log("📥 Downloading DB from HF Dataset (blocking)...")
    try:
        from huggingface_hub import hf_hub_download
        kwargs = {"repo_id": DATASET_REPO, "filename": "custom.db", "repo_type": "dataset", "local_dir": "/tmp/hf_db_sync"}
        if HF_TOKEN:
            kwargs["token"] = HF_TOKEN
        path = hf_hub_download(**kwargs)
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        shutil.copy(path, DB_PATH)
        size_mb = os.path.getsize(DB_PATH) / 1024 / 1024
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        tools = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM SkillRegistry")
        skills = cur.fetchone()[0]
        conn.close()
        log(f"✅ DB downloaded ({size_mb:.1f}MB) | Tools: {tools:,} | Skills: {skills:,}")
        return True
    except Exception as e:
        log(f"❌ Download failed: {e}")
        return False

def upload_db():
    """بيـ upload الـ DB لـ HF Dataset."""
    if not os.path.exists(DB_PATH):
        return False
    try:
        from huggingface_hub import HfApi
        api = HfApi(token=HF_TOKEN) if HF_TOKEN else HfApi()
        api.upload_file(
            path_or_fileobj=DB_PATH,
            path_in_repo="custom.db",
            repo_id=DATASET_REPO,
            repo_type="dataset",
        )
        log("✅ DB uploaded to HF Dataset")
        return True
    except Exception as e:
        log(f"⚠️ Upload failed: {e}")
        return False

def sync_loop():
    """بيـ upload الـ DB كل 5 دقايق في background."""
    log("🔄 Starting sync loop (every 5 min)...")
    while True:
        time.sleep(SYNC_INTERVAL)
        if db_has_data():
            upload_db()

def main():
    log("=" * 50)
    log("🚀 V.115 DB Sync Manager — START")
    log("=" * 50)

    # blocking download
    if not db_has_data():
        download_db()
    else:
        log("✅ DB already has data")
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        log(f"   Tools: {cur.fetchone()[0]:,}")
        conn.close()

    # start sync loop in background
    sync_thread = threading.Thread(target=sync_loop, daemon=True)
    sync_thread.start()
    log("🔄 Sync loop started in background")

    log("🏁 DB Sync Manager — DONE (DB ready for Next.js)")

if __name__ == "__main__":
    main()
