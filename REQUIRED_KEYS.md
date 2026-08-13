# 🔑 المفاتيح المطلوبة لتشغيل المنصة بالكامل

## 🎯 أولوية قصوى (لازم للعمل)

### 1. مفاتيح الذكاء الاصطناعي (AI Models)
> اختار واحد على الأقل عشان المنصة ترد على الرسايل

| المفتاح | من فين | الاستخدام | مجاني؟ |
|---------|--------|----------|--------|
| `ZAI_API_KEY` | Z.ai Platform | الموديلات الأساسية (عبس، GLM) | ✅ مجاني |
| `OPENAI_API_KEY` | platform.openai.com | GPT-4o, GPT-4o Mini | ❌ مدفوع |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Claude Sonnet/Opus/Haiku | ❌ مدفوع |
| `OPENROUTER_API_KEY` | openrouter.ai | وصول لكل الموديلات | ✅ مجاني (بعضها) |
| `GOOGLE_API_KEY` | ai.google.dev | Gemini 2.0/2.5 | ✅ مجاني |

### 2. مفاتيح المصادقة (Auth)
| المفتاح | القيمة | ملاحظة |
|---------|--------|--------|
| `SESSION_SECRET` | (عشوائي 64 حرف) | مولّد تلقائياً |
| `NEXTAUTH_SECRET` | (عشوائي 64 حرف) | مولّد تلقائياً |
| `NEXTAUTH_URL` | `https://anov.ddns.net` | الدومين بتاعك |
| `GOOGLE_CLIENT_ID` | console.cloud.google.com | لتسجيل الدخول بـ Google |
| `GOOGLE_CLIENT_SECRET` | console.cloud.google.com | لتسجيل الدخول بـ Google |

### 3. مفاتيح الإدارة
| المفتاح | القيمة | ملاحظة |
|---------|--------|--------|
| `ADMIN_EMAIL` | admin@anzaro.local | إيميل الأدمن |
| `ADMIN_PASSWORD` | (كلمة سر قوية) | كلمة سر الأدمن |

---

## 🌐 أولوية عالية (مهمة للميزات)

### 4. مفاتيح الويب والبحث
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `TAVILY_API_KEY` | tavily.com | بحث ويب سريع ومجاني |
| `BRAVE_API_KEY` | brave.com/search/api | بحث بديل |
| `SERPAPI_KEY` | serpapi.com | بحث Google |

### 5. مفاتيح الصوت (TTS/STT)
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `ELEVENLABS_API_KEY` | elevenlabs.io | أصوات احترافية |
| `AZURE_SPEECH_KEY` | azure.microsoft.com | Speech to Text |
| `AZURE_SPEECH_REGION` | eastus | منطقة Azure |

### 6. مفاتيح الصور
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `FAL_API_KEY` | fal.ai | توليد صور |
| `REPLICATE_API_TOKEN` | replicate.com | Stable Diffusion |
| `POLLINATIONS_API_KEY` | pollinations.ai | صور مجانية |

---

## 🔧 أولوية متوسطة (تكاملات)

### 7. مفاتيح الرسائل
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `TELEGRAM_BOT_TOKEN` | @BotFather | بوت تيليجرام |
| `DISCORD_BOT_TOKEN` | discord.com/developers | بوت ديسكورد |
| `SLACK_BOT_TOKEN` | api.slack.com | بوت سلاك |
| `SMTP_HOST` | smtp.gmail.com | إرسال إيميل |
| `SMTP_PORT` | 587 | منفذ SMTP |
| `SMTP_USER` | your@gmail.com | إيميل المرسل |
| `SMTP_PASS` | (app password) | كلمة سر التطبيق |

### 8. مفاتيح التخزين
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `HF_TOKEN` | huggingface.co | رفع/تحميل من HF |
| `HF_DATASET_REPO` | username/repo-name | repo الـ DB |
| `CLOUDFLARE_ACCOUNT_ID` | dash.cloudflare.com | R2 Storage |
| `CLOUDFLARE_R2_TOKEN` | dash.cloudflare.com | R2 Storage |

### 9. مفاتيح قواعد البيانات
| المفتاح | القيمة | ملاحظة |
|---------|--------|--------|
| `DATABASE_URL` | file:/app/data/custom.db | SQLite الحالي |
| `REDIS_URL` | redis://localhost:6379 | للـ caching (اختياري) |

---

## 🚀 أولوية منخفضة (ميزات إضافية)

### 10. مفاتيح تحليلات
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `SENTRY_DSN` | sentry.io | تتبع الأخطاء |
| `POSTHOG_KEY` | posthog.com | تحليلات المستخدمين |
| `GOOGLE_ANALYTICS_ID` | analytics.google.com | إحصائيات |

### 11. مفاتيح أتمتة
| المفتاح | من فين | الاستخدام |
|---------|--------|----------|
| `N8N_WEBHOOK_URL` | n8n.io | أتمتة الـ workflows |
| `ZAPIER_WEBHOOK_URL` | zapier.com | تكاملات Zapier |
| `MAKE_API_KEY` | make.com | أتمتة Make.com |

---

## 📋 قائمة المفاتيح الأساسية فقط (للبدء السريع)

لو عايز تبدأ بأقل عدد ممكن من المفاتيح، املأ دي بس:

```env
# AI (واحد على الأقل)
ZAI_API_KEY=your_key_here

# Auth
SESSION_SECRET=auto_generated
NEXTAUTH_SECRET=auto_generated
NEXTAUTH_URL=https://anov.ddns.net

# Admin
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456

# Database
DATABASE_URL=file:/app/data/custom.db

# Domain
GOOGLE_SITE_VERIFICATION=google-site-verification=your_code_here
```

---

## 🔗 روابط التسجيل السريعة:

| الخدمة | الرابط | مجاني؟ |
|--------|--------|--------|
| Z.ai | https://z.ai | ✅ |
| OpenRouter | https://openrouter.ai | ✅ |
| Google AI | https://ai.google.dev | ✅ |
| HuggingFace | https://huggingface.co | ✅ |
| Tavily Search | https://tavily.com | ✅ (1000/mo) |
| ElevenLabs | https://elevenlabs.io | ✅ (10K chars/mo) |
| Telegram Bot | https://t.me/BotFather | ✅ |
| DuckDNS/No-IP | https://no-ip.com | ✅ |
| Sentry | https://sentry.io | ✅ (5K errors/mo) |
