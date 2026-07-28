#!/usr/bin/env python3
"""
V.109e: Ultra-Fast Skill Crawler — بـ executescript (مثل ultra_pypi.py الناجح)
بيجمع 90K+ skill من:
  1. npm registry (لكن بـ executescript + commits أكتر)
  2. GitHub awesome-lists (parsing سريع)
  3. PyPI packages كـ skills (bulk من ToolRegistry)
"""
import json, os, sys, sqlite3, urllib.request, time, gc, re, uuid
from pathlib import Path

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/ultra_skill.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

def categorize(name, summary="", keywords=""):
    text = f"{name} {summary} {keywords}".lower()
    if any(k in text for k in ["ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","pytorch","tensorflow","scikit","sklearn","xgboost","huggingface","transformers","diffusers","whisper","speech","tts","ocr","vision","clip","bert","llama","mistral","gemini","claude"]): return "ai"
    if any(k in text for k in ["data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","visualization","plot","chart","dashboard","spark","polars","dbt"]): return "data"
    if any(k in text for k in ["image","video","audio","music","pdf","ffmpeg","pillow","opencv","subtitle","midi","mp3","wav","codec"]): return "media"
    if any(k in text for k in ["scrape","crawl","spider","http","request","api","rest","graphql","selenium","playwright","fastapi","flask","django","html","css","url"]): return "web"
    if any(k in text for k in ["test","lint","format","build","deploy","docker","kubernetes","git","compile","debug","profile","benchmark"]): return "dev"
    if any(k in text for k in ["science","physics","chemistry","biology","math","statistics","research","scipy","sympy","academic","scholar"]): return "science"
    return "utility"

def sql_escape(s):
    return str(s).replace("'", "''").replace("\\", "\\\\")

def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=120)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=OFF;")
    conn.execute("PRAGMA cache_size=-100000;")
    conn.execute("PRAGMA temp_store=MEMORY;")
    return conn

def bulk_insert_skills(conn, rows):
    """بيـ insert batch من skills بـ executescript (سريع جداً)."""
    if not rows: return 0
    cur = conn.cursor()
    BATCH = 250
    inserted = 0
    for i in range(0, len(rows), BATCH):
        batch = rows[i:i+BATCH]
        values_parts = []
        for r in batch:
            uid = str(uuid.uuid4())
            n = sql_escape(r["name"])
            src = sql_escape(r["source"])
            s = sql_escape(r.get("summary",""))[:300]
            c = sql_escape(r.get("category","utility"))
            st = sql_escape(r.get("skillType","tool"))
            ic = sql_escape(r.get("installCmd",""))
            repo = sql_escape(r.get("repository",""))
            kw = sql_escape(r.get("keywords",""))
            au = sql_escape(r.get("author",""))
            ue = sql_escape(r.get("usageExample",""))
            ver = 1 if r.get("isVerified") else 0
            values_parts.append(f"('{uid}','{n}','{src}','{s}','{c}','{st}','{ic}','{repo}','{kw}','{au}','{ue}',{ver},datetime('now'),datetime('now'))")
        sql = "INSERT OR IGNORE INTO SkillRegistry (id,name,source,summary,category,skillType,installCmd,repository,keywords,author,usageExample,isVerified,createdAt,updatedAt) VALUES " + ",".join(values_parts) + ";"
        cur.executescript(sql)
        inserted += len(batch)
    conn.commit()
    return inserted

