# 📋 خطة التنفيذ التنفيذية — DELTA_AI_V2

> **تاريخ الإعداد:** 2026-08-04  
> **المُعد:** Z.ai Code (بناءً على طلب أ. عبدالسلام)  
> **الهدف:** خطة تنفيذية واضحة لتحويل DELTA_AI_V2 من prototype إلى production-ready

---

## 🎯 المرحلة 0: ما قبل التنفيذ (Pre-Flight Checks)

قبل البدء في أي تنفيذ، يجب التأكد من الآتي:

### 0.1 مراجعة البيئة الحالية
- [ ] التأكد من تثبيت Node.js 20+ و Bun
- [ ] التأكد من تثبيت Python 3.11+ مع pip
- [ ] التأكد من تثبيت Docker و Docker Compose
- [ ] التأكد من وجود نسخة احتياطية كاملة من الـ DB (304MB)
- [ ] التأكد من وجود `.env` file بمفاتيح API الصحيحة

### 0.2 تحديد الأولويات
بناءً على التحليل، الترتيب الصحيح للأولويات هو:
1. **P0 (Critical):** الاستقرار + الأمان + الـ Deployment
2. **P1 (High):** الـ Testing + الـ Refactoring الأساسي
3. **P2 (Medium):** التحسينات + الـ Documentation
4. **P3 (Low):** الـ Features الجديدة + التوسعات

---

## 🚨 المرحلة 1: إصلاحات حرجة (P0 — Critical)

> **الهدف:** جعل المنصة مستقرة وقابلة للتشغيل بدون crashes  
> **المدة المقدرة:** 3-5 أيام  
> **الجهد:** ~40 ساعة

### 1.1 حل مشكلة OOM (Out of Memory)

**المشكلة:** Next.js dev server يستهلك 2-3GB RAM ويتسبب في crashes.

**خطة التنفيذ:**
- [ ] تحويل التشغيل الافتراضي من `dev` إلى `production` (`next build` + `next start`)
- [ ] تحديث `package.json` script `start` لاستخدام `next start` بدلاً من `next dev`
- [ ] إضافة `NODE_OPTIONS=--max-old-space-size=1024` في الـ Dockerfile
- [ ] تحسين `next.config.ts`:
  - تقليل `optimizePackageImports` list
  - إضافة `swcMinify: true`
  - تفعيل `compress: true`
- [ ] اختبار الذاكرة بعد كل تغيير باستخدام `docker stats`

**معايير القبول:**
- التطبيق يعمل بـ 512MB RAM كحد أقصى في وضع production
- لا توجد crashes بعد 24 ساعة من التشغيل المتواصل
- زمن الاستجابة < 2 ثانية للصفحات الأساسية

### 1.2 إصلاح تضارب الـ Tools Registry

**المشكلة:** يوجد 3 طبقات للـ tools (tools-registry، callable-tools.ts، ALL_AGENT_TOOLS) مما يسبب تضارب.

**خطة التنفيذ:**
- [ ] توحيد الـ tools layer في `src/lib/tools-registry/` فقط
- [ ] ترحيل الـ 31 tool من `callable-tools.ts` إلى `tools-registry/`
- [ ] ترحيل الـ 67 tool من `ALL_AGENT_TOOLS` إلى `tools-registry/`
- [ ] تحديث `src/app/api/massive-tools/exec/route.ts` لاستخدام طبقة واحدة
- [ ] إزالة الكود المكرر من `src/lib/agent/custom-tools.ts`

**معايير القبول:**
- طبقة tools واحدة فقط في `src/lib/tools-registry/`
- API endpoint `/api/massive-tools/exec` يستدعي الـ registry مباشرة
- لا توجد أدوات مكررة عبر الملفات

### 1.3 تأمين قاعدة البيانات

**المشكلة:** SQLite مع `--accept-data-loss` في كل restart يسبب فقدان البيانات.

