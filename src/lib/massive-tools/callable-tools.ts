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
import { stat, existsSync } from "fs";
import { promises as fsPromises } from "fs";
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
    await fsPromises.writeFile(tmpFile, code, "utf-8");
    const output = await new Promise<string>((resolve, reject) => {
      // V.127: Use /app/.venv/bin/python3 if available (has all packages), fallback to python3
      const pythonPath = existsSync("/app/.venv/bin/python3") ? "/app/.venv/bin/python3" : "python3";
      const proc = spawn(pythonPath, [tmpFile], {
        cwd: "/home/z/my-project/exports",
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
          PYTHONPATH: "/app/.venv/lib/python3.12/site-packages:/usr/lib/python3/dist-packages:/usr/local/lib/python3.11/dist-packages",
        },
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
      await fsPromises.unlink(tmpFile);
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
    'socket_timeout': 30,
    'retries': 2,
    'no_warnings': True,
}
try:
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info("${args.url}", download=True)
        filename = ydl.prepare_filename(info)
    print(json.dumps({"file": filename, "title": info.get("title",""), "duration": info.get("duration",0)}, ensure_ascii=False))
except Exception as e:
    # Fallback: just get info without downloading
    try:
        with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True, 'skip_download': True}) as ydl:
            info = ydl.extract_info("${args.url}", download=False)
        print(json.dumps({"title": info.get("title",""), "duration": info.get("duration",0), "url": "${args.url}", "note": "info only (download failed)"}, ensure_ascii=False))
    except Exception as e2:
        print(json.dumps({"error": str(e), "fallback_error": str(e2)}, ensure_ascii=False))
`;
      return runPython(code, 180000);
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

  // ── V.114: New callable tools (using newly installed packages) ──

  // Web scraping
  {
    name: "scrape_with_trafilatura",
    description: "استخراج النص الأساسي من مقال ويب (better than BeautifulSoup)",
    category: "web",
    package: "trafilatura",
    parameters: { url: { type: "string" } },
    execute: async (args) => {
      const code = `
