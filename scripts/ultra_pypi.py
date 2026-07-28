#!/usr/bin/env python3
"""
V.109d: Ultra-Fast PyPI Completer — يستخدم executescript مع multiple VALUES
أسرع 10x من executemany.
"""
import json, os, sys, sqlite3, urllib.request, time, gc, uuid, re
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/ultra_pypi.log")

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

def sql_escape(s):
    """بيـ escape single quotes للـ SQL."""
    return s.replace("'", "''")

def main():
    log("="*60)
    log("🚀 V.109d Ultra-Fast PyPI Completer — START")
    log("="*60)

    # Step 1: Fetch
    log("📥 Fetching PyPI simple index...")
    req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    projects = data.get("projects", [])
    total = len(projects)
    log(f"✅ Got {total:,} package names")
    del data; gc.collect()

    # Step 2: Open DB
    conn = sqlite3.connect(DB_PATH, timeout=120)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=OFF;")
    conn.execute("PRAGMA cache_size=-100000;")
    conn.execute("PRAGMA temp_store=MEMORY;")
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    existing = cur.fetchone()[0]
    log(f"📊 Existing: {existing:,} | Need to add: {total - existing:,}")

    # Step 3: Bulk insert directly to ToolRegistry using executescript
    # each statement: INSERT OR IGNORE INTO ToolRegistry VALUES (...), (...), ...;
    log("⚡ Bulk inserting with executescript (500 rows per statement)...")
    BATCH = 500
    start = time.time()
    processed = 0

    for i in range(0, len(projects), BATCH):
        batch = projects[i:i+BATCH]
        values_parts = []
        for p in batch:
            name = p.get("name","").strip()
            if not name or len(name) < 2: continue
            uid = str(uuid.uuid4())
            cat = categorize(name)
            n = sql_escape(name)
            hp = f"https://pypi.org/project/{name}/"
            install = f"pip install {name}"
            values_parts.append(f"('{uid}','{n}','pypi','','{cat}','{sql_escape(install)}','{hp}','','','','','',0,datetime('now'),datetime('now'))")

        if not values_parts: continue
        sql = "INSERT OR IGNORE INTO ToolRegistry (id,name,source,summary,category,installCmd,homepage,repository,keywords,author,license,version,isVerified,createdAt,updatedAt) VALUES " + ",".join(values_parts) + ";"
        cur.executescript(sql)
        processed += len(values_parts)
        if (i + BATCH) % 50000 == 0:
            conn.commit()
            elapsed = time.time() - start
            rate = processed / elapsed if elapsed > 0 else 0
            log(f"   processed {i+BATCH:,}/{total:,} ({rate:.0f}/s)")
            gc.collect()

    conn.commit()
    elapsed = time.time() - start
    log(f"✅ Insert done in {elapsed:.1f}s ({processed/elapsed:.0f}/s)" if elapsed > 0 else f"✅ Insert done")

    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    final = cur.fetchone()[0]
    log(f"📊 Final PyPI tools: {final:,}")
    log("🏁 DONE")
    conn.close()

if __name__ == "__main__":
    main()
