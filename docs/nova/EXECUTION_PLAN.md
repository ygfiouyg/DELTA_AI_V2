# 📋 خطة تنفيذ واجهة DrAix Agent

> **الهدف:** استبدال واجهة Terminal (TUI) الخاصة بـ Hermes بواجهة ويب احترافية (Web UI) مبنية على Next.js، مع الحفاظ على كل وظائف الـ Backend كما هي وربطها بالكامل، وتغيير الهوية من "Hermes/Anova" إلى "DrAix".

---

## 🛑 القواعد الذهبية (يجب الالتزام بها)

1. **لا مسح لكود يعمل:** لا يتم حذف أو إيقاف أي Logic في الـ Backend الخاص بـ Hermes.
2. **لا بيانات وهمية (No Fake Data):** كل الأرقام والإحصائيات والـ Agents المعروضة يجب أن تأتي من الـ API الحقيقي لـ Hermes.
3. **ربط كامل (Full Integration):** لا يتم تصميم واجهة لزر أو صفحة إلا وتم ربطها بالـ API المخصص لها.
4. **لا تكرار للمنطق:** الـ Web UI هي طبقة عرض (Presentation Layer) فقط، تتصل بنفس نظام الـ Agent الحالي.

---

## 📊 مراحل التنفيذ (Phases)

الخطة مقسمة لـ 15 مرحلة، وكل مرحلة تعتمد على اللي قبلها.

### المرحلة 1: التدقيق والربط (Audit & Mapping)
- حصر كل الـ Endpoints المتاحة في Hermes API (`/v1/chat/completions`, `/api/sessions`, `/v1/skills`, إلخ).
- حصر كل الـ Pages/Views المطلوبة للواجهة الجديدة.

### المرحلة 2: تأسيس المشروع وتصميم النظام (Foundation & Design System)
- إنشاء مسار `/draix` داخل مشروع Next.js الحالي (لضمان توافق الـ Hosting).
- بناء الـ Design System الأساسي:
  - الألوان: DrAix Gold/Bronze (Light & Dark).
  - الخطوط: Editorial Headings + Modern Body.
  - الـ Layout الأساسي (3 أعمدة: Left Nav, Center Workspace, Right Context).

### المرحلة 3: الواجهة الرئيسية (Workspace Dashboard)
- بناء الـ Header والـ Left Navigation (New Chat, Conversations, Agents, Files, Automations, Analytics, Settings).
- بناء الـ Composer الرئيسي ("Ask DrAix anything...").
- ربط الـ Composer بـ `/v1/chat/completions`.

### المرحلة 4: عرض الـ Agents والـ Activity (Right Panel)
- بناء الـ Right Sidebar.
- جلب بيانات الـ Agents من Hermes API وعرضها.
- عرض حالة الـ Activity الحالية (Planning, Researching, إلخ) بشكل حي (Live).

### المرحلة 5: نظام المحادثات (Conversations)
- بناء واجهة عرض المحادثات السابقة (History).
- ربطها بـ `/api/sessions`.
- بناء واجهة المحادثة نفسها (Chat Bubbles، Tool Activity، Attachments).
- ربط الـ Streaming بـ `/api/sessions/{id}/chat/stream`.

### المرحلة 6: صفحة الـ Agents
- بناء صفحة استعراض الـ Agents (Search, Categories, Status).
- ربطها بالـ API الخاص بعرض الـ Agents/Tools المتاحة في Hermes.

### المرحلة 7: صفحة الملفات (Files)
- بناء واجهة إدارة الملفات (Recent, Uploaded, Generated).
- ربطها بـ Hermes File API.

### المرحلة 8: صفحة الأتمتة (Automations)
- بناء واجهة الـ Workflows/Cron Jobs.
- ربطها بـ `/api/jobs` في Hermes API.

### المرحلة 9: صفحة التحليلات (Analytics)
- بناء صفحة الإحصائيات (Agent Usage, Tasks, Tokens).
- جلب البيانات الحقيقية من Hermes.

### المرحلة 10: الإعدادات (Settings)
- بناء صفحة الإعدادات (Models, API Config, Appearance, Account).
- ربطها بـ `/api/model/options` وملف الـ config.

### المرحلة 11: التخطيط المتجاوب (Responsive)
- ضبط الـ Layout لـ Tablet (2 أعمدة) و Mobile (عمود واحد + Drawer).

### المرحلة 12: الوضع الليلي والنهاري (Light/Dark Mode)
- تطبيق الـ Theme الخاص بـ DrAix Gold/Bronze.
- ضبط الـ Contrast والـ Readability.

### المرحلة 13: إدارة الحالات (State Management)
- ربط الـ UI States (idle, thinking, tool execution, error) بالـ API الفعلي.

### المرحلة 14: معالجة الأخطاء (Error Handling)
- بناء صفحات/رسائل الـ Errors الواضحة (Network, Agent, Tool Errors).

### المرحلة 15: الاختبار الشامل (E2E Testing)
- التأكد من أن كل وظيفة كانت في الـ TUI تعمل الآن من خلال الـ Web UI.

---

## 🗺️ حصر الصفحات المطلوبة (Pages Inventory)

للتأكد من عدم نقص أي بيانات، هذه قائمة بالصفحات التي سيتم بناؤها:

1. **Workspace (الرئيسية):** الـ Dashboard اللي فيه الـ Composer والـ Quick Actions.
2. **Conversations (المحادثات):** قائمة المحادثات + واجهة المحادثة الواحدة.
3. **Agents:** صفحة استعراض الـ 200+ Agent.
4. **Files:** إدارة الملفات والمرفقات.
5. **Automations:** الـ Workflows والـ Cron Jobs.
6. **Analytics:** الإحصائيات والتحليلات.
7. **Settings:** الإعدادات العامة والموديلات.

**ملاحظة:** كل هذه الصفحات لها مقابل في Hermes Backend، وسيتم ربطها بالكامل.


---

## 🔌 خريطة ربط الـ API (API Mapping)

بناءً على فحص كود Hermes الفعلي، وجدت **50 Endpoint**.

إليك كيف سيتم ربطها بالواجهة الجديدة:

### 1. الواجهة الرئيسية (Workspace)
- **Composer:** `POST /v1/chat/completions` (لإرسال الرسائل)
- **Quick Actions:** `GET /v1/skills` (لعرض المهارات المتاحة لكل Quick Action)

### 2. المحادثات (Conversations)
- **قائمة المحادثات:** `GET /api/sessions`
- **إنشاء محادثة:** `POST /api/sessions`
- **فتح محادثة:** `GET /api/sessions/{id}/messages`
- **الردود (Streaming):** `POST /api/sessions/{id}/chat/stream`
- **تغيير الموديل:** `POST /api/sessions/{id}/model`

### 3. صفحة الـ Agents
- **عرض الـ Tools/Agents:** `GET /v1/toolsets` و `GET /v1/skills`

### 4. صفحة الأتمتة (Automations)
- **عرض الـ Jobs:** `GET /api/jobs`
- **إنشاء Job:** `POST /api/jobs`
- **إيقاف/تشغيل:** `POST /api/jobs/{id}/pause` و `resume`

### 5. صفحة الإعدادات (Settings)
- **عرض الموديلات:** `GET /v1/models` و `GET /api/model/options`
- **عرض الـ Capabilities:** `GET /v1/capabilities`

### 6. الـ Right Panel (System Overview)
- **الحالة:** `GET /health/detailed` (لمعرفة عدد الـ Agents والـ Tasks)

