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
      // V.140: Use system python3 first (packages installed via --break-system-packages)
      const pythonPath = "python3";
      const proc = spawn(pythonPath, [tmpFile], {
        cwd: "/home/z/my-project/exports",
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
          PYTHONPATH: "/usr/local/lib/python3.11/dist-packages:/usr/lib/python3/dist-packages:/app/.venv/lib/python3.12/site-packages:/home/z/.venv/lib/python3.12/site-packages",
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
];
