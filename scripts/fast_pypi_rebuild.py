#!/usr/bin/env python3
"""Fast PyPI rebuild — streaming version."""
import os, sys, json, sqlite3, time, gc, uuid, urllib.request
from datetime import datetime

DB_PATH = "/home/z/my-project/db/custom.db"

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)

AI_KW = {"ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","prompt","pytorch","tensorflow","scikit","xgboost"}
DATA_KW = {"data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","plot","chart","spark","dask","polars"}
MEDIA_KW = {"image","video","audio","music","tts","speech","voice","ocr","vision","pdf","ffmpeg","pillow","opencv","whisper"}
WEB_KW = {"scrape","crawl","spider","http","request","api","rest","graphql","beautifulsoup","selenium","playwright","fastapi","flask","django"}

def categorize(name):
    n = name.lower()
    for k in AI_KW:
        if k in n: return "ai"
    for k in DATA_KW:
        if k in n: return "data"
    for k in MEDIA_KW:
        if k in n: return "media"
    for k in WEB_KW:
        if k in n: return "web"
    return "utility"

def main():
    log("="*60)
    log("🚀 Fast PyPI Rebuild v2 — START")
    log("="*60)

    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("""CREATE TABLE IF NOT EXISTS ToolRegistry (
        id TEXT PRIMARY KEY,
        name TEXT,
        source TEXT,
        summary TEXT DEFAULT '',
        description TEXT DEFAULT '',
        category TEXT DEFAULT 'general',
        installCmd TEXT DEFAULT '',
        homepage TEXT DEFAULT '',
        repository TEXT DEFAULT '',
        keywords TEXT DEFAULT '',
        author TEXT DEFAULT '',
        license TEXT DEFAULT '',
        version TEXT DEFAULT '',
        stars INTEGER DEFAULT 0,
        isVerified INTEGER DEFAULT 0,
        isInstalled INTEGER DEFAULT 0,
        installPath TEXT DEFAULT '',
        importName TEXT DEFAULT '',
        usageExample TEXT DEFAULT '',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
    )""")
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_unique ON ToolRegistry(name, source)")
    conn.commit()

    log("🧹 Clearing old PyPI data...")
    conn.execute("DELETE FROM ToolRegistry WHERE source='pypi'")
    conn.commit()

    log("📥 Fetching PyPI simple index...")
    t0 = time.time()
    req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw = resp.read()
    log(f"✅ Fetched {len(raw)/1024/1024:.1f}MB in {time.time()-t0:.1f}s")

    data = json.loads(raw)
    projects = data.get("projects", [])
    log(f"📦 Total projects: {len(projects):,}")
    del raw
    gc.collect()

    cur = conn.cursor()
    BATCH = 5000
    inserted = 0
    batch = []
    sql = "INSERT OR IGNORE INTO ToolRegistry (id, name, source, category, installCmd, homepage, updatedAt) VALUES (?, ?, 'pypi', ?, ?, ?, datetime('now'))"

    t1 = time.time()
    for i, p in enumerate(projects):
        name = p.get("name","").strip()
        if not name or len(name) < 2: continue
        cat = categorize(name)
        batch.append((str(uuid.uuid4()), name, cat, f"pip install {name}", f"https://pypi.org/project/{name}/"))
        if len(batch) >= BATCH:
            cur.executemany(sql, batch)
            conn.commit()
            inserted += len(batch)
            batch = []
            if inserted % 50000 == 0:
                elapsed = time.time() - t1
                log(f"   Inserted {inserted:,} ({elapsed:.0f}s)")

    if batch:
        cur.executemany(sql, batch)
        conn.commit()
        inserted += len(batch)

    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    final_count = cur.fetchone()[0]
    log("="*60)
    log(f"✅ FINAL: {final_count:,} tools in DB")
    log(f"   DB size: {os.path.getsize(DB_PATH)/1024/1024:.1f}MB")
    log("🏁 DONE")

    conn.close()

if __name__ == "__main__":
    main()
