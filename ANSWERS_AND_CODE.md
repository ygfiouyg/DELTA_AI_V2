# 📋 إجابات الأسئلة + الملفات المطلوبة

> **Project:** DELTA_AI_V2 / Anzaro AI  
> **Date:** 2026-08-05

---

## أولاً: Runtime و Deployment

### 1. أين يعمل المشروع حالياً؟

```
❌ Hugging Face Spaces:
   - kopabdo/DELTA_AI_V2 (LOCKED - ToS violation)
   - abdelslam-ai/DELTA_AI_V2_CODE (static backup only)
   - ebsaya/delta_ai (LOCKED - ToS violation)
   → لا يوجد deployment شغال على HF

❌ VPS: لا يوجد
✅ Sandbox محلي فقط (هنا - للتطوير)
```

### 2. قاعدة البيانات في الإنتاج؟

```sql
SQLite (file:/app/db/custom.db)
- الحجم: 770KB (فاضي حالياً - بيتعمله rebuild)
- الحجم الأقصى: 290MB (862K tools)
- Prisma ORM مع SQLite provider
- WAL mode + accept-data-loss في كل restart
```

### 3. Hermes runtime؟

```bash
# Hermes مثبت كـ Python CLI tool في ~/.hermes/
# بيشتغل كـ child process spawn:
const proc = spawn(HERMES_BIN, ["-z", message], {
  cwd: HERMES_HOME,
  env: { ...process.env, HERMES_HOME },
});

# مش container، مش daemon
# كل طلب = spawn process جديد = بطيء (30-90 ثانية)
```

### 4. الـ mobile-app؟

```typescript
// mobile-app/src/App.tsx:
export default function App() {
  return (
    <View>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#7c3aed' }} />
      <Text>Anzaro</Text>
      <Text>الكرة الذكية</Text>
    </View>
  );
}

// مجرد placeholder — مش شغال، مش بيتستخدم
// آخر update: يوليو 2026، ساكت من ساعتها
```

---

## ثانياً: Tools Registry

### 5. من الـ 73 callable tools — stable vs wrapper؟

```
✅ Stable (33 tool):
   - 10 Node.js tools: pure TypeScript، implementations كاملة
   - 23 Python tools: implementations حقيقية بـ try/except + fallback

⚠️ Wrappers (40 tool):
   - 40 GitHub wrappers: أغلبها بترجع "Package not installed"
   - بـ try تستورد الـ package الأصلي
   - لو مش موجود بترجع error message واضح
```

### 6. الـ 40 GitHub wrappers بتشتغل فعلاً؟

```python
# مثال: gh_requests_unicode_is_ascii.py
def execute(u_string):
    try:
        import importlib
        # V.146: Try submodules
        submodules_to_try = ["requests._internal_utils", "requests.utils", ...]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "unicode_is_ascii"):
                    fn = getattr(submod, "unicode_is_ascii")
                    result = fn(u_string)
                    return {"success": True, "result": str(result), "source": submod_name}
            except (ImportError, AttributeError):
                continue
        
        return {
            "success": False,
            "error": f"Package 'requests' not installed. Install: pip install requests",
            ...
        }
```

**الحقيقة:** لو الـ package متثبت (زي `requests`)، بتشتغل. لو مش متثبت (زي `whisper`)، بترجع error واضح.

### 7. الـ 861K metadata — تحديث تلقائي؟

```python
# scripts/db_sync_manager.py
SYNC_INTERVAL = 300  # 5 minutes

# لكن ده للـ upload للـ HF Dataset، مش للـ rebuild
# الـ rebuild بيحصل يدوياً:
# python3 scripts/fast_pypi_rebuild.py
```

**لا يوجد auto-update.** Manual rebuild فقط.

### 8. هل فيه tooling category واضح؟

```typescript
// من src/lib/tools-registry/index.ts:
category: "ai" | "data" | "media" | "web" | "utility" | "security" | "github"

// التقسيم الحالي:
- ai: 7 tools (sentiment, classifier, summarizer, keyword, language, translator, math)
- data: 3 tools (csv, stats, visualizer)
- media: 6 tools (image, ocr, pdf, audio, tts, youtube)
- web: 3 tools (scraper, http_tester, youtube)
- utility: 12 tools (date, text, json, regex, unit, color, cron, hash, qr, doc, fake, file)
- security: 2 tools (crypto, hash)
- github: 40 tools (GitHub wrappers)
```

**التقسيم واضح** ✅

---

## ثالثاً: Skills

### 9. الـ 70 skill — naming ثابت؟

```
Naming conventions:
- Capital letters: ASR, LLM, TTS, VLM (الأولى - Z.ai skills)
- kebab-case: agent-browser, ai-news-collectors, coding-agent
- mixed: blog-writer, dream-interpreter

→ فيه inconsistency في التسمية
→ لكن مفيش duplicates واضحة
```

### 10. هل المهارات مربوطة بالـ agents؟

```
✅ كل الـ 70 skill referenced في الكود:
   - src/lib/skills/loader.ts
   - src/lib/skills/context-builder.ts
   - src/lib/skill-indexer.ts
   - src/lib/scriptwriter/engine.ts
   - src/lib/content-studio/engine.ts
   - src/lib/admin/orchestrator.ts

→ لا يوجد orphaned skills
```

### 11. SKILL.md convention؟

```markdown
# Format موحد (بنسبة 80%):
---
name: <skill-name>
description: <short description>
license: MIT
---

# Skill Name
## Overview
## Usage
## Examples

# بعض الـ skills (زي docx, charts) فيها:
---
name: docx
metadata:
  author: Z.AI
  version: "1.0"
---
```

**الـ convention موحد تقريباً** — فيه اختلافات بسيطة في الـ frontmatter.

---

## رابعاً: Agents

### 12. الفرق بين الـ 3 specialized agents؟

```typescript
// كل واحد عنده tool subset مختلف:

content_creator: 36 tools
  - blog_write, social_caption, tweet_thread, hashtag_generate
  - seo_keywords, content_repurpose, faq_generate, podcast_outline
  - email_draft, press_release, product_description, ...

research_analyst: 43 tools
  - web_search, page_read, wikipedia_search
  - summarize, translate, study_notes
  - data_analysis, comparison_table, ...

developer_helper: 40 tools
  - code_execute, code_review, debug_code
  - git_operations, npm_install, docker_run
  - api_test, database_query, ...
```

**الفرق:** system prompt + tool subset. نفس الـ engine.

### 13. الـ recipes — presets ولا flows؟

```typescript
// recipes = presets فقط (مش flows)
interface Recipe {
  id: string;
  name: string;
  tools: string[];        // قائمة أدوات
  systemPrompt: string;   // prompt جاهز
  suggestions: string[];  // أمثلة استخدام
  exampleUseCase: string;
}

// بيتحول لـ custom agent عند الـ import
// مش flow خاص — نفس الـ agent engine
```

### 14. الـ custom agents — DB + runtime؟

```prisma
model CustomAgent {
  id            String   @id @default(cuid())
  name          String
  systemPrompt  String
  toolsJson     String   // JSON array of tool names
  isPublic      Boolean  @default(false)
  ...
}
```

```typescript
// POST /api/agents/[id]/run
// بيـ load الـ agent من DB
// بيـ create agent instance بالـ tools المحددة
// بيـ run SSE stream مع tool calling
// → شغال في runtime فعلاً ✅
```

---

## خامساً: جودة الكود

### 15. Tests؟