# ─────────────────────────────────────────────────────────
# Source 1: npm → skills
# ─────────────────────────────────────────────────────────
def crawl_npm_skills(conn, target=50000):
    log(f"🚀 [npm-Skills] Target: {target:,}")
    cur = conn.cursor()
    keywords = [
        "ai","ml","llm","gpt","chatbot","agent","automation","transformer","embedding",
        "rag","vector","openai","anthropic","langchain","huggingface","whisper","tts",
        "ocr","vision","clip","bert","llama","mistral","gemini","claude","prompt",
        "data","analytics","visualization","chart","dashboard","dataset","database",
        "image","video","audio","music","pdf","ffmpeg","subtitle","mp3","wav",
        "scraper","crawler","spider","http","api","rest","graphql","websocket",
        "selenium","playwright","puppeteer","fastapi","flask","django","next","nuxt",
        "test","lint","format","build","deploy","docker","kubernetes","ci","cd",
        "compiler","debugger","profiler","benchmark","logger","monitoring",
        "react","vue","angular","svelte","solid","astro","remix","gatsby",
        "tailwind","bootstrap","material","ui","component","theme","icon",
        "aws","azure","gcp","cloud","serverless","lambda","s3","firebase",
        "terraform","ansible","nginx","caddy",
        "crypto","blockchain","web3","ethereum","solana","nft","defi","wallet",
        "security","auth","jwt","oauth","encryption","hash","password","2fa",
        "chat","messaging","discord","slack","telegram","whatsapp","notification",
        "map","geo","location","gis","geocode","route","weather",
        "player","spotify","youtube","vimeo","twitch","stream",
        "pdf-generator","docx","xlsx","pptx","markdown","latex","report",
        "blog","cms","wordpress","shopify","ecommerce","cart","checkout",
        "search","elastic","solr","algolia","meilisearch","typesense",
        "cache","session","cookie","token","state","store",
        "i18n","locale","translate","arabic","english",
        "validation","schema","form","input","parse","serialize",
        "cli","command","terminal","shell","prompt","repl",
        "bot","automation","rpa","workflow","orchestration",
        "training","inference","dataset","preprocessing","fine-tune",
        "detection","segmentation","classification","recognition","tracking",
        "asr","stt","speech","voice","synthesis",
        "summarization","extraction","sentiment","ner","translation",
        "observability","tracing","langfuse","langsmith","helicone",
        "gateway","router","loadbalancer","fallback","retry","proxy",
    ]
    total = 0
    for kw in keywords:
        if total >= target: break
        for offset in (0, 250, 500, 1000, 2000, 4000):
            if total >= target: break
            try:
                url = f"https://registry.npmjs.org/-/v1/search?text=keywords:{kw}&size=250&from={offset}"
                with urllib.request.urlopen(url, timeout=12) as resp:
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
                    batch.append({
                        "name": name, "source": "npm", "summary": desc,
                        "category": categorize(name, desc, kws), "skillType": "tool",
                        "installCmd": f"npm install {name}",
                        "repository": (p.get("links") or {}).get("repository",""),
                        "keywords": kws, "author": (p.get("publisher") or {}).get("username",""),
                        "usageExample": f"npm package: {name}", "isVerified": True
                    })
                if batch:
                    total += bulk_insert_skills(conn, batch)
                time.sleep(0.15)
            except: 
                time.sleep(0.5); break
        if total % 5000 < 250: log(f"   [npm-Skills] kw='{kw}' total: {total:,}")
    log(f"✅ [npm-Skills] Done — {total:,}")
    return total

