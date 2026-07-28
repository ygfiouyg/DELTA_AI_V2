#!/usr/bin/env python3
"""
V.109: Complete PyPI Crawler — يكمل لحد 859K package
+ Skill Crawler — يجمع 90K+ skill من npm + GitHub + PyPI

Memory-safe: streaming + batch insert + gc.collect()
"""
import json, os, sys, sqlite3, urllib.request, time, gc, re, uuid
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/crawler_v109.log")
LOG.parent.mkdir(parents=True, exist_ok=True)

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

def categorize(name, summary, keywords):
    text = f"{name} {summary} {keywords}".lower()
    AI = ["ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","pytorch","tensorflow","scikit","sklearn","xgboost","huggingface","transformers","diffusers","whisper","speech","tts","ocr","vision","clip","bert","gpt","llama","mistral","gemini","claude"]
    DATA = ["data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","visualization","plot","chart","dashboard","spark","polars","dbt"]
    MEDIA = ["image","video","audio","music","pdf","ffmpeg","pillow","opencv","subtitle","midi","mp3","wav","flac","codec"]
    WEB = ["scrape","crawl","spider","http","request","api","rest","graphql","selenium","playwright","fastapi","flask","django","html","css","url"]
    DEV = ["test","lint","format","build","deploy","docker","kubernetes","git","compile","debug","profile","benchmark"]
    SCIENCE = ["science","physics","chemistry","biology","math","statistics","research","scipy","sympy","academic","scholar"]
    for k in AI:
        if k in text: return "ai"
    for k in DATA:
        if k in text: return "data"
    for k in MEDIA:
        if k in text: return "media"
    for k in WEB:
        if k in text: return "web"
    for k in DEV:
        if k in text: return "dev"
    for k in SCIENCE:
        if k in text: return "science"
    return "utility"

def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    return conn