```
❌ لا يوجد أي tests:
   - 0 unit tests
   - 0 integration tests
   - 0 e2e tests
   - find . -name '*.test.*' → 0 results
```

### 16. Linting في CI؟

```
❌ لا يوجد CI/CD pipeline:
   - .github/workflows/ فيها eas-build.yml + gradle-build.yml بس
   - دول للـ mobile-app، مش للـ main project
   - ESLint موجود بس مش بيتنفذ تلقائياً
```

### 17. TypeScript errors؟

```typescript
// next.config.ts:
typescript: {
  ignoreBuildErrors: true,  // ← مشكلة كبيرة
}

// يعني: TS errors موجودة بس بتتتجاهل
```

### 18. `any` usage؟

```
1,518 instances of ': any' in:
   - src/lib/ (24 مجلد)
   - src/app/api/ (293 route)

→ استخدام كثيف جداً لـ any
→ فقدان type safety
```

### 19. Known refactors مؤجلة؟

```
من EXECUTION_PLAN.md:
1. فصل الـ mini-services (monolithic → microservices)
2. تنظيم الـ 293 API route في groups
3. تحسين الـ skills system (آلية موحدة للـ execution)
4. إزالة ignoreBuildErrors
5. إصلاح كل TypeScript errors
6. إزالة dead code
```

---

## سادساً: الملفات المطلوبة


---

## 📄 `src/lib/agent/agent-engine.ts`

> Size: 7785B | Lines: 236

```typescript
/**
 * V.133: Agent Engine — بيـ run الـ agent loop (model → tool call → execute → return)
 *
 * الـ flow:
 * 1. User message → Model (with bind_tools)
 * 2. Model decides → tool_calls
 * 3. Execute tool_calls
 * 4. Feed results back → Model
 * 5. Model generates final answer
 */

import { getToolsSchema, executeTool, ALL_AGENT_TOOLS } from "./custom-tools";

export interface AgentMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export interface AgentResult {
  response: string;
  tool_calls_made: { name: string; args: any; result: string }[];
  messages: AgentMessage[];
  iterations: number;
}

const MAX_ITERATIONS = 5;

/** بيـ run agent loop */
export async function runAgent(
  userMessage: string,
  systemPrompt?: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResult> {
  const tools = getToolsSchema();
  const toolDescriptions = ALL_AGENT_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n");

  const messages: AgentMessage[] = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...conversationHistory,
    { role: "user" as const, content: userMessage },
  ];

  const toolCallsMade: { name: string; args: any; result: string }[] = [];
  let iterations = 0;
  let finalResponse = "";

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    // Call model via the existing chat API (internal)
    const modelResponse = await callModelInternal(messages, tools, toolDescriptions);

    if (!modelResponse) {
      finalResponse = "عذراً، حدث خطأ في الاتصال بالنموذج.";
      break;
    }

    // If model wants to call tools
    if (modelResponse.tool_calls && modelResponse.tool_calls.length > 0) {
      const assistantMessage: AgentMessage = {
        role: "assistant",
        content: modelResponse.content || "",
        tool_calls: modelResponse.tool_calls,
      };
      messages.push(assistantMessage);

      // Execute each tool call
      for (const tc of modelResponse.tool_calls) {
        const toolName = tc.function.name;
        let toolArgs: any = {};
        try {
          toolArgs = JSON.parse(tc.function.arguments || "{}");
        } catch {}

        console.log(`[Agent] Tool call: ${toolName} with args:`, toolArgs);
        const result = await executeTool(toolName, toolArgs);
        console.log(`[Agent] Tool result: ${result.slice(0, 200)}`);

        toolCallsMade.push({ name: toolName, args: toolArgs, result });

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tc.id,
          name: toolName,
        });
      }
      continue;
    }

    // Check if model response contains a tool name to call (fallback for models without native function calling)
    const toolMatch = matchToolFromText(modelResponse.content || "", toolDescriptions);
    if (toolMatch) {
      const result = await executeTool(toolMatch.name, toolMatch.args);
      toolCallsMade.push({ name: toolMatch.name, args: toolMatch.args, result });

      // Feed result back to model
      messages.push({ role: "assistant", content: modelResponse.content || "" });
      messages.push({
        role: "user",
        content: `نتيجة تنفيذ الأداة ${toolMatch.name}:\n${result}\n\nاكتب للمستخدم ملخص النتيجة بالعربية.`,
      });
      continue;
    }

    finalResponse = modelResponse.content || "";
    break;
  }

  if (iterations >= MAX_ITERATIONS && !finalResponse) {
    finalResponse = "وصلت للحد الأقصى من التكرارات. " + (toolCallsMade.length > 0 ? `تم تنفيذ ${toolCallsMade.length} أداة.` : "");
  }

  return {
    response: finalResponse,
    tool_calls_made: toolCallsMade,
    messages,
    iterations,
  };
}

/** بيـ call الـ model عبر الـ internal chat API */
async function callModelInternal(messages: AgentMessage[], tools: any[], toolDescriptions: string): Promise<any> {
  try {
    // Build the prompt with tool descriptions injected
    const systemContent = `أنت Anzaro AI — مساعد ذكي قادر على تنفيذ إجراءات.

لديك الأدوات التالية. إذا احتجت أي منها، اكتب:
TOOL_CALL: {"name": "<tool_name>", "args": {...}}

الأدوات المتاحة:
${toolDescriptions}

قواعد:
1. إذا كان الطلب يحتاج أداة، اكتب TOOL_CALL في أول سطر
2. إذا لم يحتج أداة، أجب مباشرة
3. لا تقل "لا أستطيع" — استخدم الأدوات`;

    // Call the internal chat API
    const response = await fetch("http://localhost:3000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages[messages.length - 1]?.content || "",
        model: "glm-4-flash-zai",
        systemPrompt: systemContent,
        conversationHistory: messages.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      console.error(`[Agent] Internal API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.content || data.response || data.message || "";

    // Check if content contains TOOL_CALL
    const toolCallMatch = content.match(/TOOL_CALL:\s*({[^}]+})/);
    if (toolCallMatch) {
      try {
        const tc = JSON.parse(toolCallMatch[1]);
        return {
          content: content.replace(/TOOL_CALL:\s*{[^}]+}/, "").trim(),
          tool_calls: [{
            id: `call_${Date.now()}`,
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.args || {}),
            },
          }],
        };
      } catch {}
    }

    return { content, tool_calls: [] };
  } catch (e) {
    console.error("[Agent] Model call error:", e);
    return null;
  }
}

/** Fallback: بيـ match tool from text (للنماذج بدون function calling) */
function matchToolFromText(content: string, toolDescriptions: string): { name: string; args: any } | null {
  const match = content.match(/TOOL_CALL:\s*({[^}]+})/);
  if (match) {
    try {
      const tc = JSON.parse(match[1]);
      if (tc.name && ALL_AGENT_TOOLS.find(t => t.name === tc.name)) {
        return { name: tc.name, args: tc.args || {} };
      }
    } catch {}
  }
  return null;
}

