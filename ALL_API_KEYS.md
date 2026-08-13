# 🔑 الملف الشامل لكل مفاتيح الـ API في المنصة

> ده كل مفتاح موجود في الكود (أكثر من 150 مفتاح)
> مش لازم تملأهم كلهم، بس اللي تحتاجه من ميزات

---

## 🎯 المفاتيح الأساسية (لازم للعمل)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `ZAI_API_KEY` | الموديلات الأساسية (GLM) | https://z.ai | ✅ |
| `NEXTAUTH_URL` | الدومين | `https://anov.ddns.net` | - |
| `NEXTAUTH_SECRET` | تشفير الجلسات | (مولد تلقائياً) | - |
| `SESSION_SECRET` | تشفير الجلسات | (مولد تلقائياً) | - |
| `DATABASE_URL` | قاعدة البيانات | `file:/app/data/custom.db` | - |
| `ADMIN_EMAIL` | إيميل الأدمن | `admin@anzaro.local` | - |
| `ADMIN_PASSWORD` | باسوورد الأدمن | (كلمة سر قوية) | - |

---

## 🤖 مفاتيح نماذج الذكاء الاصطناعي (AI Models)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `ZAI_API_KEY` | Z.ai (GLM-5, GLM-4) | https://z.ai | ✅ |
| `ZHIPUAI_API_KEY` | Zhipu AI (بديل) | https://open.bigmodel.cn | ✅ |
| `ZHIPU_API_KEY` | Zhipu (بديل) | https://open.bigmodel.cn | ✅ |
| `OPENAI_API_KEY` | GPT-4o, GPT-4o Mini | https://platform.openai.com | ❌ |
| `ANTHROPIC_API_KEY` | Claude Sonnet/Opus | https://console.anthropic.com | ❌ |
| `OPENROUTER_API_KEY` | وصول لكل الموديلات | https://openrouter.ai/keys | ✅ |
| `GOOGLE_API_KEY` | Gemini 2.0/2.5 | https://ai.google.dev | ✅ |
| `GEMINI_API_KEY` | Gemini (بديل) | https://ai.google.dev | ✅ |
| `GROQ_API_KEY` | Llama 3.3 (سريع) | https://console.groq.com | ✅ |
| `TOGETHER_API_KEY` | Llama, Mistral | https://api.together.xyz | ✅ ($5 مجاني) |
| `DEEPINFRA_API_KEY` | Llama 70B | https://deepinfra.com | ✅ |
| `CEREBRAS_API_KEY` | Llama (سريع جداً) | https://cerebras.ai | ✅ |
| `HF_TOKEN` | HuggingFace | https://huggingface.co | ✅ |
| `HUGGINGFACE_API_KEY` | HuggingFace (بديل) | https://huggingface.co | ✅ |
| `HF_API_TOKEN` | HuggingFace (بديل) | https://huggingface.co | ✅ |
| `GITHUB_MODELS_TOKEN` | GitHub Models | https://github.com/marketplace/models | ✅ |
| `GITHUB_TOKEN` | GitHub API | https://github.com/settings/tokens | ✅ |
| `GITHUB_PAT` | GitHub PAT | https://github.com/settings/tokens | ✅ |
| `OVH_AI_TOKEN` | OVHcloud AI | https://endpoints.ai.cloud.ovh.net | ✅ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Workers AI | https://dash.cloudflare.com | ✅ |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API | https://dash.cloudflare.com | ✅ |

---

## 🔍 مفاتيح البحث والويب (Web & Search)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `TAVILY_API_KEY` | بحث ويب سريع | https://tavily.com | ✅ (1000/شهر) |
| `BRAVE_API_KEY` | بحث بديل | https://brave.com/search/api | ✅ (2000/شهر) |
| `YOUTUBE_API_KEY` | YouTube Data API | https://console.cloud.google.com | ✅ |
| `GNEWS_API_KEY` | أخبار | https://gnews.io | ✅ |
| `SERPAPI_KEY` | بحث Google | https://serpapi.com | ✅ (100/شهر) |
| `OMDB_API_KEY` | أفلام | https://www.omdbapi.com | ✅ |
| `TMDB_API_KEY` | أفلام ومسلسلات | https://www.themoviedb.org | ✅ |

---

## 🎨 مفاتيح الصور والفيديو (Media)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `FAL_API_KEY` | FLUX (توليد صور) | https://fal.ai | ✅ ($1 مجاني) |
| `REPLICATE_API_TOKEN` | Stable Diffusion | https://replicate.com | ❌ |
| `CF_API_TOKEN` | Cloudflare Images | https://dash.cloudflare.com | ✅ |

---

## 🔊 مفاتيح الصوت (Audio)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `ELEVENLABS_API_KEY` | أصوات احترافية | https://elevenlabs.io | ✅ (10K/شهر) |
| `AZURE_SPEECH_KEY` | Speech to Text | https://azure.microsoft.com | ❌ |

---

## 📧 مفاتيح الإيميل (Email)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `SMTP_HOST` | خادم الإيميل | `smtp.gmail.com` | - |
| `SMTP_PORT` | المنفذ | `587` | - |
| `SMTP_USER` | إيميل المرسل | your@gmail.com | - |
| `SMTP_PASS` | كلمة سر التطبيق | https://myaccount.google.com/apppasswords | - |
| `SMTP_FROM` | اسم المرسل | `Anzaro AI` | - |
| `SENDER_EMAIL` | إيميل المرسل | your@gmail.com | - |
| `EMAIL_PASS` | كلمة سر الإيميل | (app password) | - |
| `RESEND_API_KEY` | Resend Email | https://resend.com | ✅ (3000/شهر) |
| `RESEND_FROM_EMAIL` | Resend From | `onboarding@resend.dev` | - |
| `BREVO_API_KEY` | Brevo Email | https://www.brevo.com | ✅ (300/يوم) |
| `BREVO_SENDER_EMAIL` | Brevo Sender | your@email.com | - |
| `BREVO_SENDER_NAME` | Brevo Name | `Anzaro AI` | - |

