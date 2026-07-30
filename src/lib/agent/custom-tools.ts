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

export const ALL_AGENT_TOOLS: AgentTool[] = [
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
