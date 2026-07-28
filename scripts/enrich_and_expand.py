#!/usr/bin/env python3
"""
V.108 Enrichment — بيجيب metadata حقيقي للـ top packages + يضيف npm + skills.
خفيف على الذاكرة (batch صغيرة، sequential).
"""
import json, os, sys, sqlite3, urllib.request, time, gc
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

DB_PATH = "/home/z/my-project/db/custom.db"
LOG = Path("/home/z/my-project/exports/enrichment.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f: f.write(line + "\n")

def categorize(name, summary, keywords):
    text = f"{name} {summary} {keywords}".lower()
    AI = ["ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","pytorch","tensorflow","scikit","sklearn","xgboost","huggingface","transformers","diffusers","whisper","speech","tts","ocr","vision"]
    DATA = ["data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","visualization","plot","chart","dashboard","spark","polars"]
    MEDIA = ["image","video","audio","music","pdf","ffmpeg","pillow","opencv","subtitle","midi"]
    WEB = ["scrape","crawl","spider","http","request","api","rest","graphql","selenium","playwright","fastapi","flask","django"]
    DEV = ["test","lint","format","build","deploy","docker","kubernetes","git","compile","debug"]
    SCIENCE = ["science","physics","chemistry","biology","math","statistics","research","scipy","sympy"]
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

def fetch_pypi_meta(name):
    try:
        url = f"https://pypi.org/pypi/{name}/json"
        with urllib.request.urlopen(url, timeout=8) as resp:
            d = json.loads(resp.read().decode("utf-8"))
        info = d.get("info", {})
        kws = info.get("keywords") or ""
        return {
            "name": name,
            "summary": (info.get("summary") or "")[:300],
            "keywords": ",".join(kws.split(",")[:8]) if kws else "",
            "author": (info.get("author") or "")[:80],
            "license": (info.get("license") or "")[:40],
            "version": (info.get("version") or "")[:30],
            "homepage": (info.get("home_page") or "")[:200],
        }
    except: return None

def enrich_top_packages(conn, top_n=800):
    """بيجيب metadata للـ top N packages المشهورة."""
    log(f"🔍 Enriching top {top_n} known-popular PyPI packages...")
    known = [
        "requests","numpy","pandas","matplotlib","scipy","scikit-learn","tensorflow","torch",
        "keras","transformers","langchain","openai","anthropic","tiktoken","pillow","opencv-python",
        "beautifulsoup4","selenium","playwright","fastapi","flask","django","pydantic","sqlalchemy",
        "pytest","black","ruff","mypy","celery","redis","pymongo","psycopg2","sqlmodel",
        "httpx","aiohttp","websockets","pyjwt","cryptography","passlib","bcrypt",
        "yt-dlp","pytube","moviepy","imageio","pydub","librosa","soundfile","speechrecognition",
        "pytesseract","easyocr","pdfplumber","pypdf2","python-docx","python-pptx","openpyxl",
        "reportlab","fpdf2","weasyprint","markdown","jinja2","rich","click","typer","tqdm",
        "spacy","nltk","gensim","wordcloud","textblob","vaderSentiment","textstat",
        "diffusers","accelerate","datasets","tokenizers","sentence-transformers","peft","trl",
        "llama-index","llama-cpp-python","chromadb","weaviate-client","qdrant-client",
        "faiss-cpu","pymilvus","annoy","hnswlib","xgboost","lightgbm","catboost","statsmodels",
        "prophet","plotly","seaborn","bokeh","altair","networkx","igraph","pyvis",
        "scrapy","parsel","lxml","xmltodict","pyyaml","toml","python-dotenv","hydra","omegaconf",
        "uvicorn","gunicorn","hypercorn","daphne","grpcio","protobuf","avro","msgpack","orjson",
        "pyarrow","polars","dask","ray","modin","pyspark","dbt-core","apache-airflow","prefect",
        "dagster","mlflow","wandb","tensorboard","pytorch-lightning","deepspeed","vllm",
        "ollama","optimum","onnxruntime","tensorflow-serving","tflite-runtime",
        "grpcio-reflection","grpcio-status","grpcio-testing","fastapi-pagination","fastapi-cache2",
        "pydantic-settings","pydantic-extra-types","sqlmodel","tortoise-orm","databases","asyncpg",
        "aiomysql","asyncmy","aiosqlite","sqlalchemy-utils","alembic","migrate","yoyo-migrations",
        "pytest-asyncio","pytest-cov","pytest-mock","pytest-xdist","coverage","hypothesis",
        "locust","locustio","py-spy","memray","pyinstrument","line-profiler","memory-profiler",
        "jupyter","notebook","jupyterlab","ipykernel","ipywidgets","voila","nbconvert","nbformat",
        "streamlit","gradio","dash","panel","voila","bokeh-server","voila-gridstack",
        "shapely","geojson","folium","geopandas","rasterio","gdal","pyproj","cartopy","basemap",
        "qrcode","pyzbar","zxing","pillow-avif","pillow-tiff","pillow-jpeg","pillow-heif",
        "openai-clip","clip-anytorch","open-clip-torch","timm","efficientnet-pytorch","pytorchcv",
        "albumentations","imgaug","augmentor","kornia","torchvision","torchtext","torchaudio",
        "fairseq","transformers-interpret","captum","shap","lime","eli5","interpret",
        "opencv-contrib-python","opencv-python-headless","scikit-image","mahotas","simplecv",
        "pyautogui","pillow-simd","wand","python-magic","imutils","imagehash","pythreshold",
        "google-cloud-vision","google-cloud-speech","google-cloud-translate","google-cloud-language",
        "google-cloud-video-intelligence","google-cloud-aiplatform","google-cloud-storage",
        "boto3","awscli","google-api-python-client","azure-cognitiveservices-vision-computervision",
        "twilio","sendgrid","mailgun","python-http-client","resend","postmarker","yagmail",
        "discord.py","pyTelegramBotAPI","python-telegram-bot","slack-sdk","pymsteams","fbmq",
        "notion-client","todoist-python","asana","trello","jira","clickup",
        "stripe","paypalrestsdk","razorpay","squareup","plaid-python","mercadopago",
        "shopify-python-api","woocommerce","bigcommerce","magento","prestashop",
        "airtable","notion","coda","smartsheet","monday","fibery","attio",
        "hubspot-api-client","salesforce-bulk","zoho","pipedrive","insightly",
        "quickbooks","freshbooks","waveaccounting","xero-python","oracle-finance",
        "plotly-express","plotly-figure-factory","dash-core-components","dash-html-components",
        "chart-studio","matplotlib-venn","matplotlib-3d","seaborn-tools","bokeh-models",
        "vtk","pyvista","mayavi","vispy","datashader","holoviews","panel","hvplot",
        "d3graph","networkx-algorithms","igraph-python","graph-tool","pygraphviz","pydot",
        "sympy","mpmath","numpy-financial","numpy-stl","scipy-optimize","scipy-stats",
        "pandas-datareader","pandas-profiling","pandas-ql","pandasgui","pandas-flavor",
        "great-expectations","pandera","schema","pydantic-yaml","pydantic-xml","pydantic-jq",
        "croniter","apscheduler","schedule","python-crontab","crontab","celery-beat",
        "rq","arq","dramatiq","huey","kuyruk","saq","taskiq","procrastinate",
        "docker","docker-compose","docker-py","kubernetes","openshift","minikube","helm",
        "ansible","terraform-python","pulumi","boto3-stubs","google-cloud-compute",
        "prometheus-client","prometheus-api-client","grafana-api","datadog","newrelic",
        "sentry-sdk","rollbar","bugsnag","honeybadger","sentry-python",
        "loguru","structlog","python-json-logger","coloredlogs","logging-tree",
        "psutil","py-cpuinfo","gpustat","nvidia-ml-py","pynvml","nvitop",
        "tqdm-rich","rich-argparse","rich-click","textual","textual-dev","textual-serve",
        "typer-cli","click-completion","click-repl","click-aliases","click-spinner",
        "fire","plac","defopt","confuse","configobj","configargparse",
        "pydantic-cli","typer-pydantic","datamodel-code-generator","jsonschema","jsonschema-spec",
        "fastjsonschema","python-fastjsonschema","schema-validator","cerberus","validators",
        "email-validator","python-geoip","python-geoip-geolite2","maxminddb","ipaddress",
        "cryptography","pycryptodome","pyopenssl","nacl","paramiko","fabric","asyncssh",
        "pyjwt","python-jose","authlib","python-auth0","okta","firebase-admin",
        "passlib","bcrypt","argon2-cffi","pbkdf2","scrypt","pyotp","qrcode",
        "fastapi-security","fastapi-login","fastapi-auth2","fastapi-users","fastapi-permissions",
        "starlette","starlette-context","starlette-csrf","starlette-prometheus",
        "uvicorn-standard","gunicorn","uvloop","httptools","uvicorn-worker",
        "hypercorn","daphne","granian","mangum","asgiref","asgi-lifespan",
        "httpx","httpcore","aiohttp","aiobotocore","aiofiles","aiohttp-session",
        "requests-async","httpx-async","aiohttp-retry","aiohttp-middlewares",
        "tenacity","stamina","backoff","retry","retrying","python-retry",
        "redis","aioredis","redis-py-cluster","valkey","dragonflydb","keydb",
        "pymongo","mongoengine","motor","odmantic","beanie","umongo",
        "psycopg2-binary","psycopg2","asyncpg","aiopg","sqlalchemy","sqlmodel","tortoise-orm",
        "alembic","yoyo-migrations","migrate","dbt-core","dbt-postgres","dbt-bigquery",
        "pymysql","mysqlclient","mysql-connector-python","aiomysql","asyncmy",
        "cassandra-driver","scylla-driver","pycassa","riak-client","aerospike",
        "elasticsearch","elasticsearch-dsl","opensearch-py","meilisearch","typesense",
        "pinecone-client","weaviate-client","qdrant-client","chromadb","milvus","pymilvus",
        "faiss-cpu","faiss-gpu","annoy","hnswlib","nmslib","scann",
        "langchain","langchain-core","langchain-community","langchain-openai","langchain-anthropic",
        "langchain-google-genai","langchain-groq","langchain-mistralai","langchain-cohere",
        "langgraph","langsmith","langserve","langchain-experimental","langchain-text-splitters",
        "llama-index","llama-index-core","llama-index-llms-openai","llama-index-llms-anthropic",
        "llama-index-embeddings-openai","llama-index-vector-stores","llama-index-readers",
        "llama-hub","llama-index-agent","llama-index-tools","llama-index-experimental",
        "haystack-ai","farm-haystack","haystack","deeppavlov","riva","rasa","spacy-transformers",
        "autogen","autogen-agentchat","autogen-core","autogen-ext","autogen-studio","autogenstudio",
        "crewai","crewai-tools","crewaihub","taskweaver","task-crewai","crewai-langchain",
        "semantic-kernel","semantic-kernel-python"," microsoft-semantic-kernel",
        "letta","letta-client","letta-sdk","memgpt","mem0","mem0ai","chromadb",
        "agentops","agent-protocol","agency-swarm","aioboto3-swarm","openai-swarm",
        "litellm","portkey","helicone","langfuse","traceloop","openllmetry","opentelemetry",
        " Guidance","guidance","lm-format-enforcer","lmnr","outlines","llm-guard","rebuff",
        "vllm","tgi","text-generation","text-generation-inference","ctransformers","llama-cpp-python",
        "ollama","ollama-python","gpt4all","llamafile","localai","xinference","openllm",
        "modal","modal-client","runpod","replicate","baseten","banana-dev","modelbit",
        "huggingface-hub","huggingface-inference","transformers","diffusers","accelerate","peft",
        "trl","bitsandbytes","datasets","tokenizers","sentencepiece","sacremoses","safetensors",
        "evaluate","optimum","onnxruntime","onnx","onnx-tf","tf2onnx","onnxruntime-tools",
        "torch","torchvision","torchaudio","torchtext","torch-geometric","torch-geometry",
        "pytorch-lightning","pytorch-ignite","catalyst","deepspeed","megatron-lm","fairscale",
        "tensorflow","tensorflow-gpu","tensorflow-hub","tensorflow-datasets","tensorflow-probability",
        "tensorflow-text","tensorflow-io","tensorflow-addons","tensorflow-estimator","tflite-runtime",
        "keras","keras-core","keras-cv","keras-nlp","keras-tuner","keras-visualizer","autokeras",
        "jax","jaxlib","flax","optax","haiku","dm-haiku","objax","einops","chex",
        "scikit-learn","scikit-image","scikit-optimize","scikit-surprise","scikit-tda","sklearn",
        "xgboost","lightgbm","catboost","ngboost","scikit-optimize","sklearn-pandas",
        "statsmodels","pmdarima","arch","econometrics","linearmodels","pingouin","biostat",
        "prophet","neuralprophet","darts","kats","merlion","tsai","tsfresher",
        "gensim","spaCy","nltk","textblob","vaderSentiment","textstat","language-tool-python",
        "transformers-interpret","captum","shap","lime","eli5","interpret","dalex","fairlearn",
        "wordcloud","word2vec","fasttext","flair","allennlp","stanza","spacy-transformers",
        "whisper","whisper-cpp","faster-whisper","whisper-timestamped","whisperx","openai-whisper",
        "speechbrain","espnet","kaldi","wenet","nemo","kiss-gpu",
        "pydub","librosa","soundfile","audioread","pyaudio","sounddevice","pedalboard",
        "ffmpeg-python","moviepy","imageio-ffmpeg","av","opencv-contrib","mediapipe",
        "pillow","pillow-simd","wand","python-magic","imutils","imagehash","pyheif","pillow-heif",
        "opencv-python","opencv-python-headless","opencv-contrib-python","scikit-image","mahotas",
        "pytesseract","easyocr","paddleocr","paddlepaddle","paddlepaddle-gpu","doctr","keras-ocr",
        "google-cloud-vision","azure-cognitiveservices-vision-computervision","aws-textract",
        "google-cloud-speech","google-cloud-text-to-speech","azure-cognitiveservices-speech",
        "amazon-transcribe","amazon-polly","elevenlabs","coqui-tts","gTTS","edge-tts","pyttsx3",
        "googletrans","deep-translator","translate","translatepy","argos-translate","fairseq-translate",
        "pdfplumber","pypdf","pypdf2","pdfminer.six","pymupdf","fitz","reportlab","fpdf2","pdfkit",
        "weasyprint","xhtml2pdf","pdf2docx","pdf2image","pdf2text","pdf-redactor","pdfrw",
        "python-docx","python-docx2python","docx2python","python-docx-template","python-pptx","python-pptx-template",
        "openpyxl","xlsxwriter","pandas-openpyxl","xlrd","xlwt","python-xlrd","python-xlwt","xlwings",
        "matplotlib","seaborn","plotly","bokeh","altair","holoviews","datashader","pyvista",
        "mayavi","vispy","vtk","dash","streamlit","gradio","panel","voila","voila-gridstack",
        "pyecharts","chart-studio","cufflinks","mpld3","plotnine","ggplot","hvplot",
        "networkx","igraph","graph-tool","pygraphviz","pydot","pyvis","d3graph",
        "scrapy","beautifulsoup4","lxml","parsel","selenium","playwright","pyppeteer","requests-html",
        "httpx","aiohttp","requests","urllib3","httplib2","treq","grequests","httpx-socks",
        "youtube-dl","yt-dlp","pytube","youtube-transcript-api","google-api-python-client","google-auth",
        "tweepy","python-telegram-bot","discord.py","slack-sdk","pymsteams","fbmq","instaloader",
        "boto3","google-cloud-storage","azure-storage-blob","minio","dropbox","boxsdk","onedrivesdk",
        "stripe","paypalrestsdk","razorpay","plaid-python","squareup","mercadopago","quickbooks",
        "twilio","sendgrid","mailgun","resend","yagmail","email-validator","aiosmtplib",
        "ansible","terraform-python","pulumi","kubernetes","docker","helm","openshift",
        "prometheus-client","grafana-api","datadog","sentry-sdk","loguru","structlog",
        "psutil","py-cpuinfo","gpustat","nvidia-ml-py","pynvml","nvitop","py-spy","memray",
        "pytest","black","ruff","mypy","isort","flake8","pylint","coverage","hypothesis",
        "jupyter","notebook","jupyterlab","ipykernel","ipywidgets","voila","nbconvert","nbformat",
        "rich","textual","click","typer","fire","tqdm","colorama","coloredlogs",
        "pydantic","sqlalchemy","sqlmodel","alembic","tortoise-orm","beanie","odmantic",
        "fastapi","flask","django","starlette","uvicorn","gunicorn","hypercorn","granian",
        "celery","redis","rq","arq","dramatiq","huey","apscheduler","schedule",
        "cryptography","pycryptodome","pyjwt","passlib","bcrypt","argon2-cffi","pyotp",
    ]
    # remove duplicates
    known = list(dict.fromkeys(known))[:top_n]
    log(f"   Fetching metadata for {len(known)} packages (10 workers)...")
    enriched = 0
    cur = conn.cursor()
    with ThreadPoolExecutor(max_workers=10) as pool:
        batch = list(known[:50])
        idx = 0
        while batch:
            futures = {pool.submit(fetch_pypi_meta, n): n for n in batch}
            for fut in as_completed(futures):
                meta = fut.result()
                if meta and meta["summary"]:
                    cur.execute("""UPDATE ToolRegistry SET
                        summary=?, keywords=?, author=?, license=?, version=?, homepage=?, isVerified=1, updatedAt=datetime('now')
                        WHERE name=? AND source='pypi'""",
                        (meta["summary"], meta["keywords"], meta["author"], meta["license"],
                         meta["version"], meta["homepage"], meta["name"]))
                    if cur.rowcount == 0:
                        import uuid
                        cat = categorize(meta["name"], meta["summary"], meta["keywords"])
                        cur.execute("""INSERT OR IGNORE INTO ToolRegistry
                            (id, name, source, summary, category, installCmd, homepage, keywords, author, license, version, isVerified, createdAt, updatedAt)
                            VALUES (?, ?, 'pypi', ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))""",
                            (str(uuid.uuid4()), meta["name"], meta["summary"], cat,
                             f"pip install {meta['name']}", meta["homepage"], meta["keywords"],
                             meta["author"], meta["license"], meta["version"]))
                    enriched += 1
            conn.commit()
            idx += 50
            log(f"   [{idx}/{len(known)}] enriched {enriched}")
            gc.collect()
            batch = list(known[idx:idx+50])
    log(f"✅ Enriched {enriched} packages with full metadata")
    return enriched

def crawl_local_skills(conn):
    """بيـ register كل skill محلي."""
    log("🚀 Registering local skills...")
    skills_dir = Path("/home/z/my-project/skills")
    if not skills_dir.exists(): return 0
    cur = conn.cursor()
    count = 0
    import uuid
    for d in sorted(skills_dir.iterdir()):
        if not d.is_dir(): continue
        skill_md = d / "SKILL.md"
        desc = ""
        if skill_md.exists():
            try:
                content = skill_md.read_text(encoding="utf-8", errors="ignore")[:2000]
                for line in content.split("\n"):
                    line = line.strip()
                    if line and not line.startswith("#") and not line.startswith("-"):
                        desc = line[:300]; break
            except: pass
        cur.execute("""INSERT OR IGNORE INTO SkillRegistry
            (id, name, source, summary, category, skillType, installCmd, repository, keywords, author, usageExample, isVerified, createdAt, updatedAt)
            VALUES (?, ?, 'local', ?, ?, 'tool', '', '', ?, 'Anzaro', ?, 1, datetime('now'), datetime('now'))""",
            (str(uuid.uuid4()), d.name, desc, categorize(d.name, desc, ""),
             d.name, f"use skill: {d.name}"))
        count += 1
    conn.commit()
    log(f"✅ Registered {count} local skills")
    return count

def crawl_npm(conn, max_packages=10000):
    """بيجلب packages من npm registry search."""
    log(f"🚀 [npm] Searching registry...")
    keywords = ["ai","ml","llm","gpt","chatbot","agent","automation","scraper","parser","converter",
        "generator","cli","tool","util","helper","data","analytics","visualization","chart",
        "image","video","audio","pdf","ocr","nlp","text","language","translation","transcribe",
        "tts","speech","voice","vision","canvas","render","3d","webgl","database","orm","sql",
        "redis","mongo","postgres","api","rest","graphql","websocket","server","client","sdk",
        "test","lint","format","build","deploy","docker","kubernetes","react","vue","angular",
        "svelte","next","nuxt","tailwind","ui","component","design","crypto","blockchain","web3",
        "security","auth","jwt","oauth","encryption"]
    total = 0
    cur = conn.cursor()
    import uuid
    for kw in keywords:
        offset = 0
        while offset < 2000:
            try:
                url = f"https://registry.npmjs.org/-/v1/search?text=keywords:{kw}&size=100&from={offset}"
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
                        categorize(name, desc, kws), f"npm install {name}",
                        (p.get("links") or {}).get("npm",""),
                        (p.get("links") or {}).get("repository",""),
                        kws, (p.get("publisher") or {}).get("username",""),
                        (p.get("license") or "")[:40], (p.get("version") or "")[:30], 1))
                if batch:
                    cur.executemany("""INSERT OR IGNORE INTO ToolRegistry
                        (id, name, source, summary, category, installCmd, homepage, repository, keywords, author, license, version, isVerified, createdAt, updatedAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""", batch)
                    conn.commit()
                    total += len(batch)
                offset += 100
                if total % 2000 < 100: log(f"   [npm] kw='{kw}' total: {total:,}")
                time.sleep(0.3)
                if total >= max_packages:
                    log(f"✅ [npm] Reached max {max_packages}")
                    return total
            except Exception as e:
                log(f"   [npm] kw='{kw}' err: {e}")
                time.sleep(2)
                break
    log(f"✅ [npm] Done — {total:,} packages")
    return total

def main():
    log("="*60)
    log("🚀 V.108 Enrichment + npm + skills — START")
    log("="*60)
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")

    # Phase 1: enrich top PyPI packages with real metadata
    n1 = enrich_top_packages(conn, top_n=800)

    # Phase 2: local skills
    n2 = crawl_local_skills(conn)

    # Phase 3: npm packages (adds variety + descriptions)
    n3 = crawl_npm(conn, max_packages=8000)

    # stats
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry")
    total = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isVerified=1")
    verified = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM SkillRegistry")
    skills = cur.fetchone()[0]
    cur.execute("SELECT source, COUNT(*) FROM ToolRegistry GROUP BY source")
    by_src = cur.fetchall()
    log("="*60)
    log(f"📊 TOTAL TOOLS: {total:,} (verified: {verified:,})")
    log(f"📊 TOTAL SKILLS: {skills:,}")
    for s,c in by_src: log(f"   {s}: {c:,}")
    log("="*60)
    log("🏁 DONE")
    conn.close()

if __name__ == "__main__":
    main()