# ─────────────────────────────────────────────────────────
# Source 2: GitHub awesome-lists → skills
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
        ("https://raw.githubusercontent.com/vuejs/awesome-vue/master/README.md", "vue"),
        ("https://raw.githubusercontent.com/brillout/awesome-react-components/master/README.md", "react"),
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
        ("https://raw.githubusercontent.com/ossu/computer-science/main/README.md", "cs"),
        ("https://raw.githubusercontent.com/josephmisiti/awesome-machine-learning/master/README.md", "ml"),
        ("https://raw.githubusercontent.com/ChristosChristofidis/awesome-deep-learning/master/README.md", "deep-learning"),
        ("https://raw.githubusercontent.com/sbilly/awesome-security/master/README.md", "security"),
        ("https://raw.githubusercontent.com/paragonie/awesome-security/master/README.md", "security"),
        ("https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md", "osint"),
        ("https://raw.githubusercontent.com/carpedm20/awesome-hacking/master/README.md", "hacking"),
        ("https://raw.githubusercontent.com/Hack-with-Github/Awesome-Hacking/master/README.md", "hacking"),
        ("https://raw.githubusercontent.com/enaqx/awesome-pentest/master/README.md", "pentest"),
        ("https://raw.githubusercontent.com/infoslack/awesome-web-hacking/master/README.md", "web-hacking"),
        ("https://raw.githubusercontent.com/apsdehal/awesome-ctf/master/README.md", "ctf"),
        ("https://raw.githubusercontent.com/rshipp/awesome-malware-analysis/master/README.md", "malware"),
        ("https://raw.githubusercontent.com/alebcay/awesome-linux-software/master/README.md", "linux"),
        ("https://raw.githubusercontent.com/n1trux/awesome-sysadmin/master/README.md", "sysadmin"),
        ("https://raw.githubusercontent.com/kahun/awesome-sysadmin/master/README.md", "sysadmin"),
        ("https://raw.githubusercontent.com/fffaraz/awesome-cpp/master/README.md", "cpp"),
        ("https://raw.githubusercontent.com/akullpp/awesome-cpp/master/README.md", "cpp"),
        ("https://raw.githubusercontent.com/avelino/awesome-c/main/README.md", "c"),
        ("https://raw.githubusercontent.com/mhinz/awesome-vim/master/README.md", "vim"),
        ("https://raw.githubusercontent.com/rockerBOO/awesome-neovim/main/README.md", "neovim"),
        ("https://raw.githubusercontent.com/emacs-tw/awesome-emacs/master/README.md", "emacs"),
        ("https://raw.githubusercontent.com/viatsko/awesome-vscode/master/README.md", "vscode"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-nodejs/master/readme.md", "nodejs"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-electron/master/readme.md", "electron"),
        ("https://raw.githubusercontent.com/awesome-selfhosted/awesome-selfhosted/master/README.md", "selfhosted"),
        ("https://raw.githubusercontent.com/Kickball/awesome-selfhosted/master/README.md", "selfhosted"),
        ("https://raw.githubusercontent.com/agarrharr/awesome-cli-apps/master/README.md", "cli"),
        ("https://raw.githubusercontent.com/sindresorhus/awesome-cli-apps/master/readme.md", "cli"),
        ("https://raw.githubusercontent.com/learn-anything/compiled-learn-anything/master/README.md", "learn"),
        ("https://raw.githubusercontent.com/alebcay/awesome-htpasswd/master/README.md", "auth"),
        ("https://raw.githubusercontent.com/PaulSec/awesome-osint/master/README.md", "osint"),
        ("https://raw.githubusercontent.com/r4j0x00/awesome-linux/main/README.md", "linux"),
        ("https://raw.githubusercontent.com/developertools-tech/awesome-c/main/README.md", "c"),
    ]
    total = 0
    for url, cat in lists:
        if total >= target: break
        try:
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read().decode("utf-8", errors="ignore")
            batch = []
            for m in re.finditer(r'-\s*\[([^\]]+)\]\((https?://[^\)]+)\)\s*-?\s*(.*)', content):
                name = m.group(1).strip()
                link = m.group(2).strip()
                desc = m.group(3).strip()[:300]
                if "github.com" not in link: continue
                if len(name) < 2 or len(name) > 100: continue
                batch.append({
                    "name": name, "source": "github", "summary": desc,
                    "category": categorize(name, desc, cat), "skillType": "tool",
                    "installCmd": f"git clone {link}", "repository": link,
                    "keywords": cat, "author": "", "usageExample": f"GitHub repo: {name}",
                    "isVerified": True
                })
            if batch:
                total += bulk_insert_skills(conn, batch)
                log(f"   [GitHub-Skills] {cat}: +{len(batch)} (total: {total:,})")
            del content; gc.collect()
            time.sleep(0.2)
        except Exception as e:
            log(f"   [GitHub-Skills] {cat} err: {str(e)[:60]}")
    log(f"✅ [GitHub-Skills] Done — {total:,}")
    return total

# ─────────────────────────────────────────────────────────
# Source 3: PyPI → skills (bulk from ToolRegistry)
# ─────────────────────────────────────────────────────────
def crawl_pypi_skills(conn, target=40000):
    log(f"🚀 [PyPI-Skills] Target: {target:,}")
    cur = conn.cursor()
    # batch fetch + batch insert بـ executescript
    cur.execute("SELECT name, summary FROM ToolRegistry WHERE source='pypi' ORDER BY name LIMIT ?", (target,))
    rows = cur.fetchall()
    log(f"   [PyPI-Skills] Fetched {len(rows):,} candidates")
    batch = []
    added = 0
    for name, summary in rows:
        if added >= target: break
        batch.append({
            "name": name, "source": "pypi", "summary": summary or "",
            "category": categorize(name, summary or ""), "skillType": "tool",
            "installCmd": f"pip install {name}", "repository": "", "keywords": "",
            "author": "", "usageExample": f"Python package: {name}", "isVerified": True
        })
        if len(batch) >= 1000:
            added += bulk_insert_skills(conn, batch)
            batch = []
            if added % 5000 == 0: log(f"   [PyPI-Skills] added {added:,}")
    if batch:
        added += bulk_insert_skills(conn, batch)
    log(f"✅ [PyPI-Skills] Done — {added:,}")
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
    for src,c in t_src: log(f"   tools/{src}: {c:,}")
    for src,c in s_src: log(f"   skills/{src}: {c:,}")
    log("="*60)

def main():
    log("="*60)
    log("🚀 V.109e Ultra Skill Crawler — START")
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
