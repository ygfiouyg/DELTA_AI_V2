#!/usr/bin/env python3
"""
V.109c: Skill Crawler — بيجمّع 90K+ skill من npm + GitHub + PyPI.
بيشتغل بعد ما الـ PyPI completer يخلص.
"""
import json, os, sys, sqlite3, urllib.request, time, gc, re, uuid
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/skill_crawler.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

def categorize(name, summary, keywords):
    text = f"{name} {summary} {keywords}".lower()
    if any(k in text for k in ["ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","pytorch","tensorflow","scikit","sklearn","xgboost","huggingface","transformers","diffusers","whisper","speech","tts","ocr","vision","clip","bert","llama","mistral","gemini","claude"]): return "ai"
    if any(k in text for k in ["data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","visualization","plot","chart","dashboard","spark","polars","dbt"]): return "data"
    if any(k in text for k in ["image","video","audio","music","pdf","ffmpeg","pillow","opencv","subtitle","midi","mp3","wav","codec"]): return "media"
    if any(k in text for k in ["scrape","crawl","spider","http","request","api","rest","graphql","selenium","playwright","fastapi","flask","django","html","css","url"]): return "web"
    if any(k in text for k in ["test","lint","format","build","deploy","docker","kubernetes","git","compile","debug","profile","benchmark"]): return "dev"
    if any(k in text for k in ["science","physics","chemistry","biology","math","statistics","research","scipy","sympy","academic","scholar"]): return "science"
    return "utility"

def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=120)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=OFF;")
    conn.execute("PRAGMA cache_size=-100000;")
    return conn

# ─────────────────────────────────────────────────────────
# Source 1: npm registry → skills (target: 50K)
# ─────────────────────────────────────────────────────────
def crawl_npm_skills(conn, target=50000):
    log(f"🚀 [npm-Skills] Target: {target:,}")
    cur = conn.cursor()
    keywords = [
        # AI/ML
        "ai","ml","llm","gpt","chatbot","agent","automation","transformer","embedding",
        "rag","vector","openai","anthropic","langchain","huggingface","whisper","tts",
        "ocr","vision","clip","bert","llama","mistral","gemini","claude","prompt",
        # Data
        "data","analytics","visualization","chart","dashboard","dataset","database",
        # Media
        "image","video","audio","music","pdf","ffmpeg","subtitle","mp3","wav",
        # Web
        "scraper","crawler","spider","http","api","rest","graphql","websocket",
        "selenium","playwright","puppeteer","fastapi","flask","django","next","nuxt",
        # Dev
        "test","lint","format","build","deploy","docker","kubernetes","ci","cd",
        "compiler","debugger","profiler","benchmark","logger","monitoring",
        # Frameworks
        "react","vue","angular","svelte","solid","astro","remix","gatsby",
        "tailwind","bootstrap","material","ui","component","theme","icon",
        # Cloud/Infra
        "aws","azure","gcp","cloud","serverless","lambda","s3","firebase",
        "docker","kubernetes","terraform","ansible","nginx","caddy",
        # Crypto
        "crypto","blockchain","web3","ethereum","solana","nft","defi","wallet",
        # Security
        "security","auth","jwt","oauth","encryption","hash","password","2fa",
        # Communication
        "chat","messaging","discord","slack","telegram","whatsapp","notification",
        # Maps/Geo
        "map","geo","location","gis","geocode","route","distance","weather",
        # Media playback
        "player","spotify","youtube","vimeo","twitch","stream",
        # Documents
        "pdf-generator","docx","xlsx","pptx","markdown","latex","report",
        # CMS/E-commerce
        "blog","cms","wordpress","shopify","ecommerce","cart","checkout",
        # Search
        "search","elastic","solr","algolia","meilisearch","typesense",
        # State
        "cache","session","cookie","token","state","store",
        # i18n
        "i18n","locale","translate","arabic","english",
        # Validation
        "validation","schema","form","input","parse","serialize",
        # CLI
        "cli","command","terminal","shell","prompt","repl",
        # Automation
        "bot","automation","rpa","workflow","orchestration",
        # ML specifics
        "training","inference","dataset","preprocessing","fine-tune",
        # Vision
        "detection","segmentation","classification","recognition","tracking",
        # Speech
        "asr","stt","speech","voice","synthesis",
        # NLP
        "summarization","extraction","sentiment","ner","translation",
        # Observability
        "observability","tracing","langfuse","langsmith","helicone",
        # Gateway
        "gateway","router","loadbalancer","fallback","retry","proxy",
    ]
    total = 0
    for kw in keywords:
        if total >= target: break
        for offset in (0, 250, 500, 1000, 2000, 4000):
            if total >= target: break
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
                time.sleep(0.2)
            except Exception as e:
                time.sleep(1)
                break
        if total % 2500 < 250: log(f"   [npm-Skills] kw='{kw}' total: {total:,}")
    log(f"✅ [npm-Skills] Done — {total:,} added")
    return total

