/**
 * V.133: Custom Tools — أدوات مخصصة باستخدام langchain @tool
 * كل أداة بتـ wrap مكتبة مثبتة وتخليها callable من الـ Agent
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

const PYTHON_PATHS = ["/app/.venv/bin/python3", "/home/z/.venv/bin/python3", "python3"];
const SITE_PACKAGES = ["/app/.venv/lib/python3.12/site-packages", "/home/z/.venv/lib/python3.12/site-packages", "/usr/lib/python3/dist-packages", "/usr/local/lib/python3.11/dist-packages"];

async function runPython(code: string, timeoutMs = 60000): Promise<string> {
  const pythonPath = PYTHON_PATHS.find(p => existsSync(p)) || "python3";
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
  // V.134: Titanium Operation — 13 new heavy tools
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
