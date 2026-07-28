#!/usr/bin/env python3
"""
V.109b: Fast PyPI Completer — بيكمل الـ 859K بسرعة عالية.
يستخدم: temporary table + bulk INSERT ... SELECT WHERE NOT EXISTS
+ PRAGMA synchronous=OFF + transaction واحد كبير.
"""
import json, os, sys, sqlite3, urllib.request, time, gc, uuid
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/fast_pypi.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

def categorize(name):
    n = name.lower()
    if any(k in n for k in ["ai","ml","deep","neural","llm","gpt","transform","nlp","chatbot","embed","vector","openai","anthropic","langchain","agent","torch","tensorflow","scikit","sklearn","xgboost","huggingface","transformers","diffusers","whisper","speech","tts","ocr","vision","clip","bert","llama","mistral","gemini","claude"]): return "ai"
    if any(k in n for k in ["data","pandas","numpy","dataset","database","sql","etl","pipeline","analytic","plot","chart","dashboard","spark","polars","dbt"]): return "data"
    if any(k in n for k in ["image","video","audio","music","pdf","ffmpeg","pillow","opencv","subtitle","midi","mp3","wav","codec"]): return "media"
    if any(k in n for k in ["scrape","crawl","spider","http","request","api","rest","graphql","selenium","playwright","fastapi","flask","django","html","css","url"]): return "web"
    if any(k in n for k in ["test","lint","format","build","deploy","docker","kubernetes","git","compile","debug","profile","benchmark"]): return "dev"
    if any(k in n for k in ["science","physics","chemistry","biology","math","statistics","research","scipy","sympy","academic","scholar"]): return "science"
    return "utility"

def main():
    log("="*60)
    log("🚀 V.109b Fast PyPI Completer — START")
    log("="*60)

    # Step 1: Fetch all package names
    log("📥 Fetching PyPI simple index (859K names)...")
    req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    projects = data.get("projects", [])
    total = len(projects)
    log(f"✅ Got {total:,} package names")
    del data; gc.collect()

    # Step 2: Open DB with fast settings
    conn = sqlite3.connect(DB_PATH, timeout=120)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=OFF;")  # أسرع - مش بيـ fsync
    conn.execute("PRAGMA cache_size=-100000;")  # 100MB cache
    conn.execute("PRAGMA temp_store=MEMORY;")
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    existing = cur.fetchone()[0]
    log(f"📊 Existing PyPI tools in DB: {existing:,}")
    log(f"📊 Need to add: {total - existing:,}")

    # Step 3: Create temp table + bulk insert all names
    log("🏗️ Creating temporary table...")
    cur.execute("DROP TABLE IF EXISTS _temp_pypi;")
    cur.execute("""CREATE TABLE _temp_pypi (
        id TEXT, name TEXT, source TEXT, summary TEXT, category TEXT,
        installCmd TEXT, homepage TEXT, repository TEXT, keywords TEXT,
        author TEXT, license TEXT, version TEXT, isVerified INTEGER
    );""")
    conn.commit()

    log("📝 Bulk inserting to temp table (no indexes = fast)...")
    BATCH = 5000
    batch = []
    inserted = 0
    for i, p in enumerate(projects):
        name = p.get("name","").strip()
        if not name or len(name) < 2: continue
        batch.append((str(uuid.uuid4()), name, "pypi", "", categorize(name),
                      f"pip install {name}", f"https://pypi.org/project/{name}/",
                      "", "", "", "", "", 0))
        if len(batch) >= BATCH:
            cur.executemany("""INSERT INTO _temp_pypi
                (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", batch)
            inserted += len(batch)
            batch = []
            if (i+1) % 100000 == 0:
                log(f"   temp inserted {i+1:,}/{total:,}")
                conn.commit()
    if batch:
        cur.executemany("""INSERT INTO _temp_pypi
            (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", batch)
        inserted += len(batch)
    conn.commit()
    log(f"✅ Temp table has {inserted:,} rows")
    del projects, batch; gc.collect()

    # Step 4: INSERT INTO ToolRegistry SELECT FROM temp WHERE NOT EXISTS
    log("🔄 Merging temp → ToolRegistry (skipping existing)...")
    start = time.time()
    cur.execute("""INSERT OR IGNORE INTO ToolRegistry
        (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
        SELECT id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, datetime('now'), datetime('now')
        FROM _temp_pypi;""")
    conn.commit()
    elapsed = time.time() - start
    log(f"✅ Merge done in {elapsed:.1f}s")

    # Step 5: Cleanup
    cur.execute("DROP TABLE IF EXISTS _temp_pypi;")
    conn.commit()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    final = cur.fetchone()[0]
    log(f"📊 Final PyPI tools count: {final:,}")
    log("🏁 DONE")
    conn.close()

if __name__ == "__main__":
    main()
