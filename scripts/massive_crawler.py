#!/usr/bin/env python3
"""
V.108: Massive Tool & Skill Crawler
يجمّع metadata لأكبر عدد ممكن من الأدوات والـ skills من:
  1. PyPI simple index (600K+ package names في طلب واحد)
  2. npm registry search (آلاف packages بكلمات مفتاحية)
  3. GitHub awesome-lists (curated repos)
  4. GitHub API topic search (rate-limited لكن يضيف repos عالية الجودة)

المخرجات: يكتب مباشرة في SQLite عبر Prisma (table: ToolRegistry / SkillRegistry)
"""
import json, os, sys, time, sqlite3, re, urllib.request, urllib.error
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/crawler.log")
LOG.parent.mkdir(parents=True, exist_ok=True)

# ---------- Logging ----------
def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")

# ---------- DB helpers (raw SQLite for speed) ----------
def get_conn():
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
        usageExample TEXT DEFAULT '',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
    )""")
    conn.execute("""CREATE TABLE IF NOT EXISTS SkillRegistry (
        id TEXT PRIMARY KEY,
        name TEXT,
        source TEXT,
        summary TEXT DEFAULT '',
        description TEXT DEFAULT '',
        category TEXT DEFAULT 'general',
        skillType TEXT DEFAULT 'tool',
        installCmd TEXT DEFAULT '',
        repository TEXT DEFAULT '',
        keywords TEXT DEFAULT '',
        author TEXT DEFAULT '',
        usageExample TEXT DEFAULT '',
        stars INTEGER DEFAULT 0,
        isVerified INTEGER DEFAULT 0,
        isInstalled INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
    )""")
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_unique ON ToolRegistry(name, source)")
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_skill_unique ON SkillRegistry(name, source)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_tool_cat ON ToolRegistry(category)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_tool_installed ON ToolRegistry(isInstalled)")
    conn.commit()
    return conn

# ---------- Categorization ----------
AI_KEYWORDS = {"ai","ml","machine-learning","deep-learning","neural","llm","gpt","transformer",
    "nlp","natural-language","text-generation","chatbot","embedding","rag","vector",
    "openai","anthropic","claude","gemini","huggingface","langchain","llamaindex","autogen",
    "agent","autonomous","reasoning","prompt","fine-tune","fine-tuning","training","pytorch","tensorflow","keras","scikit","sklearn","xgboost","lightgbm"}
DATA_KEYWORDS = {"data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics",
    "visualization","plot","chart","dashboard","tableau","bi","warehouse","spark","dask","polars"}
MEDIA_KEYWORDS = {"image","video","audio","music","tts","speech","voice","ocr","vision","pdf",
    "image-processing","ffmpeg","pillow","opencv","whisper","subtitle","transcribe","midi","wav","mp3"}
WEB_KEYWORDS = {"scrape","crawl","spider","http","request","api","rest","graphql","web","url",
    "beautifulsoup","selenium","playwright","fastapi","flask","django","html","css"}
DEV_KEYWORDS = {"test","lint","format","build","deploy","ci","cd","docker","kubernetes","git",
    "code","compile","debug","profile","benchmark","package","dependency"}
SCIENCE_KEYWORDS = {"science","scientific","physics","chemistry","biology","math","statistics",
    "research","paper","academic","scholar","citation","latex","sympy","scipy"}

def categorize(name, summary, keywords):
    text = f"{name} {summary} {keywords}".lower()
    cats = []
    for k in AI_KEYWORDS:
        if k in text: cats.append("ai"); break
    for k in DATA_KEYWORDS:
        if k in text: cats.append("data"); break
    for k in MEDIA_KEYWORDS:
        if k in text: cats.append("media"); break
    for k in WEB_KEYWORDS:
        if k in text: cats.append("web"); break
    for k in DEV_KEYWORDS:
        if k in text: cats.append("dev"); break
    for k in SCIENCE_KEYWORDS:
        if k in text: cats.append("science"); break
    return cats[0] if cats else "utility"

# ---------- Bulk insert helper ----------
def bulk_insert_tools(conn, rows):
    """rows: list of dicts with keys: name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version"""
    cur = conn.cursor()
    sql = """INSERT OR IGNORE INTO ToolRegistry
        (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"""
    data = []
    for r in rows:
        import uuid
        data.append((str(uuid.uuid4()), r["name"], r["source"], r.get("summary",""),
                     r.get("category","utility"), r.get("installCmd",""), r.get("homepage",""),
                     r.get("repository",""), r.get("keywords",""), r.get("author",""),
                     r.get("license",""), r.get("version",""), 0))
    cur.executemany(sql, data)
    conn.commit()
    return cur.rowcount

def bulk_insert_skills(conn, rows):
    cur = conn.cursor()
    sql = """INSERT OR IGNORE INTO SkillRegistry
        (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"""
    data = []
    for r in rows:
        import uuid
        data.append((str(uuid.uuid4()), r["name"], r["source"], r.get("summary",""),
                     r.get("category","general"), r.get("skillType","tool"), r.get("installCmd",""),
                     r.get("repository",""), r.get("keywords",""), r.get("author",""),
                     r.get("usageExample",""), 0))
    cur.executemany(sql, data)
    conn.commit()
    return cur.rowcount

# ---------- Source 1: PyPI Simple Index (600K+ names) ----------
def crawl_pypi_names(conn, limit=None):
    """بيجيب كل أسماء packages من PyPI simple index (44MB، طلب واحد).
    Streaming insert — memory-safe (batch of 1000)."""
    log("🚀 [PyPI] Fetching simple index (44MB)...")
    try:
        req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        projects = data.get("projects", [])
        log(f"✅ [PyPI] Got {len(projects):,} package names")
        del data  # free memory
        import gc; gc.collect()

        cur = conn.cursor()
        BATCH = 1000
        inserted = 0
        batch_data = []
        import uuid
        for i, p in enumerate(projects):
            if limit and i >= limit: break
            name = p.get("name","").strip()
            if not name or len(name) < 2: continue
            # skip if already exists
            batch_data.append((str(uuid.uuid4()), name, "pypi", "",
                               categorize(name, "", ""), f"pip install {name}",
                               f"https://pypi.org/project/{name}/", "", "", "", "", "", 0))
            if len(batch_data) >= BATCH:
                cur.executemany("""INSERT OR IGNORE INTO ToolRegistry
                    (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch_data)
                conn.commit()
                inserted += len(batch_data)
                batch_data = []
                if (i+1) % 50000 == 0:
                    log(f"   [PyPI] inserted {i+1:,}/{len(projects):,}...")
                    gc.collect()
        if batch_data:
            cur.executemany("""INSERT OR IGNORE INTO ToolRegistry
                (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch_data)
            conn.commit()
            inserted += len(batch_data)
        log(f"✅ [PyPI] Done — {inserted:,} packages inserted")
        del projects
        gc.collect()
        return inserted
    except Exception as e:
        log(f"❌ [PyPI] Error: {e}")
        import traceback; log(traceback.format_exc()[-500:])
        return 0

# ---------- Source 2: PyPI JSON API (metadata for top packages) ----------
def fetch_pypi_meta(name):
    """بيجيب metadata لحزمة واحدة من PyPI JSON API."""
    try:
        url = f"https://pypi.org/pypi/{name}/json"
        with urllib.request.urlopen(url, timeout=10) as resp:
            d = json.loads(resp.read().decode("utf-8"))
        info = d.get("info", {})
        return {
            "name": name,
            "summary": (info.get("summary") or "")[:300],
            "description": (info.get("description") or "")[:500],
            "keywords": ",".join((info.get("keywords") or "").split(",")[:10]) if info.get("keywords") else "",
            "author": (info.get("author") or "")[:100],
            "license": (info.get("license") or "")[:50],
            "version": (info.get("version") or "")[:30],
            "homepage": (info.get("home_page") or "")[:200],
            "repository": (info.get("project_urls") or {}).get("Source", "")[:200] if info.get("project_urls") else "",
        }
    except: return None

def enrich_pypi_top(conn, top_n=2000):
    """بيجيب metadata للـ top N packages (الأكثر شعبية) من PyPI."""
    log(f"🔍 [PyPI-Top] Enriching top {top_n} packages with metadata...")
    try:
        # استخدم BigQuery-style stats API (غير متاح), بدلاً منه نستخدم npm-style: نختار packages بالاسم
        # بدلاً من ذلك، نستخدم قائمة curated من packages معروفة + random sampling
        import urllib.request
        # PyPI stats: https://pypi-stats.org/api/packages/ (غير رسمي)
        # الحل: نستخدم XMLRPC لـ list_packages + نـ fetch JSON لأكثر packages شعبية من قائمتنا
        known_popular = [
            "requests","numpy","pandas","matplotlib","scipy","scikit-learn","tensorflow","torch",
            "keras","transformers","langchain","openai","anthropic","tiktoken","pillow","opencv-python",
            "beautifulsoup4","selenium","playwright","fastapi","flask","django","pydantic","sqlalchemy",
            "pytest","black","ruff","mypy","celery","redis","pymongo","psycopg2","sqlmodel","tortoise-orm",
            "httpx","aiohttp","websockets","pyjwt","cryptography","passlib","bcrypt","python-jose",
            "yt-dlp","pytube","moviepy","imageio","pydub","librosa","soundfile","speechrecognition",
            "pytesseract","easyocr","pdfplumber","pypdf2","python-docx","python-pptx","openpyxl",
            "reportlab","fpdf2","weasyprint","markdown","jinja2","rich","click","typer","tqdm",
            "spacy","nltk","gensim","wordcloud","textblob","vaderSentiment","textstat","language-tool-python",
            "diffusers","accelerate","datasets","tokenizers","sentence-transformers","peft","trl","bitsandbytes",
            "llama-index","llama-cpp-python","chromadb","pinecone-client","weaviate-client","qdrant-client",
            "faiss-cpu","milvus","pymilvus","redis-vector","pgvector","annoy","hnswlib","sklearn",
            "xgboost","lightgbm","catboost","statsmodels","prophet","pmdarima","arch","pingouin",
            "plotly","seaborn","bokeh","altair","holoviews","datashader","pyvista","mayavi","vispy",
            "networkx","igraph","graph-tool","pyvis","d3graph","scrapy","parsel","lxml","xmltodict",
            "pyyaml","toml","configparser","dotenv","hydra","omegaconf","click-params","rich-click",
            "asyncio","trio","anyio","uvloop","httptools","uvicorn","gunicorn","hypercorn","daphne",
            "grpcio","protobuf","thrift","avro","msgpack","orjson","ujson","rapidjson","pyarrow","polars",
            "dask","ray","modin","vaex","vaex-core","datatable","pyspark","fugue","ibis-framework",
            "dbt-core","airflow","prefect","dagster","kubeflow","mlflow","wandb","neptune-client","tensorboard",
            "pytorch-lightning","pytorch-ignite","catalyst","accelerate","deepspeed","megatron-lm","vllm",
            "text-generation-inference","tgi","ollama","llamafile","ctransformers","auto-gptq","autoawq",
            "optimum","onnxruntime","onnx","tensorflow-serving","tflite-runtime","coremltools","torchscript",
        ]
        # أضف packages من DB لو موجودة
        cur = conn.cursor()
        cur.execute("SELECT name FROM ToolRegistry WHERE source='pypi' LIMIT ?", (top_n,))
        db_names = [r[0] for r in cur.fetchall()]
        # ادمج
        all_names = list(set(known_popular + db_names))[:top_n]
        log(f"   [PyPI-Top] Fetching metadata for {len(all_names)} packages (parallel)...")
        enriched = 0
        with ThreadPoolExecutor(max_workers=20) as pool:
            futures = {pool.submit(fetch_pypi_meta, n): n for n in all_names}
            rows_batch = []
            done = 0
            for fut in as_completed(futures):
                done += 1
                meta = fut.result()
                if meta:
                    cat = categorize(meta["name"], meta["summary"], meta["keywords"])
                    rows_batch.append({
                        "name": meta["name"], "source": "pypi",
                        "summary": meta["summary"], "category": cat,
                        "installCmd": f"pip install {meta['name']}",
                        "homepage": meta["homepage"], "repository": meta["repository"],
                        "keywords": meta["keywords"], "author": meta["author"],
                        "license": meta["license"], "version": meta["version"]
                    })
                    enriched += 1
                if len(rows_batch) >= 200:
                    # UPDATE existing rows with metadata
                    _update_tool_meta(conn, rows_batch)
                    rows_batch = []
                if done % 200 == 0: log(f"   [PyPI-Top] {done}/{len(all_names)} processed, {enriched} enriched")
            if rows_batch: _update_tool_meta(conn, rows_batch)
        log(f"✅ [PyPI-Top] Enriched {enriched} packages with full metadata")
        return enriched
    except Exception as e:
        log(f"❌ [PyPI-Top] Error: {e}")
        return 0

def _update_tool_meta(conn, rows):
    """بيـ update الـ rows الموجودة بـ metadata."""
    cur = conn.cursor()
    for r in rows:
        cur.execute("""UPDATE ToolRegistry SET
            summary=?, category=?, homepage=?, repository=?, keywords=?,
            author=?, license=?, version=?, isVerified=1, updatedAt=datetime('now')
            WHERE name=? AND source='pypi'""",
            (r["summary"], r["category"], r["homepage"], r["repository"],
             r["keywords"], r["author"], r["license"], r["version"], r["name"]))
        if cur.rowcount == 0:
            # insert لو مش موجود
            import uuid
            cur.execute("""INSERT OR IGNORE INTO ToolRegistry
                (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                VALUES (?, ?, 'pypi', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))""",
                (str(uuid.uuid4()), r["name"], r["summary"], r["category"],
                 r["installCmd"], r["homepage"], r["repository"], r["keywords"],
                 r["author"], r["license"], r["version"]))
    conn.commit()

# ---------- Source 3: npm registry search ----------
def crawl_npm(conn, max_packages=30000):
    """بيجلب packages من npm registry search بكلمات مفتاحية متنوعة."""
    log(f"🚀 [npm] Searching registry for AI/tool packages...")
    keywords = ["ai","ml","machine-learning","llm","gpt","chatbot","agent","automation",
        "scraper","crawler","parser","converter","generator","cli","tool","util","helper",
        "data","analytics","visualization","chart","image","video","audio","pdf","ocr",
        "nlp","text","language","translation","transcribe","tts","speech","voice",
        "vision","opencv","canvas","render","3d","webgl","game","physics","math",
        "database","orm","sql","nosql","redis","mongo","postgres","sqlite",
        "api","rest","graphql","websocket","grpc","server","client","sdk","wrapper",
        "test","lint","format","build","deploy","devops","docker","kubernetes",
        "react","vue","angular","svelte","next","nuxt","gatsby","astro","remix",
        "tailwind","bootstrap","material","ui","component","design","theme",
        "crypto","blockchain","web3","ethereum","solana","nft","defi","wallet",
        "security","auth","jwt","oauth","encryption","hash","cypher","password"]
    total = 0
    for kw in keywords:
        offset = 0
        while offset < 10000:
            try:
                url = f"https://registry.npmjs.org/-/v1/search?text=keywords:{kw}&size=250&from={offset}"
                with urllib.request.urlopen(url, timeout=15) as resp:
                    d = json.loads(resp.read().decode("utf-8"))
                objs = d.get("objects", [])
                if not objs: break
                rows = []
                for o in objs:
                    p = o.get("package", {})
                    name = p.get("name","").strip()
                    if not name or len(name) < 2: continue
                    desc = (p.get("description") or "")[:300]
                    kws = ",".join((p.get("keywords") or [])[:10])
                    cat = categorize(name, desc, kws)
                    rows.append({
                        "name": name, "source": "npm",
                        "summary": desc, "category": cat,
                        "installCmd": f"npm install {name}",
                        "homepage": (p.get("links") or {}).get("npm",""),
                        "repository": (p.get("links") or {}).get("repository",""),
                        "keywords": kws, "author": (p.get("publisher") or {}).get("username",""),
                        "license": (p.get("license") or "")[:50], "version": (p.get("version") or "")[:30]
                    })
                if rows:
                    bulk_insert_tools(conn, rows)
                    total += len(rows)
                offset += 250
                if total % 5000 < 250: log(f"   [npm] keyword='{kw}' total so far: {total:,}")
                time.sleep(0.3)  # احترام rate limit
                if total >= max_packages:
                    log(f"✅ [npm] Reached max {max_packages}")
                    return total
            except Exception as e:
                log(f"   [npm] keyword='{kw}' offset={offset} error: {e}")
                time.sleep(2)
                break
    log(f"✅ [npm] Done — {total:,} packages added")
    return total

# ---------- Source 4: GitHub awesome-lists ----------
def crawl_awesome_lists(conn):
    """بيـ parse awesome-lists من GitHub raw content."""
    log("🚀 [Awesome] Parsing curated awesome-lists...")
    lists = [
        ("https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md", "general"),
        ("https://raw.githubusercontent.com/vinta/awesome-python/main/readme.md", "python"),
        ("https://raw.githubusercontent.com/marksweiss/awesome-elixir/master/README.md", "elixir"),
        ("https://raw.githubusercontent.com/avelino/awesome-go/main/README.md", "go"),
        ("https://raw.githubusercontent.com/ziadoz/awesome-php/master/README.md", "php"),
        ("https://raw.githubusercontent.com/akullpp/awesome-java/master/README.md", "java"),
        ("https://raw.githubusercontent.com/enjektor/awesome-haskell/master/README.md", "haskell"),
        ("https://raw.githubusercontent.com/rust-unofficial/awesome-rust/main/README.md", "rust"),
        ("https://raw.githubusercontent.com/sorrycc/awesome-javascript/master/README.md", "javascript"),
        ("https://raw.githubusercontent.com/victorlauren/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/Hannibal046/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/Shubhamsaboo/awesome-llm-apps/main/README.md", "llm-apps"),
        ("https://raw.githubusercontent.com/microsoft/ai-agents-for-beginners/main/README.md", "ai-agents"),
        ("https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md", "ai-agents"),
        ("https://raw.githubusercontent.com/kyrolabs/awesome-agents/main/README.md", "agents"),
        ("https://raw.githubusercontent.com/jtmuller5/The-Hustle-GPT-Repository/main/README.md", "gpt"),
    ]
    total = 0
    for url, cat in lists:
        try:
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                content = resp.read().decode("utf-8", errors="ignore")
            rows = []
            # pattern: - [Name](url) - description
            for m in re.finditer(r'-\s*\[([^\]]+)\]\((https?://[^\)]+)\)\s*-?\s*(.*)', content):
                name = m.group(1).strip()
                link = m.group(2).strip()
                desc = m.group(3).strip()[:300]
                if "github.com" not in link: continue
                if len(name) < 2 or len(name) > 100: continue
                # استخرج repo name من الـ URL
                repo_match = re.search(r'github\.com/([^/]+/[^/]+)', link)
                repo_name = repo_match.group(1) if repo_match else name
                rows.append({
                    "name": name, "source": "github",
                    "summary": desc, "category": categorize(name, desc, cat),
                    "installCmd": f"git clone {link}",
                    "homepage": link, "repository": link,
                    "keywords": cat, "author": "", "license": "", "version": ""
                })
            if rows:
                bulk_insert_tools(conn, rows)
                total += len(rows)
                log(f"   [Awesome] {cat}: +{len(rows)} (total: {total:,})")
        except Exception as e:
            log(f"   [Awesome] {cat} error: {e}")
    log(f"✅ [Awesome] Done — {total:,} repos added")
    return total

# ---------- Source 5: GitHub API topic search (rate-limited) ----------
def crawl_github_topics(conn, max_per_topic=50):
    """بيـ search GitHub repos by topic (rate-limited: 60/hour unauthenticated)."""
    log("🚀 [GitHub] Searching repos by topic (rate-limited)...")
    topics = ["machine-learning","ai","llm","chatbot","nlp","computer-vision",
              "automation","scraper","cli","developer-tools","data-analysis",
              "text-to-speech","speech-recognition","ocr","pdf","automation"]
    total = 0
    try:
        # check rate limit first
        with urllib.request.urlopen("https://api.github.com/rate_limit", timeout=10) as resp:
            rl = json.loads(resp.read().decode("utf-8"))
        remaining = rl["rate"]["remaining"]
        log(f"   [GitHub] Rate limit remaining: {remaining}")
        if remaining < 10:
            log("   [GitHub] Rate limit too low, skipping")
            return 0
        max_calls = min(remaining - 5, len(topics))
        for topic in topics[:max_calls]:
            try:
                url = f"https://api.github.com/search/repositories?q=topic:{topic}&sort=stars&per_page={max_per_topic}"
                req = urllib.request.Request(url, headers={"Accept":"application/vnd.github.v3+json","User-Agent":"AnzaroAI/1.0"})
                with urllib.request.urlopen(req, timeout=15) as resp:
                    d = json.loads(resp.read().decode("utf-8"))
                rows = []
                for repo in d.get("items", []):
                    name = repo.get("name","")
                    full = repo.get("full_name","")
                    desc = (repo.get("description") or "")[:300]
                    stars = repo.get("stargazers_count", 0)
                    topics_str = ",".join(repo.get("topics", [])[:10])
                    rows.append({
                        "name": name, "source": "github",
                        "summary": desc, "category": categorize(name, desc, topics_str),
                        "installCmd": f"git clone https://github.com/{full}.git",
                        "homepage": repo.get("html_url",""),
                        "repository": repo.get("html_url",""),
                        "keywords": topics_str, "author": (repo.get("owner") or {}).get("login",""),
                        "license": ((repo.get("license") or {}).get("spdx_id") or "")[:50],
                        "version": str(stars)
                    })
                if rows:
                    # استخدم update لو موجود، insert لو لأ
                    _upsert_tools(conn, rows, stars_field=True)
                    total += len(rows)
                time.sleep(1)
            except Exception as e:
                log(f"   [GitHub] topic='{topic}' error: {e}")
                break
    except Exception as e:
        log(f"❌ [GitHub] Error: {e}")
    log(f"✅ [GitHub] Done — {total:,} repos added")
    return total

def _upsert_tools(conn, rows, stars_field=False):
    cur = conn.cursor()
    for r in rows:
        import uuid
        stars = int(r.get("version","0")) if stars_field else r.get("stars",0)
        cur.execute("""INSERT OR IGNORE INTO ToolRegistry
            (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, stars, isVerified, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))""",
            (str(uuid.uuid4()), r["name"], r["source"], r["summary"], r["category"],
             r["installCmd"], r["homepage"], r["repository"], r["keywords"],
             r["author"], r["license"], r["version"], stars))
        # update لو موجود
        cur.execute("""UPDATE ToolRegistry SET
            summary=?, category=?, installCmd=?, homepage=?, repository=?, keywords=?,
            author=?, license=?, version=?, stars=?, isVerified=1, updatedAt=datetime('now')
            WHERE name=? AND source=?""",
            (r["summary"], r["category"], r["installCmd"], r["homepage"], r["repository"],
             r["keywords"], r["author"], r["license"], r["version"], stars, r["name"], r["source"]))
    conn.commit()

# ---------- Source 6: Skills from local /skills/ dir ----------
def crawl_local_skills(conn):
    """بيـ register كل skill محلي في /skills/ كـ SkillRegistry."""
    log("🚀 [Local-Skills] Registering local skills...")
    skills_dir = Path("/home/z/my-project/skills")
    if not skills_dir.exists():
        log("   [Local-Skills] No skills dir")
        return 0
    rows = []
    for d in sorted(skills_dir.iterdir()):
        if not d.is_dir(): continue
        skill_md = d / "SKILL.md"
        desc = ""
        if skill_md.exists():
            try:
                content = skill_md.read_text(encoding="utf-8", errors="ignore")[:2000]
                # استخرج أول وصف من الـ markdown
                for line in content.split("\n"):
                    line = line.strip()
                    if line and not line.startswith("#") and not line.startswith("-"):
                        desc = line[:300]; break
            except: pass
        rows.append({
            "name": d.name, "source": "local",
            "summary": desc, "category": categorize(d.name, desc, ""),
            "skillType": "tool", "installCmd": "",
            "repository": "", "keywords": d.name,
            "author": "Anzaro", "usageExample": f"use skill: {d.name}"
        })
    if rows: bulk_insert_skills(conn, rows)
    log(f"✅ [Local-Skills] {len(rows)} skills registered")
    return len(rows)

# ---------- Stats ----------
def print_stats(conn):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry")
    tools = cur.fetchone()[0]
    cur.execute("SELECT source, COUNT(*) FROM ToolRegistry GROUP BY source")
    by_source = cur.fetchall()
    cur.execute("SELECT category, COUNT(*) FROM ToolRegistry GROUP BY category ORDER BY COUNT(*) DESC LIMIT 10")
    by_cat = cur.fetchall()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isVerified=1")
    verified = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM SkillRegistry")
    skills = cur.fetchone()[0]
    log("="*60)
    log(f"📊 TOTAL TOOLS: {tools:,} (verified: {verified:,})")
    log(f"📊 TOTAL SKILLS: {skills:,}")
    log("By source:")
    for s, c in by_source: log(f"   {s}: {c:,}")
    log("Top categories:")
    for c, n in by_cat: log(f"   {c}: {n:,}")
    log("="*60)

# ---------- Main ----------
def main():
    log("="*60)
    log("🚀 V.108 Massive Crawler — START")
    log("="*60)
    conn = get_conn()

    # Phase 1: PyPI bulk names (fastest path to 100K+) — MOST IMPORTANT
    n1 = crawl_pypi_names(conn)

    # Phase 2: Local skills (fast, low memory)
    n6 = crawl_local_skills(conn)

    # Phase 3: GitHub awesome-lists (curated quality, low memory)
    n3 = crawl_awesome_lists(conn)

    # Phase 4: npm registry search (thousands more, moderate memory)
    n2 = crawl_npm(conn, max_packages=15000)

    # Phase 5: GitHub topics (rate-limited but high quality)
    n4 = crawl_github_topics(conn)

    # NOTE: PyPI metadata enrichment skipped in main run (memory-heavy, run separately)
    # To enrich top packages: python3 scripts/massive_crawler.py --enrich

    print_stats(conn)
    log("🏁 V.108 Massive Crawler — DONE")
    conn.close()

if __name__ == "__main__":
    if "--enrich" in sys.argv:
        conn = get_conn()
        log("="*60)
        log("🔍 PyPI Metadata Enrichment Mode")
        log("="*60)
        enrich_pypi_top(conn, top_n=500)
        print_stats(conn)
        conn.close()
    else:
        main()
