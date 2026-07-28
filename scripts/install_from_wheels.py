#!/usr/bin/env python3
"""
V.113: Fast Tools Installer — بيـ install من wheel files محلية (offline).
بيـ download الـ wheels من HF Dataset مرة واحدة، وبعدين يـ install بسرعة.
"""
import subprocess, sys, os, time, sqlite3
from pathlib import Path

DB_PATH = os.environ.get("DB_PATH", "/home/z/my-project/db/custom.db")
WHEELS_DIR = "/home/z/my-project/wheels"
HF_TOKEN = os.environ.get("HF_TOKEN", "")
WHEELS_DATASET = "kopabdo/anzaro-python-wheels"
LOG = Path("/home/z/my-project/exports/fast_install.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    Path(LOG).parent.mkdir(parents=True, exist_ok=True)
    with open(LOG, "a") as f: f.write(line + "\n")

def download_wheels_from_hf():
    """بيـ download wheel files من HF Dataset."""
    log("📥 Downloading wheels from HF Dataset...")
    try:
        from huggingface_hub import snapshot_download
        os.makedirs(WHEELS_DIR, exist_ok=True)
        kwargs = {"repo_id": WHEELS_DATASET, "repo_type": "dataset", "local_dir": WHEELS_DIR}
        if HF_TOKEN:
            kwargs["token"] = HF_TOKEN
        snapshot_download(**kwargs)
        wheels = list(Path(WHEELS_DIR).glob("*.whl"))
        log(f"✅ Downloaded {len(wheels)} wheels")
        return True
    except Exception as e:
        log(f"❌ Download failed: {e}")
        return False

def install_from_wheels():
    """بيـ install كل الـ wheels محلياً (offline, سريع جداً)."""
    wheels = list(Path(WHEELS_DIR).glob("*.whl"))
    if not wheels:
        log("⚠️ No wheels found — downloading from HF...")
        if not download_wheels_from_hf():
            return False
        wheels = list(Path(WHEELS_DIR).glob("*.whl"))

    log(f"📦 Installing {len(wheels)} wheels (offline)...")
    start = time.time()

    # install all wheels at once
    wheel_paths = [str(w) for w in wheels]
    cmd = [
        sys.executable, "-m", "pip", "install",
        "--no-cache-dir",
        "--no-index",
        "--find-links", WHEELS_DIR,
        "--break-system-packages",
        "--quiet",
    ] + wheel_paths

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

    if result.returncode == 0:
        elapsed = time.time() - start
        log(f"✅ Installed {len(wheels)} wheels in {elapsed:.1f}s")
        return True
    else:
        log(f"⚠️ Bulk install failed, trying one by one...")
        # fallback: install one by one
        installed = 0
        for wheel in wheels:
            try:
                r = subprocess.run(
                    [sys.executable, "-m", "pip", "install", "--no-cache-dir",
                     "--no-index", "--find-links", WHEELS_DIR,
                     "--break-system-packages", "--quiet", str(wheel)],
                    capture_output=True, text=True, timeout=30
                )
                if r.returncode == 0:
                    installed += 1
            except: pass
        log(f"✅ Installed {installed}/{len(wheels)} wheels")
        return installed > 0

def mark_installed_in_db():
    """بيـ update الـ DB بـ status التثبيت."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    tools_to_check = [
        "openai", "anthropic", "tiktoken", "cowsay", "pyjokes", "qrcode",
        "edge-tts", "gTTS", "deep-translator", "vaderSentiment", "textstat",
        "markdown", "pdfplumber", "pypdf", "python-docx", "python-pptx",
        "openpyxl", "reportlab", "fpdf2", "requests", "httpx", "beautifulsoup4",
        "lxml", "yt-dlp", "pillow", "opencv-python-headless", "pytesseract",
        "pandas", "numpy", "scipy", "scikit-learn", "matplotlib", "seaborn",
        "plotly", "sympy", "statsmodels", "passlib", "bcrypt", "schedule",
        "loguru", "pyyaml", "python-dotenv", "rich", "click", "typer", "tqdm",
        "pydantic", "jinja2", "tabulate", "fastapi", "uvicorn", "websockets",
        "psutil", "python-dateutil", "pytz",
    ]
    updated = 0
    for name in tools_to_check:
        base = name.replace("-", "_").replace("opencv-python-headless","cv2").replace("python-docx","docx").replace("python-pptx","pptx").replace("beautifulsoup4","bs4").replace("fpdf2","fpdf").replace("gTTS","gtts").replace("edge-tts","edge_tts").replace("deep-translator","deep_translator").replace("scikit-learn","sklearn").replace("python-dotenv","dotenv").replace("python-dateutil","dateutil")
        try:
            r = subprocess.run([sys.executable, "-c", f"import {base}"], capture_output=True, timeout=10)
            if r.returncode == 0:
                cur.execute("UPDATE ToolRegistry SET isInstalled=1, isVerified=1, installPath='wheel', updatedAt=datetime('now') WHERE name=? AND source='pypi'", (name,))
                updated += cur.rowcount
        except: pass
    conn.commit()
    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE isInstalled=1")
    total = cur.fetchone()[0]
    log(f"📊 DB updated: {updated} tools | Total installed: {total}")
    conn.close()

def main():
    log("=" * 60)
    log("🚀 V.113 Fast Tools Installer — START")
    log("=" * 60)

    # check if wheels already exist
    wheels = list(Path(WHEELS_DIR).glob("*.whl"))
    if not wheels:
        log("⚠️ No wheels found — downloading from HF Dataset...")
        if not download_wheels_from_hf():
            log("❌ Failed to download wheels")
            return

    # install from wheels
    if install_from_wheels():
        mark_installed_in_db()
        log("🏁 DONE — All tools installed from wheels")
    else:
        log("❌ Install failed")

if __name__ == "__main__":
    main()
