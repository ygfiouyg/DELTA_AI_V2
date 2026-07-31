/**
 * V.133: Custom Tools — أدوات مخصصة باستخدام langchain @tool
 * كل أداة بتـ wrap مكتبة مثبتة وتخليها callable من الـ Agent
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

const PYTHON_PATHS = ["python3", "/usr/bin/python3", "/usr/local/bin/python3", "/app/.venv/bin/python3", "/home/z/.venv/bin/python3"];
const SITE_PACKAGES = ["/usr/local/lib/python3.11/dist-packages", "/usr/lib/python3/dist-packages", "/app/.venv/lib/python3.12/site-packages", "/home/z/.venv/lib/python3.12/site-packages"];

async function runPython(code: string, timeoutMs = 60000): Promise<string> {
  const pythonPath = "python3";
  const pythonpath = SITE_PACKAGES.join(":");
  return new Promise((resolve) => {
    const proc = spawn(pythonPath, ["-c", code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1", PYTHONPATH: pythonpath },
    });
    let stdout = "", stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => { proc.kill("SIGKILL"); resolve(JSON.stringify({ error: "Timeout" })); }, timeoutMs);
    proc.on("close", () => { clearTimeout(timer); resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : "")); });
    proc.on("error", (e) => { clearTimeout(timer); resolve(JSON.stringify({ error: e.message })); });
  });
}

// ═══════════════════════════════════════════
// Tool Definition Schema (LangChain-compatible)
// ═══════════════════════════════════════════
export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<string>;
}

// ═══════════════════════════════════════════
// AUDIO TOOLS (edge-tts, pydub, faster-whisper)
// ═══════════════════════════════════════════

export const textToSpeech: AgentTool = {
  name: "text_to_speech",
  description: "تحويل نص إلى صوت MP3 عالي الجودة باستخدام edge-tts. استخدمها لما المستخدم يطلب تحويل نص لصوت أو إنشاء ملف صوتي.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تحويله لصوت" },
    voice: { type: "string", description: "الصوت (ar-EG-SalmaNeural, ar-SA-HamedNeural, en-US-JennyNeural)", default: "ar-EG-SalmaNeural" },
    filename: { type: "string", description: "اسم الملف الناتج", default: "output.mp3" },
  },
  execute: async (args) => {
    const code = `
import edge_tts, asyncio, json
async def run():
    comm = edge_tts.Communicate("${(args.text || "").replace(/"/g, '\\"')}", "${args.voice || 'ar-EG-SalmaNeural'}")
    fname = "${args.filename || 'output.mp3'}"
    await comm.save(fname)
    print(json.dumps({"file": fname, "text_length": len("${args.text}"), "voice": "${args.voice}"}))
asyncio.run(run())
`;
    return runPython(code);
  },
};

export const transcribeAudio: AgentTool = {
  name: "transcribe_audio",
  description: "تحويل ملف صوتي إلى نص (Speech-to-Text) باستخدام faster-whisper. استخدمها لتحليل التسجيلات الصوتية أو تحويل الصوت لنص.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف الصوت" },
    language: { type: "string", description: "لغة الصوت (ar, en, auto)", default: "auto" },
  },
  execute: async (args) => {
    const code = `
import json
try:
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe("${args.file_path}", language="${args.language}" if "${args.language}" != "auto" else None)
    text = " ".join([seg.text for seg in segments])
    print(json.dumps({"text": text, "language": info.language, "duration": info.duration}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code, 120000);
  },
};

export const cleanAudio: AgentTool = {
  name: "clean_audio",
  description: "تنظيف وتحسين جودة الصوت (إزالة الضوضاء، تطبيع الصوت) باستخدام pydub. استخدمها قبل تحويل الصوت لنص لتحسين الدقة.",
  parameters: {
    input_path: { type: "string", description: "مسار ملف الصوت الأصلي" },
    output_path: { type: "string", description: "مسار ملف الصوت النظيف", default: "cleaned.wav" },
  },
  execute: async (args) => {
    const code = `
from pydub import AudioSegment, effects
import json
audio = AudioSegment.from_file("${args.input_path}")
# Normalize
audio = effects.normalize(audio)
# Remove silence at start/end
audio = audio.strip_silence(threshold=-40, padding=100)
out = "${args.output_path || 'cleaned.wav'}"
audio.export(out, format="wav")
print(json.dumps({"file": out, "duration_sec": len(audio) / 1000, "sample_rate": audio.frame_rate}))
`;
    return runPython(code);
  },
};

export const convertAudioFormat: AgentTool = {
  name: "convert_audio_format",
  description: "تحويل صوت من format لآخر (mp3, wav, ogg, flac) باستخدام pydub.",
  parameters: {
    input_path: { type: "string", description: "مسار الملف الأصلي" },
    output_format: { type: "string", description: "الصيغة المطلوبة (mp3, wav, ogg, flac)" },
  },
  execute: async (args) => {
    const fmt = args.output_format || "mp3";
    const code = `
from pydub import AudioSegment
import json
audio = AudioSegment.from_file("${args.input_path}")
out = "${args.input_path.rsplit('.', 1)[0]}_converted.${fmt}"
audio.export(out, format="${fmt}")
print(json.dumps({"file": out, "format": "${fmt}", "duration_sec": len(audio) / 1000}))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// DOCUMENT TOOLS (fitz/PyMuPDF, pdfplumber, python-docx)
// ═══════════════════════════════════════════

export const extractPdfText: AgentTool = {
  name: "extract_pdf_text",
  description: "استخراج النص الكامل من ملف PDF باستخدام PyMuPDF. استخدمها لما المستخدم يطلب قراءة أو تحليل ملف PDF.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف PDF" },
    max_pages: { type: "integer", description: "أقصى عدد صفحات", default: 50 },
  },
  execute: async (args) => {
    const code = `
import pymupdf, json
doc = pymupdf.open("${args.file_path}")
max_p = min(len(doc), ${args.max_pages || 50})
text = ""
for i in range(max_p):
    text += doc[i].get_text()
    text += "\\n--- Page " + str(i+1) + " ---\\n"
doc.close()
print(json.dumps({"text": text[:5000], "pages": len(doc), "chars": len(text)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const createDocument: AgentTool = {
  name: "create_document",
  description: "إنشاء مستند Word/PDF/Excel من نص. استخدمها لما المستخدم يطلب إنشاء ملف.",
  parameters: {
    format: { type: "string", description: "نوع المستند (docx, pdf, xlsx)" },
    title: { type: "string", description: "عنوان المستند" },
    content: { type: "string", description: "محتوى المستند" },
    filename: { type: "string", description: "اسم الملف" },
  },
  execute: async (args) => {
    const fmt = args.format || "docx";
    const fname = args.filename || `document.${fmt}`;
    let code = "";
    if (fmt === "docx") {
      code = `
from docx import Document
import json
doc = Document()
doc.add_heading("${(args.title || '').replace(/"/g, '\\"')}", 0)
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    doc.add_paragraph(line)
doc.save("${fname}")
print(json.dumps({"file": "${fname}", "format": "docx"}))
`;
    } else if (fmt === "pdf") {
      code = `
from fpdf import FPDF
import json
pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", size=12)
pdf.cell(0, 10, text="${(args.title || '').replace(/"/g, '\\"')}", ln=True)
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    pdf.cell(0, 10, text=line, ln=True)
pdf.output("${fname}")
print(json.dumps({"file": "${fname}", "format": "pdf"}))
`;
    } else {
      code = `
from openpyxl import Workbook
import json
wb = Workbook()
ws = wb.active
ws.append(["${(args.title || '').replace(/"/g, '\\"')}"])
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    ws.append([line])
wb.save("${fname}")
print(json.dumps({"file": "${fname}", "format": "xlsx"}))
`;
    }
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// DATA & ANALYSIS TOOLS (pandas, numpy, matplotlib)
// ═══════════════════════════════════════════

export const analyzeData: AgentTool = {
  name: "analyze_data",
  description: "تحليل بيانات CSV/JSON باستخدام pandas. استخدمها لما المستخدم يطلب تحليل بيانات أو إحصائيات.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف البيانات (CSV/JSON)" },
    operation: { type: "string", description: "العملية (describe, head, columns, info)" },
  },
  execute: async (args) => {
    const code = `
import pandas as pd, json
df = pd.read_csv("${args.file_path}") if "${args.file_path}".endswith('.csv') else pd.read_json("${args.file_path}")
op = "${args.operation || 'describe'}"
if op == "describe":
    result = df.describe().to_dict()
elif op == "head":
    result = df.head(10).to_dict('records')
elif op == "columns":
    result = {"columns": list(df.columns), "dtypes": {c: str(df[c].dtype) for c in df.columns}}
elif op == "info":
    result = {"rows": len(df), "columns": len(df.columns), "memory": df.memory_usage().sum()}
else:
    result = df.head(5).to_dict('records')
print(json.dumps(result, default=str, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const createChart: AgentTool = {
  name: "create_chart",
  description: "إنشاء رسم بياني (bar, line, pie, scatter) من بيانات باستخدام matplotlib.",
  parameters: {
    chart_type: { type: "string", description: "نوع الرسم (bar, line, pie, scatter)" },
    x_data: { type: "array", description: "بيانات المحور X" },
    y_data: { type: "array", description: "بيانات المحور Y" },
    title: { type: "string", description: "عنوان الرسم" },
    filename: { type: "string", description: "اسم الملف", default: "chart.png" },
  },
  execute: async (args) => {
    const code = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import json
fig, ax = plt.subplots(figsize=(10,6))
x = ${JSON.stringify(args.x_data || [])}
y = ${JSON.stringify(args.y_data || [])}
ct = "${args.chart_type || 'bar'}"
if ct == "line": ax.plot(x, y, "b-o")
elif ct == "bar": ax.bar(x, y)
elif ct == "pie": ax.pie(y, labels=x, autopct="%1.1f%%")
elif ct == "scatter": ax.scatter(x, y)
if "${args.title || ''}": ax.set_title("${args.title}")
ax.grid(True, alpha=0.3)
plt.tight_layout()
fname = "${args.filename || 'chart.png'}"
plt.savefig(fname, dpi=100)
plt.close()
print(json.dumps({"file": fname}))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// WEB TOOLS (requests, bs4, trafilatura)
// ═══════════════════════════════════════════

export const scrapeWeb: AgentTool = {
  name: "scrape_web",
  description: "استخراج النص من صفحة ويب. استخدمها لما المستخدم يطلب قراءة أو تحليل محتوى موقع.",
  parameters: {
    url: { type: "string", description: "رابط الصفحة" },
  },
  execute: async (args) => {
    const code = `
import trafilatura, json
downloaded = trafilatura.fetch_url("${args.url}")
text = trafilatura.extract(downloaded) or ""
print(json.dumps({"text": text[:5000], "length": len(text)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const httpRequest: AgentTool = {
  name: "http_request",
  description: "إرسال طلب HTTP (GET/POST) لـ API أو موقع. استخدمها لما المستخدم يطلب جلب بيانات من الإنترنت.",
  parameters: {
    method: { type: "string", description: "نوع الطلب (GET, POST)" },
    url: { type: "string", description: "الرابط" },
    headers: { type: "object", description: "headers إضافية" },
  },
  execute: async (args) => {
    const code = `
import requests, json
resp = requests.${(args.method || 'get').toLowerCase()}("${args.url}", headers=${JSON.stringify(args.headers || {})}, timeout=15)
print(json.dumps({"status": resp.status_code, "text": resp.text[:3000]}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// NLP TOOLS (nltk, vaderSentiment, rapidfuzz)
// ═══════════════════════════════════════════

export const analyzeSentiment: AgentTool = {
  name: "analyze_sentiment",
  description: "تحليل مشاعر نص (إيجابي/سلبي/محايد). استخدمها لما المستخدم يطلب تحليل مشاعر أو رأي.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تحليله" },
  },
  execute: async (args) => {
    const code = `
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
analyzer = SentimentIntensityAnalyzer()
scores = analyzer.polarity_scores("""${(args.text || '').replace(/"/g, '\\"')}""")
label = "إيجابي" if scores["compound"] > 0.05 else "سلبي" if scores["compound"] < -0.05 else "محايد"
print(json.dumps({"scores": scores, "label": label}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const translateText: AgentTool = {
  name: "translate_text",
  description: "ترجمة نص بين اللغات باستخدام deep-translator.",
  parameters: {
    text: { type: "string", description: "النص" },
    target_lang: { type: "string", description: "اللغة المستهدفة (en, ar, fr, es)" },
  },
  execute: async (args) => {
    const code = `
from deep_translator import GoogleTranslator
import json
translator = GoogleTranslator(source='auto', target='${args.target_lang || 'en'}')
result = translator.translate("""${(args.text || '').replace(/"/g, '\\"')}""")
print(json.dumps({"translation": result, "target": "${args.target_lang}"}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// MATH & CODE TOOLS (sympy, exec)
// ═══════════════════════════════════════════

export const solveMath: AgentTool = {
  name: "solve_math",
  description: "حل معادلة رياضية أو تبسيطها باستخدام sympy.",
  parameters: {
    expression: { type: "string", description: "المعادلة (مثل: x**2 + 2*x + 1)" },
  },
  execute: async (args) => {
    const code = `
from sympy import sympify, simplify, solve, symbols, diff, integrate
import json
x = symbols('x')
expr = sympify("${args.expression}")
result = {
    "input": "${args.expression}",
    "simplified": str(simplify(expr)),
    "derivative": str(diff(expr, x)),
}
print(json.dumps(result, default=str, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const executePython: AgentTool = {
  name: "execute_python",
  description: "تنفيذ كود Python مباشر. استخدمها للحسابات المعقدة أو المهام البرمجية.",
  parameters: {
    code: { type: "string", description: "كود Python" },
  },
  execute: async (args) => {
    return runPython(args.code || "", 30000);
  },
};

// ═══════════════════════════════════════════
// REGISTRY — كل الأدوات
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// V.134: "عملية تيتانيوم" — Heavy Library Tools
// ═══════════════════════════════════════════

// ── CrewAI: Multi-Agent Orchestration ──
export const runCrewAgents: AgentTool = {
  name: "run_crew_agents",
  description: "تشغيل مجموعة Agents متخصصة باستخدام CrewAI. كل Agent ليه دور (كاتب، مراجع، باحث). استخدمها للمهام المعقدة اللي محتاجة تعاون بين agents.",
  parameters: {
    task: { type: "string", description: "وصف المهمة الكاملة" },
    agents: { type: "string", description: "JSON array of agent roles (e.g. [{role:'writer',goal:'write article'}])" },
  },
  execute: async (args) => {
    const code = `
import json
try:
    from crewai import Agent, Task, Crew
    agents_data = json.loads('''${(args.agents || '[]').replace(/'/g, "\\'")}''')
    task_desc = """${(args.task || '').replace(/"/g, '\\"')}"""
    # Build agents
    agents = []
    for a in agents_data:
        agents.append(Agent(role=a.get('role','assistant'), goal=a.get('goal','help'), backstory=a.get('backstory',''), verbose=True))
    # Build task
    tasks = [Task(description=task_desc, agent=agents[0] if agents else None, expected_output="completed task")]
    # Run crew
    crew = Crew(agents=agents, tasks=tasks, verbose=True)
    result = crew.kickoff()
    print(json.dumps({"result": str(result)[:2000]}, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "fallback": "CrewAI needs configuration"}))
`;
    return runPython(code, 120000);
  },
};

// ── ChromaDB: Long-term Memory ──
export const storeInMemory: AgentTool = {
  name: "store_in_memory",
  description: "تخزين معلومات في ذاكرة طويلة الأمد باستخدام ChromaDB (Vector DB). استخدمها لتخزين نصوص، محاضرات، أو أي معلومات للاسترجاع لاحقاً.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تخزينه" },
    metadata: { type: "string", description: "JSON metadata (optional)" },
  },
  execute: async (args) => {
    const code = `
import chromadb, json
client = chromadb.Client()
collection = client.get_or_create_collection("anzaro_memory")
collection.add(
    documents=["""${(args.text || '').replace(/"/g, '\\"')}"""],
    metadatas=[${args.metadata ? `json.loads('${args.metadata}')` : '{}'}],
    ids=[f"doc_{collection.count()}"]
)
print(json.dumps({"stored": True, "total_docs": collection.count()}))
`;
    return runPython(code);
  },
};

export const searchMemory: AgentTool = {
  name: "search_memory",
  description: "البحث في الذاكرة طويلة الأمد (ChromaDB) عن معلومات مخزنة. استخدمها لاسترجاع معلومات من المحاضرات أو النصوص المخزنة.",
  parameters: {
    query: { type: "string", description: "نص البحث" },
    n_results: { type: "integer", description: "عدد النتائج", default: 5 },
  },
  execute: async (args) => {
    const code = `
import chromadb, json
client = chromadb.Client()
collection = client.get_or_create_collection("anzaro_memory")
results = collection.query(query_texts=["${(args.query || '').replace(/"/g, '\\"')}"], n_results=${args.n_results || 5})
docs = results.get('documents', [[]])[0]
print(json.dumps({"results": docs[:5], "count": len(docs)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ── Playwright: Ghost Browser ──
export const browseWebsite: AgentTool = {
  name: "browse_website",
  description: "تصفح موقع ويب كأنه إنسان حقيقي باستخدام Playwright (متصفح مخفي). يقدر يعمل scroll، يدوس على أزرار، ويسحب بيانات. استخدمها للمواقع المعقدة.",
  parameters: {
    url: { type: "string", description: "رابط الموقع" },
    action: { type: "string", description: "الإجراء (screenshot, text, click)" },
    selector: { type: "string", description: "CSS selector (for click)" },
  },
  execute: async (args) => {
    const code = `
import json
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("${args.url}", timeout=15000)
        action = "${args.action || 'text'}"
        if action == "screenshot":
            page.screenshot(path="browse_screenshot.png")
            result = {"file": "browse_screenshot.png"}
        elif action == "click" and "${args.selector || ''}":
            page.click("${args.selector}")
            page.wait_for_timeout(2000)
            result = {"clicked": True, "text": page.inner_text('body')[:2000]}
        else:
            result = {"title": page.title(), "text": page.inner_text('body')[:3000]}
        browser.close()
    print(json.dumps(result, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code, 30000);
  },
};

// ── Polars: Fast Data Analysis ──
export const fastAnalyzeData: AgentTool = {
  name: "fast_analyze_data",
  description: "تحليل بيانات ضخمة بسرعة 10x أسرع من pandas باستخدام Polars. استخدمها للبيانات الكبيرة جداً.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف CSV/JSON" },
    operation: { type: "string", description: "العملية (describe, head, columns, count)" },
  },
  execute: async (args) => {
    const code = `
import polars as pl, json
df = pl.read_csv("${args.file_path}") if "${args.file_path}".endswith('.csv') else pl.read_json("${args.file_path}")
op = "${args.operation || 'describe'}"
if op == "describe": result = df.describe().to_dicts()
elif op == "head": result = df.head(10).to_dicts()
elif op == "columns": result = {"columns": df.columns, "shape": df.shape}
elif op == "count": result = {"rows": df.height, "cols": df.width}
else: result = df.head(5).to_dicts()
print(json.dumps(result, default=str, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ── Voice Cloning (TTS Coqui) ──
export const cloneVoice: AgentTool = {
  name: "clone_voice",
  description: "استنساخ صوت من عينة صوتية وتوليد صوت جديد بنفس النبرة باستخدام Coqui TTS. استخدمها لإنشاء بودكاست أو رد صوتي بنبرة مخصصة.",
  parameters: {
    text: { type: "string", description: "النص المطلوب نطقه" },
    speaker_wav: { type: "string", description: "مسار عينة الصوت المراد استنساخها" },
    language: { type: "string", description: "اللغة (ar, en)", default: "ar" },
    filename: { type: "string", description: "اسم الملف الناتج", default: "cloned_voice.wav" },
  },
  execute: async (args) => {
    const code = `
import json
try:
    from TTS.api import TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    tts.tts_to_file(
        text="""${(args.text || '').replace(/"/g, '\\"')}""",
        speaker_wav="${args.speaker_wav}",
        language="${args.language || 'ar'}",
        file_path="${args.filename || 'cloned_voice.wav'}"
    )
    print(json.dumps({"file": "${args.filename}", "engine": "Coqui XTTS"}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "fallback": "Use text_to_speech instead"}))
`;
    return runPython(code, 120000);
  },
};

// ── librosa: Audio Analysis ──
export const analyzeAudio: AgentTool = {
  name: "analyze_audio",
  description: "تحليل موجات الصوت وتردداته باستخدام librosa. استخدمها لفصل، تنقيح، أو تحليل المكونات الصوتية.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف الصوت" },
  },
  execute: async (args) => {
    const code = `
import librosa, json, numpy as np
y, sr = librosa.load("${args.file_path}", sr=None)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
result = {
    "duration_sec": len(y) / sr,
    "sample_rate": sr,
    "tempo": float(tempo),
    "rms_energy": float(np.sqrt(np.mean(y**2))),
    "zero_crossings": int(np.sum(librosa.zero_crossings(y))),
    "spectral_centroid": float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))),
}
print(json.dumps(result, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ── ffmpeg: Media Engine ──
export const processMedia: AgentTool = {
  name: "process_media",
  description: "تحويل، تقطيع، أو دمج ملفات ميديا (صوت/فيديو) باستخدام ffmpeg. استخدمها لمعالجة الميديا بأي صيغة.",
  parameters: {
    input_path: { type: "string", description: "مسار الملف الأصلي" },
    operation: { type: "string", description: "العملية (convert, trim, merge)" },
    output_path: { type: "string", description: "مسار الملف الناتج" },
    start_time: { type: "string", description: "وقت البداية (للـ trim) e.g. 00:01:00" },
    duration: { type: "string", description: "المدة (للـ trim) e.g. 30" },
  },
  execute: async (args) => {
    const code = `
import ffmpeg, json
inp = ffmpeg.input("${args.input_path}")
op = "${args.operation || 'convert'}"
out = "${args.output_path || 'output.mp4'}"
if op == "trim":
    inp = ffmpeg.input("${args.input_path}", ss="${args.start_time || '0'}", t="${args.duration || '10'}")
    inp.output(out).overwrite_output().run()
elif op == "convert":
    inp.output(out).overwrite_output().run()
result = {"file": out, "operation": op}
print(json.dumps(result))
`;
    return runPython(code, 60000);
  },
};

// ── MQTT: Hardware Control ──
export const sendMqttCommand: AgentTool = {
  name: "send_mqtt_command",
  description: "إرسال أمر لجهاز إلكتروني عبر MQTT (إضاءة، مايك، سينسور). استخدمها للتحكم في الأجهزة الذكية.",
  parameters: {
    broker: { type: "string", description: "MQTT broker address" },
    topic: { type: "string", description: "MQTT topic" },
    message: { type: "string", description: "الأمر المطلوب إرساله" },
  },
  execute: async (args) => {
    const code = `
import paho.mqtt.client as mqtt, json
client = mqtt.Client()
client.connect("${args.broker || 'localhost'}", 1883, 60)
client.publish("${args.topic}", "${args.message}")
client.disconnect()
print(json.dumps({"sent": True, "topic": "${args.topic}", "message": "${args.message}"}))
`;
    return runPython(code);
  },
};

// ── pyserial: Serial Hardware ──
export const serialCommand: AgentTool = {
  name: "serial_command",
  description: "إرسال أومر لمتحكم دقيق (Arduino, ESP32) عبر منفذ سيريال USB. استخدمها للتحكم في الهاردوير مباشرة.",
  parameters: {
    port: { type: "string", description: "منفذ السيريال (e.g. /dev/ttyUSB0)" },
    command: { type: "string", description: "الأمر" },
    baudrate: { type: "integer", description: "سرعة الاتصال", default: 9600 },
  },
  execute: async (args) => {
    const code = `
import serial, json, time
ser = serial.Serial("${args.port}", ${args.baudrate || 9600}, timeout=5)
time.sleep(2)
ser.write(b"${args.command}\\n")
response = ser.readline().decode().strip()
ser.close()
print(json.dumps({"sent": "${args.command}", "response": response}))
`;
    return runPython(code);
  },
};

// ── moviepy: Auto Video Editor ──
export const createVideo: AgentTool = {
  name: "create_video",
  description: "إنشاء فيديو من صور وصوت تلقائياً باستخدام moviepy. استخدمها لإنتاج محتوى فيديو من مواد خام.",
  parameters: {
    images: { type: "string", description: "JSON array of image paths" },
    audio_path: { type: "string", description: "مسار ملف الصوت" },
    output_path: { type: "string", description: "اسم ملف الفيديو", default: "output.mp4" },
  },
  execute: async (args) => {
    const code = `
import json
try:
    from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
    images = json.loads('''${args.images || '[]'}''')
    audio = AudioFileClip("${args.audio_path}")
    clips = []
    dur = audio.duration / max(len(images), 1)
    for img in images:
        clip = ImageClip(img).set_duration(dur)
        clips.append(clip)
    video = concatenate_videoclips(clips).set_audio(audio)
    video.write_videofile("${args.output_path || 'output.mp4'}", fps=24, codec='libx264')
    print(json.dumps({"file": "${args.output_path}", "duration": audio.duration}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code, 120000);
  },
};

// ── pyautogui: Desktop Automation ──
export const automateDesktop: AgentTool = {
  name: "automate_desktop",
  description: "التحكم في الماوس والكيبورد تلقائياً باستخدام pyautogui. استخدمها لفتح برامج، الضغط على أزرار، أو كتابة نص.",
  parameters: {
    action: { type: "string", description: "الإجراء (click, type, screenshot, hotkey)" },
    x: { type: "integer", description: "إحداثي X (for click)" },
    y: { type: "integer", description: "إحداثي Y (for click)" },
    text: { type: "string", description: "النص (for type)" },
    keys: { type: "string", description: "المفاتيح (for hotkey, e.g. ctrl+c)" },
  },
  execute: async (args) => {
    const code = `
import pyautogui, json
action = "${args.action || 'screenshot'}"
if action == "click":
    pyautogui.click(${args.x || 0}, ${args.y || 0})
    result = {"clicked": [${args.x || 0}, ${args.y || 0}]}
elif action == "type":
    pyautogui.typewrite("""${(args.text || '').replace(/"/g, '\\"')}""")
    result = {"typed": True}
elif action == "hotkey":
    keys = "${args.keys || ''}".split("+")
    pyautogui.hotkey(*keys)
    result = {"hotkey": "${args.keys}"}
elif action == "screenshot":
    img = pyautogui.screenshot()
    img.save("desktop_screenshot.png")
    result = {"file": "desktop_screenshot.png"}
else:
    result = {"error": "unknown action"}
print(json.dumps(result))
`;
    return runPython(code);
  },
};

// ── Scrapy: Heavy Data Mining ──
export const mineData: AgentTool = {
  name: "mine_data",
  description: "سحب بيانات ضخمة من مواقع باستخدام Scrapy. استخدمها لسحب آلاف المقالات أو المنتجات في دقائق.",
  parameters: {
    url: { type: "string", description: "رابط الموقع" },
    selector: { type: "string", description: "CSS selector للعناصر المطلوبة" },
    max_items: { type: "integer", description: "أقصى عدد عناصر", default: 50 },
  },
  execute: async (args) => {
    const code = `
import json
try:
    import scrapy
    from scrapy.http import HtmlResponse
    import requests
    resp = requests.get("${args.url}", timeout=15, headers={"User-Agent":"Mozilla/5.0"})
    response = HtmlResponse(url="${args.url}", body=resp.content)
    items = response.css("${args.selector || 'p'}::text").getall()[:${args.max_items || 50}]
    print(json.dumps({"count": len(items), "items": items[:20]}, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// V.135: Mega-Install — 15 new action-oriented tools
// ═══════════════════════════════════════════

// ── rembg: Remove Image Background ──
export const removeImageBackground: AgentTool = {
  name: "remove_image_background",
  description: "إزالة خلفية أي صورة بالذكاء الاصطناعي في ثانية. استخدمها لصناعة ثامبنيلز أو فصل العناصر.",
  parameters: { input_path: { type: "string", description: "مسار الصورة" }, output_path: { type: "string", description: "مسار الناتج" } },
  execute: async (args) => {
    const code = `
import rembg, json
from PIL import Image
inp = Image.open("${args.input_path}")
out = rembg.remove(inp)
out.save("${args.output_path || 'no_bg.png'}")
print(json.dumps({"file": "${args.output_path || 'no_bg.png'}"}))
`;
    return runPython(code, 30000);
  },
};

// ── yagmail: Send Email ──
export const sendEmail: AgentTool = {
  name: "send_email",
  description: "إرسال إيميل مع مرفقات. استخدمها لتبليغ المستخدم أو إرسال تقارير.",
  parameters: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } },
  execute: async (args) => {
    const code = `
import json
try:
    import yagmail
    yag = yagmail.SMTP("anzaro@ai")
    yag.send(to="${args.to}", subject="${args.subject}", contents="${args.body}")
    print(json.dumps({"sent": True}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "note": "yagmail needs config"}))
`;
    return runPython(code);
  },
};

// ── pywhatkit: Send WhatsApp ──
export const sendWhatsapp: AgentTool = {
  name: "send_whatsapp",
  description: "إرسال رسالة واتساب. استخدمها للتواصل المباشر مع المستخدم.",
  parameters: { phone: { type: "string" }, message: { type: "string" } },
  execute: async (args) => {
    const code = `
import pywhatkit, json
try:
    pywhatkit.sendwhatmsg_instantly("${args.phone}", "${args.message}", wait_time=5)
    print(json.dumps({"sent": True}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code, 30000);
  },
};

// ── forex-python: Currency Converter ──
export const convertCurrency: AgentTool = {
  name: "convert_currency",
  description: "تحويل بين العملات بأسعار حية. استخدمها لمعرفة سعر الدولار أو أي عملة.",
  parameters: { amount: { type: "number" }, from_currency: { type: "string" }, to_currency: { type: "string" } },
  execute: async (args) => {
    const code = `
from forex_python.converter import CurrencyRates
import json
c = CurrencyRates()
rate = c.get_rate("${args.from_currency || 'USD'}", "${args.to_currency || 'EGP'}")
result = ${args.amount || 1} * rate
print(json.dumps({"rate": rate, "result": result, "from": "${args.from_currency}", "to": "${args.to_currency}"}))
`;
    return runPython(code);
  },
};

// ── pyowm: Weather ──
export const getWeather: AgentTool = {
  name: "get_weather",
  description: "جلب حالة الطقس لأي مدينة. استخدمها لما المستخدم يسأل عن الطقس.",
  parameters: { city: { type: "string" } },
  execute: async (args) => {
    const code = `
import json
try:
    from pyowm import OWM
    owm = OWM('default')
    mgr = owm.weather_manager()
    obs = mgr.weather_at_place("${args.city}")
    w = obs.weather
    print(json.dumps({"temp": w.temperature('celsius')['temp'], "status": w.detailed_status, "humidity": w.humidity}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "fallback": "weather needs API key"}))
`;
    return runPython(code);
  },
};

// ── googlesearch: Search Google ──
export const searchGoogle: AgentTool = {
  name: "search_google",
  description: "البحث المباشر على جوجل وسحب الروابط. استخدمها للبحث السريع.",
  parameters: { query: { type: "string" }, num_results: { type: "integer", default: 5 } },
  execute: async (args) => {
    const code = `
import json
try:
    from googlesearch import search
    results = list(search("${args.query}", num_results=${args.num_results || 5}))
    print(json.dumps({"results": results}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code);
  },
};

// ── pytrends: Google Trends ──
export const getGoogleTrends: AgentTool = {
  name: "get_google_trends",
  description: "سحب بيانات جوجل تريندز لتحليل السوق. استخدمها لمعرفة التريندات.",
  parameters: { keyword: { type: "string" } },
  execute: async (args) => {
    const code = `
from pytrends.request import TrendReq
import json
pytrends = TrendReq()
pytrends.build_payload(kw_list=["${args.keyword}"])
df = pytrends.interest_by_region()
print(json.dumps(df.head(10).to_dict(), default=str))
`;
    return runPython(code);
  },
};

// ── pubchempy: Molecule Analysis ──
export const analyzeMolecule: AgentTool = {
  name: "analyze_molecule",
  description: "البحث عن مركب كيميائي ودواء في قاعدة PubChem. استخدمها للتحليل الصيدلاني.",
  parameters: { name: { type: "string", description: "اسم المركب أو الدواء" } },
  execute: async (args) => {
    const code = `
from pubchempy import get_compounds, Compound
import json
compounds = get_compounds("${args.name}", "name")
if compounds:
    c = compounds[0]
    print(json.dumps({"name": c.iupac_name, "formula": c.molecular_formula, "weight": c.molecular_weight, "cid": c.cid}))
else:
    print(json.dumps({"error": "not found"}))
`;
    return runPython(code);
  },
};

// ── mendeleev: Periodic Table ──
export const getPeriodicTable: AgentTool = {
  name: "get_periodic_table",
  description: "جلب بيانات عنصر من الجدول الدوري. استخدمها للمعلومات الكيميائية.",
  parameters: { element: { type: "string", description: "رمز العنصر (مثل Fe, O, H)" } },
  execute: async (args) => {
    const code = `
from mendeleev import element
import json
e = element("${args.element}")
print(json.dumps({"name": e.name, "symbol": e.symbol, "atomic_number": e.atomic_number, "atomic_weight": e.atomic_weight, "group": str(e.group), "period": e.period}))
`;
    return runPython(code);
  },
};

// ── pydicom: Read DICOM Medical Images ──
export const readDicom: AgentTool = {
  name: "read_dicom",
  description: "قراءة ملفات الأشعة الطبية (DICOM). استخدمها لتحليل صور الرنين المغناطيسي والمقطعية.",
  parameters: { file_path: { type: "string" } },
  execute: async (args) => {
    const code = `
import pydicom, json
ds = pydicom.dcmread("${args.file_path}")
print(json.dumps({"patient": str(ds.get('PatientName','')), "modality": str(ds.get('Modality','')), "rows": ds.Rows, "cols": ds.Columns}, default=str))
`;
    return runPython(code);
  },
};

// ── ppadb: Control Android ──
export const controlAndroid: AgentTool = {
  name: "control_android",
  description: "التحكم في موبايل أندرويد متوصل بالـ ADB. استخدمها لفتح تطبيقات أو سحب ملفات.",
  parameters: { action: { type: "string", description: "الإجراء (screenshot, open_app, tap)" }, package: { type: "string" } },
  execute: async (args) => {
    const code = `
import json
try:
    from ppadb.client import Client as AdbClient
    client = AdbClient(host="127.0.0.1", port=5037)
    device = client.devices()[0]
    action = "${args.action || 'screenshot'}"
    if action == "screenshot":
        result = device.screencap()
        with open("android_screen.png", "wb") as f: f.write(result)
        print(json.dumps({"file": "android_screen.png"}))
    elif action == "open_app":
        device.shell(f"monkey -p ${args.package} -c android.intent.category.LAUNCHER 1")
        print(json.dumps({"opened": "${args.package}"}))
    else:
        print(json.dumps({"error": "unknown action"}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "note": "ADB not connected"}))
`;
    return runPython(code);
  },
};

// ── instaloader: Download Instagram ──
export const downloadInstagram: AgentTool = {
  name: "download_instagram",
  description: "سحب صور وفيديوهات من إنستجرام. استخدمها لتحليل الحسابات أو حفظ المحتوى.",
  parameters: { profile: { type: "string" }, max_posts: { type: "integer", default: 5 } },
  execute: async (args) => {
    const code = `
import instaloader, json
L = instaloader.Instaloader(download_videos=False, save_metadata=False, post_metadata_txt_pattern="")
profile = instaloader.Profile.from_username(L.context, "${args.profile}")
posts = []
for i, post in enumerate(profile.get_posts()):
    if i >= ${args.max_posts || 5}: break
    posts.append({"url": post.url, "likes": post.likes, "date": str(post.date)})
print(json.dumps({"profile": "${args.profile}", "posts": posts}, default=str))
`;
    return runPython(code, 60000);
  },
};

// ── pyrogram: Telegram Bot ──
export const controlTelegram: AgentTool = {
  name: "control_telegram",
  description: "إرسال رسالة عبر تليجرام. استخدمها للتنبيهات أو إدارة قنوات.",
  parameters: { chat_id: { type: "string" }, message: { type: "string" } },
  execute: async (args) => {
    const code = `
import json
try:
    from pyrogram import Client
    app = Client("anzaro_bot")
    with app:
        app.send_message("${args.chat_id}", "${args.message}")
    print(json.dumps({"sent": True}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "note": "pyrogram needs API config"}))
`;
    return runPython(code, 30000);
  },
};

// ── yfinance: Stock Data ──
export const getStockData: AgentTool = {
  name: "get_stock_data",
  description: "جلب بيانات الأسهم والأسعار الحية. استخدمها للتحليل المالي.",
  parameters: { symbol: { type: "string", description: "رمز السهم (AAPL, TSLA, BTC-USD)" } },
  execute: async (args) => {
    const code = `
import yfinance as yf, json
ticker = yf.Ticker("${args.symbol}")
info = ticker.info
print(json.dumps({"symbol": "${args.symbol}", "price": info.get('currentPrice'), "currency": info.get('currency'), "name": info.get('shortName')}, default=str))
`;
    return runPython(code);
  },
};

// ── autoscraper: Smart Scraper ──
export const scrapeAuto: AgentTool = {
  name: "scrape_auto",
  description: "سحب بيانات من أي موقع تلقائياً بذكاء. استخدمها لما لا تعرف CSS selectors.",
  parameters: { url: { type: "string" }, wanted_list: { type: "string", description: "JSON array of items you want" } },
  execute: async (args) => {
    const wanted = args.wanted_list || '["example"]';
    const code = `
from autoscraper import AutoScraper
import json
scraper = AutoScraper()
wanted = json.loads(${JSON.stringify(wanted)})
result = scraper.build("${args.url}", wanted)
print(json.dumps({"results": result[:20]}, ensure_ascii=False))
`;
    return runPython(code, 30000);
  },
};

// ═══════════════════════════════════════════
// V.137: 300 More — 10 new action-oriented tools
// ═══════════════════════════════════════════

// ── manim: Math Animation ──
export const animateMath: AgentTool = {
  name: "animate_math",
  description: "إنشاء فيديو تعليمي يحرك المعادلات الرياضية والهندسة باستخدام manim. استخدمها لإنشاء محتوى تعليمي مرئي.",
  parameters: { expression: { type: "string", description: "المعادلة (مثل: x**2 + y**2 = r**2)" }, output_file: { type: "string", default: "math_animation.mp4" } },
  execute: async (args) => {
    const code = `
from manim import *
import json
class MathScene(Scene):
    def construct(self):
        eq = MathTex("${args.expression || 'x^2 + y^2 = r^2'}")
        self.play(Write(eq))
        self.wait(2)
scene = MathScene()
scene.render()
print(json.dumps({"file": "${args.output_file || 'math_animation.mp4'}"}))
`;
    return runPython(code, 120000);
  },
};

// ── web3: Blockchain ──
export const playBlockchain: AgentTool = {
  name: "play_blockchain",
  description: "التفاعل مع blockchain (Ethereum). استخدمها لقراءة رصيد محفظة أو إرسال معاملة.",
  parameters: { action: { type: "string", description: "الإجراء (balance, block_number)" }, address: { type: "string" } },
  execute: async (args) => {
    const code = `
from web3 import Web3
import json
w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))
if "${args.action}" == "balance":
    bal = w3.eth.get_balance("${args.address}")
    print(json.dumps({"address": "${args.address}", "balance_eth": bal / 1e18}))
elif "${args.action}" == "block_number":
    print(json.dumps({"block": w3.eth.block_number}))
`;
    return runPython(code);
  },
};

// ── IoT Control (Adafruit) ──
export const controlIoT: AgentTool = {
  name: "control_iot",
  description: "التحكم في أجهزة IoT (Adafruit IO). استخدمها لقراءة أو كتابة بيانات حساسات.",
  parameters: { feed: { type: "string" }, value: { type: "string" }, action: { type: "string", description: "read or write" } },
  execute: async (args) => {
    const code = `
import json
try:
    from Adafruit_IO import Client
    aio = Client()
    if "${args.action}" == "write":
        aio.send_data("${args.feed}", "${args.value}")
        print(json.dumps({"written": True, "feed": "${args.feed}", "value": "${args.value}"}))
    else:
        data = aio.receive("${args.feed}")
        print(json.dumps({"feed": "${args.feed}", "value": data.value}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "note": "IoT needs config"}))
`;
    return runPython(code);
  },
};

// ── python-pptx: Create Presentation ──
export const createPresentation: AgentTool = {
  name: "create_presentation",
  description: "إنشاء عرض تقديمي PowerPoint كامل. استخدمها لإنشاء شرائح مع نصوص وصور.",
  parameters: { title: { type: "string" }, slides: { type: "string", description: "JSON array of {title, content}" }, filename: { type: "string", default: "presentation.pptx" } },
  execute: async (args) => {
    const code = `
from pptx import Presentation
import json
prs = Presentation()
prs.slides[0].shapes.title.text = "${args.title}"
slides = json.loads('''${args.slides || '[]'}''')
for s in slides:
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = s.get('title','')
    slide.placeholders[1].text = s.get('content','')
prs.save("${args.filename || 'presentation.pptx'}")
print(json.dumps({"file": "${args.filename}", "slides": len(slides) + 1}))
`;
    return runPython(code);
  },
};

// ── schemathesis: API Testing ──
export const testAPI: AgentTool = {
  name: "test_api",
  description: "اختبار API تلقائياً باستخدام schemathesis. استخدمها لفحص صحة endpoints.",
  parameters: { spec_url: { type: "string", description: "OpenAPI spec URL" } },
  execute: async (args) => {
    const code = `
import schemathesis, json
schema = schemathesis.openapi.from_url("${args.spec_url}")
results = []
for case in schema[""].get_all_tests():
    try:
        response = case.call()
        case.validate_response(response)
        results.append({"endpoint": case.path, "method": case.method, "status": "pass"})
    except Exception as e:
        results.append({"endpoint": case.path, "method": case.method, "status": "fail", "error": str(e)[:100]})
print(json.dumps({"results": results[:20]}, ensure_ascii=False))
`;
    return runPython(code, 60000);
  },
};

// ── trimesh: 3D Rendering ──
export const render3D: AgentTool = {
  name: "render_3d",
  description: "تحميل وعرض ملفات 3D (STL, OBJ, GLTF). استخدمها لتحليل نماذج ثلاثية الأبعاد.",
  parameters: { file_path: { type: "string" } },
  execute: async (args) => {
    const code = `
import trimesh, json
mesh = trimesh.load("${args.file_path}")
print(json.dumps({"faces": len(mesh.faces), "vertices": len(mesh.vertices), "bounds": mesh.bounds.tolist(), "volume": float(mesh.volume)}, default=str))
`;
    return runPython(code);
  },
};

// ── vobject: Calendar Management ──
export const manageCalendar: AgentTool = {
  name: "manage_calendar",
  description: "إنشاء وقراءة ملفات تقويم (iCalendar). استخدمها لإدارة المواعيد.",
  parameters: { action: { type: "string", description: "create or read" }, summary: { type: "string" }, date: { type: "string" } },
  execute: async (args) => {
    const code = `
import vobject, json
if "${args.action}" == "create":
    cal = vobject.iCalendar()
    event = cal.add('vevent')
    event.add('summary').value = "${args.summary}"
    event.add('dtstart').value = "${args.date}"
    with open("event.ics", "w") as f: f.write(cal.serialize())
    print(json.dumps({"file": "event.ics", "summary": "${args.summary}", "date": "${args.date}"}))
`;
    return runPython(code);
  },
};

// ── tabula-py: Extract Tables from PDF ──
export const extractTables: AgentTool = {
  name: "extract_tables",
  description: "استخراج الجداول من ملف PDF كـ DataFrame. استخدمها للملفات المليانة جداول معقدة.",
  parameters: { file_path: { type: "string" } },
  execute: async (args) => {
    const code = `
import tabula, json
dfs = tabula.read_pdf("${args.file_path}", pages='all', multiple_tables=True)
result = []
for i, df in enumerate(dfs):
    result.append({"table": i+1, "rows": len(df), "cols": len(df.columns), "data": df.head(5).to_dict('records')})
print(json.dumps({"tables": len(dfs), "data": result}, default=str, ensure_ascii=False))
`;
    return runPython(code, 60000);
  },
};

// ── manim: Create Animation ──
export const createAnimation: AgentTool = {
  name: "create_animation",
  description: "إنشاء فيديو متحرك من نص أو معادلة باستخدام manim. استخدمها للمحتوى التعليمي.",
  parameters: { text: { type: "string" }, output_file: { type: "string", default: "animation.mp4" } },
  execute: async (args) => {
    const code = `
from manim import *
import json
class TextScene(Scene):
    def construct(self):
        t = Text("${args.text}")
        self.play(Write(t))
        self.wait(2)
scene = TextScene()
scene.render()
print(json.dumps({"file": "${args.output_file}"}))
`;
    return runPython(code, 120000);
  },
};

// ── praw: Reddit Posts ──
export const getRedditPosts: AgentTool = {
  name: "get_reddit_posts",
  description: "سحب بوستات وتعليقات من Reddit. استخدمها لتحليل تريندات أو آراء.",
  parameters: { subreddit: { type: "string" }, limit: { type: "integer", default: 10 } },
  execute: async (args) => {
    const code = `
import praw, json
try:
    reddit = praw.Reddit(client_id="default", client_secret="default", user_agent="anzaro")
    subreddit = reddit.subreddit("${args.subreddit}")
    posts = []
    for post in subreddit.hot(limit=${args.limit || 10}):
        posts.append({"title": post.title, "score": post.score, "url": post.url, "comments": post.num_comments})
    print(json.dumps({"subreddit": "${args.subreddit}", "posts": posts}, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "note": "Reddit needs API config"}))
`;
    return runPython(code);
  },
};

export const ALL_AGENT_TOOLS: AgentTool[] = [
  // V.133: Original 14 tools
  textToSpeech,
  transcribeAudio,
  cleanAudio,
  convertAudioFormat,
  extractPdfText,
  createDocument,
  analyzeData,
  createChart,
  scrapeWeb,
  httpRequest,
  analyzeSentiment,
  translateText,
  solveMath,
  executePython,
  // V.134: Titanium Operation — 13 heavy tools
  runCrewAgents,
  storeInMemory,
  searchMemory,
  browseWebsite,
  fastAnalyzeData,
  cloneVoice,
  analyzeAudio,
  processMedia,
  sendMqttCommand,
  serialCommand,
  createVideo,
  automateDesktop,
  mineData,
  // V.135: Mega-Install — 15 new action-oriented tools
  removeImageBackground,
  sendEmail,
  sendWhatsapp,
  convertCurrency,
  getWeather,
  searchGoogle,
  getGoogleTrends,
  analyzeMolecule,
  getPeriodicTable,
  readDicom,
  controlAndroid,
  downloadInstagram,
  controlTelegram,
  getStockData,
  scrapeAuto,
  // V.137: 300 more — 10 new action-oriented tools
  animateMath,
  playBlockchain,
  controlIoT,
  createPresentation,
  testAPI,
  render3D,
  manageCalendar,
  extractTables,
  createAnimation,
  getRedditPosts,
];

/** بيـ رجّع tools schema بصيغة OpenAI function calling */
export function getToolsSchema() {
  return ALL_AGENT_TOOLS.map(t => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: "object",
        properties: t.parameters,
      },
    },
  }));
}

/** بيـ execute tool بالاسم */
export async function executeTool(name: string, args: any): Promise<string> {
  const tool = ALL_AGENT_TOOLS.find(t => t.name === name);
  if (!tool) return JSON.stringify({ error: `Tool ${name} not found` });
  try {
    return await tool.execute(args);
  } catch (e: any) {
    return JSON.stringify({ error: e.message });
  }
}
