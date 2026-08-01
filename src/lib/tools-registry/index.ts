/**
 * Tools Registry — Auto-loader for all tool implementations.
 *
 * V.145: بدل ما كل tool يكون inline في callable-tools.ts أو custom-tools.ts،
 * كل tool في ملف مستقل تحت /tools/{python,nodejs}/.
 * الـ registry ده بيجمعهم كلهم في مكان واحد ويفضحهم للـ API.
 *
 * Categories:
 *   - ai:        AI/ML/NLP tools (sentiment, classifier, summarizer, ...)
 *   - data:      Data analysis (csv, stats, visualizer, ...)
 *   - media:     Media processing (image, audio, OCR, PDF, ...)
 *   - web:       Web/HTTP (scraper, api_tester, youtube, ...)
 *   - utility:   General utilities (text, json, regex, date, color, ...)
 *   - security:  Crypto/hash utilities
 *
 * Tool Format:
 *   {
 *     name: string,
 *     description: string,
 *     category: "ai" | "data" | "media" | "web" | "utility" | "security",
 *     runtime: "python" | "nodejs",
 *     package?: string,        // pip package or npm module (if any)
 *     parameters: { [key]: { type, description, default?, required? } },
 *     execute: (args) => Promise<any>
 *   }
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

// ─── GitHub-harvested tools (auto-generated) ─────────────────
import { GH_TOOLS, getGhStats } from "./gh_tools_registry";

// ─── Node.js tools (static imports) ──────────────────────────
import dateUtilities from "./nodejs/date_utilities";
import textUtilities from "./nodejs/text_utilities";
import jsonUtilities from "./nodejs/json_utilities";
import regexTester from "./nodejs/regex_tester";
import unitConverter from "./nodejs/unit_converter";
import colorUtilities from "./nodejs/color_utilities";
import networkUtilities from "./nodejs/network_utilities";
import validationUtilities from "./nodejs/validation_utilities";
import cronUtilities from "./nodejs/cron_utilities";
import hashUtilities from "./nodejs/hash_utilities"

// ─── Python tool wrappers ────────────────────────────────────
// كل Python tool ليه wrapper function بيستدعي الـ script بـ python3

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runPythonTool(scriptName: string, args: any, timeoutMs: number = 60000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  // Write args to a temp file
  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_args_${Date.now()}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      // Cleanup
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        // Try to parse the last line as JSON
        const lines = stdout.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-500),
          stdout: stdout.slice(-500),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

// ─── Tool Definitions ────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  category: "ai" | "data" | "media" | "web" | "utility" | "security" | "github";
  runtime: "python" | "nodejs";
  package?: string;
  source_repo?: string;
  license?: string;
  parameters: Record<string, { type: string; description: string; default?: any; required?: boolean }>;
  execute: (args: any) => Promise<any>;
}

export const TOOLS: ToolDefinition[] = [
  // ─── Node.js Tools (10) ──────────────────────────────────
  {
    name: "date_utilities",
    description: "أدوات تواريخ شاملة — format, parse, diff, add, timezone convert, weekday, startOf, endOf",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "operation: format|parse|diff|add|timezone|now|isValid|weekday|startOf|endOf", required: true },
      date: { type: "string", description: "input date (ISO, YYYY-MM-DD, or timestamp)" },
      format: { type: "string", description: "format style: human|relative|YYYY-MM-DD|ISO|unix", default: "human" },
      timezone: { type: "string", description: "IANA timezone (e.g. Africa/Cairo)" },
      amount: { type: "number", description: "amount to add" },
      unit: { type: "string", description: "seconds|minutes|hours|days|weeks|months|years", default: "days" },
      date2: { type: "string", description: "second date for diff operation" },
    },
    execute: async (args) => dateUtilities.execute(args),
  },
  {
    name: "text_utilities",
    description: "أدوات نصوص شاملة — case conversion, count, extract emails/urls/phones, slugify, reverse, truncate, strip_html",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "uppercase|lowercase|title|camel|snake|kebab|word_count|char_count|line_count|extract_emails|extract_urls|extract_phones|slugify|reverse|truncate|strip_html|encode_url|decode_url|stats|find_replace", required: true },
      text: { type: "string", description: "input text", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => textUtilities.execute(args),
  },
  {
    name: "json_utilities",
    description: "أدوات JSON شاملة — format, minify, validate, query (dot path), flatten, unflatten, merge, diff, keys, size, convert_csv",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "format|minify|validate|query|flatten|unflatten|merge|diff|keys|size|convert_csv", required: true },
      json: { type: "string|object", description: "JSON string or object" },
      json2: { type: "string|object", description: "second JSON for merge/diff" },
      params: { type: "object", description: "{ indent, path }" },
    },
    execute: async (args) => jsonUtilities.execute(args),
  },
  {
    name: "regex_tester",
    description: "اختبار regular expressions — match, extract, replace, split, validate, explain",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "match|extract|replace|split|validate|explain", required: true },
      pattern: { type: "string", description: "regex pattern", required: true },
      text: { type: "string", description: "input text", required: true },
      flags: { type: "string", description: "regex flags (g, i, m)", default: "g" },
      replacement: { type: "string", description: "replacement string for replace op" },
    },
    execute: async (args) => regexTester.execute(args),
  },
  {
    name: "unit_converter",
    description: "محول وحدات شامل — length, weight, volume, area, speed, data, time, pressure, angle, temperature",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "convert|list_units", required: true },
      category: { type: "string", description: "length|weight|volume|area|speed|data|time|pressure|angle|temperature" },
      value: { type: "number", description: "value to convert" },
      from: { type: "string", description: "source unit" },
      to: { type: "string", description: "target unit" },
    },
    execute: async (args) => unitConverter.execute(args),
  },
  {
    name: "color_utilities",
    description: "أدوات ألوان شاملة — convert HEX/RGB/HSL/HSV, info, palette, gradient, mix, complement, brightness, random",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "convert|info|palette|gradient|mix|complement|brightness|random", required: true },
      color: { type: "string", description: "color in HEX, rgb(), or hsl()" },
      format: { type: "string", description: "hex|rgb|hsl|hsv", default: "hex" },
      count: { type: "number", description: "number of colors in palette/gradient", default: 5 },
      color2: { type: "string", description: "second color for gradient/mix" },
      weight: { type: "number", description: "mix weight (0-1)", default: 0.5 },
    },
    execute: async (args) => colorUtilities.execute(args),
  },
  {
    name: "network_utilities",
    description: "أدوات شبكة — DNS lookup, reverse DNS, port check, URL parse, IP info, get headers, validate URL, get my IP",
    category: "web",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "dns_lookup|dns_reverse|port_check|url_parse|ip_info|get_headers|validate_url|get_my_ip", required: true },
      hostname: { type: "string", description: "hostname for DNS" },
      ip: { type: "string", description: "IP address" },
      url: { type: "string", description: "URL" },
      port: { type: "number", description: "port number" },
      timeout: { type: "number", description: "timeout in ms", default: 5000 },
    },
    execute: async (args) => networkUtilities.execute(args),
  },
  {
    name: "validation_utilities",
    description: "أدوات تحقق شاملة — email, phone, URL, IP, credit card, ISBN, UUID, JWT, password strength, username",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "email|phone|url|ip|credit_card|isbn|uuid|jwt|password_strength|username", required: true },
      value: { type: "string", description: "value to validate", required: true },
      params: { type: "object", description: "{ strict: boolean }" },
    },
    execute: async (args) => validationUtilities.execute(args),
  },
  {
    name: "cron_utilities",
    description: "أدوات cron — parse, validate, describe (human-readable), next_run, schedule (list next N runs)",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "parse|validate|describe|next_run|schedule", required: true },
      cron: { type: "string", description: "cron expression (e.g. '0 9 * * 1-5')", required: true },
      count: { type: "number", description: "number of runs for schedule", default: 5 },
      from: { type: "string", description: "ISO date for next_run/schedule start" },
    },
    execute: async (args) => cronUtilities.execute(args),
  },
  {
    name: "hash_utilities",
    description: "أدوات hash شاملة — MD5, SHA-1, SHA-256, SHA-512, HMAC, UUID v1/v4, random bytes, PBKDF2, scrypt",
    category: "security",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "hash|hmac|uuid|random_bytes|pbkdf2|scrypt|cipher_info", required: true },
      data: { type: "string", description: "input data" },
      algorithm: { type: "string", description: "sha256|sha512|md5|sha1", default: "sha256" },
      secret: { type: "string", description: "secret for HMAC" },
      encoding: { type: "string", description: "hex|base64|latin1", default: "hex" },
      length: { type: "number", description: "byte length for random_bytes", default: 32 },
      iterations: { type: "number", description: "iterations for PBKDF2", default: 100000 },
      salt: { type: "string", description: "salt for PBKDF2/scrypt" },
    },
    execute: async (args) => hashUtilities.execute(args),
  },

  // ─── Python Tools (12) ───────────────────────────────────
  {
    name: "sentiment_analysis",
    description: "تحليل المشاعر في نص — يحدد إيجابي/سلبي/محايد مع نسبة الثقة (يدعم العربية والإنجليزية)",
    category: "ai",
    runtime: "python",
    package: "vaderSentiment, textblob",
    parameters: {
      text: { type: "string", description: "النص المطلوب تحليله", required: true },
      language: { type: "string", description: "auto|en|ar", default: "auto" },
    },
    execute: async (args) => {
      // Modify script to accept --args_file (we'll patch the script)
      return runPythonToolWithArgs("sentiment_analysis.py", args);
    },
  },
  {
    name: "text_classifier",
    description: "تصنيف نص إلى فئة (tech, sports, politics, business, health, education) باستخدام TF-IDF + Naive Bayes",
    category: "ai",
    runtime: "python",
    package: "scikit-learn, numpy",
    parameters: {
      text: { type: "string", description: "النص المطلوب تصنيفه", required: true },
      categories: { type: "array", description: "list of categories (optional)" },
    },
    execute: async (args) => runPythonToolWithArgs("text_classifier.py", args),
  },
  {
    name: "text_summarizer",
    description: "تلخيص نص طويل باستخدام extractive summarization (TF-IDF + TextRank)",
    category: "ai",
    runtime: "python",
    package: "nltk, scikit-learn",
    parameters: {
      text: { type: "string", description: "النص الطويل", required: true },
      sentences_count: { type: "number", description: "عدد الجمل في الملخص", default: 3 },
      language: { type: "string", description: "en|ar", default: "en" },
    },
    execute: async (args) => runPythonToolWithArgs("text_summarizer.py", args),
  },
  {
    name: "keyword_extractor",
    description: "استخراج الكلمات المفتاحية من نص باستخدام TF-IDF (يدعم n-grams)",
    category: "ai",
    runtime: "python",
    package: "scikit-learn",
    parameters: {
      text: { type: "string", description: "النص", required: true },
      top_n: { type: "number", description: "عدد الكلمات المفتاحية", default: 10 },
      language: { type: "string", description: "en|ar", default: "en" },
    },
    execute: async (args) => runPythonToolWithArgs("keyword_extractor.py", args),
  },
  {
    name: "language_detector",
    description: "كشف لغة نص معين ويرجع اللغة + نسبة الثقة (يدعم 100+ لغة)",
    category: "ai",
    runtime: "python",
    package: "langdetect",
    parameters: {
      text: { type: "string", description: "النص", required: true },
    },
    execute: async (args) => runPythonToolWithArgs("language_detector.py", args),
  },
  {
    name: "csv_analyzer",
    description: "تحليل ملف CSV — إحصائيات، أنواع بيانات، قيم مفقودة، ارتباط",
    category: "data",
    runtime: "python",
    package: "pandas, numpy",
    parameters: {
      csv_path: { type: "string", description: "مسار ملف CSV" },
      csv_text: { type: "string", description: "محتوى CSV مباشرة" },
      analysis_type: { type: "string", description: "summary|stats|head|correlation", default: "summary" },
    },
    execute: async (args) => runPythonToolWithArgs("csv_analyzer.py", args),
  },
  {
    name: "statistics_calculator",
    description: "حساب إحصائيات شاملة — descriptive, correlation, ttest, regression",
    category: "data",
    runtime: "python",
    package: "numpy, scipy",
    parameters: {
      numbers: { type: "array", description: "قائمة الأرقام", required: true },
      operation: { type: "string", description: "descriptive|correlation|ttest|regression", default: "descriptive" },
      numbers2: { type: "array", description: "قائمة ثانية للـ correlation/ttest/regression" },
    },
    execute: async (args) => runPythonToolWithArgs("statistics_calculator.py", args),
  },
  {
    name: "data_visualizer",
    description: "إنشاء رسوم بيانية — line, bar, scatter, histogram, pie وحفظها كـ PNG",
    category: "data",
    runtime: "python",
    package: "matplotlib, pandas",
    parameters: {
      chart_type: { type: "string", description: "line|bar|scatter|histogram|pie", required: true },
      title: { type: "string", description: "عنوان الرسم" },
      x: { type: "array", description: "بيانات X" },
      y: { type: "array", description: "بيانات Y" },
      x_label: { type: "string", description: "تسمية X" },
      y_label: { type: "string", description: "تسمية Y" },
      output_path: { type: "string", description: "مسار الإخراج", default: "/tmp/chart.png" },
    },
    execute: async (args) => runPythonToolWithArgs("data_visualizer.py", args),
  },
  {
    name: "web_scraper",
    description: "استخراج المحتوى من صفحة ويب — نص نظيف، روابط، صور، meta tags",
    category: "web",
    runtime: "python",
    package: "requests, beautifulsoup4, trafilatura",
    parameters: {
      url: { type: "string", description: "URL الصفحة", required: true },
      extract: { type: "string", description: "text|links|images|meta|all", default: "all" },
      timeout: { type: "number", description: "timeout in seconds", default: 30 },
    },
    execute: async (args) => runPythonToolWithArgs("web_scraper.py", args),
  },
  {
    name: "http_api_tester",
    description: "اختبار API endpoint — GET, POST, PUT, DELETE مع headers و body",
    category: "web",
    runtime: "python",
    package: "requests",
    parameters: {
      url: { type: "string", description: "API URL", required: true },
      method: { type: "string", description: "GET|POST|PUT|PATCH|DELETE", default: "GET" },
      headers: { type: "object", description: "request headers" },
      params: { type: "object", description: "query params" },
      body: { type: "object", description: "request body" },
      body_type: { type: "string", description: "json|form|raw", default: "json" },
      timeout: { type: "number", description: "timeout in seconds", default: 30 },
    },
    execute: async (args) => runPythonToolWithArgs("http_api_tester.py", args),
  },
  {
    name: "youtube_downloader",
    description: "تحميل فيديوهات/صوت من YouTube و منصات تانية باستخدام yt-dlp",
    category: "media",
    runtime: "python",
    package: "yt-dlp",
    parameters: {
      url: { type: "string", description: "YouTube URL", required: true },
      format: { type: "string", description: "best|bestaudio|bestvideo|720p|1080p|480p", default: "best" },
      output_path: { type: "string", description: "output directory", default: "/tmp/youtube_downloads" },
      extract_info_only: { type: "boolean", description: "just get metadata", default: false },
    },
    execute: async (args) => runPythonToolWithArgs("youtube_downloader.py", args),
  },
  {
    name: "image_processor",
    description: "معالجة الصور — resize, crop, rotate, grayscale, blur, sharpen, watermark, convert",
    category: "media",
    runtime: "python",
    package: "pillow",
    parameters: {
      input_path: { type: "string", description: "مسار الصورة الأصلية", required: true },
      output_path: { type: "string", description: "مسار الصورة الناتجة", required: true },
      operation: { type: "string", description: "resize|crop|rotate|grayscale|blur|sharpen|thumbnail|watermark|convert", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => runPythonToolWithArgs("image_processor.py", args),
  },
  {
    name: "ocr_extractor",
    description: "استخراج النص من صور باستخدام Tesseract OCR (يدعم الإنجليزية والعربية)",
    category: "media",
    runtime: "python",
    package: "pytesseract, pillow",
    parameters: {
      image_path: { type: "string", description: "مسار الصورة", required: true },
      language: { type: "string", description: "eng|ara|eng+ara", default: "eng" },
      output_format: { type: "string", description: "text|data|hocr", default: "text" },
    },
    execute: async (args) => runPythonToolWithArgs("ocr_extractor.py", args),
  },
  {
    name: "pdf_processor",
    description: "معالجة ملفات PDF — استخراج نص، صور، جدول، دمج، تقسيم",
    category: "media",
    runtime: "python",
    package: "pypdf, pdfplumber, pymupdf",
    parameters: {
      pdf_path: { type: "string", description: "مسار ملف PDF", required: true },
      operation: { type: "string", description: "extract_text|extract_images|extract_tables|merge|split|page_count|metadata", default: "extract_text" },
      output_path: { type: "string", description: "output path" },
      pages: { type: "string", description: "page range: 1-5 or all", default: "all" },
      merge_files: { type: "array", description: "list of PDF paths to merge" },
    },
    execute: async (args) => runPythonToolWithArgs("pdf_processor.py", args),
  },
  {
    name: "audio_processor",
    description: "معالجة الصوت — convert, cut, merge, normalize, info, extract_features",
    category: "media",
    runtime: "python",
    package: "pydub, librosa",
    parameters: {
      input_path: { type: "string", description: "مسار ملف الصوت" },
      output_path: { type: "string", description: "مسار الإخراج" },
      operation: { type: "string", description: "convert|cut|merge|normalize|info|extract_features", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => runPythonToolWithArgs("audio_processor.py", args),
  },
  {
    name: "text_to_speech",
    description: "تحويل نص إلى صوت MP3 — يدعم العربية والإنجليزية و 50+ لغة (edge-tts neural voices)",
    category: "media",
    runtime: "python",
    package: "edge-tts, gtts",
    parameters: {
      text: { type: "string", description: "النص المطلوب تحويله لصوت", required: true },
      voice: { type: "string", description: "ar-EG-SalmaNeural|en-US-JennyNeural|auto", default: "auto" },
      output_path: { type: "string", description: "مسار الإخراج", default: "/tmp/tts_output.mp3" },
      rate: { type: "string", description: "speed: +0%", default: "+0%" },
      volume: { type: "string", description: "volume: +0%", default: "+0%" },
    },
    execute: async (args) => runPythonToolWithArgs("text_to_speech.py", args),
  },
  {
    name: "qr_code_generator",
    description: "توليد QR codes — URL, text, WiFi, vCard مع تخصيص الألوان وحجم",
    category: "utility",
    runtime: "python",
    package: "qrcode, pillow",
    parameters: {
      data: { type: "string", description: "البيانات المطلوب ترميزها", required: true },
      output_path: { type: "string", description: "مسار الإخراج", default: "/tmp/qr.png" },
      size: { type: "number", description: "box size", default: 10 },
      border: { type: "number", description: "border width", default: 4 },
      fill_color: { type: "string", description: "color", default: "black" },
      back_color: { type: "string", description: "background", default: "white" },
      error_correction: { type: "string", description: "L|M|Q|H", default: "M" },
    },
    execute: async (args) => runPythonToolWithArgs("qr_code_generator.py", args),
  },
  {
    name: "translator",
    description: "ترجمة نص بين لغات مختلفة باستخدام Google/Microsoft/DeepL/MyMemory",
    category: "ai",
    runtime: "python",
    package: "deep-translator",
    parameters: {
      text: { type: "string", description: "النص المطلوب ترجمته", required: true },
      source_lang: { type: "string", description: "auto|en|ar|...", default: "auto" },
      target_lang: { type: "string", description: "ar|en|fr|...", required: true },
      engine: { type: "string", description: "google|microsoft|deepl|mymemory", default: "google" },
    },
    execute: async (args) => runPythonToolWithArgs("translator.py", args),
  },
  {
    name: "document_generator",
    description: "إنشاء مستندات Word, Excel, PowerPoint, PDF من بيانات",
    category: "utility",
    runtime: "python",
    package: "python-docx, python-pptx, openpyxl, reportlab",
    parameters: {
      format: { type: "string", description: "docx|xlsx|pptx|pdf", required: true },
      output_path: { type: "string", description: "مسار الإخراج", required: true },
      title: { type: "string", description: "عنوان المستند" },
      content: { type: "object", description: "format-specific content" },
    },
    execute: async (args) => runPythonToolWithArgs("document_generator.py", args),
  },
  {
    name: "fake_data_generator",
    description: "توليد بيانات وهمية واقعية — أسماء، إيميلات، عناوين، أرقام هواتف",
    category: "utility",
    runtime: "python",
    package: "faker",
    parameters: {
      data_type: { type: "string", description: "name|email|address|phone|company|text|date|url|credit_card|uuid|all", default: "name" },
      count: { type: "number", description: "عدد العناصر", default: 10 },
      locale: { type: "string", description: "en_US|ar_EG|fr_FR|...", default: "en_US" },
    },
    execute: async (args) => runPythonToolWithArgs("fake_data_generator.py", args),
  },
  {
    name: "file_utilities",
    description: "أدوات ملفات شاملة — list_dir, read_file, write_file, delete, copy, move, search_files, zip, unzip, tree",
    category: "utility",
    runtime: "python",
    parameters: {
      operation: { type: "string", description: "list_dir|read_file|write_file|delete|copy|move|file_info|search_files|zip_dir|unzip|tree", required: true },
      path: { type: "string", description: "file/directory path" },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => runPythonToolWithArgs("file_utilities.py", args),
  },
  {
    name: "crypto_utilities",
    description: "أدوات تشفير شاملة — hash, AES, HMAC, random tokens, bcrypt",
    category: "security",
    runtime: "python",
    package: "cryptography, bcrypt",
    parameters: {
      operation: { type: "string", description: "hash|aes_encrypt|aes_decrypt|hmac|random_token|bcrypt_hash|bcrypt_verify|base64_encode|base64_decode", required: true },
      data: { type: "string", description: "input data" },
      params: { type: "object", description: "{ algorithm, key, length, rounds, hash }" },
    },
    execute: async (args) => runPythonToolWithArgs("crypto_utilities.py", args),
  },
  {
    name: "math_solver",
    description: "حل مسائل رياضية رمزية — solve, simplify, derivative, integrate, expand, factor, evaluate",
    category: "ai",
    runtime: "python",
    package: "sympy",
    parameters: {
      operation: { type: "string", description: "solve|simplify|derivative|integrate|expand|factor|evaluate", required: true },
      expression: { type: "string", description: "math expression (e.g. 'x^2 + 2*x')", required: true },
      variable: { type: "string", description: "variable name", default: "x" },
      params: { type: "object", description: "{ order, values, definite, lower, upper }" },
    },
    execute: async (args) => runPythonToolWithArgs("math_solver.py", args),
  },
];

// ─── Python tool runner (with --args_file support) ───────────
async function runPythonToolWithArgs(scriptName: string, args: any, timeoutMs: number = 60000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  // Write args to temp JSON file
  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_args_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  // Modify script invocation: instead of CLI args, we pass --args_file
  // Python scripts read args from JSON file if --args_file is present, else use argparse
  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      // Cleanup
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        // Try to parse the last non-empty line as JSON
        const lines = stdout.trim().split("\n").filter((l) => l.trim());
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-500),
          stdout: stdout.slice(-500),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

// ─── Public API ──────────────────────────────────────────────

export function getAllTools(): ToolDefinition[] {
  return [...TOOLS, ...GH_TOOLS];
}

export function findTool(name: string): ToolDefinition | null {
  return TOOLS.find((t) => t.name === name) || GH_TOOLS.find((t) => t.name === name) || null;
}

export async function executeTool(name: string, args: any): Promise<{ success: boolean; output?: any; error?: string; durationMs: number }> {
  const start = Date.now();
  const tool = findTool(name);
  if (!tool) {
    return { success: false, error: `Tool '${name}' not found`, durationMs: 0 };
  }
  try {
    const result = await tool.execute(args);
    return {
      success: result?.success !== false,
      output: result,
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return { success: false, error: e.message, durationMs: Date.now() - start };
  }
}

export function getToolsSchema() {
  return [...TOOLS, ...GH_TOOLS].map((t) => ({
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
    runtime: t.runtime,
    package: (t as any).package,
    source_repo: (t as any).source_repo,
    license: (t as any).license,
  }));
}

export function getStats() {
  const all = [...TOOLS, ...GH_TOOLS];
  const byCategory: Record<string, number> = {};
  const byRuntime: Record<string, number> = {};
  for (const t of all) {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    byRuntime[t.runtime] = (byRuntime[t.runtime] || 0) + 1;
  }
  const ghStats = getGhStats();
  return {
    total: all.length,
    byCategory,
    byRuntime,
    github_tools: ghStats,
  };
}
