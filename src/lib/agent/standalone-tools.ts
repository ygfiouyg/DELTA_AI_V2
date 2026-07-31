/**
 * V.142: Standalone Custom Tools — أدوات مستقلة مش من packages
 * دي أدوات بنكتبها إحنا بـ Python كود مباشر
 * كل أداة action-oriented — الموديل بيقرر امتى يستدعيها
 */

import { AgentTool } from "./custom-tools";

const PYTHON_INIT = `import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); `;

async function runPythonCode(code: string, timeoutMs = 30000): Promise<string> {
  const { spawn } = await import("child_process");
  return new Promise((resolve) => {
    const proc = spawn("python3", ["-c", PYTHON_INIT + code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    const timer = setTimeout(() => { proc.kill(); resolve(JSON.stringify({ error: "Timeout" })); }, timeoutMs);
    proc.on("close", () => { clearTimeout(timer); resolve(out); });
  });
}

// ═══════════════════════════════════════════
// 1. URL Shortener
// ═══════════════════════════════════════════
export const urlShortener: AgentTool = {
  name: "shorten_url",
  description: "تقصير رابط طويل باستخدام is.gd API. استخدمها لما المستخدم يطلب تقصير رابط.",
  parameters: { url: { type: "string", description: "الرابط الطويل" } },
  execute: async (args) => {
    return runPythonCode(`import urllib.request, json
resp = urllib.request.urlopen("https://is.gd/create.php?format=json&url=${args.url}", timeout=10)
data = json.loads(resp.read())
print(json.dumps(data))`);
  },
};

// ═══════════════════════════════════════════
// 2. Base64 Encoder/Decoder
// ═══════════════════════════════════════════
export const base64Tool: AgentTool = {
  name: "base64_codec",
  description: "ترميز أو فك ترميز Base64. استخدمها لتشفير أو فك تشفير نصوص.",
  parameters: { text: { type: "string" }, action: { type: "string", description: "encode or decode" } },
  execute: async (args) => {
    return runPythonCode(`import base64, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
action = "${args.action || 'encode'}"
if action == "encode":
    result = base64.b64encode(text.encode()).decode()
else:
    result = base64.b64decode(text.encode()).decode()
print(json.dumps({"result": result}))`);
  },
};

// ═══════════════════════════════════════════
// 3. Hash Generator (MD5, SHA1, SHA256)
// ═══════════════════════════════════════════
export const hashGenerator: AgentTool = {
  name: "generate_hash",
  description: "توليد hash من نص (md5, sha1, sha256). استخدمها لتشفير كلمات مرور أو بيانات.",
  parameters: { text: { type: "string" }, algorithm: { type: "string", description: "md5, sha1, sha256", default: "sha256" } },
  execute: async (args) => {
    return runPythonCode(`import hashlib, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
algo = "${args.algorithm || 'sha256'}"
h = hashlib.new(algo)
h.update(text.encode())
print(json.dumps({"hash": h.hexdigest(), "algorithm": algo}))`);
  },
};

// ═══════════════════════════════════════════
// 4. Color Picker (hex to RGB/HSV)
// ═══════════════════════════════════════════
export const colorPicker: AgentTool = {
  name: "color_convert",
  description: "تحويل بين صيغ الألوان (HEX, RGB, HSV). استخدمها لتحليل أو توليد ألوان.",
  parameters: { color: { type: "string", description: "اللون (e.g. #FF5733 or rgb(255,87,51))" } },
  execute: async (args) => {
    return runPythonCode(`import colorsys, json, re
color = "${args.color || '#000000'}"
if color.startswith('#'):
    r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
else:
    nums = re.findall(r'\\d+', color)
    r, g, b = int(nums[0]), int(nums[1]), int(nums[2])
h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
print(json.dumps({"hex": f"#{r:02X}{g:02X}{b:02X}", "rgb": [r, g, b], "hsv": [round(h*360), round(s*100), round(v*100)]}))`);
  },
};

// ═══════════════════════════════════════════
// 5. Password Generator
// ═══════════════════════════════════════════
export const passwordGenerator: AgentTool = {
  name: "generate_password",
  description: "توليد كلمة مرور قوية عشوائية. استخدمها لما المستخدم يطلب كلمة مرور آمنة.",
  parameters: { length: { type: "integer", default: 16 }, include_symbols: { type: "boolean", default: true } },
  execute: async (args) => {
    return runPythonCode(`import random, string, json
length = ${args.length || 16}
chars = string.ascii_letters + string.digits
if ${args.include_symbols !== false}:
    chars += "!@#\$%^&*()_+-=[]{}|;:,.<>?"
password = ''.join(random.choice(chars) for _ in range(length))
strength = "strong" if length >= 12 else "medium" if length >= 8 else "weak"
print(json.dumps({"password": password, "length": length, "strength": strength}))`);
  },
};

// ═══════════════════════════════════════════
// 6. Text Diff Checker
// ═══════════════════════════════════════════
export const textDiff: AgentTool = {
  name: "text_diff",
  description: "مقارنة نصين وإظهار الفروقات. استخدمها لما المستخدم يطلب مقارنة ملفين أو نصين.",
  parameters: { text1: { type: "string" }, text2: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import difflib, json
t1 = """${(args.text1 || "").replace(/"/g, '\\"')}""".split('\\n')
t2 = """${(args.text2 || "").replace(/"/g, '\\"')}""".split('\\n')
diff = list(difflib.unified_diff(t1, t2, lineterm=''))
print(json.dumps({"diff": '\\n'.join(diff)[:2000]}))`);
  },
};

// ═══════════════════════════════════════════
// 7. JSON Formatter & Validator
// ═══════════════════════════════════════════
export const jsonFormatter: AgentTool = {
  name: "format_json_standalone",
  description: "تنسيق والتحقق من صحة JSON. استخدمها لتنظيم أو التحقق من بيانات JSON.",
  parameters: { json_string: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
try:
    data = json.loads('''${(args.json_string || "{}").replace(/'/g, "\\'")}''')
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)}))`);
  },
};

// ═══════════════════════════════════════════
// 8. Unit Converter
// ═══════════════════════════════════════════
export const unitConverter: AgentTool = {
  name: "convert_units",
  description: "تحويل بين وحدات القياس (طول، وزن، حرارة، مساحة، سرعة). استخدمها لأي تحويل وحدات.",
  parameters: { value: { type: "number" }, from_unit: { type: "string" }, to_unit: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
value = ${args.value || 0}
from_u = "${args.from_unit || 'm'}"
to_u = "${args.to_unit || 'ft'}"
# Length
length = {"m":1, "km":1000, "cm":0.01, "mm":0.001, "ft":0.3048, "in":0.0254, "mi":1609.34, "yd":0.9144}
# Weight
weight = {"kg":1, "g":0.001, "lb":0.453592, "oz":0.0283495, "ton":1000}
# Temperature
if from_u in ["c","f","k"] and to_u in ["c","f","k"]:
    if from_u == "c" and to_u == "f": result = value * 9/5 + 32
    elif from_u == "f" and to_u == "c": result = (value - 32) * 5/9
    elif from_u == "c" and to_u == "k": result = value + 273.15
    elif from_u == "k" and to_u == "c": result = value - 273.15
    elif from_u == "f" and to_u == "k": result = (value - 32) * 5/9 + 273.15
    elif from_u == "k" and to_u == "f": result = (value - 273.15) * 9/5 + 32
    else: result = value
elif from_u in length and to_u in length:
    result = value * length[from_u] / length[to_u]
elif from_u in weight and to_u in weight:
    result = value * weight[from_u] / weight[to_u]
else:
    result = "Cannot convert"
print(json.dumps({"result": round(result, 6), "from": from_u, "to": to_u}))`);
  },
};

// ═══════════════════════════════════════════
// 9. Markdown to HTML
// ═══════════════════════════════════════════
export const markdownToHtml: AgentTool = {
  name: "markdown_to_html",
  description: "تحويل Markdown إلى HTML. استخدمها لتحويل نصوص Markdown لصفحات ويب.",
  parameters: { markdown: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import markdown, json
md_text = """${(args.markdown || "").replace(/"/g, '\\"')}"""
html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])
print(json.dumps({"html": html[:3000]}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 10. Lorem Ipsum Generator
// ═══════════════════════════════════════════
export const loremIpsum: AgentTool = {
  name: "generate_lorem",
  description: "توليد نص وهمي (Lorem Ipsum) للاختبار. استخدمها لتعبئة قوالب أو تجارب.",
  parameters: { paragraphs: { type: "integer", default: 3 } },
  execute: async (args) => {
    return runPythonCode(`import json, random
words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split()
result = []
for p in range(${args.paragraphs || 3}):
    sentences = []
    for s in range(random.randint(3, 6)):
        n = random.randint(8, 20)
        sentence = ' '.join(random.choice(words) for _ in range(n))
        sentences.append(sentence.capitalize() + '.')
    result.append(' '.join(sentences))
print(json.dumps({"text": '\\n\\n'.join(result)}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 11. Regex Tester
// ═══════════════════════════════════════════
export const regexTester: AgentTool = {
  name: "test_regex",
  description: "اختبار تعبير نمطي (Regex) ضد نص. استخدمها للتحقق من صحة regex.",
  parameters: { pattern: { type: "string" }, text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import re, json
pattern = r"""${(args.pattern || "").replace(/"/g, '\\"')}"""
text = """${(args.text || "").replace(/"/g, '\\"')}"""
matches = re.findall(pattern, text)
print(json.dumps({"matches": matches[:20], "count": len(matches)}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 12. Timestamp Converter
// ═══════════════════════════════════════════
export const timestampConverter: AgentTool = {
  name: "convert_timestamp",
  description: "تحويل بين Unix timestamp وتاريخ مقروء. استخدمها لتحويل التواريخ.",
  parameters: { value: { type: "string" }, action: { type: "string", description: "to_date or to_timestamp" } },
  execute: async (args) => {
    return runPythonCode(`from datetime import datetime, timezone
import json
action = "${args.action || 'to_date'}"
value = "${args.value || '0'}"
if action == "to_date":
    dt = datetime.fromtimestamp(int(value), tz=timezone.utc)
    print(json.dumps({"date": dt.strftime("%Y-%m-%d %H:%M:%S UTC")}))
else:
    dt = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    print(json.dumps({"timestamp": int(dt.replace(tzinfo=timezone.utc).timestamp())}))`);
  },
};

// ═══════════════════════════════════════════
// 13. Slug Generator
// ═══════════════════════════════════════════
export const slugGenerator: AgentTool = {
  name: "generate_slug",
  description: "تحويل نص إلى slug صالح للـ URLs. استخدمها لإنشاء روابط نظيفة.",
  parameters: { text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import re, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
slug = re.sub(r'[^a-zA-Z0-9\\s-]', '', text.lower())
slug = re.sub(r'[\\s-]+', '-', slug).strip('-')
print(json.dumps({"slug": slug}))`);
  },
};

// ═══════════════════════════════════════════
// 14. Text Statistics
// ═══════════════════════════════════════════
export const textStats: AgentTool = {
  name: "text_stats",
  description: "إحصائيات نص: عدد كلمات، أحرف، جمل، قراءة. استخدمها لتحليل النصوص.",
  parameters: { text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json, re
text = """${(args.text || "").replace(/"/g, '\\"')}"""
words = len(text.split())
chars = len(text)
chars_no_spaces = len(text.replace(' ', ''))
sentences = len(re.findall(r'[.!?]+', text))
paragraphs = len([p for p in text.split('\\n\\n') if p.strip()])
avg_word_len = sum(len(w) for w in text.split()) / max(words, 1)
reading_time = words / 200  # 200 words per minute
print(json.dumps({"words": words, "chars": chars, "chars_no_spaces": chars_no_spaces, "sentences": sentences, "paragraphs": paragraphs, "avg_word_length": round(avg_word_len, 2), "reading_time_min": round(reading_time, 1)}))`);
  },
};

// ═══════════════════════════════════════════
// 15. Cron Expression Parser
// ═══════════════════════════════════════════
export const cronParser: AgentTool = {
  name: "parse_cron",
  description: "تحليل cron expression ووصف متى سيعمل. استخدمها لفهم جدولة المهام.",
  parameters: { expression: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
expr = "${(args.expression || '').replace(/"/g, '\\"')}"
parts = expr.split()
if len(parts) == 5:
    minute, hour, day, month, weekday = parts
    desc = f"Every {minute} minute(s), {hour} hour(s), {day} day(s), {month} month(s), {weekday} weekday(s)"
else:
    desc = "Invalid cron expression"
print(json.dumps({"expression": expr, "description": desc}))`);
  },
};

// ═══════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════
export const STANDALONE_TOOLS: AgentTool[] = [
  urlShortener,
  base64Tool,
  hashGenerator,
  colorPicker,
  passwordGenerator,
  textDiff,
  jsonFormatter,
  unitConverter,
  markdownToHtml,
  loremIpsum,
  regexTester,
  timestampConverter,
  slugGenerator,
  textStats,
  cronParser,
];