# ─────────────────────────────────────────────────────────
# Source 2: GitHub awesome-lists → skills (target: 30K)
# ─────────────────────────────────────────────────────────
def crawl_github_skills(conn, target=30000):
    log(f"🚀 [GitHub-Skills] Target: {target:,}")
    cur = conn.cursor()
    lists = [
        ("https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md", "general"),
        ("https://raw.githubusercontent.com/vinta/awesome-python/main/readme.md", "python"),
        ("https://raw.githubusercontent.com/avelino/awesome-go/main/README.md", "go"),
        ("https://raw.githubusercontent.com/ziadoz/awesome-php/master/README.md", "php"),
        ("https://raw.githubusercontent.com/akullpp/awesome-java/master/README.md", "java"),
        ("https://raw.githubusercontent.com/rust-unofficial/awesome-rust/main/README.md", "rust"),
        ("https://raw.githubusercontent.com/sorrycc/awesome-javascript/master/README.md", "javascript"),
        ("https://raw.githubusercontent.com/babel/awesome-babel/main/README.md", "babel"),
        ("https://raw.githubusercontent.com/vuejs/awesome-vue/master/README.md", "vue"),
        ("https://raw.githubusercontent.com/brillout/awesome-react-components/master/README.md", "react"),
        ("https://raw.githubusercontent.com/angularjs/awesome-angular/master/README.md", "angular"),
        ("https://raw.githubusercontent.com/sveltejs/awesome-svelte/master/README.md", "svelte"),
        ("https://raw.githubusercontent.com/victorlauren/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/Hannibal046/awesome-llm/main/README.md", "llm"),
        ("https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md", "ai-agents"),
        ("https://raw.githubusercontent.com/kyrolabs/awesome-agents/main/README.md", "agents"),
        ("https://raw.githubusercontent.com/Shubhamsaboo/awesome-llm-apps/main/README.md", "llm-apps"),
        ("https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md", "ai-tools"),
        ("https://raw.githubusercontent.com/semperai/awesome-llm/main/README.md", "llm"),
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
        ("https://raw.githubusercontent.com/awesome-selfhosted/awesome-selfhosted/master/README.md", "selfhosted"),
        ("https://raw.githubusercontent.com/Kickball/awesome-selfhosted/master/README.md", "selfhosted"),
        ("https://raw.githubusercontent.com/agarrharr/awesome-cli-apps/master/README.md", "cli"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-cli-apps/master/readme.md", "cli"),
        ("https://raw.githubusercontent.com/alebcay/awesome-htpasswd/master/README.md", "auth"),
        ("https://raw.githubusercontent.com/sbilly/awesome-security/master/README.md", "security"),
        ("https://raw.githubusercontent.com/paragonie/awesome-security/master/README.md", "security"),
        ("https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md", "osint"),
        ("https://raw.githubusercontent.com/PaulSec/awesome-osint/master/README.md", "osint"),
        ("https://raw.githubusercontent.com/carpedm20/awesome-hacking/master/README.md", "hacking"),
        ("https://raw.githubusercontent.com/Hack-with-Github/Awesome-Hacking/master/README.md", "hacking"),
        ("https://raw.githubusercontent.com/enaqx/awesome-pentest/master/README.md", "pentest"),
        ("https://raw.githubusercontent.com/infoslack/awesome-web-hacking/master/README.md", "web-hacking"),
        ("https://raw.githubusercontent.com/apsdehal/awesome-ctf/master/README.md", "ctf"),
        ("https://raw.githubusercontent.com/rshipp/awesome-malware-analysis/master/README.md", "malware"),
        ("https://raw.githubusercontent.com/r4j0x00/awesome-linux/main/README.md", "linux"),
        ("https://raw.githubusercontent.com/alebcay/awesome-linux-software/master/README.md", "linux"),
        ("https://raw.githubusercontent.com/n1trux/awesome-sysadmin/master/README.md", "sysadmin"),
        ("https://raw.githubusercontent.com/kahun/awesome-sysadmin/master/README.md", "sysadmin"),
        ("https://raw.githubusercontent.com/fffaraz/awesome-cpp/master/README.md", "cpp"),
        ("https://raw.githubusercontent.com/akullpp/awesome-cpp/master/README.md", "cpp"),
        ("https://raw.githubusercontent.com/avelino/awesome-c/main/README.md", "c"),
        ("https://raw.githubusercontent.com/developertools-tech/awesome-c/main/README.md", "c"),
        ("https://raw.githubusercontent.com/learn-anything/compiled-learn-anything/master/README.md", "learn"),
        ("https://raw.githubusercontent.com/mhinz/awesome-vim/master/README.md", "vim"),
        ("https://raw.githubusercontent.com/rockerBOO/awesome-neovim/main/README.md", "neovim"),
        ("https://raw.githubusercontent.com/emacs-tw/awesome-emacs/master/README.md", "emacs"),
        ("https://raw.githubusercontent.com/microsoft/vscode/main/README.md", "vscode"),
        ("https://raw.githubusercontent.com/viatsko/awesome-vscode/master/README.md", "vscode"),
        ("https://raw.githubusercontent.com/stek29/awesome-vscode/master/README.md", "vscode"),
        ("https://raw.githubusercontent.com/notable/notable/master/README.md", "notes"),
        ("https://raw.githubusercontent.com/asciimoo/awesome-asciinema/master/README.md", "asciinema"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-nodejs/master/readme.md", "nodejs"),
        ("https://raw.githubusercontent.com/sqren/awesome-nodejs/master/readme.md", "nodejs"),
        ("https://raw.githubusercontent.com/bnb/awesome-awesome-nodejs/master/README.md", "nodejs"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-electron/master/readme.md", "electron"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-scifi/master/readme.md", "scifi"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-talks/master/readme.md", "talks"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md", "awesome"),
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
            time.sleep(0.3)
        except Exception as e:
            log(f"   [GitHub-Skills] {cat} error: {str(e)[:80]}")
    log(f"✅ [GitHub-Skills] Done — {total:,} added")
    return total

# ─────────────────────────────────────────────────────────
# Source 3: PyPI packages → skills (target: 40K)
# ─────────────────────────────────────────────────────────
def crawl_pypi_skills(conn, target=40000):
    log(f"🚀 [PyPI-Skills] Target: {target:,}")
    cur = conn.cursor()
    # استخدم temp table approach للسرعة
    cur.execute("SELECT name, summary FROM ToolRegistry WHERE source='pypi' ORDER BY name LIMIT ?", (target,))
    rows = cur.fetchall()
    log(f"   [PyPI-Skills] Fetched {len(rows):,} candidates")
    batch = []
    added = 0
    for name, summary in rows:
        if added >= target: break
        batch.append((str(uuid.uuid4()), name, "pypi", summary or "",
            categorize(name, summary or "", ""), "tool",
            f"pip install {name}", "", "", "", f"Python package: {name}", 1))
        if len(batch) >= 1000:
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
    log(f"✅ [PyPI-Skills] Done — {added:,} added")
    return added

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
    log("🚀 V.109c Skill Crawler — START")
    log("Target: 90K+ skills")
    log("="*60)
    conn = get_conn()
    n1 = crawl_npm_skills(conn, target=50000)
    n2 = crawl_github_skills(conn, target=30000)
    n3 = crawl_pypi_skills(conn, target=40000)
    print_stats(conn)
    log("🏁 DONE")
    conn.close()

if __name__ == "__main__":
    main()