---

## 📱 مفاتيح التكاملات (Integrations - OAuth)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `GOOGLE_CLIENT_ID` | Google Login | https://console.cloud.google.com | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google Login | https://console.cloud.google.com | ✅ |
| `SPOTIFY_CLIENT_ID` | Spotify | https://developer.spotify.com | ✅ |
| `SPOTIFY_CLIENT_SECRET` | Spotify | https://developer.spotify.com | ✅ |
| `DISCORD_CLIENT_ID` | Discord | https://discord.com/developers | ✅ |
| `DISCORD_CLIENT_SECRET` | Discord | https://discord.com/developers | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram | https://t.me/BotFather | ✅ |
| `TELEGRAM_CHAT_ID` | Telegram Chat | https://t.me/userinfobot | - |
| `SLACK_CLIENT_ID` | Slack | https://api.slack.com | ✅ |
| `SLACK_CLIENT_SECRET` | Slack | https://api.slack.com | ✅ |
| `SLACK_WEBHOOK_URL` | Slack Webhook | https://api.slack.com | ✅ |
| `GITHUB_CLIENT_ID` | GitHub Login | https://github.com/settings/developers | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub Login | https://github.com/settings/developers | ✅ |
| `GITLAB_CLIENT_ID` | GitLab Login | https://gitlab.com | ✅ |
| `GITLAB_CLIENT_SECRET` | GitLab Login | https://gitlab.com | ✅ |
| `FACEBOOK_CLIENT_ID` | Facebook Login | https://developers.facebook.com | ✅ |
| `FACEBOOK_CLIENT_SECRET` | Facebook Login | https://developers.facebook.com | ✅ |
| `INSTAGRAM_CLIENT_ID` | Instagram | https://developers.facebook.com | ✅ |
| `INSTAGRAM_CLIENT_SECRET` | Instagram | https://developers.facebook.com | ✅ |
| `WHATSAPP_TOKEN` | WhatsApp API | https://developers.facebook.com | ❌ |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp | https://developers.facebook.com | ❌ |
| `WHATSAPP_VERIFY_TOKEN` | WhatsApp | (مخصص) | - |
| `WHATSAPP_APP_SECRET` | WhatsApp | https://developers.facebook.com | - |
| `NOTION_API_KEY` | Notion | https://www.notion.so/my-integrations | ✅ |
| `NOTION_CLIENT_ID` | Notion Login | https://www.notion.so | ✅ |
| `NOTION_CLIENT_SECRET` | Notion Login | https://www.notion.so | ✅ |

---

## 🏠 مفاتيح المنزل الذكي (Home Automation)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `HASS_URL` | Home Assistant | `http://homeassistant.local:8123` | - |
| `HASS_TOKEN` | Home Assistant | (من HA settings) | - |
| `HOME_ASSISTANT_URL` | Home Assistant (بديل) | `http://homeassistant.local:8123` | - |
| `HOME_ASSISTANT_TOKEN` | Home Assistant (بديل) | (من HA settings) | - |

---

## 💾 مفاتيح التخزين (Storage)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `HF_TOKEN` | HuggingFace | https://huggingface.co | ✅ |
| `HF_REPO_ID` | HF Repo | `username/repo` | - |
| `CF_ACCOUNT_ID` | Cloudflare R2 | https://dash.cloudflare.com | ✅ (10GB) |
| `CF_API_TOKEN` | Cloudflare R2 | https://dash.cloudflare.com | ✅ |
| `SUPABASE_URL` | Supabase DB | https://supabase.com | ✅ |
| `SUPABASE_SECRET_KEY` | Supabase | https://supabase.com | ✅ |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase | https://supabase.com | ✅ |
| `PINECONE_API_KEY` | Pinecone Vector | https://www.pinecone.io | ✅ |
| `PINECONE_INDEX_URL` | Pinecone | https://www.pinecone.io | ✅ |

---

## 📊 مفاتيح تحليلات (Analytics)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `SENTRY_DSN` | تتبع الأخطاء | https://sentry.io | ✅ (5K/شهر) |

---

## 💰 مفاتيح إضافية (Misc)

| المفتاح | الوظيفة | الرابط | مجاني؟ |
|---------|---------|--------|--------|
| `FIXER_API_KEY` | أسعار العملات | https://fixer.io | ✅ (100/شهر) |
| `OPENEXCHANGERATES_APP_ID` | أسعار الصرف | https://openexchangerates.org | ✅ |
| `CAT_API_KEY` | صور قطط | https://thecatapi.com | ✅ |
| `CARBON_INTERFACE_API_KEY` | بصمة كربونية | https://www.carboninterface.com | ✅ |
| `AGIFY_API_KEY` | تقدير العمر | https://agify.io | ✅ |
| `GENDERIZE_API_KEY` | تقدير الجنس | https://genderize.io | ✅ |

---

## 📝 ملاحظات

1. **الحد الأدنى للعمل:** بس `ZAI_API_KEY` + `NEXTAUTH_URL`
2. **للبدء السريع:** `ZAI_API_KEY` + `OPENROUTER_API_KEY` + `GOOGLE_API_KEY`
3. **كل المفاتيح المجانية** مش هتكلفك شيئاً
4. **المفاتيح المدفوعة** مش ضرورية للعمل الأساسي

