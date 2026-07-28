/**
 * V.110: Actual Callable Tools — أدوات حقيقية متثبتة الموديل يقدر يستدعيها.
 *
 * مش بس metadata — دي functions حقيقية بتشتغل فعلاً.
 * كل tool بيـ:
 *  1. يـ verify إن الـ package متثبت
 *  2. يـ execute الـ function
 *  3. يـ return نتيجة حقيقية
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { stat } from "fs/promises";
import path from "path";

const sleep = promisify(setTimeout);

// ─────────────────────────────────────────────────────────────
// Tool Executor — بيـ run Python code باستخدام الـ packages المتثبتة
// ─────────────────────────────────────────────────────────────

interface ToolResult {
  success: boolean;
  output: string;
  files?: string[];
  error?: string;
  durationMs: number;
}

/** بيـ run Python script ويرجع النتيجة. */
async function runPython(code: string, timeoutMs = 30000): Promise<ToolResult> {
  const start = Date.now();
  const fs = await import("fs/promises");
  const os = await import("os");
  const tmpFile = path.join(os.tmpdir(), `anzaro_tool_${Date.now()}.py`);

  try {
    await fs.writeFile(tmpFile, code, "utf-8");
    const output = await new Promise<string>((resolve, reject) => {
      const proc = spawn("python3", [tmpFile], {
        cwd: "/home/z/my-project/exports",
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
        timeout: timeoutMs,
      });
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (d) => { stdout += d.toString(); });
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      const timer = setTimeout(() => {
        proc.kill("SIGKILL");
        reject(new Error(`Timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      proc.on("close", (code) => {
        clearTimeout(timer);
        resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : ""));
      });
      proc.on("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
    });

    return {
      success: true,
      output: output.slice(0, 5000),
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return {
      success: false,
      output: "",
      error: e.message || String(e),
      durationMs: Date.now() - start,
    };
  } finally {
    try {
      const fs = await import("fs/promises");
      await fs.unlink(tmpFile);
    } catch {}
  }
}

/** بيـ verify إن package متثبت. */
async function verifyPackage(pkgName: string): Promise<boolean> {
  const importName = pkgName.replace(/-/g, "_").replace(/\[.*\]/, "").split(/[=<>]/)[0];
  const result = await runPython(
    `import importlib\ntry:\n    importlib.import_module('${importName}')\n    print('OK')\nexcept ImportError as e:\n    print(f'FAIL: {e}')\n`,
    10000
  );
  return result.output.includes("OK");
}

// ─────────────────────────────────────────────────────────────
// ACTUAL CALLABLE TOOLS
// ─────────────────────────────────────────────────────────────

export interface CallableTool {
  name: string;
  description: string;
  category: string;
  package: string; // pip package name
  parameters: Record<string, any>;
  execute: (args: any) => Promise<ToolResult>;
}

export const CALLABLE_TOOLS: CallableTool[] = [

  // ── PDF Tools ──
  {
    name: "extract_pdf_text",
    description: "استخراج النص من ملف PDF",
    category: "pdf",
    package: "pdfplumber",
    parameters: { file_path: { type: "string", description: "مسار ملف PDF" } },
    execute: async (args) => {
      const code = `
import pdfplumber, json
with pdfplumber.open('${args.file_path}') as pdf:
    text = ""
    for page in pdf.pages[:50]:
        text += page.extract_text() or ""
        text += "\\n--- PAGE BREAK ---\\n"
print(json.dumps({"text": text[:5000], "pages": len(pdf.pages)}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "create_pdf",
    description: "إنشاء ملف PDF من نص",
    category: "pdf",
    package: "fpdf2",
    parameters: {
      text: { type: "string", description: "النص" },
      filename: { type: "string", description: "اسم الملف" },
    },
    execute: async (args) => {
      const code = `
from fpdf import FPDF
import json
pdf = FPDF()
pdf.add_page()
pdf.add_font('Arial', '', '', uni=True)
pdf.set_font_size(12)
text = """${(args.text || "").replace(/"/g, '\\"')}"""
for line in text.split("\\n"):
    pdf.cell(0, 10, txt=line, ln=True)
pdf.output('${args.filename || "output.pdf"}')
print(json.dumps({"file": "${args.filename || "output.pdf"}"}))
`;
      return runPython(code);
    },
  },

  // ── Image Tools ──
  {
    name: "resize_image",
    description: "تغيير حجم صورة",
    category: "image",
    package: "pillow",
    parameters: {
      input_path: { type: "string" },
      width: { type: "integer" },
      height: { type: "integer" },
      output_path: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from PIL import Image
import json
img = Image.open('${args.input_path}')
resized = img.resize((${'args.width || 800'}, ${args.height || 600}))
resized.save('${args.output_path || "resized.png"}')
print(json.dumps({"file": "${args.output_path || "resized.png"}", "size": [${args.width || 800}, ${args.height || 600}]}))
`;
      return runPython(code);
    },
  },
  {
    name: "image_to_text_ocr",
    description: "استخراج نص من صورة (OCR)",
    category: "image",
    package: "pytesseract",
    parameters: { image_path: { type: "string" } },
    execute: async (args) => {
      const code = `
import pytesseract
from PIL import Image
import json
img = Image.open('${args.image_path}')
text = pytesseract.image_to_string(img, lang='eng+ara')
print(json.dumps({"text": text[:3000]}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "generate_qr_code",
    description: "إنشاء QR code من نص/رابط",
    category: "image",
    package: "qrcode",
    parameters: {
      data: { type: "string", description: "النص أو الرابط" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import qrcode, json
qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data("${(args.data || "").replace(/"/g, '\\"')}")
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
fname = "${args.filename || "qr_code.png"}"
img.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },

  // ── Chart/Visualization ──
  {
    name: "create_chart",
    description: "إنشاء رسم بياني (line/bar/pie/scatter)",
    category: "chart",
    package: "matplotlib",
    parameters: {
      chart_type: { type: "string", enum: ["line", "bar", "pie", "scatter"] },
      x_data: { type: "array" },
      y_data: { type: "array" },
      title: { type: "string" },
      filename: { type: "string" },
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
ct = "${args.chart_type || "bar"}"
if ct == "line": ax.plot(x, y, "b-o")
elif ct == "bar": ax.bar(x, y)
elif ct == "pie": ax.pie(y, labels=x, autopct="%1.1f%%")
elif ct == "scatter": ax.scatter(x, y)
if "${args.title || ""}": ax.set_title("${args.title}")
ax.grid(True, alpha=0.3)
plt.tight_layout()
fname = "${args.filename || "chart.png"}"
plt.savefig(fname, dpi=100, bbox_inches="tight")
plt.close()
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },

  // ── Web Scraping ──
  {
    name: "scrape_website",
    description: "استخراج النص من موقع ويب",
    category: "web",
    package: "beautifulsoup4",
    parameters: { url: { type: "string" } },
    execute: async (args) => {
      const code = `
import requests, json
from bs4 import BeautifulSoup
resp = requests.get("${args.url}", timeout=15, headers={"User-Agent":"Mozilla/5.0"})
soup = BeautifulSoup(resp.text, "html.parser")
for tag in soup(["script","style","nav","footer"]): tag.decompose()
text = soup.get_text(separator="\\n", strip=True)[:5000]
print(json.dumps({"title": soup.title.string if soup.title else "", "content": text}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "download_youtube_video",
    description: "تحميل فيديو من يوتيوب",
    category: "web",
    package: "yt-dlp",
    parameters: {
      url: { type: "string" },
      format: { type: "string", description: "best/audio" },
    },
    execute: async (args) => {
      const code = `
import yt_dlp, json, os
opts = {
    'format': '${args.format === "audio" ? "bestaudio" : "best"}' if '${args.format}' else 'best',
    'outtmpl': '/home/z/my-project/exports/%(title)s.%(ext)s',
    'quiet': True,
}
with yt_dlp.YoutubeDL(opts) as ydl:
    info = ydl.extract_info("${args.url}", download=True)
    filename = ydl.prepare_filename(info)
print(json.dumps({"file": filename, "title": info.get("title",""), "duration": info.get("duration",0)}, ensure_ascii=False))
`;
      return runPython(code, 120000);
    },
  },

  // ── Text/Speech ──
  {
    name: "text_to_speech",
    description: "تحويل نص إلى صوت MP3",
    category: "audio",
    package: "gTTS",
    parameters: {
      text: { type: "string" },
      lang: { type: "string", default: "ar" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from gtts import gTTS
import json
tts = gTTS(text="""${(args.text || "").replace(/"/g, '\\"')}""", lang='${args.lang || "ar"}', slow=False)
fname = "${args.filename || "tts.mp3"}"
tts.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },
  {
    name: "text_to_speech_neural",
    description: "تحويل نص إلى صوت عالي الجودة (Neural TTS)",
    category: "audio",
    package: "edge-tts",
    parameters: {
      text: { type: "string" },
      voice: { type: "string", default: "ar-EG-SalmaNeural" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import asyncio, edge_tts, json
async def run():
    comm = edge_tts.Communicate("""${(args.text || "").replace(/"/g, '\\"')}""", "${args.voice || "ar-EG-SalmaNeural"}")
    fname = "${args.filename || "tts_neural.mp3"}"
    await comm.save(fname)
    print(json.dumps({"file": fname, "voice": "${args.voice || "ar-EG-SalmaNeural"}"}))
asyncio.run(run())
`;
      return runPython(code);
    },
  },

  // ── Data Analysis ──
  {
    name: "analyze_csv",
    description: "تحليل ملف CSV وإعطاء إحصائيات",
    category: "data",
    package: "pandas",
    parameters: { file_path: { type: "string" } },
    execute: async (args) => {
      const code = `
import pandas as pd, json
df = pd.read_csv('${args.file_path}')
stats = {
    "rows": len(df),
    "columns": list(df.columns),
    "dtypes": {c: str(df[c].dtype) for c in df.columns},
    "describe": df.describe().to_dict() if len(df.select_dtypes(include='number').columns) > 0 else {},
    "head": df.head(5).to_dict('records'),
    "missing": df.isnull().sum().to_dict(),
}
print(json.dumps(stats, default=str, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // ── NLP ──
  {
    name: "sentiment_analysis",
    description: "تحليل مشاعر نص (positive/negative/neutral)",
    category: "nlp",
    package: "vaderSentiment",
    parameters: { text: { type: "string" } },
    execute: async (args) => {
      const code = `
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
analyzer = SentimentIntensityAnalyzer()
scores = analyzer.polarity_scores("""${(args.text || "").replace(/"/g, '\\"')}""")
print(json.dumps(scores))
`;
      return runPython(code);
    },
  },
  {
    name: "word_frequency",
    description: "تحليل تكرار الكلمات في نص",
    category: "nlp",
    package: "nltk",
    parameters: { text: { type: "string" }, top_n: { type: "integer", default: 20 } },
    execute: async (args) => {
      const code = `
import nltk
from collections import Counter
import json, re
nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords
text = """${(args.text || "").replace(/"/g, '\\"')}"""
words = re.findall(r'\\b[a-zA-Z]+\\b', text.lower())
stop = set(stopwords.words('english'))
filtered = [w for w in words if w not in stop and len(w) > 2]
top = Counter(filtered).most_common(${args.top_n || 20})
print(json.dumps({"top_words": top, "total_words": len(words), "unique_words": len(set(filtered))}))
`;
      return runPython(code);
    },
  },

  // ── Math/Calculation ──
  {
    name: "solve_math",
    description: "حل معادلة رياضية رمزية",
    category: "math",
    package: "sympy",
    parameters: { expression: { type: "string" } },
    execute: async (args) => {
      const code = `
from sympy import sympify, simplify, solve, symbols, integrate, diff
import json
expr_str = "${(args.expression || "").replace(/"/g, '\\"')}"
try:
    expr = sympify(expr_str)
    result = {
        "input": expr_str,
        "simplified": str(simplify(expr)),
        "derivative": str(diff(expr, symbols('x'))) if 'x' in str(expr) else "N/A",
    }
    print(json.dumps(result, default=str))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
      return runPython(code);
    },
  },

  // ── Document Generation ──
  {
    name: "create_docx",
    description: "إنشاء ملف Word (.docx) من نص",
    category: "document",
    package: "python-docx",
    parameters: {
      text: { type: "string" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from docx import Document
import json
doc = Document()
text = """${(args.text || "").replace(/"/g, '\\"')}"""
for line in text.split("\\n"):
    doc.add_paragraph(line)
fname = "${args.filename || "document.docx"}"
doc.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },
  {
    name: "create_excel",
    description: "إنشاء ملف Excel من بيانات JSON",
    category: "document",
    package: "openpyxl",
    parameters: {
      data: { type: "array", description: "list of rows" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from openpyxl import Workbook
import json
wb = Workbook()
ws = wb.active
data = ${JSON.stringify(args.data || [])}
for row in data:
    ws.append(row)
fname = "${args.filename || "spreadsheet.xlsx"}"
wb.save(fname)
print(json.dumps({"file": fname, "rows": len(data)}))
`;
      return runPython(code);
    },
  },

  // ── Translation ──
  {
    name: "translate_text",
    description: "ترجمة نص بين اللغات",
    category: "translation",
    package: "deep-translator",
    parameters: {
      text: { type: "string" },
      target_lang: { type: "string", default: "en" },
    },
    execute: async (args) => {
      const code = `
from deep_translator import GoogleTranslator
import json
translator = GoogleTranslator(source='auto', target='${args.target_lang || "en"}')
result = translator.translate("""${(args.text || "").replace(/"/g, '\\"')}""")
print(json.dumps({"translation": result}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // ── Fun ──
  {
    name: "tell_joke",
    description: "إخبار نكتة عشوائية",
    category: "fun",
    package: "pyjokes",
    parameters: {},
    execute: async () => {
      const code = `
import pyjokes, json
print(json.dumps({"joke": pyjokes.get_joke()}))
`;
      return runPython(code);
    },
  },
  {
    name: "cowsay",
    description: "عرض نص في شكل بقرة تتكلم",
    category: "fun",
    package: "cowsay",
    parameters: { text: { type: "string" } },
    execute: async (args) => {
      const code = `
import cowsay, json
cowsay.cow("""${(args.text || "Hello").replace(/"/g, '\\"')}""")
`;
      return runPython(code);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Tool Registry Helpers
// ─────────────────────────────────────────────────────────────

/** بيـ رجّع كل الـ callable tools. */
export function getCallableTools(): CallableTool[] {
  return CALLABLE_TOOLS;
}

/** بيـ search عن tool بالاسم. */
export function findCallableTool(name: string): CallableTool | null {
  return CALLABLE_TOOLS.find(t => t.name === name) || null;
}

/** بيـ execute tool بالاسم + args. */
export async function executeCallableTool(name: string, args: any): Promise<ToolResult> {
  const tool = findCallableTool(name);
  if (!tool) {
    return {
      success: false,
      output: "",
      error: `Tool "${name}" not found. Available: ${CALLABLE_TOOLS.map(t => t.name).join(", ")}`,
      durationMs: 0,
    };
  }

  // verify package installed
  const installed = await verifyPackage(tool.package);
  if (!installed) {
    // JIT install
    const { spawn } = await import("child_process");
    await new Promise<void>((resolve) => {
      const proc = spawn("pip", ["install", "--no-cache-dir", "--quiet", "--break-system-packages", tool.package]);
      proc.on("close", () => resolve());
      setTimeout(resolve, 60000); // timeout 60s
    });
  }

  return tool.execute(args);
}

/** بيـ رجّع schema بتاعة كل tools (للـ model). */
export function getToolsSchema() {
  return CALLABLE_TOOLS.map(t => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: "object",
        properties: t.parameters,
      },
    },
    category: t.category,
    package: t.package,
  }));
}