**خطة التنفيذ:**
- [ ] إزالة `--accept-data-loss` من `Dockerfile` و `docker-entrypoint.sh`
- [ ] استخدام `prisma migrate deploy` بدلاً من `prisma db push`
- [ ] إضافة Persistent Volume للـ DB في `docker-compose.yml`
- [ ] إنشاء backup script يومي للـ DB
- [ ] اختبار استعادة الـ DB من backup

**معايير القبول:**
- البيانات لا تُفقد بعد restart
- الـ migrations تعمل بشكل صحيح
- يوجد backup يومي تلقائي

### 1.4 إصلاح Hermes Integration

**المشكلة:** Hermes يعمل كـ child process في كل طلب = بطيء جداً (30-90 ثانية).

**خطة التنفيذ:**
- [ ] تحويل Hermes إلى WebSocket-based service (mini-service مستقل)
- [ ] إنشاء `mini-services/hermes-service/` يعمل كـ daemon
- [ ] تحديث `/api/hermes/chat` لاستخدام WebSocket بدلاً من spawn
- [ ] إضافة connection pooling للـ Hermes process
- [ ] اختبار زمن الاستجابة بعد التحسين

**معايير القبول:**
- زمن استجابة Hermes < 5 ثوانٍ
- Hermes process يعمل بشكل مستمر (مش spawn per request)
- WebSocket connection مستقر

---

## 🏗️ المرحلة 2: البنية التحتية (P1 — High Priority)

> **الهدف:** بناء infrastructure قابلة للتوسع والمراقبة  
> **المدة المقدرة:** 5-7 أيام  
> **الجهد:** ~60 ساعة

### 2.1 إعداد CI/CD Pipeline

**خطة التنفيذ:**
- [ ] إنشاء `.github/workflows/ci.yml`:
  - lint check على كل PR
  - TypeScript type check
  - build test
  - security audit (`npm audit`)
- [ ] إنشاء `.github/workflows/deploy.yml`:
  - auto-deploy على push to `main`
  - build Docker image
  - push to container registry
  - deploy to VPS
- [ ] إضافة pre-commit hooks (husky):
  - eslint
  - prettier
  - type check

**معايير القبول:**
- كل PR يتم فحصه تلقائياً
- الـ deploy يتم تلقائياً على merge to main
- لا يتم deploy كود فيه errors

### 2.2 إضافة Monitoring و Logging

**خطة التنفيذ:**
- [ ] تثبيت Sentry للـ error tracking:
  - `@sentry/nextjs`
  - إعداد DSN في `.env`
  - إعداد release tracking
- [ ] إضافة structured logging:
  - استخدام `pino` بدلاً من `console.log`
  - log rotation في Docker
  - centralized log collection
- [ ] إضافة health checks حقيقية:
  - `/api/health` endpoint
  - فحص DB connection
  - فحص Hermes availability
  - فحص disk space
- [ ] إضافة Prometheus metrics:
  - request count
  - response times
  - error rates
  - active connections

**معايير الققوبول:**
- Sentry يلتقط كل الأخطاء تلقائياً
- Logs منظمة وقابلة للبحث
- Health check endpoint يعمل
- Metrics متاحة على `/metrics`

### 2.3 تحسين الـ Docker Setup

**خطة التنفيذ:**
- [ ] تحسين `Dockerfile.prod` (multi-stage build):
  - Stage 1: build dependencies
  - Stage 2: production image (أصغر)
  - استخدام `.dockerignore` محسّن
- [ ] إضافة Docker layer caching:
  - cache `package.json` و `requirements.txt` بشكل منفصل
  - استخدام BuildKit
- [ ] تحديث `docker-compose.yml`:
  - إضافة nginx reverse proxy
  - إضافة redis للـ caching
  - إضافة backup service
  - network isolation

**معايير القبول:**
- حجم الـ Docker image < 1GB
- زمن الـ build < 10 دقائق
- الـ compose file يشمل كل الخدمات اللازمة

### 2.4 إعداد SSL و Domain

**خطة التنفيذ:**
- [ ] إعداد Nginx reverse proxy:
  - SSL termination
  - gzip compression
  - static file serving
  - rate limiting
