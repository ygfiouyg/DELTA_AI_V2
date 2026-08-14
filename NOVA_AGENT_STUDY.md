# 📊 دراسة Hermes Agent (Nova Agent) — المعمارية والـ API

> **الهدف:** دراسة عمارة Hermes عشان نبني واجهة Anova Agent احترافية للمستخدم العادي.

## 1. العمارة التقنية (Tech Stack)

- **Backend:** Python (aiohttp server)
- **Frontend:** React 19 + Vite + TypeScript
- **State Management:** Nanostores + TanStack Query
- **UI Library:** Radix UI + Tailwind CSS 4
- **Markdown:** Streamdown + Shiki (syntax highlighting)
- **Terminal:** xterm.js
- **Audio:** @audiowave/react (للتسجيلات الصوتية)

## 2. الـ API Endpoints المتاحة (الخاصة بالـ Chat)

| Method | Endpoint | الوظيفة |
|--------|----------|---------|
| POST | `/v1/chat/completions` | إرسال رسالة (OpenAI format) |
| POST | `/v1/responses` | إرسال رسالة (Responses API) |
| POST | `/api/sessions/{id}/chat` | محادثة عادية |
| POST | `/api/sessions/{id}/chat/stream` | محادثة SSE (Streaming) |
| GET | `/api/sessions` | عرض كل الجلسات |
| POST | `/api/sessions` | إنشاء جلسة جديدة |
| GET | `/v1/models` | عرض الموديلات المتاحة |
| GET | `/v1/skills` | عرض المهارات |
| GET | `/v1/toolsets` | عرض الأدوات |

## 3. خطة بناء "Anova Agent" UI

بدل ما نستخدم الـ TUI (Terminal UI) بتاع Hermes، هنبني واجهة Next.js احترافية بتتكلم مع الـ API بتاع Hermes.

### المميزات اللي هتكون في الواجهة:
1. **Chat بسيط وواضح** (مش terminal) — فيه bubbles للمستخدم والـ AI.
2. **Sidebar للإعدادات** (مش options معقدة):
   - اختيار الموديل (GLM, OpenRouter, إلخ).
   - تفعيل/إلغاء الأدوات (Web Search, Terminal, إلخ).
   - اختيار صوت الـ TTS.
3. **تسجيل دخول سهل** (Google / Guest) بدل username/password.
4. **دعم RTL كامل** (عربي).
5. **رفع ملفات** (صور، PDFs) وتحويلها لـ base64 للـ API.
6. **إخفاء الـ Terminal** تماماً عن المستخدم العادي.

### الـ Flow التقني:
```
[Next.js UI (Anova)] → [Hermes API (/v1/chat/completions)] → [AI Provider]
```