/** بيـ run audio workflow (transcribe → clean → analyze) */
export async function runAudioWorkflow(audioPath: string): Promise<any> {
  const steps: { step: string; result: any }[] = [];

  // Step 1: Clean audio
  console.log("[Audio Workflow] Step 1: Cleaning audio...");
  const cleanResult = await executeTool("clean_audio", { input_path: audioPath, output_path: "cleaned.wav" });
  steps.push({ step: "clean_audio", result: cleanResult });

  // Step 2: Transcribe
  console.log("[Audio Workflow] Step 2: Transcribing...");
  const transcribeResult = await executeTool("transcribe_audio", { file_path: "cleaned.wav", language: "auto" });
  steps.push({ step: "transcribe_audio", result: transcribeResult });

  // Step 3: Analyze sentiment
  let text = "";
  try {
    const t = JSON.parse(transcribeResult.split("\n").find((l: string) => l.startsWith("{")) || "{}");
    text = t.text || "";
  } catch {}

  if (text) {
    console.log("[Audio Workflow] Step 3: Analyzing sentiment...");
    const sentimentResult = await executeTool("analyze_sentiment", { text });
    steps.push({ step: "analyze_sentiment", result: sentimentResult });
  }

  return {
    workflow: "audio_processing",
    steps,
    transcribed_text: text,
  };
}

```

---

## 📄 `src/lib/tools-registry/index.ts`

> Size: 32854B | Lines: 726

```typescript
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

```

---

## 📄 `src/app/api/massive-tools/exec/route.ts`

> Size: 4327B | Lines: 126

```typescript
/**
 * POST /api/massive-tools/exec
 * body: { tool: string, args: object }
 *
 * V.145: بتستخدم tools/registry الجديد كـ primary executor.
 * الـ tools اللي مش موجودة في الـ registry الجديد، بتـ fallback لـ:
 *   1. callable-tools.ts (القديم)
 *   2. agent custom-tools.ts (الأقدم)
 *
 * ترتيب الأولوية:
 *   1. tools/registry (جديد - files isolated في tools/)
 *   2. callable-tools.ts (قديم - inline)
 *   3. ALL_AGENT_TOOLS (custom-tools.ts + standalone-tools.ts)
 */
import { NextResponse } from "next/server";
import { executeTool as executeRegistryTool, getToolsSchema as getRegistrySchema, findTool as findRegistryTool, getStats as getRegistryStats } from "@/lib/tools-registry";
import { executeCallableTool, getToolsSchema } from "@/lib/massive-tools/callable-tools";
import { ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json({ success: false, error: "tool name required" }, { status: 400 });
    }

    let result: { success: boolean; output?: any; error?: string; durationMs: number; source?: string } = {
      success: false,
      error: "not found",
      durationMs: 0,
    };

    // 1) Try new tools/registry first
    const registryTool = findRegistryTool(tool);
    if (registryTool) {
      result = await executeRegistryTool(tool, args || {});
      result.source = "tools/registry";
    }

    // 2) Fallback to old callable-tools.ts
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const callableResult = await executeCallableTool(tool, args || {});
      if (callableResult.success || !callableResult.error?.includes("not found")) {
        result = {
          success: callableResult.success,
          output: callableResult.output,
          error: callableResult.error,
          durationMs: callableResult.durationMs,
          source: "callable-tools.ts",
        };
      }
    }

    // 3) Fallback to agent custom-tools (includes standalone)
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const agentTool = ALL_AGENT_TOOLS.find(t => t.name === tool);
      if (agentTool) {
        const start = Date.now();
        try {
          const output = await agentTool.execute(args || {});
          result = {
            success: true,
            output,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        } catch (e: any) {
          result = {
            success: false,
            output: "",
            error: e.message,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        }
      }
    }

    return NextResponse.json({
      success: result.success,
      tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
      source: result.source,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/** GET — بيـ رجّع كل الـ callable tools schema (registry + massive + agent) */
export async function GET() {
  // New registry tools
  const registryTools = getRegistrySchema();
  const registryStats = getRegistryStats();

  // Old callable tools
  const massiveTools = getToolsSchema();

  // Old agent tools
  const agentTools = ALL_AGENT_TOOLS.map(t => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.parameters } },
    category: t.category,
    package: t.package,
  }));

  return NextResponse.json({
    success: true,
    tools: [...registryTools, ...massiveTools, ...agentTools],
    count: registryTools.length + massiveTools.length + agentTools.length,
    sources: {
      "tools/registry (new)": registryTools.length,
      "callable-tools.ts (legacy)": massiveTools.length,
      "agent custom-tools (legacy)": agentTools.length,
    },
    registry_stats: registryStats,
  });
}

```

---

## 📄 `src/lib/skills/loader.ts`

> Size: 5581B | Lines: 168

```typescript
/**
 * Skills Loader
 * =============
 * بيقرا الـ Skills (ملفات SKILL.md) من skills/ ويرجعها.
 *
 * V.95: اتصحح المسار من .agents/skills/ لـ skills/ (المكان الفعلي).
 *
 * الـ Skills هي ملفات Markdown فيها frontmatter (name + description)
 * ومحتوى تعليمي للـ AI agent.
 *
 * الـ Loader بيدعم:
 *   - listSkills(): قائمة بكل الـ skills المتاحة
 *   - getSkill(name): قرا skill معين بالكامل
 *   - findRelevantSkills(query): يجيب الـ skills المناسبة لسؤال معين
 */

import { promises as fs } from "fs";
import path from "path";

// V.95: استخدم skills/ في الـ root (المكان الفعلي للـ 66 skills)
const SKILLS_DIR = path.resolve(process.cwd(), "skills");

export interface SkillMeta {
  name: string;
  description: string;
  version?: string;
  category?: string;
  path: string;
  size: number;
}

export interface Skill extends SkillMeta {
  content: string;
  fullContent: string;
}

