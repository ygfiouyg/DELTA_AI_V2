#!/usr/bin/env python3
"""
V.112: DB Restore Script — بيـ restore الـ DB من HF Dataset عند الـ startup.
"""
import os, sys, sqlite3, shutil, time
from pathlib import Path

DB_PATH = os.environ.get("DB_PATH", "/home/z/my-project/db/custom.db")
HF_TOKEN = os.environ.get("HF_TOKEN", "")
DATASET_REPO = "kopabdo/anzaro-tools-db"
MIN_TOOLS = 1000
LOG_FILE = "/home/z/my-project/exports/db_restore.log"

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
        return count > MIN_TOOLS
    except Exception as e:
        log(f"DB check error: {e}")
        return False

def restore_from_hf():
    log("📥 Restoring DB from HF Dataset...")
    try:
        from huggingface_hub import hf_hub_download
        kwargs = {"repo_id": DATASET_REPO, "filename": "custom.db", "repo_type": "dataset", "local_dir": "/tmp/hf_db_restore"}
        if HF_TOKEN:
            kwargs["token"] = HF_TOKEN
        path = hf_hub_download(**kwargs)
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        shutil.copy(path, DB_PATH)
        size_mb = os.path.getsize(DB_PATH) / 1024 / 1024
        log(f"✅ Restored DB ({size_mb:.1f}MB)")
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        tools = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM SkillRegistry")
        skills = cur.fetchone()[0]
        conn.close()
        log(f"   Tools: {tools:,} | Skills: {skills:,}")
        return True
    except Exception as e:
        log(f"❌ Restore failed: {e}")
        return False

def main():
    log("=" * 50)
    log("🚀 V.112 DB Restore — START")
    log("=" * 50)
    if db_has_data():
        log("✅ DB already has data — no restore needed")
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        log(f"   Tools: {cur.fetchone()[0]:,}")
        conn.close()
        return
    log("⚠️ DB is empty — restoring from HF...")
    restore_from_hf()

if __name__ == "__main__":
    main()