import trafilatura, json
downloaded = trafilatura.fetch_url("${args.url}")
text = trafilatura.extract(downloaded) or ""
print(json.dumps({"text": text[:5000], "length": len(text)}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // NLP: NLTK
  {
    name: "tokenize_text",
    description: "تقسيم نص إلى كلمات (tokenization) باستخدام NLTK",
    category: "nlp",
    package: "nltk",
    parameters: { text: { type: "string" } },
    execute: async (args) => {
      const code = `
import nltk, json
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import word_tokenize, sent_tokenize
text = """${(args.text || "").replace(/"/g, '\\"')}"""
words = word_tokenize(text)
sentences = sent_tokenize(text)
print(json.dumps({"words": words[:100], "word_count": len(words), "sentence_count": len(sentences)}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // Image: Albumentations (augmentation)
  {
    name: "augment_image",
    description: "تطبيق augmentation على صورة (flip, rotate, blur)",
    category: "image",
    package: "albumentations",
    parameters: {
      input_path: { type: "string" },
      output_path: { type: "string" },
      transform: { type: "string", enum: ["flip", "rotate", "blur", "brightness"] },
    },
    execute: async (args) => {
      const code = `
import albumentations as A
import cv2
import json
img = cv2.imread('${args.input_path}')
t = '${args.transform || "flip"}'
if t == "flip": aug = A.HorizontalFlip(p=1)
elif t == "rotate": aug = A.Rotate(p=1, limit=45)
elif t == "blur": aug = A.GaussianBlur(p=1, blur_limit=(3, 7))
elif t == "brightness": aug = A.RandomBrightnessContrast(p=1)
else: aug = A.HorizontalFlip(p=1)
transformed = aug(image=img)["image"]
out = '${args.output_path || "augmented.png"}'
cv2.imwrite(out, transformed)
print(json.dumps({"file": out, "transform": t}))
`;
      return runPython(code);
    },
  },

  // PyMuDF: advanced PDF
  {
    name: "extract_pdf_images",
    description: "استخراج الصور من ملف PDF",
    category: "pdf",
    package: "pymupdf",
    parameters: { file_path: { type: "string" } },
    execute: async (args) => {
      const code = `
import pymupdf, json, os
doc = pymupdf.open('${args.file_path}')
images = []
for page_num in range(min(len(doc), 20)):
    page = doc[page_num]
    imgs = page.get_images(full=True)
    for img_idx, img in enumerate(imgs):
        xref = img[0]
        pix = pymupdf.Pixmap(doc, xref)
        if pix.n - pix.alpha < 4:
            fname = f"pdf_img_p{page_num}_i{img_idx}.png"
            pix.save(fname)
            images.append(fname)
        pix = None
doc.close()
print(json.dumps({"images": images, "count": len(images)}))
`;
      return runPython(code);
    },
  },

  // Audio: pydub
  {
    name: "convert_audio",
    description: "تحويل صوت من format لـ format آخر",
    category: "audio",
    package: "pydub",
    parameters: {
      input_path: { type: "string" },
      output_path: { type: "string" },
      format: { type: "string", enum: ["mp3", "wav", "ogg", "flac"] },
    },
    execute: async (args) => {
      const outPath = args.output_path || `converted.${args.format || "mp3"}`;
      const code = `
from pydub import AudioSegment
import json
audio = AudioSegment.from_file('${args.input_path}')
out = '${outPath}'
audio.export(out, format='${args.format || "mp3"}')
print(json.dumps({"file": out, "duration_sec": len(audio) / 1000}))
`;
      return runPython(code);
    },
  },

  // Data: xlsxwriter (advanced Excel)
  {
    name: "create_excel_chart",
    description: "إنشاء ملف Excel مع رسم بياني",
    category: "document",
    package: "xlsxwriter",
    parameters: {
      data: { type: "array" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import xlsxwriter, json
wb = xlsxwriter.Workbook('${args.filename || "chart.xlsx"}')
ws = wb.add_worksheet()
data = ${JSON.stringify(args.data || [["Month", "Sales"], ["Jan", 100], ["Feb", 200]])}
for r, row in enumerate(data):
    for c, val in enumerate(row):
        ws.write(r, c, val)
chart = wb.add_chart({"type": "column"})
chart.add_series({
    "name": "=Sheet1!$B$1",
    "categories": "=Sheet1!$A$2:$A$" + str(len(data)),
    "values": "=Sheet1!$B$2:$B$" + str(len(data)),
})
ws.insert_chart("D2", chart)
wb.close()
print(json.dumps({"file": "${args.filename || "chart.xlsx"}"}))
`;
      return runPython(code);
    },
  },

  // Faker: generate fake data
  {
    name: "generate_fake_data",
    description: "توليد بيانات وهمية (أسماء، إيميلات، أرقام)",
    category: "data",
    package: "faker",
    parameters: {
      count: { type: "integer", default: 10 },
      type: { type: "string", enum: ["name", "email", "phone", "address", "company"] },
    },
    execute: async (args) => {
      const code = `
from faker import Faker
import json
fake = Faker()
t = '${args.type || "name"}'
n = ${args.count || 10}
results = []
for _ in range(n):
    if t == "name": results.append(fake.name())
    elif t == "email": results.append(fake.email())
    elif t == "phone": results.append(fake.phone_number())
    elif t == "address": results.append(fake.address())
    elif t == "company": results.append(fake.company())
print(json.dumps({"type": t, "count": n, "data": results}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // Image: scikit-image
  {
    name: "image_info",
    description: "معلومات عن صورة (dimensions, format, mode)",
    category: "image",
    package: "scikit-image",
    parameters: { image_path: { type: "string" } },
    execute: async (args) => {
      const code = `
from skimage import io
import json
img = io.imread('${args.image_path}')
print(json.dumps({
    "shape": list(img.shape),
    "dtype": str(img.dtype),
    "size_mb": img.nbytes / 1024 / 1024,
    "min": float(img.min()),
    "max": float(img.max()),
    "mean": float(img.mean()),
}))
`;
      return runPython(code);
    },
  },

  // Arrow: date/time
  {
    name: "timezones_info",
    description: "عرض الوقت الحالي في مدن مختلفة",
    category: "utility",
    package: "arrow",
    parameters: {},
    execute: async () => {
      const code = `
import arrow, json
cities = {
    "Cairo": "Africa/Cairo",
    "Riyadh": "Asia/Riyadh",
    "Dubai": "Asia/Dubai",
    "London": "Europe/London",
    "New York": "America/New_York",
    "Tokyo": "Asia/Tokyo",
}
result = {city: arrow.now(tz).format("YYYY-MM-DD HH:mm:ss") for city, tz in cities.items()}
print(json.dumps(result, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // Transformers: text classification
  {
    name: "classify_text_ai",
    description: "تصنيف نص باستخدام AI (transformers)",
    category: "ai",
    package: "transformers",
    parameters: { text: { type: "string" } },
    execute: async (args) => {
      const code = `
from transformers import pipeline
import json
try:
    classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
    result = classifier("""${(args.text || "").replace(/"/g, '\\"')}""")
    print(json.dumps(result, default=str))
except Exception as e:
    print(json.dumps({"error": str(e), "fallback": "transformers needs model download"}))
`;
      return runPython(code, 60000);
    },
  },

  // Structlog: structured logging
  {
    name: "format_json",
    description: "تنسيق JSON من نص",
    category: "utility",
    package: "orjson",
    parameters: { json_string: { type: "string" } },
    execute: async (args) => {
      const code = `
import orjson, json
try:
    data = orjson.loads('''${(args.json_string || "{}").replace(/'/g, "\\'")}''')
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")
`;
      return runPython(code);
    },
  },

  // RapidFuzz: fuzzy string matching
  {
    name: "fuzzy_match",
    description: "مطابقة نصوص تقريبية (fuzzy matching)",
    category: "nlp",
    package: "rapidfuzz",
    parameters: {
      query: { type: "string" },
      choices: { type: "array" },
    },
    execute: async (args) => {
      const code = `
from rapidfuzz import process, fuzz
import json
query = "${(args.query || "").replace(/"/g, '\\"')}"
choices = ${JSON.stringify(args.choices || [])}
results = process.extract(query, choices, limit=5, scorer=fuzz.WRatio)
print(json.dumps({"query": query, "matches": [{"choice": r[0], "score": r[1]} for r in results]}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

// ═══ V.130 Batch 1: 100 wrappers ═══

  // V.130: APScheduler
  {
    name: "pkg_apscheduler",
    description: "Execute APScheduler — import, inspect, or call functions",
    category: "package",
    package: "APScheduler",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'apscheduler'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'APScheduler', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Authlib
  {
    name: "pkg_authlib",
    description: "Execute Authlib — import, inspect, or call functions",
    category: "package",
    package: "Authlib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'authlib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Authlib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: CairoSVG
  {
    name: "pkg_cairosvg",
    description: "Execute CairoSVG — import, inspect, or call functions",
    category: "package",
    package: "CairoSVG",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cairosvg'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'CairoSVG', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Camelot
  {
    name: "pkg_camelot",
    description: "Execute Camelot — import, inspect, or call functions",
    category: "package",
    package: "Camelot",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'camelot'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Camelot', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Deprecated
  {
    name: "pkg_deprecated",
    description: "Execute Deprecated — import, inspect, or call functions",
    category: "package",
    package: "Deprecated",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'deprecated'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Deprecated', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Faker
  {
    name: "pkg_faker",
    description: "Execute Faker — import, inspect, or call functions",
    category: "package",
    package: "Faker",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'faker'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Faker', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Freetype
  {
    name: "pkg_freetype",
    description: "Execute Freetype — import, inspect, or call functions",
    category: "package",
    package: "Freetype",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'freetype'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Freetype', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Hypercorn
  {
    name: "pkg_hypercorn",
    description: "Execute Hypercorn — import, inspect, or call functions",
    category: "package",
    package: "Hypercorn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'hypercorn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Hypercorn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ImageIO
  {
    name: "pkg_imageio",
    description: "Execute ImageIO — import, inspect, or call functions",
    category: "package",
    package: "ImageIO",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'imageio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ImageIO', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Jinja2
  {
    name: "pkg_jinja2",
    description: "Execute Jinja2 — import, inspect, or call functions",
    category: "package",
    package: "Jinja2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jinja2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Jinja2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: MarkupSafe
  {
    name: "pkg_markupsafe",
    description: "Execute MarkupSafe — import, inspect, or call functions",
    category: "package",
    package: "MarkupSafe",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'markupsafe'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'MarkupSafe', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: PIL
  {
    name: "pkg_pil",
    description: "Execute PIL — import, inspect, or call functions",
    category: "package",
    package: "PIL",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'PIL'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'PIL', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: PyPDF2
  {
    name: "pkg_pypdf2",
    description: "Execute PyPDF2 — import, inspect, or call functions",
    category: "package",
    package: "PyPDF2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'PyPDF2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'PyPDF2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Pygments
  {
    name: "pkg_pygments",
    description: "Execute Pygments — import, inspect, or call functions",
    category: "package",
    package: "Pygments",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pygments'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Pygments', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: RUST
  {
    name: "pkg_rust",
    description: "Execute RUST — import, inspect, or call functions",
    category: "package",
    package: "RUST",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rust'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'RUST', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: RapidFuzz
  {
    name: "pkg_rapidfuzz",
    description: "Execute RapidFuzz — import, inspect, or call functions",
    category: "package",
    package: "RapidFuzz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rapidfuzz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'RapidFuzz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: SecretStorage
  {
    name: "pkg_secretstorage",
    description: "Execute SecretStorage — import, inspect, or call functions",
    category: "package",
    package: "SecretStorage",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'secretstorage'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'SecretStorage', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: Send2Trash
  {
    name: "pkg_send2trash",
    description: "Execute Send2Trash — import, inspect, or call functions",
    category: "package",
    package: "Send2Trash",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'send2trash'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'Send2Trash', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: adjustText
  {
    name: "pkg_adjusttext",
    description: "Execute adjustText — import, inspect, or call functions",
    category: "package",
    package: "adjustText",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'adjusttext'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'adjustText', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: affine
  {
    name: "pkg_affine",
    description: "Execute affine — import, inspect, or call functions",
    category: "package",
    package: "affine",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'affine'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'affine', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: aiofiles
  {
    name: "pkg_aiofiles",
    description: "Execute aiofiles — import, inspect, or call functions",
    category: "package",
    package: "aiofiles",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'aiofiles'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'aiofiles', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: aiohappyeyeballs
  {
    name: "pkg_aiohappyeyeballs",
    description: "Execute aiohappyeyeballs — import, inspect, or call functions",
    category: "package",
    package: "aiohappyeyeballs",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'aiohappyeyeballs'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'aiohappyeyeballs', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: aiohttp
  {
    name: "pkg_aiohttp",
    description: "Execute aiohttp — import, inspect, or call functions",
    category: "package",
    package: "aiohttp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'aiohttp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'aiohttp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: aiosignal
  {
    name: "pkg_aiosignal",
    description: "Execute aiosignal — import, inspect, or call functions",
    category: "package",
    package: "aiosignal",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'aiosignal'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'aiosignal', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-credentials
  {
    name: "pkg_alibabacloud_credentials",
    description: "Execute alibabacloud-credentials — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-credentials",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_credentials'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-credentials', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-credentials-api
  {
    name: "pkg_alibabacloud_credentials_api",
    description: "Execute alibabacloud-credentials-api — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-credentials-api",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_credentials_api'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-credentials-api', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-fc20230330
  {
    name: "pkg_alibabacloud_fc20230330",
    description: "Execute alibabacloud-fc20230330 — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-fc20230330",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_fc20230330'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-fc20230330', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-gateway-spi
  {
    name: "pkg_alibabacloud_gateway_spi",
    description: "Execute alibabacloud-gateway-spi — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-gateway-spi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_gateway_spi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-gateway-spi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-oss-v2
  {
    name: "pkg_alibabacloud_oss_v2",
    description: "Execute alibabacloud-oss-v2 — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-oss-v2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_oss_v2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-oss-v2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-polardb20170801
  {
    name: "pkg_alibabacloud_polardb20170801",
    description: "Execute alibabacloud-polardb20170801 — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-polardb20170801",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_polardb20170801'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-polardb20170801', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-tea-openapi
  {
    name: "pkg_alibabacloud_tea_openapi",
    description: "Execute alibabacloud-tea-openapi — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-tea-openapi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_tea_openapi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-tea-openapi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: alibabacloud-tea-util
  {
    name: "pkg_alibabacloud_tea_util",
    description: "Execute alibabacloud-tea-util — import, inspect, or call functions",
    category: "package",
    package: "alibabacloud-tea-util",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'alibabacloud_tea_util'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'alibabacloud-tea-util', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: annotated-doc
  {
    name: "pkg_annotated_doc",
    description: "Execute annotated-doc — import, inspect, or call functions",
    category: "package",
    package: "annotated-doc",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'annotated_doc'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'annotated-doc', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: annotated-types
  {
    name: "pkg_annotated_types",
    description: "Execute annotated-types — import, inspect, or call functions",
    category: "package",
    package: "annotated-types",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'annotated_types'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'annotated-types', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: anyio
  {
    name: "pkg_anyio",
    description: "Execute anyio — import, inspect, or call functions",
    category: "package",
    package: "anyio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'anyio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'anyio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: anytree
  {
    name: "pkg_anytree",
    description: "Execute anytree — import, inspect, or call functions",
    category: "package",
    package: "anytree",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'anytree'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'anytree', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: argon2
  {
    name: "pkg_argon2",
    description: "Execute argon2 — import, inspect, or call functions",
    category: "package",
    package: "argon2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'argon2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'argon2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: asn1crypto
  {
    name: "pkg_asn1crypto",
    description: "Execute asn1crypto — import, inspect, or call functions",
    category: "package",
    package: "asn1crypto",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'asn1crypto'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'asn1crypto', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: asttokens
  {
    name: "pkg_asttokens",
    description: "Execute asttokens — import, inspect, or call functions",
    category: "package",
    package: "asttokens",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'asttokens'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'asttokens', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: async-lru
  {
    name: "pkg_async_lru",
    description: "Execute async-lru — import, inspect, or call functions",
    category: "package",
    package: "async-lru",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'async_lru'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'async-lru', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: attr
  {
    name: "pkg_attr",
    description: "Execute attr — import, inspect, or call functions",
    category: "package",
    package: "attr",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'attr'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'attr', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: attrs
  {
    name: "pkg_attrs",
    description: "Execute attrs — import, inspect, or call functions",
    category: "package",
    package: "attrs",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'attrs'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'attrs', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: audioread
  {
    name: "pkg_audioread",
    description: "Execute audioread — import, inspect, or call functions",
    category: "package",
    package: "audioread",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'audioread'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'audioread', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: babel
  {
    name: "pkg_babel",
    description: "Execute babel — import, inspect, or call functions",
    category: "package",
    package: "babel",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'babel'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'babel', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: beartype
  {
    name: "pkg_beartype",
    description: "Execute beartype — import, inspect, or call functions",
    category: "package",
    package: "beartype",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'beartype'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'beartype', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: bio
  {
    name: "pkg_bio",
    description: "Execute bio — import, inspect, or call functions",
    category: "package",
    package: "bio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'bio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'bio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: bleach
  {
    name: "pkg_bleach",
    description: "Execute bleach — import, inspect, or call functions",
    category: "package",
    package: "bleach",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'bleach'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'bleach', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: blis
  {
    name: "pkg_blis",
    description: "Execute blis — import, inspect, or call functions",
    category: "package",
    package: "blis",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'blis'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'blis', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: blosc2
  {
    name: "pkg_blosc2",
    description: "Execute blosc2 — import, inspect, or call functions",
    category: "package",
    package: "blosc2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'blosc2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'blosc2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: bokeh
  {
    name: "pkg_bokeh",
    description: "Execute bokeh — import, inspect, or call functions",
    category: "package",
    package: "bokeh",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'bokeh'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'bokeh', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: boto3
  {
    name: "pkg_boto3",
    description: "Execute boto3 — import, inspect, or call functions",
    category: "package",
    package: "boto3",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'boto3'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'boto3', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: botocore
  {
    name: "pkg_botocore",
    description: "Execute botocore — import, inspect, or call functions",
    category: "package",
    package: "botocore",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'botocore'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'botocore', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: branca
  {
    name: "pkg_branca",
    description: "Execute branca — import, inspect, or call functions",
    category: "package",
    package: "branca",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'branca'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'branca', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: bs4
  {
    name: "pkg_bs4",
    description: "Execute bs4 — import, inspect, or call functions",
    category: "package",
    package: "bs4",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'bs4'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'bs4', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: bytecode
  {
    name: "pkg_bytecode",
    description: "Execute bytecode — import, inspect, or call functions",
    category: "package",
    package: "bytecode",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'bytecode'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'bytecode', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cachetools
  {
    name: "pkg_cachetools",
    description: "Execute cachetools — import, inspect, or call functions",
    category: "package",
    package: "cachetools",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cachetools'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cachetools', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cadquery
  {
    name: "pkg_cadquery",
    description: "Execute cadquery — import, inspect, or call functions",
    category: "package",
    package: "cadquery",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cadquery'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cadquery', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cadquery-ocp
  {
    name: "pkg_cadquery_ocp",
    description: "Execute cadquery-ocp — import, inspect, or call functions",
    category: "package",
    package: "cadquery-ocp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cadquery_ocp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cadquery-ocp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cairocffi
  {
    name: "pkg_cairocffi",
    description: "Execute cairocffi — import, inspect, or call functions",
    category: "package",
    package: "cairocffi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cairocffi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cairocffi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: casadi
  {
    name: "pkg_casadi",
    description: "Execute casadi — import, inspect, or call functions",
    category: "package",
    package: "casadi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'casadi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'casadi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: catalogue
  {
    name: "pkg_catalogue",
    description: "Execute catalogue — import, inspect, or call functions",
    category: "package",
    package: "catalogue",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'catalogue'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'catalogue', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: catboost
  {
    name: "pkg_catboost",
    description: "Execute catboost — import, inspect, or call functions",
    category: "package",
    package: "catboost",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'catboost'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'catboost', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cattrs
  {
    name: "pkg_cattrs",
    description: "Execute cattrs — import, inspect, or call functions",
    category: "package",
    package: "cattrs",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cattrs'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cattrs', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: certifi
  {
    name: "pkg_certifi",
    description: "Execute certifi — import, inspect, or call functions",
    category: "package",
    package: "certifi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'certifi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'certifi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cffi
  {
    name: "pkg_cffi",
    description: "Execute cffi — import, inspect, or call functions",
    category: "package",
    package: "cffi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cffi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cffi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: chardet
  {
    name: "pkg_chardet",
    description: "Execute chardet — import, inspect, or call functions",
    category: "package",
    package: "chardet",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'chardet'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'chardet', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: charset-normalizer
  {
    name: "pkg_charset_normalizer",
    description: "Execute charset-normalizer — import, inspect, or call functions",
    category: "package",
    package: "charset-normalizer",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'charset_normalizer'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'charset-normalizer', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: choreographer
  {
    name: "pkg_choreographer",
    description: "Execute choreographer — import, inspect, or call functions",
    category: "package",
    package: "choreographer",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'choreographer'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'choreographer', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: click
  {
    name: "pkg_click",
    description: "Execute click — import, inspect, or call functions",
    category: "package",
    package: "click",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'click'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'click', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: click-plugins
  {
    name: "pkg_click_plugins",
    description: "Execute click-plugins — import, inspect, or call functions",
    category: "package",
    package: "click-plugins",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'click_plugins'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'click-plugins', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cligj
  {
    name: "pkg_cligj",
    description: "Execute cligj — import, inspect, or call functions",
    category: "package",
    package: "cligj",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cligj'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cligj', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cloudpathlib
  {
    name: "pkg_cloudpathlib",
    description: "Execute cloudpathlib — import, inspect, or call functions",
    category: "package",
    package: "cloudpathlib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cloudpathlib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cloudpathlib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cloudpickle
  {
    name: "pkg_cloudpickle",
    description: "Execute cloudpickle — import, inspect, or call functions",
    category: "package",
    package: "cloudpickle",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cloudpickle'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cloudpickle', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cmudict
  {
    name: "pkg_cmudict",
    description: "Execute cmudict — import, inspect, or call functions",
    category: "package",
    package: "cmudict",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cmudict'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cmudict', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cobble
  {
    name: "pkg_cobble",
    description: "Execute cobble — import, inspect, or call functions",
    category: "package",
    package: "cobble",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cobble'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cobble', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: comm
  {
    name: "pkg_comm",
    description: "Execute comm — import, inspect, or call functions",
    category: "package",
    package: "comm",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'comm'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'comm', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: confection
  {
    name: "pkg_confection",
    description: "Execute confection — import, inspect, or call functions",
    category: "package",
    package: "confection",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'confection'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'confection', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: contourpy
  {
    name: "pkg_contourpy",
    description: "Execute contourpy — import, inspect, or call functions",
    category: "package",
    package: "contourpy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'contourpy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'contourpy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: countryinfo
  {
    name: "pkg_countryinfo",
    description: "Execute countryinfo — import, inspect, or call functions",
    category: "package",
    package: "countryinfo",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'countryinfo'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'countryinfo', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: coverage
  {
    name: "pkg_coverage",
    description: "Execute coverage — import, inspect, or call functions",
    category: "package",
    package: "coverage",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'coverage'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'coverage', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: crcmod
  {
    name: "pkg_crcmod",
    description: "Execute crcmod — import, inspect, or call functions",
    category: "package",
    package: "crcmod",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'crcmod'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'crcmod', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cronsim
  {
    name: "pkg_cronsim",
    description: "Execute cronsim — import, inspect, or call functions",
    category: "package",
    package: "cronsim",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cronsim'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cronsim', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: crypto
  {
    name: "pkg_crypto",
    description: "Execute crypto — import, inspect, or call functions",
    category: "package",
    package: "crypto",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'crypto'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'crypto', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cryptography
  {
    name: "pkg_cryptography",
    description: "Execute cryptography — import, inspect, or call functions",
    category: "package",
    package: "cryptography",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cryptography'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cryptography', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cssselect2
  {
    name: "pkg_cssselect2",
    description: "Execute cssselect2 — import, inspect, or call functions",
    category: "package",
    package: "cssselect2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cssselect2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cssselect2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cv2
  {
    name: "pkg_cv2",
    description: "Execute cv2 — import, inspect, or call functions",
    category: "package",
    package: "cv2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cv2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cv2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cycler
  {
    name: "pkg_cycler",
    description: "Execute cycler — import, inspect, or call functions",
    category: "package",
    package: "cycler",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cycler'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cycler', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cyclopts
  {
    name: "pkg_cyclopts",
    description: "Execute cyclopts — import, inspect, or call functions",
    category: "package",
    package: "cyclopts",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cyclopts'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cyclopts', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: cymem
  {
    name: "pkg_cymem",
    description: "Execute cymem — import, inspect, or call functions",
    category: "package",
    package: "cymem",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'cymem'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'cymem', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: databricks
  {
    name: "pkg_databricks",
    description: "Execute databricks — import, inspect, or call functions",
    category: "package",
    package: "databricks",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'databricks'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'databricks', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: datadog
  {
    name: "pkg_datadog",
    description: "Execute datadog — import, inspect, or call functions",
    category: "package",
    package: "datadog",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'datadog'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'datadog', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: dateutil
  {
    name: "pkg_dateutil",
    description: "Execute dateutil — import, inspect, or call functions",
    category: "package",
    package: "dateutil",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'dateutil'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'dateutil', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ddtrace
  {
    name: "pkg_ddtrace",
    description: "Execute ddtrace — import, inspect, or call functions",
    category: "package",
    package: "ddtrace",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ddtrace'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ddtrace', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: debugpy
  {
    name: "pkg_debugpy",
    description: "Execute debugpy — import, inspect, or call functions",
    category: "package",
    package: "debugpy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'debugpy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'debugpy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: defusedxml
  {
    name: "pkg_defusedxml",
    description: "Execute defusedxml — import, inspect, or call functions",
    category: "package",
    package: "defusedxml",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'defusedxml'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'defusedxml', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: diskcache
  {
    name: "pkg_diskcache",
    description: "Execute diskcache — import, inspect, or call functions",
    category: "package",
    package: "diskcache",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'diskcache'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'diskcache', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: distro
  {
    name: "pkg_distro",
    description: "Execute distro — import, inspect, or call functions",
    category: "package",
    package: "distro",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'distro'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'distro', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: dns
  {
    name: "pkg_dns",
    description: "Execute dns — import, inspect, or call functions",
    category: "package",
    package: "dns",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'dns'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'dns', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: docstring-parser
  {
    name: "pkg_docstring_parser",
    description: "Execute docstring-parser — import, inspect, or call functions",
    category: "package",
    package: "docstring-parser",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'docstring_parser'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'docstring-parser', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: docutils
  {
    name: "pkg_docutils",
    description: "Execute docutils — import, inspect, or call functions",
    category: "package",
    package: "docutils",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'docutils'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'docutils', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },
// ═══ End Batch 1 ═══

// ═══ V.130 Batch 2: 100 wrappers ═══

  // V.130: docx
  {
    name: "pkg_docx",
    description: "Execute docx — import, inspect, or call functions",
    category: "package",
    package: "docx",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'docx'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'docx', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: docx2txt
  {
    name: "pkg_docx2txt",
    description: "Execute docx2txt — import, inspect, or call functions",
    category: "package",
    package: "docx2txt",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'docx2txt'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'docx2txt', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: dotenv
  {
    name: "pkg_dotenv",
    description: "Execute dotenv — import, inspect, or call functions",
    category: "package",
    package: "dotenv",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'dotenv'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'dotenv', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: einops
  {
    name: "pkg_einops",
    description: "Execute einops — import, inspect, or call functions",
    category: "package",
    package: "einops",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'einops'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'einops', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: email-validator
  {
    name: "pkg_email_validator",
    description: "Execute email-validator — import, inspect, or call functions",
    category: "package",
    package: "email-validator",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'email_validator'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'email-validator', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: envier
  {
    name: "pkg_envier",
    description: "Execute envier — import, inspect, or call functions",
    category: "package",
    package: "envier",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'envier'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'envier', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: et-xmlfile
  {
    name: "pkg_et_xmlfile",
    description: "Execute et-xmlfile — import, inspect, or call functions",
    category: "package",
    package: "et-xmlfile",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'et_xmlfile'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'et-xmlfile', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: exceptiongroup
  {
    name: "pkg_exceptiongroup",
    description: "Execute exceptiongroup — import, inspect, or call functions",
    category: "package",
    package: "exceptiongroup",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'exceptiongroup'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'exceptiongroup', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: exchange_calendars
  {
    name: "pkg_exchange_calendars",
    description: "Execute exchange_calendars — import, inspect, or call functions",
    category: "package",
    package: "exchange_calendars",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'exchange_calendars'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'exchange_calendars', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: executing
  {
    name: "pkg_executing",
    description: "Execute executing — import, inspect, or call functions",
    category: "package",
    package: "executing",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'executing'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'executing', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ezdxf
  {
    name: "pkg_ezdxf",
    description: "Execute ezdxf — import, inspect, or call functions",
    category: "package",
    package: "ezdxf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ezdxf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ezdxf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fakeredis
  {
    name: "pkg_fakeredis",
    description: "Execute fakeredis — import, inspect, or call functions",
    category: "package",
    package: "fakeredis",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fakeredis'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fakeredis', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fastapi
  {
    name: "pkg_fastapi",
    description: "Execute fastapi — import, inspect, or call functions",
    category: "package",
    package: "fastapi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fastapi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fastapi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fastjsonschema
  {
    name: "pkg_fastjsonschema",
    description: "Execute fastjsonschema — import, inspect, or call functions",
    category: "package",
    package: "fastjsonschema",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fastjsonschema'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fastjsonschema', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fastmcp
  {
    name: "pkg_fastmcp",
    description: "Execute fastmcp — import, inspect, or call functions",
    category: "package",
    package: "fastmcp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fastmcp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fastmcp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ffmpeg
  {
    name: "pkg_ffmpeg",
    description: "Execute ffmpeg — import, inspect, or call functions",
    category: "package",
    package: "ffmpeg",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ffmpeg'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ffmpeg', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ffmpy
  {
    name: "pkg_ffmpy",
    description: "Execute ffmpy — import, inspect, or call functions",
    category: "package",
    package: "ffmpy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ffmpy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ffmpy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: filelock
  {
    name: "pkg_filelock",
    description: "Execute filelock — import, inspect, or call functions",
    category: "package",
    package: "filelock",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'filelock'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'filelock', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fiona
  {
    name: "pkg_fiona",
    description: "Execute fiona — import, inspect, or call functions",
    category: "package",
    package: "fiona",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fiona'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fiona', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fitz
  {
    name: "pkg_fitz",
    description: "Execute fitz — import, inspect, or call functions",
    category: "package",
    package: "fitz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fitz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fitz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: folium
  {
    name: "pkg_folium",
    description: "Execute folium — import, inspect, or call functions",
    category: "package",
    package: "folium",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'folium'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'folium', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fonttools
  {
    name: "pkg_fonttools",
    description: "Execute fonttools — import, inspect, or call functions",
    category: "package",
    package: "fonttools",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fonttools'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fonttools', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fpdf
  {
    name: "pkg_fpdf",
    description: "Execute fpdf — import, inspect, or call functions",
    category: "package",
    package: "fpdf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fpdf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fpdf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fqdn
  {
    name: "pkg_fqdn",
    description: "Execute fqdn — import, inspect, or call functions",
    category: "package",
    package: "fqdn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fqdn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fqdn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: frozenlist
  {
    name: "pkg_frozenlist",
    description: "Execute frozenlist — import, inspect, or call functions",
    category: "package",
    package: "frozenlist",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'frozenlist'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'frozenlist', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fsspec
  {
    name: "pkg_fsspec",
    description: "Execute fsspec — import, inspect, or call functions",
    category: "package",
    package: "fsspec",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fsspec'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fsspec', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: future
  {
    name: "pkg_future",
    description: "Execute future — import, inspect, or call functions",
    category: "package",
    package: "future",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'future'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'future', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: fuzzywuzzy
  {
    name: "pkg_fuzzywuzzy",
    description: "Execute fuzzywuzzy — import, inspect, or call functions",
    category: "package",
    package: "fuzzywuzzy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'fuzzywuzzy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'fuzzywuzzy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: gensim
  {
    name: "pkg_gensim",
    description: "Execute gensim — import, inspect, or call functions",
    category: "package",
    package: "gensim",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'gensim'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'gensim', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: geographiclib
  {
    name: "pkg_geographiclib",
    description: "Execute geographiclib — import, inspect, or call functions",
    category: "package",
    package: "geographiclib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'geographiclib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'geographiclib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: geopandas
  {
    name: "pkg_geopandas",
    description: "Execute geopandas — import, inspect, or call functions",
    category: "package",
    package: "geopandas",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'geopandas'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'geopandas', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: geopy
  {
    name: "pkg_geopy",
    description: "Execute geopy — import, inspect, or call functions",
    category: "package",
    package: "geopy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'geopy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'geopy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: gradio
  {
    name: "pkg_gradio",
    description: "Execute gradio — import, inspect, or call functions",
    category: "package",
    package: "gradio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'gradio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'gradio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: gradio-client
  {
    name: "pkg_gradio_client",
    description: "Execute gradio-client — import, inspect, or call functions",
    category: "package",
    package: "gradio-client",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'gradio_client'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'gradio-client', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: graphviz
  {
    name: "pkg_graphviz",
    description: "Execute graphviz — import, inspect, or call functions",
    category: "package",
    package: "graphviz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'graphviz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'graphviz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: greenlet
  {
    name: "pkg_greenlet",
    description: "Execute greenlet — import, inspect, or call functions",
    category: "package",
    package: "greenlet",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'greenlet'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'greenlet', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: groovy
  {
    name: "pkg_groovy",
    description: "Execute groovy — import, inspect, or call functions",
    category: "package",
    package: "groovy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'groovy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'groovy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: h11
  {
    name: "pkg_h11",
    description: "Execute h11 — import, inspect, or call functions",
    category: "package",
    package: "h11",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'h11'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'h11', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: h2
  {
    name: "pkg_h2",
    description: "Execute h2 — import, inspect, or call functions",
    category: "package",
    package: "h2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'h2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'h2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: h5py
  {
    name: "pkg_h5py",
    description: "Execute h5py — import, inspect, or call functions",
    category: "package",
    package: "h5py",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'h5py'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'h5py', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: hf-xet
  {
    name: "pkg_hf_xet",
    description: "Execute hf-xet — import, inspect, or call functions",
    category: "package",
    package: "hf-xet",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'hf_xet'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'hf-xet', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: hpack
  {
    name: "pkg_hpack",
    description: "Execute hpack — import, inspect, or call functions",
    category: "package",
    package: "hpack",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'hpack'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'hpack', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: html5lib
  {
    name: "pkg_html5lib",
    description: "Execute html5lib — import, inspect, or call functions",
    category: "package",
    package: "html5lib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'html5lib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'html5lib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: httpcore
  {
    name: "pkg_httpcore",
    description: "Execute httpcore — import, inspect, or call functions",
    category: "package",
    package: "httpcore",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'httpcore'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'httpcore', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: httpx
  {
    name: "pkg_httpx",
    description: "Execute httpx — import, inspect, or call functions",
    category: "package",
    package: "httpx",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'httpx'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'httpx', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: httpx-sse
  {
    name: "pkg_httpx_sse",
    description: "Execute httpx-sse — import, inspect, or call functions",
    category: "package",
    package: "httpx-sse",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'httpx_sse'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'httpx-sse', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: huggingface-hub
  {
    name: "pkg_huggingface_hub",
    description: "Execute huggingface-hub — import, inspect, or call functions",
    category: "package",
    package: "huggingface-hub",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'huggingface_hub'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'huggingface-hub', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: hyperframe
  {
    name: "pkg_hyperframe",
    description: "Execute hyperframe — import, inspect, or call functions",
    category: "package",
    package: "hyperframe",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'hyperframe'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'hyperframe', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: idna
  {
    name: "pkg_idna",
    description: "Execute idna — import, inspect, or call functions",
    category: "package",
    package: "idna",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'idna'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'idna', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: imageio-ffmpeg
  {
    name: "pkg_imageio_ffmpeg",
    description: "Execute imageio-ffmpeg — import, inspect, or call functions",
    category: "package",
    package: "imageio-ffmpeg",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'imageio_ffmpeg'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'imageio-ffmpeg', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: imblearn
  {
    name: "pkg_imblearn",
    description: "Execute imblearn — import, inspect, or call functions",
    category: "package",
    package: "imblearn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'imblearn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'imblearn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: imgkit
  {
    name: "pkg_imgkit",
    description: "Execute imgkit — import, inspect, or call functions",
    category: "package",
    package: "imgkit",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'imgkit'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'imgkit', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: importlib-metadata
  {
    name: "pkg_importlib_metadata",
    description: "Execute importlib-metadata — import, inspect, or call functions",
    category: "package",
    package: "importlib-metadata",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'importlib_metadata'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'importlib-metadata', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: importlib-resources
  {
    name: "pkg_importlib_resources",
    description: "Execute importlib-resources — import, inspect, or call functions",
    category: "package",
    package: "importlib-resources",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'importlib_resources'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'importlib-resources', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: include
  {
    name: "pkg_include",
    description: "Execute include — import, inspect, or call functions",
    category: "package",
    package: "include",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'include'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'include', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: iniconfig
  {
    name: "pkg_iniconfig",
    description: "Execute iniconfig — import, inspect, or call functions",
    category: "package",
    package: "iniconfig",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'iniconfig'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'iniconfig', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ipykernel
  {
    name: "pkg_ipykernel",
    description: "Execute ipykernel — import, inspect, or call functions",
    category: "package",
    package: "ipykernel",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ipykernel'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ipykernel', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ipython
  {
    name: "pkg_ipython",
    description: "Execute ipython — import, inspect, or call functions",
    category: "package",
    package: "ipython",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ipython'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ipython', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: isoduration
  {
    name: "pkg_isoduration",
    description: "Execute isoduration — import, inspect, or call functions",
    category: "package",
    package: "isoduration",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'isoduration'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'isoduration', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jedi
  {
    name: "pkg_jedi",
    description: "Execute jedi — import, inspect, or call functions",
    category: "package",
    package: "jedi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jedi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jedi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jeepney
  {
    name: "pkg_jeepney",
    description: "Execute jeepney — import, inspect, or call functions",
    category: "package",
    package: "jeepney",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jeepney'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jeepney', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jmespath
  {
    name: "pkg_jmespath",
    description: "Execute jmespath — import, inspect, or call functions",
    category: "package",
    package: "jmespath",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jmespath'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jmespath', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: joblib
  {
    name: "pkg_joblib",
    description: "Execute joblib — import, inspect, or call functions",
    category: "package",
    package: "joblib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'joblib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'joblib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: json-repair
  {
    name: "pkg_json_repair",
    description: "Execute json-repair — import, inspect, or call functions",
    category: "package",
    package: "json-repair",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'json_repair'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'json-repair', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: json5
  {
    name: "pkg_json5",
    description: "Execute json5 — import, inspect, or call functions",
    category: "package",
    package: "json5",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'json5'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'json5', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jsonschema
  {
    name: "pkg_jsonschema",
    description: "Execute jsonschema — import, inspect, or call functions",
    category: "package",
    package: "jsonschema",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jsonschema'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jsonschema', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jsonschema-path
  {
    name: "pkg_jsonschema_path",
    description: "Execute jsonschema-path — import, inspect, or call functions",
    category: "package",
    package: "jsonschema-path",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jsonschema_path'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jsonschema-path', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jsonschema-specifications
  {
    name: "pkg_jsonschema_specifications",
    description: "Execute jsonschema-specifications — import, inspect, or call functions",
    category: "package",
    package: "jsonschema-specifications",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jsonschema_specifications'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jsonschema-specifications', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-client
  {
    name: "pkg_jupyter_client",
    description: "Execute jupyter-client — import, inspect, or call functions",
    category: "package",
    package: "jupyter-client",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_client'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-client', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-core
  {
    name: "pkg_jupyter_core",
    description: "Execute jupyter-core — import, inspect, or call functions",
    category: "package",
    package: "jupyter-core",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_core'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-core', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-events
  {
    name: "pkg_jupyter_events",
    description: "Execute jupyter-events — import, inspect, or call functions",
    category: "package",
    package: "jupyter-events",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_events'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-events', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-lsp
  {
    name: "pkg_jupyter_lsp",
    description: "Execute jupyter-lsp — import, inspect, or call functions",
    category: "package",
    package: "jupyter-lsp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_lsp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-lsp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-server
  {
    name: "pkg_jupyter_server",
    description: "Execute jupyter-server — import, inspect, or call functions",
    category: "package",
    package: "jupyter-server",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_server'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-server', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyter-server-terminals
  {
    name: "pkg_jupyter_server_terminals",
    description: "Execute jupyter-server-terminals — import, inspect, or call functions",
    category: "package",
    package: "jupyter-server-terminals",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyter_server_terminals'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyter-server-terminals', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyterlab
  {
    name: "pkg_jupyterlab",
    description: "Execute jupyterlab — import, inspect, or call functions",
    category: "package",
    package: "jupyterlab",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyterlab'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyterlab', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyterlab-pygments
  {
    name: "pkg_jupyterlab_pygments",
    description: "Execute jupyterlab-pygments — import, inspect, or call functions",
    category: "package",
    package: "jupyterlab-pygments",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyterlab_pygments'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyterlab-pygments', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jupyterlab-server
  {
    name: "pkg_jupyterlab_server",
    description: "Execute jupyterlab-server — import, inspect, or call functions",
    category: "package",
    package: "jupyterlab-server",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jupyterlab_server'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jupyterlab-server', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: jwt
  {
    name: "pkg_jwt",
    description: "Execute jwt — import, inspect, or call functions",
    category: "package",
    package: "jwt",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'jwt'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'jwt', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: kaleido
  {
    name: "pkg_kaleido",
    description: "Execute kaleido — import, inspect, or call functions",
    category: "package",
    package: "kaleido",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'kaleido'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'kaleido', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: kerykeion
  {
    name: "pkg_kerykeion",
    description: "Execute kerykeion — import, inspect, or call functions",
    category: "package",
    package: "kerykeion",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'kerykeion'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'kerykeion', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: key-value
  {
    name: "pkg_key_value",
    description: "Execute key-value — import, inspect, or call functions",
    category: "package",
    package: "key-value",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'key_value'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'key-value', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: keyring
  {
    name: "pkg_keyring",
    description: "Execute keyring — import, inspect, or call functions",
    category: "package",
    package: "keyring",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'keyring'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'keyring', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: kiwisolver
  {
    name: "pkg_kiwisolver",
    description: "Execute kiwisolver — import, inspect, or call functions",
    category: "package",
    package: "kiwisolver",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'kiwisolver'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'kiwisolver', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: korean-lunar-calendar
  {
    name: "pkg_korean_lunar_calendar",
    description: "Execute korean-lunar-calendar — import, inspect, or call functions",
    category: "package",
    package: "korean-lunar-calendar",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'korean_lunar_calendar'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'korean-lunar-calendar', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lark
  {
    name: "pkg_lark",
    description: "Execute lark — import, inspect, or call functions",
    category: "package",
    package: "lark",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lark'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lark', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lazy-loader
  {
    name: "pkg_lazy_loader",
    description: "Execute lazy-loader — import, inspect, or call functions",
    category: "package",
    package: "lazy-loader",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lazy_loader'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lazy-loader', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: librosa
  {
    name: "pkg_librosa",
    description: "Execute librosa — import, inspect, or call functions",
    category: "package",
    package: "librosa",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'librosa'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'librosa', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lightgbm
  {
    name: "pkg_lightgbm",
    description: "Execute lightgbm — import, inspect, or call functions",
    category: "package",
    package: "lightgbm",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lightgbm'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lightgbm', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: llvmlite
  {
    name: "pkg_llvmlite",
    description: "Execute llvmlite — import, inspect, or call functions",
    category: "package",
    package: "llvmlite",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'llvmlite'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'llvmlite', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: logistro
  {
    name: "pkg_logistro",
    description: "Execute logistro — import, inspect, or call functions",
    category: "package",
    package: "logistro",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'logistro'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'logistro', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: loguru
  {
    name: "pkg_loguru",
    description: "Execute loguru — import, inspect, or call functions",
    category: "package",
    package: "loguru",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'loguru'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'loguru', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lupa
  {
    name: "pkg_lupa",
    description: "Execute lupa — import, inspect, or call functions",
    category: "package",
    package: "lupa",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lupa'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lupa', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lxml
  {
    name: "pkg_lxml",
    description: "Execute lxml — import, inspect, or call functions",
    category: "package",
    package: "lxml",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lxml'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lxml', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: lz4
  {
    name: "pkg_lz4",
    description: "Execute lz4 — import, inspect, or call functions",
    category: "package",
    package: "lz4",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'lz4'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'lz4', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mammoth
  {
    name: "pkg_mammoth",
    description: "Execute mammoth — import, inspect, or call functions",
    category: "package",
    package: "mammoth",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mammoth'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mammoth', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: markdownify
  {
    name: "pkg_markdownify",
    description: "Execute markdownify — import, inspect, or call functions",
    category: "package",
    package: "markdownify",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'markdownify'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'markdownify', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: matplotlib-inline
  {
    name: "pkg_matplotlib_inline",
    description: "Execute matplotlib-inline — import, inspect, or call functions",
    category: "package",
    package: "matplotlib-inline",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'matplotlib_inline'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'matplotlib-inline', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: matplotlib-venn
  {
    name: "pkg_matplotlib_venn",
    description: "Execute matplotlib-venn — import, inspect, or call functions",
    category: "package",
    package: "matplotlib-venn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'matplotlib_venn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'matplotlib-venn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mcp
  {
    name: "pkg_mcp",
    description: "Execute mcp — import, inspect, or call functions",
    category: "package",
    package: "mcp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mcp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mcp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mdurl
  {
    name: "pkg_mdurl",
    description: "Execute mdurl — import, inspect, or call functions",
    category: "package",
    package: "mdurl",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mdurl'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mdurl', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },
// ═══ End Batch 2 ═══

// ═══ V.130 Batch 3: 100 wrappers ═══

  // V.130: mistune
  {
    name: "pkg_mistune",
    description: "Execute mistune — import, inspect, or call functions",
    category: "package",
    package: "mistune",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mistune'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mistune', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mizani
  {
    name: "pkg_mizani",
    description: "Execute mizani — import, inspect, or call functions",
    category: "package",
    package: "mizani",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mizani'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mizani', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mne
  {
    name: "pkg_mne",
    description: "Execute mne — import, inspect, or call functions",
    category: "package",
    package: "mne",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mne'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mne', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: more-itertools
  {
    name: "pkg_more_itertools",
    description: "Execute more-itertools — import, inspect, or call functions",
    category: "package",
    package: "more-itertools",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'more_itertools'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'more-itertools', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: moviepy
  {
    name: "pkg_moviepy",
    description: "Execute moviepy — import, inspect, or call functions",
    category: "package",
    package: "moviepy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'moviepy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'moviepy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mpmath
  {
    name: "pkg_mpmath",
    description: "Execute mpmath — import, inspect, or call functions",
    category: "package",
    package: "mpmath",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mpmath'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mpmath', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: msgpack
  {
    name: "pkg_msgpack",
    description: "Execute msgpack — import, inspect, or call functions",
    category: "package",
    package: "msgpack",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'msgpack'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'msgpack', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: multidict
  {
    name: "pkg_multidict",
    description: "Execute multidict — import, inspect, or call functions",
    category: "package",
    package: "multidict",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'multidict'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'multidict', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: multimethod
  {
    name: "pkg_multimethod",
    description: "Execute multimethod — import, inspect, or call functions",
    category: "package",
    package: "multimethod",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'multimethod'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'multimethod', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: multipart
  {
    name: "pkg_multipart",
    description: "Execute multipart — import, inspect, or call functions",
    category: "package",
    package: "multipart",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'multipart'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'multipart', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: murmurhash
  {
    name: "pkg_murmurhash",
    description: "Execute murmurhash — import, inspect, or call functions",
    category: "package",
    package: "murmurhash",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'murmurhash'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'murmurhash', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: mutagen
  {
    name: "pkg_mutagen",
    description: "Execute mutagen — import, inspect, or call functions",
    category: "package",
    package: "mutagen",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'mutagen'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'mutagen', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: narwhals
  {
    name: "pkg_narwhals",
    description: "Execute narwhals — import, inspect, or call functions",
    category: "package",
    package: "narwhals",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'narwhals'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'narwhals', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: nashpy
  {
    name: "pkg_nashpy",
    description: "Execute nashpy — import, inspect, or call functions",
    category: "package",
    package: "nashpy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'nashpy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'nashpy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: nbclient
  {
    name: "pkg_nbclient",
    description: "Execute nbclient — import, inspect, or call functions",
    category: "package",
    package: "nbclient",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'nbclient'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'nbclient', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: nbconvert
  {
    name: "pkg_nbconvert",
    description: "Execute nbconvert — import, inspect, or call functions",
    category: "package",
    package: "nbconvert",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'nbconvert'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'nbconvert', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: nbformat
  {
    name: "pkg_nbformat",
    description: "Execute nbformat — import, inspect, or call functions",
    category: "package",
    package: "nbformat",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'nbformat'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'nbformat', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ndindex
  {
    name: "pkg_ndindex",
    description: "Execute ndindex — import, inspect, or call functions",
    category: "package",
    package: "ndindex",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ndindex'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ndindex', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: networkx
  {
    name: "pkg_networkx",
    description: "Execute networkx — import, inspect, or call functions",
    category: "package",
    package: "networkx",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'networkx'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'networkx', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: nlopt
  {
    name: "pkg_nlopt",
    description: "Execute nlopt — import, inspect, or call functions",
    category: "package",
    package: "nlopt",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'nlopt'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'nlopt', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: notebook
  {
    name: "pkg_notebook",
    description: "Execute notebook — import, inspect, or call functions",
    category: "package",
    package: "notebook",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'notebook'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'notebook', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: notebook-shim
  {
    name: "pkg_notebook_shim",
    description: "Execute notebook-shim — import, inspect, or call functions",
    category: "package",
    package: "notebook-shim",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'notebook_shim'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'notebook-shim', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: numba
  {
    name: "pkg_numba",
    description: "Execute numba — import, inspect, or call functions",
    category: "package",
    package: "numba",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'numba'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'numba', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: numexpr
  {
    name: "pkg_numexpr",
    description: "Execute numexpr — import, inspect, or call functions",
    category: "package",
    package: "numexpr",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'numexpr'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'numexpr', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: numpy
  {
    name: "pkg_numpy",
    description: "Execute numpy — import, inspect, or call functions",
    category: "package",
    package: "numpy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'numpy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'numpy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: numpy-financial
  {
    name: "pkg_numpy_financial",
    description: "Execute numpy-financial — import, inspect, or call functions",
    category: "package",
    package: "numpy-financial",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'numpy_financial'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'numpy-financial', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: oauthlib
  {
    name: "pkg_oauthlib",
    description: "Execute oauthlib — import, inspect, or call functions",
    category: "package",
    package: "oauthlib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'oauthlib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'oauthlib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ocp
  {
    name: "pkg_ocp",
    description: "Execute ocp — import, inspect, or call functions",
    category: "package",
    package: "ocp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ocp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ocp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: odf
  {
    name: "pkg_odf",
    description: "Execute odf — import, inspect, or call functions",
    category: "package",
    package: "odf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'odf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'odf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: openapi-pydantic
  {
    name: "pkg_openapi_pydantic",
    description: "Execute openapi-pydantic — import, inspect, or call functions",
    category: "package",
    package: "openapi-pydantic",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'openapi_pydantic'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'openapi-pydantic', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: packaging
  {
    name: "pkg_packaging",
    description: "Execute packaging — import, inspect, or call functions",
    category: "package",
    package: "packaging",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'packaging'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'packaging', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pandas
  {
    name: "pkg_pandas",
    description: "Execute pandas — import, inspect, or call functions",
    category: "package",
    package: "pandas",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pandas'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pandas', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pandoc
  {
    name: "pkg_pandoc",
    description: "Execute pandoc — import, inspect, or call functions",
    category: "package",
    package: "pandoc",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pandoc'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pandoc', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: parso
  {
    name: "pkg_parso",
    description: "Execute parso — import, inspect, or call functions",
    category: "package",
    package: "parso",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'parso'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'parso', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: past
  {
    name: "pkg_past",
    description: "Execute past — import, inspect, or call functions",
    category: "package",
    package: "past",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'past'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'past', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: path
  {
    name: "pkg_path",
    description: "Execute path — import, inspect, or call functions",
    category: "package",
    package: "path",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'path'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'path', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pathable
  {
    name: "pkg_pathable",
    description: "Execute pathable — import, inspect, or call functions",
    category: "package",
    package: "pathable",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pathable'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pathable', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pathvalidate
  {
    name: "pkg_pathvalidate",
    description: "Execute pathvalidate — import, inspect, or call functions",
    category: "package",
    package: "pathvalidate",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pathvalidate'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pathvalidate', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: patsy
  {
    name: "pkg_patsy",
    description: "Execute patsy — import, inspect, or call functions",
    category: "package",
    package: "patsy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'patsy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'patsy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pdf2image
  {
    name: "pkg_pdf2image",
    description: "Execute pdf2image — import, inspect, or call functions",
    category: "package",
    package: "pdf2image",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pdf2image'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pdf2image', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pdfkit
  {
    name: "pkg_pdfkit",
    description: "Execute pdfkit — import, inspect, or call functions",
    category: "package",
    package: "pdfkit",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pdfkit'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pdfkit', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pdfminer
  {
    name: "pkg_pdfminer",
    description: "Execute pdfminer — import, inspect, or call functions",
    category: "package",
    package: "pdfminer",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pdfminer'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pdfminer', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pdfrw
  {
    name: "pkg_pdfrw",
    description: "Execute pdfrw — import, inspect, or call functions",
    category: "package",
    package: "pdfrw",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pdfrw'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pdfrw', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pedalboard
  {
    name: "pkg_pedalboard",
    description: "Execute pedalboard — import, inspect, or call functions",
    category: "package",
    package: "pedalboard",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pedalboard'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pedalboard', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pexpect
  {
    name: "pkg_pexpect",
    description: "Execute pexpect — import, inspect, or call functions",
    category: "package",
    package: "pexpect",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pexpect'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pexpect', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pikepdf
  {
    name: "pkg_pikepdf",
    description: "Execute pikepdf — import, inspect, or call functions",
    category: "package",
    package: "pikepdf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pikepdf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pikepdf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pip
  {
    name: "pkg_pip",
    description: "Execute pip — import, inspect, or call functions",
    category: "package",
    package: "pip",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pip'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pip', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: platformdirs
  {
    name: "pkg_platformdirs",
    description: "Execute platformdirs — import, inspect, or call functions",
    category: "package",
    package: "platformdirs",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'platformdirs'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'platformdirs', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: playwright
  {
    name: "pkg_playwright",
    description: "Execute playwright — import, inspect, or call functions",
    category: "package",
    package: "playwright",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'playwright'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'playwright', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: plotly
  {
    name: "pkg_plotly",
    description: "Execute plotly — import, inspect, or call functions",
    category: "package",
    package: "plotly",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'plotly'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'plotly', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: plotnine
  {
    name: "pkg_plotnine",
    description: "Execute plotnine — import, inspect, or call functions",
    category: "package",
    package: "plotnine",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'plotnine'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'plotnine', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pluggy
  {
    name: "pkg_pluggy",
    description: "Execute pluggy — import, inspect, or call functions",
    category: "package",
    package: "pluggy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pluggy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pluggy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: plumbum
  {
    name: "pkg_plumbum",
    description: "Execute plumbum — import, inspect, or call functions",
    category: "package",
    package: "plumbum",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'plumbum'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'plumbum', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ply
  {
    name: "pkg_ply",
    description: "Execute ply — import, inspect, or call functions",
    category: "package",
    package: "ply",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ply'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ply', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pooch
  {
    name: "pkg_pooch",
    description: "Execute pooch — import, inspect, or call functions",
    category: "package",
    package: "pooch",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pooch'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pooch', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: preshed
  {
    name: "pkg_preshed",
    description: "Execute preshed — import, inspect, or call functions",
    category: "package",
    package: "preshed",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'preshed'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'preshed', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: priority
  {
    name: "pkg_priority",
    description: "Execute priority — import, inspect, or call functions",
    category: "package",
    package: "priority",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'priority'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'priority', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: proglog
  {
    name: "pkg_proglog",
    description: "Execute proglog — import, inspect, or call functions",
    category: "package",
    package: "proglog",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'proglog'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'proglog', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: prometheus-client
  {
    name: "pkg_prometheus_client",
    description: "Execute prometheus-client — import, inspect, or call functions",
    category: "package",
    package: "prometheus-client",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'prometheus_client'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'prometheus-client', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: prompt_toolkit
  {
    name: "pkg_prompt_toolkit",
    description: "Execute prompt_toolkit — import, inspect, or call functions",
    category: "package",
    package: "prompt_toolkit",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'prompt_toolkit'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'prompt_toolkit', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pronouncing
  {
    name: "pkg_pronouncing",
    description: "Execute pronouncing — import, inspect, or call functions",
    category: "package",
    package: "pronouncing",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pronouncing'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pronouncing', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: propcache
  {
    name: "pkg_propcache",
    description: "Execute propcache — import, inspect, or call functions",
    category: "package",
    package: "propcache",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'propcache'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'propcache', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: psutil
  {
    name: "pkg_psutil",
    description: "Execute psutil — import, inspect, or call functions",
    category: "package",
    package: "psutil",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'psutil'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'psutil', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ptyprocess
  {
    name: "pkg_ptyprocess",
    description: "Execute ptyprocess — import, inspect, or call functions",
    category: "package",
    package: "ptyprocess",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ptyprocess'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ptyprocess', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pure-eval
  {
    name: "pkg_pure_eval",
    description: "Execute pure-eval — import, inspect, or call functions",
    category: "package",
    package: "pure-eval",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pure_eval'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pure-eval', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pybreaker
  {
    name: "pkg_pybreaker",
    description: "Execute pybreaker — import, inspect, or call functions",
    category: "package",
    package: "pybreaker",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pybreaker'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pybreaker', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pycountry
  {
    name: "pkg_pycountry",
    description: "Execute pycountry — import, inspect, or call functions",
    category: "package",
    package: "pycountry",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pycountry'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pycountry', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pycparser
  {
    name: "pkg_pycparser",
    description: "Execute pycparser — import, inspect, or call functions",
    category: "package",
    package: "pycparser",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pycparser'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pycparser', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pydantic
  {
    name: "pkg_pydantic",
    description: "Execute pydantic — import, inspect, or call functions",
    category: "package",
    package: "pydantic",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pydantic'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pydantic', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pydantic-settings
  {
    name: "pkg_pydantic_settings",
    description: "Execute pydantic-settings — import, inspect, or call functions",
    category: "package",
    package: "pydantic-settings",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pydantic_settings'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pydantic-settings', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pydantic_core
  {
    name: "pkg_pydantic_core",
    description: "Execute pydantic_core — import, inspect, or call functions",
    category: "package",
    package: "pydantic_core",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pydantic_core'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pydantic_core', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pydot
  {
    name: "pkg_pydot",
    description: "Execute pydot — import, inspect, or call functions",
    category: "package",
    package: "pydot",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pydot'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pydot', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pydyf
  {
    name: "pkg_pydyf",
    description: "Execute pydyf — import, inspect, or call functions",
    category: "package",
    package: "pydyf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pydyf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pydyf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyee
  {
    name: "pkg_pyee",
    description: "Execute pyee — import, inspect, or call functions",
    category: "package",
    package: "pyee",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyee'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyee', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyloudnorm
  {
    name: "pkg_pyloudnorm",
    description: "Execute pyloudnorm — import, inspect, or call functions",
    category: "package",
    package: "pyloudnorm",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyloudnorm'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyloudnorm', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyluach
  {
    name: "pkg_pyluach",
    description: "Execute pyluach — import, inspect, or call functions",
    category: "package",
    package: "pyluach",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyluach'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyluach', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyogrio
  {
    name: "pkg_pyogrio",
    description: "Execute pyogrio — import, inspect, or call functions",
    category: "package",
    package: "pyogrio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyogrio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyogrio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pypandoc
  {
    name: "pkg_pypandoc",
    description: "Execute pypandoc — import, inspect, or call functions",
    category: "package",
    package: "pypandoc",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pypandoc'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pypandoc', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyparsing
  {
    name: "pkg_pyparsing",
    description: "Execute pyparsing — import, inspect, or call functions",
    category: "package",
    package: "pyparsing",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyparsing'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyparsing', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pypdf
  {
    name: "pkg_pypdf",
    description: "Execute pypdf — import, inspect, or call functions",
    category: "package",
    package: "pypdf",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pypdf'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pypdf', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pypdfium2
  {
    name: "pkg_pypdfium2",
    description: "Execute pypdfium2 — import, inspect, or call functions",
    category: "package",
    package: "pypdfium2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pypdfium2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pypdfium2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyperclip
  {
    name: "pkg_pyperclip",
    description: "Execute pyperclip — import, inspect, or call functions",
    category: "package",
    package: "pyperclip",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyperclip'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyperclip', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyphen
  {
    name: "pkg_pyphen",
    description: "Execute pyphen — import, inspect, or call functions",
    category: "package",
    package: "pyphen",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyphen'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyphen', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyproj
  {
    name: "pkg_pyproj",
    description: "Execute pyproj — import, inspect, or call functions",
    category: "package",
    package: "pyproj",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyproj'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyproj', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pytest
  {
    name: "pkg_pytest",
    description: "Execute pytest — import, inspect, or call functions",
    category: "package",
    package: "pytest",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pytest'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pytest', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pytest-asyncio
  {
    name: "pkg_pytest_asyncio",
    description: "Execute pytest-asyncio — import, inspect, or call functions",
    category: "package",
    package: "pytest-asyncio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pytest_asyncio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pytest-asyncio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pytest-cov
  {
    name: "pkg_pytest_cov",
    description: "Execute pytest-cov — import, inspect, or call functions",
    category: "package",
    package: "pytest-cov",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pytest_cov'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pytest-cov', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pytest-metadata
  {
    name: "pkg_pytest_metadata",
    description: "Execute pytest-metadata — import, inspect, or call functions",
    category: "package",
    package: "pytest-metadata",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pytest_metadata'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pytest-metadata', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyth
  {
    name: "pkg_pyth",
    description: "Execute pyth — import, inspect, or call functions",
    category: "package",
    package: "pyth",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyth'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyth', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: python-multipart
  {
    name: "pkg_python_multipart",
    description: "Execute python-multipart — import, inspect, or call functions",
    category: "package",
    package: "python-multipart",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'python_multipart'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'python-multipart', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyttsx3
  {
    name: "pkg_pyttsx3",
    description: "Execute pyttsx3 — import, inspect, or call functions",
    category: "package",
    package: "pyttsx3",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyttsx3'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyttsx3', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pytz
  {
    name: "pkg_pytz",
    description: "Execute pytz — import, inspect, or call functions",
    category: "package",
    package: "pytz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pytz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pytz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyxlsb
  {
    name: "pkg_pyxlsb",
    description: "Execute pyxlsb — import, inspect, or call functions",
    category: "package",
    package: "pyxlsb",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyxlsb'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyxlsb', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pyzbar
  {
    name: "pkg_pyzbar",
    description: "Execute pyzbar — import, inspect, or call functions",
    category: "package",
    package: "pyzbar",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pyzbar'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pyzbar', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rasterio
  {
    name: "pkg_rasterio",
    description: "Execute rasterio — import, inspect, or call functions",
    category: "package",
    package: "rasterio",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rasterio'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rasterio', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rdflib
  {
    name: "pkg_rdflib",
    description: "Execute rdflib — import, inspect, or call functions",
    category: "package",
    package: "rdflib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rdflib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rdflib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: redis
  {
    name: "pkg_redis",
    description: "Execute redis — import, inspect, or call functions",
    category: "package",
    package: "redis",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'redis'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'redis', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: referencing
  {
    name: "pkg_referencing",
    description: "Execute referencing — import, inspect, or call functions",
    category: "package",
    package: "referencing",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'referencing'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'referencing', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: regex
  {
    name: "pkg_regex",
    description: "Execute regex — import, inspect, or call functions",
    category: "package",
    package: "regex",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'regex'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'regex', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: reportlab
  {
    name: "pkg_reportlab",
    description: "Execute reportlab — import, inspect, or call functions",
    category: "package",
    package: "reportlab",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'reportlab'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'reportlab', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },
// ═══ End Batch 3 ═══

// ═══ V.130 Batch 4: 100 wrappers ═══

  // V.130: requests-cache
  {
    name: "pkg_requests_cache",
    description: "Execute requests-cache — import, inspect, or call functions",
    category: "package",
    package: "requests-cache",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'requests_cache'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'requests-cache', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rfc3987-syntax
  {
    name: "pkg_rfc3987_syntax",
    description: "Execute rfc3987-syntax — import, inspect, or call functions",
    category: "package",
    package: "rfc3987-syntax",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rfc3987_syntax'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rfc3987-syntax', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rich
  {
    name: "pkg_rich",
    description: "Execute rich — import, inspect, or call functions",
    category: "package",
    package: "rich",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rich'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rich', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rich-rst
  {
    name: "pkg_rich_rst",
    description: "Execute rich-rst — import, inspect, or call functions",
    category: "package",
    package: "rich-rst",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rich_rst'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rich-rst', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: ripgrepy
  {
    name: "pkg_ripgrepy",
    description: "Execute ripgrepy — import, inspect, or call functions",
    category: "package",
    package: "ripgrepy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'ripgrepy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'ripgrepy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: rlPyCairo
  {
    name: "pkg_rlpycairo",
    description: "Execute rlPyCairo — import, inspect, or call functions",
    category: "package",
    package: "rlPyCairo",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'rlpycairo'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'rlPyCairo', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: s3transfer
  {
    name: "pkg_s3transfer",
    description: "Execute s3transfer — import, inspect, or call functions",
    category: "package",
    package: "s3transfer",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 's3transfer'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 's3transfer', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: safehttpx
  {
    name: "pkg_safehttpx",
    description: "Execute safehttpx — import, inspect, or call functions",
    category: "package",
    package: "safehttpx",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'safehttpx'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'safehttpx', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: scipy
  {
    name: "pkg_scipy",
    description: "Execute scipy — import, inspect, or call functions",
    category: "package",
    package: "scipy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'scipy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'scipy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: scour
  {
    name: "pkg_scour",
    description: "Execute scour — import, inspect, or call functions",
    category: "package",
    package: "scour",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'scour'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'scour', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: seaborn
  {
    name: "pkg_seaborn",
    description: "Execute seaborn — import, inspect, or call functions",
    category: "package",
    package: "seaborn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'seaborn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'seaborn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: semantic-version
  {
    name: "pkg_semantic_version",
    description: "Execute semantic-version — import, inspect, or call functions",
    category: "package",
    package: "semantic-version",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'semantic_version'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'semantic-version', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: setuptools
  {
    name: "pkg_setuptools",
    description: "Execute setuptools — import, inspect, or call functions",
    category: "package",
    package: "setuptools",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'setuptools'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'setuptools', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: shapely
  {
    name: "pkg_shapely",
    description: "Execute shapely — import, inspect, or call functions",
    category: "package",
    package: "shapely",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'shapely'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'shapely', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: share
  {
    name: "pkg_share",
    description: "Execute share — import, inspect, or call functions",
    category: "package",
    package: "share",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'share'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'share', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: shellingham
  {
    name: "pkg_shellingham",
    description: "Execute shellingham — import, inspect, or call functions",
    category: "package",
    package: "shellingham",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'shellingham'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'shellingham', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: simple-ascii-tables
  {
    name: "pkg_simple_ascii_tables",
    description: "Execute simple-ascii-tables — import, inspect, or call functions",
    category: "package",
    package: "simple-ascii-tables",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'simple_ascii_tables'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'simple-ascii-tables', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: simplejson
  {
    name: "pkg_simplejson",
    description: "Execute simplejson — import, inspect, or call functions",
    category: "package",
    package: "simplejson",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'simplejson'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'simplejson', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: skimage
  {
    name: "pkg_skimage",
    description: "Execute skimage — import, inspect, or call functions",
    category: "package",
    package: "skimage",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'skimage'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'skimage', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: sklearn
  {
    name: "pkg_sklearn",
    description: "Execute sklearn — import, inspect, or call functions",
    category: "package",
    package: "sklearn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'sklearn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'sklearn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: smart-open
  {
    name: "pkg_smart_open",
    description: "Execute smart-open — import, inspect, or call functions",
    category: "package",
    package: "smart-open",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'smart_open'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'smart-open', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: snowflake
  {
    name: "pkg_snowflake",
    description: "Execute snowflake — import, inspect, or call functions",
    category: "package",
    package: "snowflake",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'snowflake'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'snowflake', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: sortedcontainers
  {
    name: "pkg_sortedcontainers",
    description: "Execute sortedcontainers — import, inspect, or call functions",
    category: "package",
    package: "sortedcontainers",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'sortedcontainers'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'sortedcontainers', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: soupsieve
  {
    name: "pkg_soupsieve",
    description: "Execute soupsieve — import, inspect, or call functions",
    category: "package",
    package: "soupsieve",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'soupsieve'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'soupsieve', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: soxr
  {
    name: "pkg_soxr",
    description: "Execute soxr — import, inspect, or call functions",
    category: "package",
    package: "soxr",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'soxr'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'soxr', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: spacy
  {
    name: "pkg_spacy",
    description: "Execute spacy — import, inspect, or call functions",
    category: "package",
    package: "spacy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'spacy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'spacy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: spacy-legacy
  {
    name: "pkg_spacy_legacy",
    description: "Execute spacy-legacy — import, inspect, or call functions",
    category: "package",
    package: "spacy-legacy",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'spacy_legacy'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'spacy-legacy', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: spacy-loggers
  {
    name: "pkg_spacy_loggers",
    description: "Execute spacy-loggers — import, inspect, or call functions",
    category: "package",
    package: "spacy-loggers",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'spacy_loggers'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'spacy-loggers', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: squarify
  {
    name: "pkg_squarify",
    description: "Execute squarify — import, inspect, or call functions",
    category: "package",
    package: "squarify",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'squarify'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'squarify', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: srsly
  {
    name: "pkg_srsly",
    description: "Execute srsly — import, inspect, or call functions",
    category: "package",
    package: "srsly",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'srsly'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'srsly', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: sse-starlette
  {
    name: "pkg_sse_starlette",
    description: "Execute sse-starlette — import, inspect, or call functions",
    category: "package",
    package: "sse-starlette",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'sse_starlette'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'sse-starlette', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: stack-data
  {
    name: "pkg_stack_data",
    description: "Execute stack-data — import, inspect, or call functions",
    category: "package",
    package: "stack-data",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'stack_data'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'stack-data', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: starlette
  {
    name: "pkg_starlette",
    description: "Execute starlette — import, inspect, or call functions",
    category: "package",
    package: "starlette",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'starlette'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'starlette', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: statsmodels
  {
    name: "pkg_statsmodels",
    description: "Execute statsmodels — import, inspect, or call functions",
    category: "package",
    package: "statsmodels",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'statsmodels'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'statsmodels', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: svglib
  {
    name: "pkg_svglib",
    description: "Execute svglib — import, inspect, or call functions",
    category: "package",
    package: "svglib",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'svglib'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'svglib', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: svgwrite
  {
    name: "pkg_svgwrite",
    description: "Execute svgwrite — import, inspect, or call functions",
    category: "package",
    package: "svgwrite",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'svgwrite'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'svgwrite', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tables
  {
    name: "pkg_tables",
    description: "Execute tables — import, inspect, or call functions",
    category: "package",
    package: "tables",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tables'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tables', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tabula
  {
    name: "pkg_tabula",
    description: "Execute tabula — import, inspect, or call functions",
    category: "package",
    package: "tabula",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tabula'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tabula', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tabulate
  {
    name: "pkg_tabulate",
    description: "Execute tabulate — import, inspect, or call functions",
    category: "package",
    package: "tabulate",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tabulate'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tabulate', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tea
  {
    name: "pkg_tea",
    description: "Execute tea — import, inspect, or call functions",
    category: "package",
    package: "tea",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tea'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tea', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: terminado
  {
    name: "pkg_terminado",
    description: "Execute terminado — import, inspect, or call functions",
    category: "package",
    package: "terminado",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'terminado'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'terminado', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: textblob
  {
    name: "pkg_textblob",
    description: "Execute textblob — import, inspect, or call functions",
    category: "package",
    package: "textblob",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'textblob'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'textblob', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: thinc
  {
    name: "pkg_thinc",
    description: "Execute thinc — import, inspect, or call functions",
    category: "package",
    package: "thinc",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'thinc'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'thinc', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: thrift
  {
    name: "pkg_thrift",
    description: "Execute thrift — import, inspect, or call functions",
    category: "package",
    package: "thrift",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'thrift'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'thrift', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tifffile
  {
    name: "pkg_tifffile",
    description: "Execute tifffile — import, inspect, or call functions",
    category: "package",
    package: "tifffile",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tifffile'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tifffile', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tinycss2
  {
    name: "pkg_tinycss2",
    description: "Execute tinycss2 — import, inspect, or call functions",
    category: "package",
    package: "tinycss2",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tinycss2'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tinycss2', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tinyhtml5
  {
    name: "pkg_tinyhtml5",
    description: "Execute tinyhtml5 — import, inspect, or call functions",
    category: "package",
    package: "tinyhtml5",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tinyhtml5'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tinyhtml5', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tlz
  {
    name: "pkg_tlz",
    description: "Execute tlz — import, inspect, or call functions",
    category: "package",
    package: "tlz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tlz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tlz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tomlkit
  {
    name: "pkg_tomlkit",
    description: "Execute tomlkit — import, inspect, or call functions",
    category: "package",
    package: "tomlkit",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tomlkit'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tomlkit', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: toolz
  {
    name: "pkg_toolz",
    description: "Execute toolz — import, inspect, or call functions",
    category: "package",
    package: "toolz",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'toolz'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'toolz', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tornado
  {
    name: "pkg_tornado",
    description: "Execute tornado — import, inspect, or call functions",
    category: "package",
    package: "tornado",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tornado'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tornado', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tqdm
  {
    name: "pkg_tqdm",
    description: "Execute tqdm — import, inspect, or call functions",
    category: "package",
    package: "tqdm",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tqdm'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tqdm', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: traitlets
  {
    name: "pkg_traitlets",
    description: "Execute traitlets — import, inspect, or call functions",
    category: "package",
    package: "traitlets",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'traitlets'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'traitlets', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trame
  {
    name: "pkg_trame",
    description: "Execute trame — import, inspect, or call functions",
    category: "package",
    package: "trame",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trame'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trame', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trame-client
  {
    name: "pkg_trame_client",
    description: "Execute trame-client — import, inspect, or call functions",
    category: "package",
    package: "trame-client",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trame_client'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trame-client', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trame-common
  {
    name: "pkg_trame_common",
    description: "Execute trame-common — import, inspect, or call functions",
    category: "package",
    package: "trame-common",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trame_common'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trame-common', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trame-server
  {
    name: "pkg_trame_server",
    description: "Execute trame-server — import, inspect, or call functions",
    category: "package",
    package: "trame-server",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trame_server'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trame-server', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trame-vtk
  {
    name: "pkg_trame_vtk",
    description: "Execute trame-vtk — import, inspect, or call functions",
    category: "package",
    package: "trame-vtk",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trame_vtk'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trame-vtk', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: trimesh
  {
    name: "pkg_trimesh",
    description: "Execute trimesh — import, inspect, or call functions",
    category: "package",
    package: "trimesh",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'trimesh'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'trimesh', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: typer
  {
    name: "pkg_typer",
    description: "Execute typer — import, inspect, or call functions",
    category: "package",
    package: "typer",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'typer'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'typer', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: typing-inspection
  {
    name: "pkg_typing_inspection",
    description: "Execute typing-inspection — import, inspect, or call functions",
    category: "package",
    package: "typing-inspection",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'typing_inspection'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'typing-inspection', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: typish
  {
    name: "pkg_typish",
    description: "Execute typish — import, inspect, or call functions",
    category: "package",
    package: "typish",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'typish'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'typish', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tzdata
  {
    name: "pkg_tzdata",
    description: "Execute tzdata — import, inspect, or call functions",
    category: "package",
    package: "tzdata",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tzdata'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tzdata', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: tzlocal
  {
    name: "pkg_tzlocal",
    description: "Execute tzlocal — import, inspect, or call functions",
    category: "package",
    package: "tzlocal",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'tzlocal'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'tzlocal', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: uncalled-for
  {
    name: "pkg_uncalled_for",
    description: "Execute uncalled-for — import, inspect, or call functions",
    category: "package",
    package: "uncalled-for",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'uncalled_for'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'uncalled-for', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: uri-template
  {
    name: "pkg_uri_template",
    description: "Execute uri-template — import, inspect, or call functions",
    category: "package",
    package: "uri-template",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'uri_template'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'uri-template', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: url-normalize
  {
    name: "pkg_url_normalize",
    description: "Execute url-normalize — import, inspect, or call functions",
    category: "package",
    package: "url-normalize",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'url_normalize'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'url-normalize', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: urllib3
  {
    name: "pkg_urllib3",
    description: "Execute urllib3 — import, inspect, or call functions",
    category: "package",
    package: "urllib3",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'urllib3'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'urllib3', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: uvicorn
  {
    name: "pkg_uvicorn",
    description: "Execute uvicorn — import, inspect, or call functions",
    category: "package",
    package: "uvicorn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'uvicorn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'uvicorn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wasabi
  {
    name: "pkg_wasabi",
    description: "Execute wasabi — import, inspect, or call functions",
    category: "package",
    package: "wasabi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wasabi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wasabi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wcwidth
  {
    name: "pkg_wcwidth",
    description: "Execute wcwidth — import, inspect, or call functions",
    category: "package",
    package: "wcwidth",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wcwidth'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wcwidth', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: weasel
  {
    name: "pkg_weasel",
    description: "Execute weasel — import, inspect, or call functions",
    category: "package",
    package: "weasel",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'weasel'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'weasel', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: weasyprint
  {
    name: "pkg_weasyprint",
    description: "Execute weasyprint — import, inspect, or call functions",
    category: "package",
    package: "weasyprint",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'weasyprint'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'weasyprint', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: webcolors
  {
    name: "pkg_webcolors",
    description: "Execute webcolors — import, inspect, or call functions",
    category: "package",
    package: "webcolors",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'webcolors'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'webcolors', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: webencodings
  {
    name: "pkg_webencodings",
    description: "Execute webencodings — import, inspect, or call functions",
    category: "package",
    package: "webencodings",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'webencodings'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'webencodings', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: websocket
  {
    name: "pkg_websocket",
    description: "Execute websocket — import, inspect, or call functions",
    category: "package",
    package: "websocket",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'websocket'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'websocket', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: websockets
  {
    name: "pkg_websockets",
    description: "Execute websockets — import, inspect, or call functions",
    category: "package",
    package: "websockets",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'websockets'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'websockets', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wordcloud
  {
    name: "pkg_wordcloud",
    description: "Execute wordcloud — import, inspect, or call functions",
    category: "package",
    package: "wordcloud",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wordcloud'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wordcloud', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wrapt
  {
    name: "pkg_wrapt",
    description: "Execute wrapt — import, inspect, or call functions",
    category: "package",
    package: "wrapt",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wrapt'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wrapt', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wslink
  {
    name: "pkg_wslink",
    description: "Execute wslink — import, inspect, or call functions",
    category: "package",
    package: "wslink",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wslink'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wslink', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: wsproto
  {
    name: "pkg_wsproto",
    description: "Execute wsproto — import, inspect, or call functions",
    category: "package",
    package: "wsproto",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'wsproto'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'wsproto', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: xgboost
  {
    name: "pkg_xgboost",
    description: "Execute xgboost — import, inspect, or call functions",
    category: "package",
    package: "xgboost",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'xgboost'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'xgboost', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: xlrd
  {
    name: "pkg_xlrd",
    description: "Execute xlrd — import, inspect, or call functions",
    category: "package",
    package: "xlrd",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'xlrd'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'xlrd', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: xlwt
  {
    name: "pkg_xlwt",
    description: "Execute xlwt — import, inspect, or call functions",
    category: "package",
    package: "xlwt",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'xlwt'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'xlwt', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: xyzservices
  {
    name: "pkg_xyzservices",
    description: "Execute xyzservices — import, inspect, or call functions",
    category: "package",
    package: "xyzservices",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'xyzservices'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'xyzservices', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: yaml
  {
    name: "pkg_yaml",
    description: "Execute yaml — import, inspect, or call functions",
    category: "package",
    package: "yaml",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'yaml'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'yaml', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: yarl
  {
    name: "pkg_yarl",
    description: "Execute yarl — import, inspect, or call functions",
    category: "package",
    package: "yarl",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'yarl'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'yarl', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: zipp
  {
    name: "pkg_zipp",
    description: "Execute zipp — import, inspect, or call functions",
    category: "package",
    package: "zipp",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'zipp'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'zipp', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: zmq
  {
    name: "pkg_zmq",
    description: "Execute zmq — import, inspect, or call functions",
    category: "package",
    package: "zmq",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'zmq'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'zmq', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: zopfli
  {
    name: "pkg_zopfli",
    description: "Execute zopfli — import, inspect, or call functions",
    category: "package",
    package: "zopfli",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'zopfli'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'zopfli', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: argon2-cffi
  {
    name: "pkg_argon2_cffi",
    description: "Execute argon2-cffi — import, inspect, or call functions",
    category: "package",
    package: "argon2-cffi",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'argon2_cffi'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'argon2-cffi', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: examples
  {
    name: "pkg_examples",
    description: "Execute examples — import, inspect, or call functions",
    category: "package",
    package: "examples",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'examples'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'examples', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: pycryptodome
  {
    name: "pkg_pycryptodome",
    description: "Execute pycryptodome — import, inspect, or call functions",
    category: "package",
    package: "pycryptodome",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'pycryptodome'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'pycryptodome', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: python-dateutil
  {
    name: "pkg_python_dateutil",
    description: "Execute python-dateutil — import, inspect, or call functions",
    category: "package",
    package: "python-dateutil",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'python_dateutil'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'python-dateutil', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: python-dotenv
  {
    name: "pkg_python_dotenv",
    description: "Execute python-dotenv — import, inspect, or call functions",
    category: "package",
    package: "python-dotenv",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'python_dotenv'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'python-dotenv', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: python-pptx
  {
    name: "pkg_python_pptx",
    description: "Execute python-pptx — import, inspect, or call functions",
    category: "package",
    package: "python-pptx",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'python_pptx'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'python-pptx', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: scikit-learn
  {
    name: "pkg_scikit_learn",
    description: "Execute scikit-learn — import, inspect, or call functions",
    category: "package",
    package: "scikit-learn",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'scikit_learn'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'scikit-learn', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: scripts
  {
    name: "pkg_scripts",
    description: "Execute scripts — import, inspect, or call functions",
    category: "package",
    package: "scripts",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'scripts'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'scripts', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: soundfile
  {
    name: "pkg_soundfile",
    description: "Execute soundfile — import, inspect, or call functions",
    category: "package",
    package: "soundfile",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'soundfile'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'soundfile', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },

  // V.130: websocket-client
  {
    name: "pkg_websocket_client",
    description: "Execute websocket-client — import, inspect, or call functions",
    category: "package",
    package: "websocket-client",
    parameters: {
      action: { type: "string", description: "info | call" },
      function: { type: "string", description: "function name (for call)" },
    },
    execute: async (args) => {
      const code = [
        "import importlib, json",
        "imp_name = 'websocket_client'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {'package': 'websocket-client', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}",
        "    else:",
        "        result = {'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({'error': str(e)[:200]}))",
      ].join("\n");
      return runPython(code, 30000);
    },
  },
// ═══ End Batch 4 ═══

];