- [ ] إضافة Certbot لـ Let's Encrypt:
  - auto-renewal
  - wildcard certificates
- [ ] إعداد domain DNS:
  - A record للـ server
  - CNAME للـ www
  - MX records للـ email

**معايير القبول:**
- الموقع يعمل على HTTPS
- SSL certificate صالح ومجدد تلقائياً
- Nginx يقدم static files بسرعة

---

## 🧪 المرحلة 3: Testing و Quality Assurance (P1)

> **الهدف:** ضمان جودة الكود ومنع الـ regressions  
> **المدة المقدرة:** 4-6 أيام  
> **الجهد:** ~50 ساعة

### 3.1 إعداد Testing Infrastructure

**خطة التنفيذ:**
- [ ] تثبيت testing frameworks:
  - `vitest` للـ unit tests
  - `@testing-library/react` للـ component tests
  - `playwright` للـ e2e tests
- [ ] إعداد `vitest.config.ts`
- [ ] إعداد `playwright.config.ts`
- [ ] إضافة test scripts في `package.json`:
  - `test:unit`
  - `test:integration`
  - `test:e2e`
  - `test:coverage`

### 3.2 كتابة Unit Tests للـ Tools Registry

**خطة التنفيذ:**
- [ ] اختبار كل tool في `src/lib/tools-registry/nodejs/`:
  - `date_utilities.test.ts`
  - `text_utilities.test.ts`
  - `json_utilities.test.ts`
  - ... (10 أدوات)
- [ ] اختبار الـ Python tools عبر subprocess:
  - `sentiment_analysis.test.ts`
  - `math_solver.test.ts`
  - ... (23 أداة)
- [ ] اختبار الـ GitHub tools (40 أداة)
- [ ] الهدف: 80% coverage للـ tools-registry

### 3.3 كتابة Integration Tests للـ API

**خطة التنفيذ:**
- [ ] اختبار الـ API routes الأساسية:
  - `/api/agents-list`
  - `/api/massive-tools/exec`
  - `/api/massive-tools/stats`
  - `/api/hermes/status`
  - `/api/auth/*`
- [ ] اختبار الـ agent engine:
  - `runAgent()` function
  - tool execution flow
  - error handling
- [ ] اختبار الـ DB operations:
  - CRUD لكل model
  - migrations
  - backup/restore

### 3.4 كتابة E2E Tests

**خطة التنفيذ:**
- [ ] اختبار user flows أساسية:
  - Login (guest + admin)
  - Chat مع Anzaro AI
  - استخدام tool من الـ tools-registry
  - تصفح الـ agents hub
  - تصفح الـ models
- [ ] اختبار الـ deployment:
  - Docker build
  - Container startup
  - Health check

**معايير القبول:**
- 80% code coverage للـ tools-registry
- 60% code coverage للـ API routes
- E2E tests تعمل على CI
- لا توجد regressions بعد refactoring

---

## 🔄 المرحلة 4: Refactoring (P2)

> **الهدف:** تحسين جودة الكود وقابليته للصيانة  
> **المدة المقدرة:** 5-7 أيام  
> **الجهد:** ~60 ساعة

### 4.1 فصل الـ Mini-Services

**المشكلة:** المشروع monolithic، كل الـ logic في `src/lib/`.

**خطة التنفيذ:**
- [ ] إنشاء `mini-services/` حقيقية:
  - `mini-services/hermes-service/` — Hermes daemon
  - `mini-services/tools-service/` — Python tools execution
  - `mini-services/chat-service/` — Chat orchestration
- [ ] تعريف communication protocol:
  - HTTP REST للـ synchronous calls
  - WebSocket للـ streaming
  - Redis pub/sub للـ async events
- [ ] تحديث `docker-compose.yml` لإضافة الخدمات الجديدة
- [ ] migration تدريجي للـ services الجديدة

### 4.2 تنظيم الـ API Routes

**المشكلة:** 293 API route بدون تنظيم واضح.