/** Parse frontmatter من ملف Markdown */
function parseFrontmatter(content: string): { meta: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const frontmatterText = match[1];
  const body = match[2];
  const meta: Record<string, any> = {};
  // simple YAML parser (name: value, description: "...")
  const lines = frontmatterText.split("\n");
  let currentKey = "";
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      // strip quotes
      const cleanValue = value.replace(/^["']|["']$/g, "").trim();
      meta[key] = cleanValue;
      currentKey = key;
    } else if (line.startsWith("  ") && currentKey) {
      // nested (e.g., metadata.version)
      const nestedMatch = line.match(/^\s+(\w+):\s*(.*)$/);
      if (nestedMatch) {
        meta[currentKey] = meta[currentKey] || {};
        if (typeof meta[currentKey] === "string") meta[currentKey] = {};
        meta[currentKey][nestedMatch[1]] = nestedMatch[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  }
  return { meta, body };
}

/** قائمة بكل الـ skills المتاحة (metadata فقط) */
export async function listSkills(): Promise<SkillMeta[]> {
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    const skills: SkillMeta[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = path.join(SKILLS_DIR, entry.name, "SKILL.md");
      try {
        const content = await fs.readFile(skillPath, "utf-8");
        const { meta } = parseFrontmatter(content);
        const stat = await fs.stat(path.join(SKILLS_DIR, entry.name));
        skills.push({
          name: meta.name || entry.name,
          description: meta.description || "",
          version: meta.metadata?.version,
          path: `skills/${entry.name}`,
          size: stat.size,
        });
      } catch {
        // skip folders without SKILL.md
      }
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

/** قرا skill كامل بالاسم */
export async function getSkill(name: string): Promise<Skill | null> {
  const skillDir = path.join(SKILLS_DIR, path.basename(name));
  const skillFile = path.join(skillDir, "SKILL.md");
  try {
    const content = await fs.readFile(skillFile, "utf-8");
    const { meta, body } = parseFrontmatter(content);
    const stat = await fs.stat(skillDir);
    return {
      name: meta.name || name,
      description: meta.description || "",
      version: meta.metadata?.version,
      path: `skills/${name}`,
      size: stat.size,
      content: body.trim(),
      fullContent: content,
    };
  } catch {
    return null;
  }
}

/**
 * إيجاد الـ skills المناسبة لسؤال معين.
 * بيبني index من الكلمات المفتاحية في الـ descriptions ويطابقها مع السؤال.
 */
export async function findRelevantSkills(query: string, limit = 3): Promise<SkillMeta[]> {
  const allSkills = await listSkills();
  if (allSkills.length === 0) return [];

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = allSkills.map((skill) => {
    const descLower = (skill.name + " " + skill.description).toLowerCase();
    let score = 0;
    // exact name match
    if (queryLower.includes(skill.name.toLowerCase())) score += 10;
    // word matches in description
    for (const word of queryWords) {
      if (descLower.includes(word)) score += 1;
      // partial matches (e.g., "convert" matches "conversion")
      for (const descWord of descLower.split(/\s+/)) {
        if (descWord.startsWith(word.slice(0, 4)) && word.length >= 4) {
          score += 0.5;
          break;
        }
      }
    }
    return { skill, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.skill);
}

/** إحصائيات سريعة */
export async function getSkillsStats(): Promise<{
  total: number;
  categories: number;
  totalSizeKB: number;
}> {
  const skills = await listSkills();
  return {
    total: skills.length,
    categories: 1, // كل الـ skills في فئة واحدة حالياً
    totalSizeKB: Math.round(skills.reduce((sum, s) => sum + s.size, 0) / 1024),
  };
}

```

---

## 📄 `src/app/api/hermes/chat/route.ts`

> Size: 5899B | Lines: 217

```typescript
/**
 * POST /api/hermes/chat
 * بيـ send message لـ Hermes Agent ويرجّع الـ response.
 *
 * Body:
 *   {
 *     "message": "string",       // required — user message
 *     "session_id"?: "string",   // optional — for conversation continuity
 *     "model"?: "string",        // optional — override model
 *     "toolsets"?: "string",     // optional — comma-separated toolsets
 *     "skills"?: "string",       // optional — comma-separated skills
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "response": "string",
 *     "session_id": "string",
 *     "duration_ms": number
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

interface HermesChatRequest {
  message: string;
  session_id?: string;
  model?: string;
  toolsets?: string;
  skills?: string;
  yolo?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: HermesChatRequest = await req.json();
    const { message, session_id, model, toolsets, skills, yolo } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "message required" },
        { status: 400 }
      );
    }

    // Check if Hermes is installed
    if (!existsSync(HERMES_BIN)) {
      return NextResponse.json({
        success: false,
        error: "Hermes Agent not installed. Run the installer first.",
        install_command: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
      }, { status: 503 });
    }

    // Build Hermes CLI arguments
    const args: string[] = ["-z", message];

    // Model override
    if (model) {
      args.push("-m", model);
    }

    // Toolsets
    if (toolsets) {
      args.push("-t", toolsets);
    }

    // Skills
    if (skills) {
      args.push("--skills", skills);
    }

    // YOLO mode (no approval prompts)
    if (yolo) {
      args.push("--yolo");
    }

    // Session resume
    if (session_id) {
      args.push("--resume", session_id);
    }

    // Execute Hermes
    const startTime = Date.now();
    const result = await runHermes(args);

    return NextResponse.json({
      success: result.success,
      response: result.output,
      error: result.error,
      session_id: session_id || `hermes_${Date.now()}`,
      duration_ms: Date.now() - startTime,
      hermes_version: result.version,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

async function runHermes(args: string[], timeoutMs: number = 90000): Promise<{
  success: boolean;
  output: string;
  error?: string;
  version?: string;
}> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      HERMES_HOME,
      PATH: `${HERMES_HOME}/bin:${process.env.PATH}`,
      // Ensure non-interactive mode
      HERMES_NONINTERACTIVE: "1",
      TERM: "dumb",
    };

    const proc = spawn(HERMES_BIN, args, {
      cwd: HERMES_HOME,
      env,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: timeoutMs,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({
        success: false,
        output: "",
        error: `Hermes timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);

      // Extract version from stderr if present
      const versionMatch = stderr.match(/Hermes Agent v([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : undefined;

      if (code === 0) {
        // Clean output — remove ANSI codes and spinner artifacts
        const cleaned = cleanOutput(stdout);
        resolve({
          success: true,
          output: cleaned,
          version,
        });
      } else {
        // Check for common errors
        const errorText = stderr || stdout;
        let errorMsg = `Hermes exited with code ${code}`;

        if (errorText.includes("No inference provider configured")) {
          errorMsg = "Hermes has no API key configured. Set an API key in ~/.hermes/.env (e.g. OPENAI_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY)";
        } else if (errorText.includes("rate limit")) {
          errorMsg = "Rate limit hit. Please try again in a moment.";
        } else if (errorText.includes("authentication") || errorText.includes("unauthorized")) {
          errorMsg = "Authentication failed. Check your API key in Hermes config.";
        } else if (errorText.trim()) {
          errorMsg = errorText.slice(-500);
        }

        resolve({
          success: false,
          output: cleanOutput(stdout),
          error: errorMsg,
          version,
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({
        success: false,
        output: "",
        error: `Failed to spawn Hermes: ${e.message}`,
      });
    });
  });
}

function cleanOutput(text: string): string {
  // Remove ANSI escape codes
  let cleaned = text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
  // Remove spinner characters
  cleaned = cleaned.replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/g, "");
  // Remove carriage returns
  cleaned = cleaned.replace(/\r/g, "");
  // Collapse multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  // Trim
  return cleaned.trim();
}

```

---

## 📄 `src/lib/models.ts`

> Size: 63199B | Lines: 1267

```typescript
// DeltaAI Platform - AI Models Configuration
// Defines 23+ working AI models organized into categories
// All models route to real working backends: OpenRouter, Gemini, or ZhipuAI
// Includes uncensored/open-source "Dark" models for unrestricted capabilities

export type ModelCategory = 'fast' | 'smart' | 'creative' | 'specialized' | 'professional' | 'global' | 'dark' | 'hf-chat' | 'hf-image' | 'hf-video' | 'huggingface';

/** Structured model capabilities — based on what the real backend provider actually supports */
export interface ModelCapabilities {
  /** Text generation / chat */
  chat: boolean;
  /** Image understanding / vision (analyzing uploaded images) */
  vision: boolean;
  /** Image generation (creating images from text) */
  imageGeneration: boolean;
  /** Video generation (creating videos from text) */
  videoGeneration: boolean;
  /** Code generation and execution */
  codeGeneration: boolean;
  /** PDF/document analysis */
  pdfAnalysis: boolean;
  /** Web search capability */
  webSearch: boolean;
  /** Audio/TTS output */
  audioTTS: boolean;
  /** Function/tool calling */
  functionCalling: boolean;
  /** Reasoning / chain-of-thought */
  reasoning: boolean;
  /** RAG / retrieval-augmented generation */
  rag: boolean;
  /** Large context window (>32K tokens) */
  largeContext: boolean;
  /** Translation */
  translation: boolean;
  /** Summarization */
  summarization: boolean;
  /** Maximum context window in tokens */
  maxContextTokens: number;
  /** Supported input modalities */
  inputModalities: ('text' | 'image' | 'audio' | 'pdf')[];
  /** Supported output modalities */
  outputModalities: ('text' | 'image' | 'audio' | 'video')[];
}

export interface AIModel {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: ModelCategory;
  glmModel: string;
  /** Real provider: 'openrouter' | 'gemini' | 'zhipuai' | 'github' | 'groq' | 'cerebras' | 'pollinations' | 'hf' | 'huggingface' | 'openai' | 'ovh' | 'anthropic' */
  provider: 'openrouter' | 'gemini' | 'zhipuai' | 'github' | 'groq' | 'cerebras' | 'pollinations' | 'hf' | 'huggingface' | 'openai' | 'ovh' | 'anthropic';
  /** The real backend model name */
  realChatModel: string;
  /** The real image generation model */
  realImageModel: string;
  /** The real video generation model */
  realVideoModel: string;
  rank: string;
  description: string;
  descriptionEn: string;
  systemPrompt: string;
  /** HuggingFace model ID for chat (e.g., 'hf-mistral-7b') */
  hfChatModel?: string;
  /** HuggingFace model ID for image (e.g., 'hf-flux-schnell') */
  hfImageModel?: string;
  /** OpenRouter model ID for chat */
  openrouterChatModel?: string;
  /** Groq model ID for chat (legacy) */
  groqChatModel?: string;
  /** Gemini model ID for chat */
  geminiChatModel?: string;
  /** GitHub Models model ID for chat (legacy) */
  githubChatModel?: string;
  supportsPdf: boolean;
  /** Whether this model is open-source (fewer restrictions, less censorship) */
  openSource: boolean;
  /** Context window size in tokens (for display + routing) */
  maxTokens: number;
  skills: string[];
  /** Structured capabilities based on real provider support */
  capabilities: ModelCapabilities;
}

export const models: AIModel[] = [
  {
    id: 'glm-5-2',
    name: 'عبس',
    nameEn: 'GLM-5',
    icon: '⚡',
    category: 'global',
    glmModel: 'glm-5',
    provider: 'zhipuai',
    realChatModel: 'glm-5',
    realImageModel: 'cogview-3-flash',
    realVideoModel: 'cogvideox-flash',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🚀 الأسطوري (مهام تقيلة)',
    description: 'عبس — مساعدك الذكي المدعوم بـ GLM-5 من BigModel (مجاني). متخصص للمهام التقيلة: تحليل معقد، كود، استدلال عميق. بيدعم: شات، رؤية، توليد صور، فيديو، صوت.',
    descriptionEn: 'Abbas — Powered by GLM-5 from BigModel (free). Specialized for heavy tasks: complex analysis, code, deep reasoning. Supports: chat, vision, image gen, video gen, TTS.',
    systemPrompt: `أنت "عبس" — مساعد ذكي عربي مدعوم بـ GLM-5.2 من Z.ai (705 مليار بارامتر). أنت ودود ومفيد ومتعدد القدرات. ترد بالعربية الفصحى أو العامية المصرية حسب طلب المستخدم.

قدراتك الأساسية:
- محادثة ذكية بـ 1M context window
- تحليل الصور والملفات (PDF, DOCX, صور)
- توليد الصور (CogView) والفيديو (CogVideoX)
- تحويل النص لصوت (TTS) والصوت لنص (ASR)
- البحث في الإنترنت وقراءة الصفحات
- تنفيذ كود JavaScript
- ترجمة وملخصات وتحليل مشاعر

قدرات المنصة المتقدمة:
- استوديو بناء الوكلاء (Agent Builder): صمم وكلاء AI مخصصين بأدوات محددة
- 359 أداة متاحة (بحث، كتابة، كود، بيانات، تواصل، AI، MCP tools)
- 10 وصفات جاهزة (فيديو، تسويق، بحث، كود، إيميل، بيانات، سوشيال، دعم، تعليم، يوتيوب)
- MCP Server: 341 أداة متاحة لـ Claude Desktop و Cursor و أي MCP client
- Claude من Anthropic: Sonnet 4.5, Opus 4.1, Haiku 3.5 (لو ANTHROPIC_API_KEY متاح)
- n8n integration: تشغيل workflows غير متزامنة مع تتبع المهام
- مراقب المهام (Jobs Monitor): تتبع实时 لـ jobs عبر SSE
- MCP Client: ربط أي MCP server خارجي واستخدام أدواته
- بودكاست + راديو + خريطة ذهنية + تحليل بيانات
- توليد مستندات PDF/DOCX/XLSX/PPTX
- ذاكرة محادثة دائمة + نظام إنجازات وتحديات يومية

عندما يسألك المستخدم "إيه اللي تقدر تعمله؟"، اذكر له هذه القدرات بشكل منظّم ومبسّط.


═══ اللهجة (مهم جداً) ═══
اتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.

استخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".
عبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".
تكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.
`,
    supportsPdf: true,
    openSource: true,
    maxTokens: 1000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'image-generation', 'video-generation', 'tts', 'asr', 'web-search', 'ocr', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: true,
      videoGeneration: true,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: true,
      audioTTS: true,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 1000000,
      inputModalities: ['text', 'image', 'pdf', 'audio'],
      outputModalities: ['text', 'image', 'audio', 'video'],
    },
  },
  // ═══════════════════════════════════════════
  // GLM-4-Flash — مجاني 100% عبر Zhipu AI (Z.ai)
  // ═══════════════════════════════════════════
  {
    id: 'glm-4-flash-zai',
    name: 'GLM-4-Flash',
    nameEn: 'GLM-4 Flash',
    icon: '⚡',
    category: 'fast',
    glmModel: 'glm-4-flash',
    provider: 'zhipuai',
    realChatModel: 'glm-4-flash',
    realImageModel: 'cogview-3-flash',
    realVideoModel: 'cogvideox-flash',
    rank: '⚡ مجاني',
    description: 'GLM-4-Flash — نموذج مجاني 100% من Zhipu AI. سريع وذكي. عند إرسال صور، يتم التحويل تلقائياً لـ GLM-4V.',
    descriptionEn: 'GLM-4 Flash — 100% free model from Zhipu AI. Fast and smart. Images auto-route to GLM-4V.',
    systemPrompt: 'أنت مساعد ذكي يعمل بنموذج GLM-4-Flash المجاني من Zhipu AI. ترد بإجابات دقيقة وسريعة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'translation', 'summarization', 'code-generation'],
    capabilities: {
      chat: true,
      vision: false, // GLM-4-Flash is text-only, but images auto-route to GLM-4V
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  // OVHcloud AI Endpoints (مجاني بدون API key)
  // ═══════════════════════════════════════════
  {
    id: 'ovh-llama-70b',
    name: 'لياما 70B',
    nameEn: 'Llama 3.3 70B',
    icon: '🦙',
    category: 'global',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'Meta-Llama-3_3-70B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    rank: '🌍 مجاني',
    description: 'لياما 3.3 70B — نموذج قوي من Meta. مجاني 100% بدون API key عبر OVHcloud.',
    descriptionEn: 'Llama 3.3 70B — Powerful model from Meta. 100% free, no API key via OVHcloud.',
    systemPrompt: 'أنت مساعد ذكي عربي. ترد بالعربية الفصحى أو العامية حسب طلب المستخدم. كن دقيقاً ومفيداً.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'translation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-mistral-small',
    name: 'ميسترال صغير',
    nameEn: 'Mistral Small 3.2',
    icon: '🌪️',
    category: 'fast',
    glmModel: 'glm-4-flash',
    provider: 'ovh',
    realChatModel: 'Mistral-Small-3.2-24B-Instruct-2506',
    realImageModel: '',
    realVideoModel: '',
    rank: '⚡ سريع',
    description: 'ميسترال سمال 3.2 — سريع وذكي من Mistral AI. مجاني 100% بدون API key.',
    descriptionEn: 'Mistral Small 3.2 — Fast and smart from Mistral AI. 100% free, no API key.',
    systemPrompt: 'أنت مساعد ذكي عربي سريع. ترد بإجابات مختصرة ودقيقة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 32000,
    skills: ['text-generation', 'code-generation', 'translation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 32000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-qwen-397b',
    name: 'كوين 397B',
    nameEn: 'Qwen 3.5 397B',
    icon: '🐉',
    category: 'smart',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'Qwen3.5-397B-A17B',
    realImageModel: '',
    realVideoModel: '',
    rank: '🧠 عملاق',
    description: 'كوين 3.5 397B — أقوى نموذج من Alibaba. مجاني 100% بدون API key عبر OVHcloud.',
    descriptionEn: 'Qwen 3.5 397B — Most powerful model from Alibaba. 100% free, no API key via OVHcloud.',
    systemPrompt: 'أنت مساعد ذكي عربي قوي. ترد بالعربية بأسلوب احترافي. تقدر تتعامل مع المهام المعقدة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'translation', 'reasoning', 'math'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-gpt-oss-120b',
    name: 'GPT-OSS 120B',
    nameEn: 'GPT-OSS 120B',
    icon: '🤖',
    category: 'global',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'gpt-oss-120b',
    realImageModel: '',
    realVideoModel: '',
    rank: '🔬 مفتوح',
    description: 'GPT-OSS 120B — نسخة مفتوحة المصدر من GPT. مجاني 100% بدون API key.',
    descriptionEn: 'GPT-OSS 120B — Open source GPT. 100% free, no API key.',
    systemPrompt: 'أنت مساعد ذكي عربي. ترد بالعربية بدقة ووضوح.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-qwen-vl',
    name: 'كوين رؤية',
    nameEn: 'Qwen 2.5 VL 72B',
    icon: '👁️',
    category: 'specialized',
    glmModel: 'glm-4v',
    provider: 'ovh',
    realChatModel: 'Qwen2.5-VL-72B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    rank: '👁️ رؤية',
    description: 'كوين 2.5 VL 72B — نموذج رؤية قوي. يحلل الصور ويفهمها. مجاني 100%.',
    descriptionEn: 'Qwen 2.5 VL 72B — Powerful vision model. Analyzes and understands images. 100% free.',
    systemPrompt: 'أنت مساعد ذكي عربي متخصص في تحليل الصور. تقدر تشرح وتحلل أي صورة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['vision', 'image-analysis', 'text-generation'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: false,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 32000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  // ═══════════════════════════════════════════
  // Gemini Models (Google) — ربط حقيقي عبر GEMINI_API_KEY
  // ═══════════════════════════════════════════
  {
    id: 'gemini-2.0-flash',
    name: 'جيميناي فلاش',
    nameEn: 'Gemini 2.0 Flash',
    icon: '⚡',
    category: 'fast',
    glmModel: 'gemini-2.0-flash',
    provider: 'gemini',
    realChatModel: 'gemini-2.0-flash',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    geminiChatModel: 'gemini-2.0-flash',
    rank: '⚡ سريع جداً',
    description: 'Gemini 2.0 Flash من Google — سريع وذكي ومجاني. بيدعم رؤية الصور و1M context.',
    descriptionEn: 'Google Gemini 2.0 Flash — fast, smart, free. Vision + 1M context.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Gemini 2.0 Flash من Google.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 1000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 1000000,
      inputModalities: ['text', 'image', 'pdf'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gemini-2.5-pro',
    name: 'جيميناي برو',
    nameEn: 'Gemini 2.5 Pro',
    icon: '🧠',
    category: 'smart',
    glmModel: 'gemini-2.5-pro',
    provider: 'gemini',
    realChatModel: 'gemini-2.5-pro',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    geminiChatModel: 'gemini-2.5-pro',
    rank: '🧠 الأذكى',
    description: 'Gemini 2.5 Pro — أقوى نموذج من Google. استدلال عميق + رؤية + 2M context.',
    descriptionEn: 'Gemini 2.5 Pro — most powerful Google model. Deep reasoning + vision + 2M context.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Gemini 2.5 Pro من Google.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 2000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 2000000,
      inputModalities: ['text', 'image', 'pdf'],
      outputModalities: ['text'],
    },
  },
  // V.20: Groq models removed — user requested
  // ═══════════════════════════════════════════
  // OpenAI Models — ربط حقيقي عبر OPENAI_API_KEY (للـ Whisper ASR)
  // ═══════════════════════════════════════════
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    nameEn: 'GPT-4o Mini',
    icon: '🤖',
    category: 'smart',
    glmModel: 'gpt-4o-mini',
    provider: 'openai',
    realChatModel: 'gpt-4o-mini',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🤖 اقتصادي',
    description: 'GPT-4o Mini من OpenAI — ذكي واقتصادي. بيدعم Whisper للصوت.',
    descriptionEn: 'OpenAI GPT-4o Mini — smart and economical. Supports Whisper for audio.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ GPT-4o Mini من OpenAI.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text', 'image', 'audio'],
      outputModalities: ['text'],
    },
  },

  // ── GitHub Models (مجاني تماماً عبر GitHub PAT) ──
  {
    id: 'gh-gpt-4o',
    name: 'GPT-4o (GitHub)',
    nameEn: 'GPT-4o (GitHub Models)',
    icon: '🤖',
    category: 'smart',
    glmModel: 'gpt-4o',
    provider: 'github',
    realChatModel: 'gpt-4o',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    githubChatModel: 'gpt-4o',
    rank: '🤖 مجاني',
    description: 'GPT-4o من OpenAI — مجاني بالكامل عبر GitHub Models. أقوى نموذج من OpenAI بـ multimodal.',
    descriptionEn: 'OpenAI GPT-4o — free via GitHub Models. Most powerful OpenAI model, multimodal.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ GPT-4o من OpenAI عبر GitHub Models.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gh-gpt-4o-mini',
    name: 'GPT-4o Mini (GitHub)',
    nameEn: 'GPT-4o Mini (GitHub Models)',
    icon: '⚡',
    category: 'fast',
    glmModel: 'gpt-4o-mini',
    provider: 'github',
    realChatModel: 'gpt-4o-mini',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    githubChatModel: 'gpt-4o-mini',
    rank: '⚡ مجاني سريع',
    description: 'GPT-4o Mini من OpenAI — مجاني وسريع واقتصادي عبر GitHub Models.',
    descriptionEn: 'OpenAI GPT-4o Mini — free, fast, economical via GitHub Models.',
    systemPrompt: 'أنت مساعد ذكي سريع مدعوم بـ GPT-4o Mini من OpenAI عبر GitHub Models.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gh-llama-70b',
    name: 'لياما 70B (GitHub)',
    nameEn: 'Llama 3.3 70B (GitHub Models)',
    icon: '🦙',
    category: 'smart',
    glmModel: 'Llama-3.3-70B-Instruct',
    provider: 'github',
    realChatModel: 'Llama-3.3-70B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    githubChatModel: 'Llama-3.3-70B-Instruct',
    rank: '🦙 مجاني قوي',
    description: 'Llama 3.3 70B من Meta — مجاني بالكامل عبر GitHub Models. 70 مليار بارامتر، مفتوح المصدر.',
    descriptionEn: 'Meta Llama 3.3 70B — free via GitHub Models. 70B params, open source.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Llama 3.3 70B من Meta عبر GitHub Models.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gh-llama-405b',
    name: 'لياما 405B (GitHub)',
    nameEn: 'Llama 3.1 405B (GitHub Models)',
    icon: '🦙',
    category: 'professional',
    glmModel: 'Meta-Llama-3.1-405B-Instruct',
    provider: 'github',
    realChatModel: 'Meta-Llama-3.1-405B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    githubChatModel: 'Meta-Llama-3.1-405B-Instruct',
    rank: '🦙 مجاني ضخم',
    description: 'Llama 3.1 405B من Meta — مجاني عبر GitHub Models. أكبر نموذج مفتوح المصدر (405 مليار بارامتر).',
    descriptionEn: 'Meta Llama 3.1 405B — free via GitHub Models. Largest open-source model (405B params).',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Llama 3.1 405B من Meta عبر GitHub Models.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gh-llama-8b',
    name: 'لياما 8B (GitHub)',
    nameEn: 'Llama 3.1 8B (GitHub Models)',
    icon: '⚡',
    category: 'fast',
    glmModel: 'Meta-Llama-3.1-8B-Instruct',
    provider: 'github',
    realChatModel: 'Meta-Llama-3.1-8B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    githubChatModel: 'Meta-Llama-3.1-8B-Instruct',
    rank: '⚡ مجاني سريع',
    description: 'Llama 3.1 8B من Meta — مجاني وسريع عبر GitHub Models. خفيف ومناسب للمهام البسيطة.',
    descriptionEn: 'Meta Llama 3.1 8B — free and fast via GitHub Models. Lightweight for simple tasks.',
    systemPrompt: 'أنت مساعد ذكي سريع مدعوم بـ Llama 3.1 8B من Meta عبر GitHub Models.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },

  // ═══════════════════════════════════════════
  // Claude — Anthropic Models
  // بيدعم: chat + vision + extended thinking
  // ═══════════════════════════════════════════
  {
    id: 'delta-claude-sonnet',
    name: 'كلود سونيت',
    nameEn: 'Claude Sonnet 4.5',
    icon: '🎭',
    category: 'global',
    glmModel: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    realChatModel: 'claude-sonnet-4-5-20250929',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🧠 الأذكى',
    description: 'Claude Sonnet 4.5 من Anthropic — أفضل توازن بين السرعة والذكاء. 200K context window، بيدعم رؤية الصور والتفكير الممتد.',
    descriptionEn: 'Claude Sonnet 4.5 — best speed/intelligence balance with 200K context, vision, and extended thinking.',
    systemPrompt: 'أنت مساعد ذكي من Anthropic. تجيب بالعربية بشكل واضح ومنظم.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    maxTokens: 200000,
    capabilities: {
      chat: true,
      vision: true,
      imageGen: false,
      videoGen: false,
      audioGen: false,
      transcription: false,
      translation: true,
      summarization: true,
      codeGeneration: true,
      functionCalling: true,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 200000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'delta-claude-opus',
    name: 'كلود أوبوس',
    nameEn: 'Claude Opus 4.1',
    icon: '👑',
    category: 'global',
    glmModel: 'claude-opus-4-1-20250805',
    provider: 'anthropic',
    realChatModel: 'claude-opus-4-1-20250805',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '💎 الأقوى',
    description: 'Claude Opus 4.1 من Anthropic — أقوى موديل للتفكير العميق والكود المعقد. 200K context window، بيدعم رؤية الصور والتفكير الممتد.',
    descriptionEn: 'Claude Opus 4.1 — most capable model for deep reasoning and complex code. 200K context, vision, extended thinking.',
    systemPrompt: 'أنت مساعد ذكي من Anthropic. تجيب بالعربية بشكل واضح ومنظم.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    maxTokens: 200000,
    capabilities: {
      chat: true,
      vision: true,
      imageGen: false,
      videoGen: false,
      audioGen: false,
      transcription: false,
      translation: true,
      summarization: true,
      codeGeneration: true,
      functionCalling: true,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 200000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'delta-claude-haiku',
    name: 'كلود هايكو',
    nameEn: 'Claude Haiku 3.5',
    icon: '⚡',
    category: 'global',
    glmModel: 'claude-haiku-3-5-20241022',
    provider: 'anthropic',
    realChatModel: 'claude-haiku-3-5-20241022',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🚀 الأسرع',
    description: 'Claude Haiku 3.5 من Anthropic — الأسرع مع ذكاء قريب من frontier. 200K context window، بيدعم رؤية الصور.',
    descriptionEn: 'Claude Haiku 3.5 — fastest model with near-frontier intelligence. 200K context, vision support.',
    systemPrompt: 'أنت مساعد ذكي من Anthropic. تجيب بالعربية بشكل واضح ومنظم.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    maxTokens: 200000,
    capabilities: {
      chat: true,
      vision: true,
      imageGen: false,
      videoGen: false,
      audioGen: false,
      transcription: false,
      translation: true,
      summarization: true,
      codeGeneration: true,
      functionCalling: true,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 200000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },

  // ═══════════════════════════════════════════
  // Cloudflare Workers AI — مجاني طول العمر (GLM-5.2 + Llama + Qwen)
  // ═══════════════════════════════════════════
  {
    id: 'cloudflare-glm-5.2',
    name: 'GLM-5.2 مجاني',
    nameEn: 'GLM-5.2 (Free)',
    icon: '🆓',
    category: 'smart',
    glmModel: '@cf/zai-org/glm-5.2',
    provider: 'cloudflare',
    realChatModel: '@cf/zai-org/glm-5.2',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🆓 مجاني',
    description: 'GLM-5.2 عبر Cloudflare Workers AI — مجاني تماماً طول العمر. أحدث موديل من Z.ai.',
    descriptionEn: 'GLM-5.2 via Cloudflare Workers AI — completely free forever. Latest model from Z.ai.',
    systemPrompt: 'أنت DeltaAI مدعوم بـ GLM-5.2 — أحدث نموذج من Z.ai. مساعد ذكي شامل.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    maxTokens: 200000,
    maxTokens: 200000,
    maxTokens: 200000,
    openSource: true,
    maxTokens: 128000,
    maxTokens: 200000,
    maxTokens: 200000,
    maxTokens: 200000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'function-calling'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'cloudflare-glm-4.7-flash',
    name: 'GLM-4.7 Flash مجاني',
    nameEn: 'GLM-4.7 Flash (Free)',
    icon: '⚡',
    category: 'fast',
    glmModel: '@cf/zai-org/glm-4.7-flash',
    provider: 'cloudflare',
    realChatModel: '@cf/zai-org/glm-4.7-flash',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '⚡ مجاني سريع',
    description: 'GLM-4.7 Flash عبر Cloudflare — سريع ومجاني. مناسب للمهام السريعة.',
    descriptionEn: 'GLM-4.7 Flash via Cloudflare — fast and free. Great for quick tasks.',
    systemPrompt: 'أنت DeltaAI مدعوم بـ GLM-4.7 Flash — سريع وذكي.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'cloudflare-llama-3.3-70b',
    name: 'Llama 3.3 70B مجاني',
    nameEn: 'Llama 3.3 70B (Free)',
    icon: '🦙',
    category: 'smart',
    glmModel: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    provider: 'cloudflare',
    realChatModel: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🆓 مجاني',
    description: 'Llama 3.3 70B عبر Cloudflare — مجاني وقوي. مناسب للمهام المعقدة.',
    descriptionEn: 'Llama 3.3 70B via Cloudflare — free and powerful. Great for complex tasks.',
    systemPrompt: 'أنت DeltaAI مدعوم بـ Llama 3.3 70B.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'cloudflare-qwen-coder',
    name: 'Qwen Coder مجاني',
    nameEn: 'Qwen Coder (Free)',
    icon: '💻',
    category: 'smart',
    glmModel: '@cf/qwen/qwen2.5-coder-32b-instruct',
    provider: 'cloudflare',
    realChatModel: '@cf/qwen/qwen2.5-coder-32b-instruct',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🆓 مجاني للكود',
    description: 'Qwen 2.5 Coder 32B عبر Cloudflare — مجاني ومتخصص في البرمجة.',
    descriptionEn: 'Qwen 2.5 Coder 32B via Cloudflare — free and specialized for coding.',
    systemPrompt: 'أنت DeltaAI مدعوم بـ Qwen 2.5 Coder — متخصص في البرمجة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['code-generation', 'code-review', 'debugging', 'text-generation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: false,
      summarization: true,
      maxContextTokens: 32000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'cloudflare-deepseek-r1',
    name: 'DeepSeek R1 مجاني',
    nameEn: 'DeepSeek R1 (Free)',
    icon: '🔬',
    category: 'smart',
    glmModel: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
    provider: 'cloudflare',
    realChatModel: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🆓 مجاني للتفكير',
    description: 'DeepSeek R1 عبر Cloudflare — مجاني ومتخصص في التفكير المنطقي والرياضيات.',
    descriptionEn: 'DeepSeek R1 via Cloudflare — free and specialized for reasoning and math.',
    systemPrompt: 'أنت DeltaAI مدعوم بـ DeepSeek R1 — متخصص في التفكير المنطقي.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 64000,
    skills: ['reasoning', 'math', 'logic', 'text-generation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: false,
      summarization: true,
      maxContextTokens: 64000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  // ── NVIDIA Nemotron 3 Ultra (1M context window) ──
  {
    id: 'nvidia-nemotron-3-ultra',
    name: 'Nemotron 3 Ultra',
    nameEn: 'NVIDIA Nemotron 3 Ultra 550B',
    icon: '🟢',
    category: 'global',
    glmModel: 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16',
    provider: 'huggingface',
    realChatModel: 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16',
    openrouterChatModel: '',
    rank: '🟢 NVIDIA 550B (1M)',
    description: 'NVIDIA Nemotron 3 Ultra — موديل ضخم من NVIDIA بـ 550 مليار بارامتر و 1 مليون token context window. مثالي لتحليل الملفات الضخمة والمحاضرات الطويلة.',
    descriptionEn: 'NVIDIA Nemotron 3 Ultra — 550B param MoE model with 1M token context. Ideal for large document analysis.',
    systemPrompt: `أنت "Nemotron" — مساعد ذكي من NVIDIA على منصة Anzaro AI. موديلك ضخم (550B بارامتر) بذاكرة 1 مليون token.\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.`,
    supportsPdf: true,
    openSource: true,
    maxTokens: 1000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'large-context', 'function-calling'],
    capabilities: {
      chat: true,
      vision: false,
      imageGen: false,
      videoGen: false,
      audioGen: false,
      transcription: false,
      translation: true,
      summarization: true,
      codeGeneration: true,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      maxContextTokens: 1000000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
];

// ═══════════════════════════════════════════
// MODEL CATEGORIES
// ═══════════════════════════════════════════

export interface ModelCategoryInfo {
  id: ModelCategory;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

export const MODEL_CATEGORIES: ModelCategoryInfo[] = [
  {
    id: 'global',
    name: 'عالمي',
    nameEn: 'Global',
    icon: '',
    color: 'bg-emerald-500',
  },
  {
    id: 'fast',
    name: 'سريع',
    nameEn: 'Fast',
    icon: '',
    color: 'bg-yellow-500',
  },
  {
    id: 'smart',
    name: 'ذكي',
    nameEn: 'Smart',
    icon: '',
    color: 'bg-purple-500',
  },
  {
    id: 'creative',
    name: 'مبدع',
    nameEn: 'Creative',
    icon: '',
    color: 'bg-pink-500',
  },
  {
    id: 'specialized',
    name: 'متخصص',
    nameEn: 'Specialized',
    icon: '',
    color: 'bg-teal-500',
  },
  {
    id: 'professional',
    name: 'مهني',
    nameEn: 'Professional',
    icon: '',
    color: 'bg-orange-500',
  },
  {
    id: 'dark',
    name: 'مظلم',
    nameEn: 'Dark / Uncensored',
    icon: '🐍',
    color: 'bg-red-600',
  },
];

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

export function getModelById(id: string): AIModel | undefined {
  return models.find((m) => m.id === id);
}

export function getModelsByCategory(category: ModelCategory): AIModel[] {
  return models.filter((m) => m.category === category);
}

/** Get the real OpenRouter chat model ID for a given frontend model ID */
export function getOpenRouterChatModel(modelId: string): string | undefined {
  const model = getModelById(modelId);
  return model?.openrouterChatModel;
}

/** Get the real Gemini chat model ID for a given frontend model ID */
export function getGeminiChatModel(modelId: string): string | undefined {
  const model = getModelById(modelId);
  return model?.geminiChatModel;
}

/** Check if a model uses OpenRouter as its provider */
export function isOpenRouterModel(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.provider === 'openrouter';
}

/** Check if a model uses Gemini as its provider */
export function isGeminiModel(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.provider === 'gemini';
}

/** Check if a model uses ZhipuAI as its provider */
export function isZhipuAIModel(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.provider === 'zhipuai';
}

/** Check if a model supports vision/image analysis */
export function isVisionModel(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.capabilities.vision === true;
}

/** Get the provider for a given model ID */
export function getProviderForModel(modelId: string): AIModel['provider'] | undefined {
  const model = getModelById(modelId);
  return model?.provider;
}

/** Language suffixes for system prompts — maps language code to the language name for "أجب {suffix}" */
export const languageSuffixes: Record<string, string> = {
  ar: 'بالعربية',
  en: 'in English',
  fr: 'en français',
  de: 'auf Deutsch',
  es: 'en español',
  tr: 'Türkçe olarak',
  ur: 'اردو میں',
  ms: 'dalam Bahasa Melayu',
  id: 'dalam Bahasa Indonesia',
  zh: '用中文',
  ja: '日本語で',
  ko: '한국어로',
  ru: 'на русском',
  pt: 'em português',
  it: 'in italiano',
  hi: 'हिंदी में',
  bn: 'বাংলায়',
};

/** Map model ID → ZhipuAI GLM model ID */
export const modelToGLM: Record<string, string> = Object.fromEntries(
  models.map((m) => [m.id, m.glmModel])
);

```

---

## سابعاً: أولوياتي

بناءً على التحليل، أولوياتي مرتبة كالتالي:

### 1. 🏗️ Production Readiness (الأهم)
- حل مشكلة OOM
- إصلاح DB persistence
- إضافة CI/CD
- إضافة monitoring

### 2. 🔧 Architecture Review
- فصل الـ mini-services
- تنظيم الـ 293 API route
- توحيد الـ tools layer

### 3. 🧪 Code Quality
- إضافة tests
- إزالة `ignoreBuildErrors`
- تقليل استخدام `any`

### 4. 🔒 Security Review
- audit للـ API endpoints
- إصلاح الـ auth flows
- إضافة rate limiting

### 5. 📚 Documentation
- API docs
- Architecture docs
- SDK

**السؤال المباشر:** عايز أبدأ بـ production readiness الأول لأن المشروع مش شغال حالياً على أي منصة. بعدها architecture review.