# ─────────────────────────────────────────────────────────
# PHASE 1: Complete PyPI — كل الـ 859K package
# ─────────────────────────────────────────────────────────
def complete_pypi(conn):
    """بيكمل تسجيل كل أسماء PyPI packages (859K)."""
    log("🚀 [PyPI-Complete] Fetching simple index...")
    try:
        req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        projects = data.get("projects", [])
        total_available = len(projects)
        log(f"✅ [PyPI] Got {total_available:,} package names from simple index")
        del data; gc.collect()

        # شوف اللي موجود بالفعل
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
        existing = cur.fetchone()[0]
        log(f"   [PyPI] Already in DB: {existing:,} — need to add: {total_available - existing:,}")

        cur = conn.cursor()
        BATCH = 500
        inserted = 0
        batch_data = []
        skipped = 0

        for i, p in enumerate(projects):
            name = p.get("name","").strip()
            if not name or len(name) < 2:
                skipped += 1
                continue
            batch_data.append((str(uuid.uuid4()), name, "pypi", "",
                               categorize(name, "", ""), f"pip install {name}",
                               f"https://pypi.org/project/{name}/", "", "", "", "", "", 0))
            if len(batch_data) >= BATCH:
                cur.executemany("""INSERT OR IGNORE INTO ToolRegistry
                    (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch_data)
                conn.commit()
                inserted += cur.rowcount if cur.rowcount > 0 else len(batch_data)
                batch_data = []
                if (i+1) % 50000 == 0:
                    log(f"   [PyPI] processed {i+1:,}/{total_available:,} (skipped: {skipped})")
                    gc.collect()
        if batch_data:
            cur.executemany("""INSERT OR IGNORE INTO ToolRegistry
                (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch_data)
            conn.commit()
            inserted += len(batch_data)

        cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
        final = cur.fetchone()[0]
        log(f"✅ [PyPI-Complete] Done — DB now has {final:,} PyPI packages (target was {total_available:,})")
        del projects; gc.collect()
        return final
    except Exception as e:
        log(f"❌ [PyPI-Complete] Error: {e}")
        import traceback; log(traceback.format_exc()[-500:])
        return 0

# ─────────────────────────────────────────────────────────
# PHASE 2: Skill Crawler — 90K+ skills
# ─────────────────────────────────────────────────────────
def crawl_npm_as_skills(conn, target=50000):
    """بيجمع npm packages ويسجلهم كـ skills."""
    log(f"🚀 [npm-Skills] Collecting {target:,} npm packages as skills...")
    cur = conn.cursor()
    keywords = ["ai","ml","llm","gpt","chatbot","agent","automation","scraper","parser","converter",
        "generator","cli","tool","util","helper","data","analytics","visualization","chart",
        "image","video","audio","pdf","ocr","nlp","text","language","translation","transcribe",
        "tts","speech","voice","vision","canvas","render","3d","webgl","game","physics","math",
        "database","orm","sql","nosql","redis","mongo","postgres","sqlite","mysql","mariadb",
        "api","rest","graphql","websocket","grpc","server","client","sdk","wrapper","library",
        "test","lint","format","build","deploy","devops","docker","kubernetes","ci","cd",
        "react","vue","angular","svelte","next","nuxt","gatsby","astro","remix","solid",
        "tailwind","bootstrap","material","ui","component","design","theme","icon","font",
        "crypto","blockchain","web3","ethereum","solana","nft","defi","wallet","smart-contract",
        "security","auth","jwt","oauth","encryption","hash","password","2fa","captcha",
        "email","sms","notification","push","queue","worker","cron","scheduler","batch",
        "file","upload","download","storage","s3","azure","gcp","cloud","aws","firebase",
        "payment","stripe","paypal","subscription","billing","invoice","tax","accounting",
        "chat","messaging","discord","slack","telegram","whatsapp","messenger","irc",
        "map","geo","location","gis","geocode","route","distance","timezone","weather",
        "music","player","spotify","soundcloud","youtube","vimeo","twitch","stream",
        "image-processing","filter","effect","transform","resize","crop","compress",
        "pdf-generator","docx","xlsx","pptx","markdown","latex","report","document",
        "blog","cms","wordpress","drupal","joomla","ghost","strapi","contentful",
        "ecommerce","shop","cart","checkout","product","catalog","inventory","order",
        "forum","comment","review","rating","feedback","survey","poll","quiz",
        "search","index","elastic","solr","algolia","meilisearch","typesense",
        "cache","memory","session","cookie","token","state","store","persist",
        "logger","monitor","metric","trace","debug","profile","benchmark","performance",
        "i18n","locale","translate","language","arabic","english","french","spanish",
        "validation","schema","form","input","output","serialize","deserialize","parse",
        "config","env","secret","key","credential","vault","manager",
        "cli","command","terminal","shell","prompt","repl","console",
        "bot","crawler","spider","scraper","automation","rpa","selenium","playwright","puppeteer",
        "ml-model","inference","training","dataset","feature","pipeline","preprocessing",
        "vector","embedding","similarity","search","ann","faiss","hnsw","pq",
        "rag","retrieval","augmented","generation","context","memory","knowledge",
        "agent","autonomous","workflow","orchestration","multi-agent","swarm","crew",
        "prompt","template","chain","chain-of-thought","reasoning","planning",
        "fine-tune","lora","peft","quantization","distillation","pruning",
        "vision","ocr","detection","segmentation","classification","recognition","tracking",
        "speech","asr","stt","tts","voice","clone","synthesis","recognition",
        "translation","multilingual","language-detection","sentiment","ner","pos",
        "summarization","extraction","classification","generation","completion","chat",
        "embedding","reranker","ranker","scorer","matcher","dedup",
        "guardrail","safety","moderation","filter","blocklist","pii","redact",
        "observability","tracing","langfuse","langsmith","helicone","portkey",
        "gateway","router","loadbalancer","fallback","retry","cache","stream",
        "server","proxy","reverse","gateway","nginx","caddy","traefik","envoy"]
    total = 0
    for kw in keywords:
        if total >= target:
            log(f"✅ [npm-Skills] Reached target {target:,}")
            break
        offset = 0
        while offset < 5000 and total < target:
            try:
                url = f"https://registry.npmjs.org/-/v1/search?text=keywords:{kw}&size=250&from={offset}"
                with urllib.request.urlopen(url, timeout=15) as resp:
                    d = json.loads(resp.read().decode("utf-8"))
                objs = d.get("objects", [])
                if not objs: break
                batch = []
                for o in objs:
                    p = o.get("package", {})
                    name = p.get("name","").strip()
                    if not name or len(name) < 2: continue
                    desc = (p.get("description") or "")[:300]
                    kws = ",".join((p.get("keywords") or [])[:8])
                    batch.append((str(uuid.uuid4()), name, "npm", desc,
                        categorize(name, desc, kws), "tool",
                        f"npm install {name}",
                        (p.get("links") or {}).get("repository",""),
                        kws, (p.get("publisher") or {}).get("username",""),
                        f"npm package: {name}", 1))
                if batch:
                    cur.executemany("""INSERT OR IGNORE INTO SkillRegistry
                        (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch)
                    conn.commit()
                    total += len(batch)
                offset += 250
                if total % 5000 < 250: log(f"   [npm-Skills] kw='{kw}' total: {total:,}")
                time.sleep(0.25)
            except Exception as e:
                log(f"   [npm-Skills] kw='{kw}' err: {str(e)[:80]}")
                time.sleep(2)
                break
    log(f"✅ [npm-Skills] Done — {total:,} npm skills added")
    return total

def crawl_github_awesome_as_skills(conn, target=30000):
    """بيجمع GitHub repos من awesome-lists ويسجلهم كـ skills."""
    log(f"🚀 [GitHub-Skills] Parsing awesome-lists...")
    cur = conn.cursor()
    lists = [
        ("https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md", "general"),
        ("https://raw.githubusercontent.com/vinta/awesome-python/main/readme.md", "python"),
        ("https://raw.githubusercontent.com/avelino/awesome-go/main/README.md", "go"),
        ("https://raw.githubusercontent.com/ziadoz/awesome-php/master/README.md", "php"),
        ("https://raw.githubusercontent.com/akullpp/awesome-java/master/README.md", "java"),
        ("https://raw.githubusercontent.com/rust-unofficial/awesome-rust/main/README.md", "rust"),
        ("https://raw.githubusercontent.com/sorrycc/awesome-javascript/master/README.md", "javascript"),
        ("https://raw.githubusercontent.com/victorlauren/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md", "ai-agents"),
        ("https://raw.githubusercontent.com/kyrolabs/awesome-agents/main/README.md", "agents"),
        ("https://raw.githubusercontent.com/Shubhamsaboo/awesome-llm-apps/main/README.md", "llm-apps"),
        ("https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md", "ai-tools"),
        ("https://raw.githubusercontent.com/semperai/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/huggingface/transformers/main/README.md", "transformers"),
        ("https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md", "langchain"),
        ("https://raw.githubusercontent.com/lobehub/awesome-ai-agents/main/README.md", "ai-agents"),
        ("https://raw.githubusercontent.com/chaindead/awesome-ai-tools/main/README.md", "ai-tools"),
        ("https://raw.githubusercontent.com/steven2358/awesome-generative-ai/main/README.md", "gen-ai"),
        ("https://raw.githubusercontent.com/brylie/awesome-ai/main/README.md", "ai"),
        ("https://raw.githubusercontent.com/automation-stack/awesome-automation/main/README.md", "automation"),
        ("https://raw.githubusercontent.com/MichaelKrippel/awesome-automation/main/README.md", "automation"),
        ("https://raw.githubusercontent.com/automata/awesome-automata/main/README.md", "automata"),
        ("https://raw.githubusercontent.com/ossu/computer-science/main/README.md", "cs"),
        ("https://raw.githubusercontent.com/prakhar1989/awesome-courses/main/README.md", "courses"),
        ("https://raw.githubusercontent.com/josephmisiti/awesome-machine-learning/master/README.md", "ml"),
        ("https://raw.githubusercontent.com/ChristosChristofidis/awesome-deep-learning/master/README.md", "deep-learning"),
        ("https://raw.githubusercontent.com/keras-team/keras-io/master/README.md", "keras"),
        ("https://raw.githubusercontent.com/torch/torch7/master/README.md", "torch"),
        ("https://raw.githubusercontent.com/tensorflow/tensorflow/master/README.md", "tensorflow"),
        ("https://raw.githubusercontent.com/pytorch/pytorch/main/README.md", "pytorch"),
        ("https://raw.githubusercontent.com/scikit-learn/scikit-learn/main/README.rst", "sklearn"),
        ("https://raw.githubusercontent.com/pandas-dev/pandas/main/README.md", "pandas"),
        ("https://raw.githubusercontent.com/numpy/numpy/main/README.md", "numpy"),
        ("https://raw.githubusercontent.com/mwaskom/seaborn/master/README.md", "seaborn"),
        ("https://raw.githubusercontent.com/matplotlib/matplotlib/main/README.rst", "matplotlib"),
        ("https://raw.githubusercontent.com/bokeh/bokeh/main/README.md", "bokeh"),
        ("https://raw.githubusercontent.com/plotly/plotly.py/master/README.md", "plotly"),
        ("https://raw.githubusercontent.com/streamlit/streamlit/main/README.md", "streamlit"),
        ("https://raw.githubusercontent.com/gradio-app/gradio/main/README.md", "gradio"),
        ("https://raw.githubusercontent.com/huggingface/datasets/main/README.md", "datasets"),
        ("https://raw.githubusercontent.com/huggingface/tokenizers/main/README.md", "tokenizers"),
        ("https://raw.githubusercontent.com/huggingface/accelerate/main/README.md", "accelerate"),
        ("https://raw.githubusercontent.com/huggingface/peft/main/README.md", "peft"),
        ("https://raw.githubusercontent.com/huggingface/diffusers/main/README.md", "diffusers"),
        ("https://raw.githubusercontent.com/huggingface/optimum/main/README.md", "optimum"),
        ("https://raw.githubusercontent.com/huggingface/safetensors/main/README.md", "safetensors"),
        ("https://raw.githubusercontent.com/openai/whisper/main/README.md", "whisper"),
        ("https://raw.githubusercontent.com/openai/tiktoken/main/README.md", "tiktoken"),
        ("https://raw.githubusercontent.com/openai/openai-python/main/README.md", "openai"),
        ("https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md", "anthropic"),
        ("https://raw.githubusercontent.com/langchain-ai/langgraph/main/README.md", "langgraph"),
        ("https://raw.githubusercontent.com/run-llama/llama_index/main/README.md", "llama-index"),
        ("https://raw.githubusercontent.com/deepset-ai/haystack/main/README.md", "haystack"),
        ("https://raw.githubusercontent.com/chroma-core/chroma/main/README.md", "chromadb"),
        ("https://raw.githubusercontent.com/weaviate/weaviate/main/README.md", "weaviate"),
        ("https://raw.githubusercontent.com/qdrant/qdrant/master/README.md", "qdrant"),
        ("https://raw.githubusercontent.com/milvus-io/milvus/master/README.md", "milvus"),
        ("https://raw.githubusercontent.com/facebookresearch/faiss/main/README.md", "faiss"),
        ("https://raw.githubusercontent.com/spotify/annoy/main/README.md", "annoy"),
        ("https://raw.githubusercontent.com/nmslib/hnswlib/master/README.md", "hnswlib"),
    ]
    total = 0
    for url, cat in lists:
        if total >= target: break
        try:
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                content = resp.read().decode("utf-8", errors="ignore")
            batch = []
            for m in re.finditer(r'-\s*\[([^\]]+)\]\((https?://[^\)]+)\)\s*-?\s*(.*)', content):
                name = m.group(1).strip()
                link = m.group(2).strip()
                desc = m.group(3).strip()[:300]
                if "github.com" not in link: continue
                if len(name) < 2 or len(name) > 100: continue
                batch.append((str(uuid.uuid4()), name, "github", desc,
                    categorize(name, desc, cat), "tool",
                    f"git clone {link}", link, cat, "", f"GitHub repo: {name}", 1))
            if batch:
                cur.executemany("""INSERT OR IGNORE INTO SkillRegistry
                    (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch)
                conn.commit()
                total += len(batch)
                log(f"   [GitHub-Skills] {cat}: +{len(batch)} (total: {total:,})")
            del content; gc.collect()
            time.sleep(0.5)
        except Exception as e:
            log(f"   [GitHub-Skills] {cat} error: {str(e)[:80]}")
    log(f"✅ [GitHub-Skills] Done — {total:,} skills added")
    return total

def crawl_pypi_as_skills(conn, target=40000):
    """بيسجل subset من PyPI packages كـ skills."""
    log(f"🚀 [PyPI-Skills] Registering {target:,} PyPI packages as skills...")
    cur = conn.cursor()
    cur.execute("SELECT name, summary FROM ToolRegistry WHERE source='pypi' LIMIT ?", (target * 2,))
    rows = cur.fetchall()
    log(f"   [PyPI-Skills] Fetched {len(rows):,} candidates from ToolRegistry")
    batch = []
    added = 0
    for name, summary in rows:
        if added >= target: break
        batch.append((str(uuid.uuid4()), name, "pypi", summary or "",
            categorize(name, summary or "", ""), "tool",
            f"pip install {name}", "", "", "", f"Python package: {name}", 1))
        if len(batch) >= 500:
            cur.executemany("""INSERT OR IGNORE INTO SkillRegistry
                (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch)
            conn.commit()
            added += len(batch)
            batch = []
            if added % 5000 == 0: log(f"   [PyPI-Skills] added {added:,}")
    if batch:
        cur.executemany("""INSERT OR IGNORE INTO SkillRegistry
            (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch)
        conn.commit()
        added += len(batch)
    log(f"✅ [PyPI-Skills] Done — {added:,} skills added")
    return added

# ─────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────
def print_stats(conn):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry"); t = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM SkillRegistry"); s = cur.fetchone()[0]
    cur.execute("SELECT source, COUNT(*) FROM ToolRegistry GROUP BY source")
    t_src = cur.fetchall()
    cur.execute("SELECT source, COUNT(*) FROM SkillRegistry GROUP BY source")
    s_src = cur.fetchall()
    log("="*60)
    log(f"📊 TOOLS: {t:,} | SKILLS: {s:,}")
    log("Tools by source:")
    for src,c in t_src: log(f"   {src}: {c:,}")
    log("Skills by source:")
    for src,c in s_src: log(f"   {src}: {c:,}")
    log("="*60)

def main():
    log("="*60)
    log("🚀 V.109 Complete Crawler — START")
    log("Target: 859K tools + 90K skills")
    log("="*60)
    conn = get_conn()

    # Phase 1: Complete PyPI (859K)
    log("\n📋 PHASE 1: Complete PyPI packages → 859K")
    n1 = complete_pypi(conn)

    # Phase 2: Skills from npm (50K target)
    log("\n📋 PHASE 2: npm packages as skills → 50K")
    n2 = crawl_npm_as_skills(conn, target=50000)

    # Phase 3: Skills from GitHub awesome-lists (30K target)
    log("\n📋 PHASE 3: GitHub repos as skills → 30K")
    n3 = crawl_github_awesome_as_skills(conn, target=30000)

    # Phase 4: Skills from PyPI (40K target)
    log("\n📋 PHASE 4: PyPI packages as skills → 40K")
    n4 = crawl_pypi_as_skills(conn, target=40000)

    print_stats(conn)
    log("🏁 V.109 Complete Crawler — DONE")
    conn.close()

if __name__ == "__main__":
    main()