**خطة التنفيذ:**
- [ ] تجميع الـ routes حسب الـ domain:
  - `/api/v2/agents/*`
  - `/api/v2/tools/*`
  - `/api/v2/chat/*`
  - `/api/v2/admin/*`
- [ ] إضافة API versioning
- [ ] إنشاء OpenAPI/Swagger documentation
- [ ] إضافة rate limiting لكل endpoint
- [ ] إضافة request validation (zod schemas)

### 4.3 تحسين الـ Skills System

**المشكلة:** 70 skill بدون آلية موحدة للـ execution.

**خطة التنفيذ:**
- [ ] توحيد الـ skill format:
  - كل skill يكون له `index.ts` أو `index.py`
  - metadata في `skill.yaml`
  - tests في `__tests__/`
- [ ] إنشاء skill loader موحد:
  - `src/lib/skills/loader.ts` (موجود، يحتاج تحسين)
  - auto-discovery للـ skills الجديدة
  - hot-reload في dev mode
- [ ] ربط الـ skills بالـ agents بشكل أوضح:
  - كل agent يحدد الـ skills التي يستخدمها
  - الـ skill context injection تلقائي

### 4.4 إزالة الـ Tech Debt

**خطة التنفيذ:**
- [ ] إزالة `ignoreBuildErrors: true` من `next.config.ts`
- [ ] إصلاح كل TypeScript errors
- [ ] إزالة الكود الميت (dead code)
- [ ] تحسين الـ naming conventions
- [ ] إضافة JSDoc للـ functions المهمة

**معايير القبول:**
- لا توجد TypeScript errors
- 293 API route منظمة في groups
- الـ skills system موحد
- الكود نظيف وقابل للصيانة

---

## 📚 المرحلة 5: Documentation (P2)

> **الهدف:** توثيق شامل للمشروع  
> **المدة المقدرة:** 3-4 أيام  
> **الجهد:** ~30 ساعة

### 5.1 إنشاء Architecture Documentation

**خطة التنفيذ:**
- [ ] إنشاء `docs/ARCHITECTURE.md`:
  - System overview
  - Component diagram
  - Data flow diagram
  - Deployment diagram
- [ ] إنشاء `docs/API.md`:
  - كل endpoint مع مثال
  - request/response schemas
  - authentication flow
- [ ] إنشاء `docs/DEPLOYMENT.md`:
  - prerequisites
  - step-by-step deployment
  - troubleshooting
- [ ] تحديث `README.md` الرئيسي

### 5.2 إنشاء Developer Guide

**خطة التنفيذ:**
- [ ] إنشاء `docs/DEVELOPMENT.md`:
  - local setup
  - coding standards
  - git workflow
  - testing guide
- [ ] إنشاء `docs/CONTRIBUTING.md`:
  - how to add a new tool
  - how to add a new skill
  - how to add a new agent
- [ ] إنشاء `docs/SECURITY.md`:
  - security best practices
  - API key management
  - user data protection

### 5.3 إنشاء SDK

**خطة التنفيذ:**
- [ ] إنشاء `packages/sdk/`:
  - TypeScript SDK للـ API
  - Python SDK للـ API
- [ ] نشر الـ SDK على npm و PyPI
- [ ] توثيق الـ SDK usage

---

## 🎯 المرحلة 6: الميزات الجديدة (P3)

> **الهدف:** إضافة ميزات تزيد من قيمة المنصة  
> **المدة المقدرة:** حسب الطلب  
> **الجهد:** حسب الميزة

### 6.1 ميزات مقترحة (مرتبة بالأولوية)

#### 6.1.1 WebSocket Streaming للـ Chat
- استبدال SSE بـ WebSocket للـ real-time chat
- تحسين تجربة المستخدم في الـ streaming responses

#### 6.1.2 User Dashboard محسّن
- إحصائيات استخدام شخصية
- تاريخ المحادثات مع search
- إدارة الـ API keys

#### 6.1.3 Plugin System
- السماح للمطورين بإضافة plugins
- plugin marketplace
- plugin sandboxing

