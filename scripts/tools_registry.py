"""Tools Registry — V.102 — 12 tools (مع Coqui TTS + Whisper)"""
import json, os, sys, subprocess, asyncio
from pathlib import Path
EXPORTS_DIR = Path.cwd() / "exports"
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

TOOLS_SCHEMA = [
    {"type":"function","function":{"name":"web_search","description":"Search the web","parameters":{"type":"object","properties":{"query":{"type":"string"},"num_results":{"type":"integer","default":5}},"required":["query"]}}},
    {"type":"function","function":{"name":"read_pdf","description":"Extract text from PDF","parameters":{"type":"object","properties":{"file_path":{"type":"string"}},"required":["file_path"]}}},
    {"type":"function","function":{"name":"write_file","description":"Write file to /exports/","parameters":{"type":"object","properties":{"filename":{"type":"string"},"content":{"type":"string"}},"required":["filename","content"]}}},
    {"type":"function","function":{"name":"execute_python","description":"Execute Python code","parameters":{"type":"object","properties":{"code":{"type":"string"},"timeout":{"type":"integer","default":30}},"required":["code"]}}},
    {"type":"function","function":{"name":"generate_chart","description":"Generate chart PNG","parameters":{"type":"object","properties":{"chart_type":{"type":"string","enum":["line","bar","pie","scatter"]},"x_data":{"type":"array"},"y_data":{"type":"array"},"title":{"type":"string"},"filename":{"type":"string"}},"required":["chart_type","x_data","y_data"]}}},
    {"type":"function","function":{"name":"text_to_speech","description":"Text to speech MP3 (gTTS - fast, basic)","parameters":{"type":"object","properties":{"text":{"type":"string"},"lang":{"type":"string","default":"ar"},"filename":{"type":"string"}},"required":["text"]}}},
    {"type":"function","function":{"name":"text_to_speech_neural","description":"Text to speech with Microsoft Neural voices (high quality)","parameters":{"type":"object","properties":{"text":{"type":"string"},"voice":{"type":"string","default":"ar-EG-SalmaNeural"},"filename":{"type":"string"}},"required":["text"]}}},
    {"type":"function","function":{"name":"text_to_speech_cloning","description":"Text to speech with voice cloning (Coqui XTTS - needs sample audio)","parameters":{"type":"object","properties":{"text":{"type":"string"},"speaker_wav":{"type":"string","description":"Path to sample voice audio"},"language":{"type":"string","default":"ar"},"filename":{"type":"string"}},"required":["text","speaker_wav"]}}},
    {"type":"function","function":{"name":"speech_to_text","description":"Transcribe audio file to text (Whisper)","parameters":{"type":"object","properties":{"file_path":{"type":"string"},"model_size":{"type":"string","default":"base","enum":["tiny","base","small","medium","large"]}},"required":["file_path"]}}},
    {"type":"function","function":{"name":"scrape_web","description":"Extract text from URL","parameters":{"type":"object","properties":{"url":{"type":"string"}},"required":["url"]}}},
    {"type":"function","function":{"name":"calculate_math","description":"Evaluate math expression","parameters":{"type":"object","properties":{"expression":{"type":"string"}},"required":["expression"]}}},
]

