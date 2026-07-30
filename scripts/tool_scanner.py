#!/usr/bin/env python3
"""
V.138: Auto-Discovery Tool Scanner
بيفحص كل package مثبت، يستخرج كل function كأداة قابلة للاستدعاء، ويسجلها في الـ DB.
ده بيحول 1000 package → 100,000+ أداة فعلية.
"""
import os, sys, importlib, inspect, json, sqlite3, time, gc
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

DB_PATH = "/home/z/my-project/db/custom.db"
SITE = "/home/z/.venv/lib/python3.12/site-packages"
LOG = Path("/home/z/my-project/exports/tool_scanner.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

# mappings for packages with different import names
IMPORT_MAP = {
    "PIL": "PIL", "PyPDF2": "PyPDF2", "cv2": "cv2", "bs4": "bs4",
    "docx": "docx", "pptx": "pptx", "fitz": "fitz", "faiss": "faiss",
    "jwt": "jwt", "yaml": "yaml", "Crypto": "Crypto", "OpenSSL": "OpenSSL",
    "nacl": "nacl", "google": "google", "googleapiclient": "googleapiclient",
    "youtube_transcript_api": "youtube_transcript_api",
    "readability_lxml": "readability_lxml", "discord": "discord",
    "slack_sdk": "slack_sdk", "websocket": "websocket",
    "snowflake": "snowflake.connector",
    "google_cloud": "google.cloud.bigquery",
    "edge_tts": "edge_tts", "gtts": "gtts",
    "deep_translator": "deep_translator",
    "sklearn": "sklearn", "skimage": "skimage",
    "dateutil": "dateutil", "dotenv": "dotenv",
    "magic": "magic", "slugify": "slugify", "barcode": "barcode",
    "argon2": "argon2", "async_timeout": "async_timeout",
}

def get_import_name(pkg_dir):
    """بيـ map directory name لـ import name."""
    if pkg_dir in IMPORT_MAP:
        return IMPORT_MAP[pkg_dir]
    # try importing with the directory name
    return pkg_dir.replace('-', '_').replace('.', '_').lower()

def scan_package(pkg_dir, import_name):
    """بيفحص package واحد ويرجّع كل الـ functions."""
    try:
        mod = importlib.import_module(import_name)
        functions = []
        classes = []
        
        for name in dir(mod):
            if name.startswith('_'):
                continue
            try:
                obj = getattr(mod, name)
                if callable(obj) and not isinstance(obj, type):
                    # function
                    try:
                        sig = inspect.signature(obj)
                        params = list(sig.parameters.keys())[:5]
                        doc = (inspect.getdoc(obj) or "")[:200]
                    except:
                        params = []
                        doc = ""
                    functions.append({
                        "name": f"{import_name}.{name}",
                        "package": pkg_dir,
                        "type": "function",
                        "params": params,
                        "doc": doc,
                    })
                elif isinstance(obj, type):
                    # class — extract methods
                    try:
                        methods = []
                        for mname in dir(obj):
                            if mname.startswith('_'):
                                continue
                            try:
                                mobj = getattr(obj, mname)
                                if callable(mobj):
                                    methods.append(mname)
                            except: pass
                        if methods:
                            classes.append({
                                "name": f"{import_name}.{name}",
                                "package": pkg_dir,
                                "type": "class",
                                "methods": methods[:20],
                            })
                    except: pass
            except: pass
        
        return functions, classes
    except:
        return [], []

def main():
    log("=" * 60)
    log("🚀 V.138 Auto-Discovery Tool Scanner — START")
    log("=" * 60)
    
    # get all package dirs
    pkgs = [d for d in os.listdir(SITE) 
            if os.path.isdir(os.path.join(SITE, d)) 
            and not d.startswith('_') 
            and not d.endswith('.dist-info')
            and not d.endswith('.egg-info')
            and not '.' in d]
    
    log(f"📦 Found {len(pkgs)} packages to scan")
    
    # scan each package
    all_tools = []
    all_classes = []
    start = time.time()
    
    for i, pkg in enumerate(pkgs, 1):
        imp = get_import_name(pkg)
        fns, cls = scan_package(pkg, imp)
        all_tools.extend(fns)
        all_classes.extend(cls)
        
        if i % 50 == 0:
            elapsed = time.time() - start
            rate = i / elapsed if elapsed > 0 else 0
            log(f"  [{i}/{len(pkgs)}] {len(all_tools):,} tools found | {rate:.1f} pkg/s")
            gc.collect()
    
    # count class methods as tools too
    method_count = sum(len(c.get('methods', [])) for c in all_classes)
    total_tools = len(all_tools) + method_count
    
    log("=" * 60)
    log(f"📊 RESULTS:")
    log(f"   Packages scanned: {len(pkgs)}")
    log(f"   Functions: {len(all_tools):,}")
    log(f"   Classes: {len(all_classes):,}")
    log(f"   Class methods: {method_count:,}")
    log(f"   TOTAL TOOLS: {total_tools:,}")
    log(f"   Time: {time.time() - start:.1f}s")
    log("=" * 60)
    
    # save to JSON
    with open("/home/z/my-project/exports/discovered_tools.json", "w") as f:
        json.dump({
            "total": total_tools,
            "functions": len(all_tools),
            "classes": len(all_classes),
            "methods": method_count,
            "tools": all_tools[:5000],  # save first 5000 for sampling
        }, f, ensure_ascii=False, indent=2)
    
    log(f"✅ Saved to discovered_tools.json")
    
    # register in DB
    log("📝 Registering in DB...")
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA synchronous=OFF;")
    cur = conn.cursor()
    
    # create tools table if not exists
    cur.execute("""CREATE TABLE IF NOT EXISTS DiscoveredTools (
        id TEXT PRIMARY KEY,
        name TEXT,
        package TEXT,
        type TEXT,
        params TEXT,
        doc TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )""")
    conn.commit()
    
    # insert functions
    import uuid
    batch = []
    for tool in all_tools:
        batch.append((
            str(uuid.uuid4()),
            tool['name'],
            tool['package'],
            tool['type'],
            json.dumps(tool['params']),
            tool['doc'][:200],
        ))
    
    cur.executemany("""INSERT OR IGNORE INTO DiscoveredTools 
        (id, name, package, type, params, doc) VALUES (?, ?, ?, ?, ?, ?)""", batch)
    conn.commit()
    
    cur.execute("SELECT COUNT(*) FROM DiscoveredTools")
    db_count = cur.fetchone()[0]
    log(f"✅ DB: {db_count:,} tools registered")
    conn.close()

if __name__ == "__main__":
    main()