#### 6.1.4 Multi-language Support
- دعم لغات إضافية (English, French, Spanish)
- RTL/LTR switching
- localized UI

#### 6.1.5 Mobile App Refresh
- تحديث الـ React Native app
- إضافة features جديدة
- تحسين الـ UX

#### 6.1.6 Vector Search للـ Tools
- إضافة embeddings للـ tools
- semantic search بدلاً من keyword search
- تحسين دقة اكتشاف الـ tools

---

## 📊 الجدول الزمني الإجمالي

| المرحلة | المدة | الجهد | الأولوية |
|---------|------|------|---------|
| **المرحلة 0:** Pre-Flight | 1 يوم | 8 ساعات | - |
| **المرحلة 1:** Critical Fixes | 3-5 أيام | 40 ساعة | P0 |
| **المرحلة 2:** Infrastructure | 5-7 أيام | 60 ساعة | P1 |
| **المرحلة 3:** Testing & QA | 4-6 أيام | 50 ساعة | P1 |
| **المرحلة 4:** Refactoring | 5-7 أيام | 60 ساعة | P2 |
| **المرحلة 5:** Documentation | 3-4 أيام | 30 ساعة | P2 |
| **المرحلة 6:** New Features | حسب الطلب | - | P3 |
| **الإجمالي** | **21-30 يوم** | **248 ساعة** | - |

---

## ✅ معايير القبول النهائية (Definition of Done)

المنصة تعتبر "production-ready" عند تحقيق الآتي:

### الاستقرار
- [ ] التطبيق يعمل 24/7 بدون crashes
- [ ] زمن الاستجابة < 2 ثانية للـ 95% من الطلبات
- [ ] الذاكرة المستهلكة < 1GB في وضع production
- [ ] لا توجد memory leaks

### الأمان
- [ ] جميع الـ API endpoints محمية بـ authentication
- [ ] الـ secrets محفوظة في environment variables
- [ ] الـ DB محمية بكلمة مرور قوية
- [ ] HTTPS مفعّل مع SSL certificate صالح

### الجودة
- [ ] 80% code coverage للـ tools-registry
- [ ] 60% code coverage للـ API routes
- [ ] لا توجد TypeScript errors
- [ ] لا توجد ESLint errors
- [ ] CI/CD pipeline يعمل

### المراقبة
- [ ] Sentry يلتقط كل الأخطاء
- [ ] Logs منظمة وقابلة للبحث
- [ ] Health check endpoint يعمل
- [ ] Metrics متاحة على `/metrics`

### التوثيق
- [ ] `docs/ARCHITECTURE.md` موجود ومحدّث
- [ ] `docs/API.md` موجود ومحدّث
- [ ] `docs/DEPLOYMENT.md` موجود ومحدّث
- [ ] `README.md` محدّث

---

## ⚠️ المخاطر والافتراضات

### المخاطر
1. **الوقت:** الجدول الزمني قد يمتد بسبب مشاكل غير متوقعة
2. **ال resources:** قد نحتاج لـ VPS أقوى لـ testing
3. **الـ migrations:** نقل الـ DB من SQLite لـ PostgreSQL قد يكون معقداً
4. **الـ Hermes:** الـ integration قد يحتاج لإعادة كتابة كاملة

### الافتراضات
1. وجود VPS بـ 4GB RAM على الأقل
2. وجود API keys لـ AI providers
3. وجود domain name للـ deployment
4. تفرغ المطور للعمل على المشروع

---

## 📝 ملاحظات ختامية

هذه الخطة **مرنة وقابلة للتعديل** بناءً على:
- الأولويات الفعلية للمستخدم
- الـ resources المتاحة
- المشاكل التي قد تظهر أثناء التنفيذ
- الـ feedback من المستخدمين

**الخطوة التالية:** انتظار موافقة أ. عبدالسلام على الخطة قبل البدء في التنفيذ.

---

*تم إعداد هذه الخطة بواسطة Z.ai Code في 2026-08-04*