def web_search(query, num_results=5):
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs: results = list(ddgs.text(query, max_results=num_results))
        return json.dumps({"results":[{"title":r.get("title",""),"url":r.get("href",""),"snippet":r.get("body","")[:200]} for r in results]}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def read_pdf(file_path):
    try:
        import fitz
        doc = fitz.open(file_path)
        text = "".join(p.get_text() for p in doc)
        doc.close()
        return json.dumps({"content": text[:5000]}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def write_file(filename, content):
    safe = Path(filename).name
    (EXPORTS_DIR / safe).write_text(content, encoding="utf-8")
    return json.dumps({"success": True, "file_url": f"/api/file/download/{safe}"}, ensure_ascii=False)

def execute_python(code, timeout=30):
    sp = EXPORTS_DIR / f"exec_{os.getpid()}_{int(__import__('time').time())}.py"
    before = set(EXPORTS_DIR.glob("*"))
    try:
        sp.write_text(code, encoding="utf-8")
        r = subprocess.run([sys.executable, str(sp)], capture_output=True, text=True, timeout=timeout, cwd=str(EXPORTS_DIR))
        after = set(EXPORTS_DIR.glob("*"))
        new_files = [f.name for f in (after-before) if f.name != sp.name]
        return json.dumps({"success": r.returncode==0, "stdout": r.stdout[:3000], "stderr": r.stderr[:1000], "generated_files": new_files, "file_urls": [f"/api/file/download/{f}" for f in new_files]}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})
    finally:
        try: sp.unlink()
        except: pass

def generate_chart(chart_type, x_data, y_data, title="", filename="chart.png"):
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        fp = EXPORTS_DIR / Path(filename).name
        fig, ax = plt.subplots(figsize=(10,6))
        if chart_type=="line": ax.plot(x_data, y_data, "b-o")
        elif chart_type=="bar": ax.bar(x_data, y_data)
        elif chart_type=="pie": ax.pie(y_data, labels=x_data, autopct="%1.1f%%")
        elif chart_type=="scatter": ax.scatter(x_data, y_data)
        if title: ax.set_title(title)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(fp, dpi=100, bbox_inches="tight")
        plt.close()
        return json.dumps({"success": True, "file_url": f"/api/file/download/{Path(filename).name}"}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def text_to_speech(text, lang="ar", filename="tts_gtts.mp3"):
    try:
        from gtts import gTTS
        fp = EXPORTS_DIR / Path(filename).name
        gTTS(text=text, lang=lang, slow=False).save(str(fp))
        return json.dumps({"success": True, "engine": "gTTS", "file_url": f"/api/file/download/{Path(filename).name}"}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def text_to_speech_neural(text, voice="ar-EG-SalmaNeural", filename="tts_neural.mp3"):
    try:
        import edge_tts
        fp = EXPORTS_DIR / Path(filename).name
        async def _run():
            c = edge_tts.Communicate(text, voice)
            await c.save(str(fp))
        asyncio.run(_run())
        return json.dumps({"success": True, "engine": "Edge TTS Neural", "voice": voice, "file_url": f"/api/file/download/{Path(filename).name}"}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def text_to_speech_cloning(text, speaker_wav, language="ar", filename="tts_clone.wav"):
    try:
        from TTS.api import TTS
        fp = EXPORTS_DIR / Path(filename).name
        tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        tts.tts_to_file(text=text, speaker_wav=speaker_wav, language=language, file_path=str(fp))
        return json.dumps({"success": True, "engine": "Coqui XTTS", "file_url": f"/api/file/download/{Path(filename).name}"}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def speech_to_text(file_path, model_size="base"):
    try:
        import whisper
        model = whisper.load_model(model_size)
        result = model.transcribe(file_path)
        return json.dumps({"text": result["text"], "language": result.get("language",""), "engine": "Whisper "+model_size}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def scrape_web(url):
    try:
        import requests
        from bs4 import BeautifulSoup
        resp = requests.get(url, timeout=15, headers={"User-Agent":"Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script","style","nav","footer"]): tag.decompose()
        return json.dumps({"content": soup.get_text(separator="\n", strip=True)[:5000]}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

def calculate_math(expression):
    try:
        import ast, operator
        ops = {ast.Add:operator.add, ast.Sub:operator.sub, ast.Mult:operator.mul, ast.Div:operator.truediv, ast.Pow:operator.pow, ast.Mod:operator.mod, ast.USub:operator.neg}
        def ev(n):
            if isinstance(n, ast.Constant) and isinstance(n.value, (int,float)): return n.value
            elif isinstance(n, ast.BinOp) and type(n.op) in ops: return ops[type(n.op)](ev(n.left), ev(n.right))
            elif isinstance(n, ast.UnaryOp) and type(n.op) in ops: return ops[type(n.op)](ev(n.operand))
            raise ValueError("Invalid")
        return json.dumps({"result": ev(ast.parse(expression, mode="eval").body)}, ensure_ascii=False)
    except Exception as e: return json.dumps({"error": str(e)})

TOOL_FUNCTIONS = {
    "web_search": web_search, "read_pdf": read_pdf, "write_file": write_file,
    "execute_python": execute_python, "generate_chart": generate_chart,
    "text_to_speech": text_to_speech, "text_to_speech_neural": text_to_speech_neural,
    "text_to_speech_cloning": text_to_speech_cloning, "speech_to_text": speech_to_text,
    "scrape_web": scrape_web, "calculate_math": calculate_math,
}

def execute_tool(name, args):
    f = TOOL_FUNCTIONS.get(name)
    if not f: return json.dumps({"error": f"Unknown tool: {name}"})
    try: return f(**args)
    except Exception as e: return json.dumps({"error": str(e)})

def get_tools_schema(): return TOOLS_SCHEMA
def list_available_tools(): return list(TOOL_FUNCTIONS.keys())

if __name__ == "__main__":
    print("Tools:", list_available_tools())
