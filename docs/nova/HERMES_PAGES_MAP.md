# 📊 خريطة صفحات Hermes Agent الأصلية (Desktop App)

> المصدر: `apps/desktop/src/app/` من NousResearch/hermes-agent

## 🗺️ المخطط العام (Layout)

الواجهة مقسمة لـ 3 مناطق رئيسية:

```
┌─────────────────────────────────────────────────────────────┐
│  Titlebar (شريط علوي)                                       │
├──────────┬──────────────────────────────┬───────────────────┤
│          │                              │                   │
│ Sidebar  │  Main Workspace              │  Right Sidebar    │
│ (يسار)   │  (وسط)                       │  (يمين)           │
│          │                              │                   │
│ - Chat   │  - Composer                  │  - Context Usage  │
│ - Skills │  - Messages                  │  - Model Menu     │
│ - Tools  │  - Tool Activity             │  - Approval Mode  │
│ - Files  │  - Agent Status              │  - Gateway Menu   │
│ - Cron   │                              │                   │
│ - Config │                              │                   │
│          │                              │                   │
├──────────┴──────────────────────────────┴───────────────────┤
│  Statusbar (شريط سفلي)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 الصفحات الموجودة (apps/desktop/src/app/)

### 1. 💬 chat/ (المحادثة الرئيسية)
**الملفات:** 32 ملف
- `index.tsx` — الصفحة الرئيسية للمحادثة
- `transcript-window.tsx` — نافذة عرض الرسائل
- `session-view.tsx` — عرض الجلسة الحالية
- `session-tile.tsx` — بطاقة الجلسة في الـ sidebar
- `session-drag.tsx` — سحب وإفلات الجلسات
- `session-status-dot.tsx` — نقطة حالة الجلسة
- `session-tile-actions.ts` — أزرار العمليات على الجلسة
- `session-draft-title.tsx` — عنوان الجلسة المؤقت
- `close-tab.ts` — إغلاق التبويب
- `chat-drop-overlay.tsx` — تراكب سحب الملفات
- `chat-swap-overlay.tsx` — تراكب تبديل الجلسات
- `preview-tile.tsx` — بطاقة المعاينة
- `pr-tag.tsx` — علامة Pull Request
- `route-tile.tsx` — بطاقة المسار
- `profile-tag.tsx` — علامة الملف الشخصي
- `scroll-to-bottom-button.tsx` — زر التمرير للأسفل
- `thread-loading.tsx` — شاشة تحميل المحادثة
- `surface-vars.ts` — متغيرات الواجهة
- `runtime-repository.ts` — مستودع التشغيل
- `perf-probe.tsx` — مسبار الأداء

### 2. 📜 session/ (إدارة الجلسات)
- `index.tsx` — قائمة الجلسات
- إدارة إنشاء/حذف/تفريع الجلسات

### 3. 📁 artifacts/ (الملفات والمخرجات)
- عرض الملفات المولّدة (صور، PDFs، كود)
- معاينة الملفات

### 4. 🎛️ command-center/ (مركز التحكم)
- `index.tsx` — الصفحة الرئيسية
- `maintenance.tsx` — صفحة الصيانة

### 5. 🔍 command-palette/ (لوحة الأوامر)
- بحث سريع عن الأوامر والمهام
- اختصارات لوحة المفاتيح

### 6. 🤝 contrib/ (المساهمون)
- عرض المساهمين في المشروع

### 7. 🌐 gateway/ (البوابة)
- `hooks/` — إدارة الخطاطيف (webhooks)

### 8. 🪝 hooks/ (الخطاطيف)
- إدارة دورة حياة الـ hooks

### 9. 📊 hud/ (واجهة العرض)
- عرض المعلومات الحية (HUD - Heads-Up Display)

### 10. 🎓 learning/ (التعلم)
- `graph/` — رسم بياني للتعلم
- `node/` — عقد التعلم
- عرض الإنجازات والتقدم

### 11. 📱 messaging/ (المراسلة)
- إدارة قنوات المراسلة (Telegram, Discord, Slack, إلخ)

### 12. 🖼️ overlays/ (التراكبات)
- نوافذ منبثقة وتراكبات

### 13. 🐾 pet-generate/ (توليد الحيوانات الأليفة)
- واجهة توليد الـ pets (ميزة選ا)

### 14. 🐾 pet-overlay/ (تراكب الحيوانات)
- عرض الـ pets على الشاشة

### 15. ⚡ quick-entry/ (الإدخال السريع)
- إدخال سريع للأوامر والنصوص

### 16. 📊 right-sidebar/ (الشريط الجانبي الأيمن)
- `context-usage-panel.tsx` — لوحة استخدام السياق (tokens)
- `model-menu-panel.tsx` — قائمة النماذج
- `gateway-menu-panel.tsx` — قائمة البوابة

### 17. ⚙️ settings/ (الإعدادات)
**الملفات:** 45+ ملف
- `index.tsx` — الصفحة الرئيسية للإعدادات
- `model-settings.tsx` — إعدادات النماذج
- `appearance-settings.tsx` — إعدادات المظهر
- `config-settings.tsx` — إعدادات التكوين
- `gateway-settings.tsx` — إعدادات البوابة
- `keys-settings.tsx` — إعدادات المفاتيح
- `plugins-settings.tsx` — إعدادات الإضافات
- `providers-settings.tsx` — إعدادات المزودين
- `notifications-settings.tsx` — إعدادات الإشعارات
- `sessions-settings.tsx` — إعدادات الجلسات
- `computer-use-panel.tsx` — لوحة استخدام الكمبيوتر
- `terminal-backend-panel.tsx` — لوحة خلفية الطرفية
- `terminal-font-setting.tsx` — إعداد خط الطرفية
- `toolset-config-panel.tsx` — لوحة تكوين الأدوات
- `custom-endpoints-settings.tsx` — نقاط النهاية المخصصة
- `env-credentials.tsx` — اعتمادات البيئة
- `credential-key-ui.tsx` — واجهة مفاتيح الاعتماد
- `fallback-models-field.tsx` — حقل النماذج الاحتياطية
- `keybind-settings.tsx` — إعدادات اختصارات لوحة المفاتيح
- `pet-settings.tsx` — إعدادات الحيوانات الأليفة
- `quick-entry-settings.tsx` — إعدادات الإدخال السريع
- `voice-provider-fields.tsx` — حقول مزود الصوت
- `about-settings.tsx` — معلومات حول التطبيق
- `uninstall-section.tsx` — قسم إلغاء التثبيت
- `ssh-host-selection.ts` — اختيار خادم SSH
- `billing/` — الفوترة
- `memory/` — الذاكرة

### 18. 🐚 shell/ (الواجهة الأساسية)
- `titlebar.ts` — الشريط العلوي
- `titlebar-controls.tsx` — أزرار التحكم
- `statusbar-controls.tsx` — أزرار الشريط السفلي
- `statusbar-visibility.tsx` — رؤية الشريط السفلي
- `sidebar-label.tsx` — تسميات الشريط الجانبي
- `shell-context-menu.tsx` — قائمة السياق
- `model-catalog-menu.tsx` — قائمة كتالوج النماذج
- `model-edit-submenu.tsx` — القائمة الفرعية لتعديل النموذج
- `model-menu-panel.tsx` — لوحة قائمة النماذج
- `approval-mode-menu.tsx` — قائمة وضع الموافقة
- `context-usage-panel.tsx` — لوحة استخدام السياق
- `gateway-menu-panel.tsx` — لوحة قائمة البوابة
- `group-setter.ts` — ضبط المجموعات
- `hooks/` — خطاطيف الواجهة

### 19. 🧠 skills/ (المهارات)
- تصفح وتثبيت وإدارة المهارات

### 20. 🗺️ starmap/ (خريطة النجوم)
- عرض بصري للجلسات والمهام

### 21. 🔔 wake-indicator/ (مؤشر الاستيقاظ)
- مؤشر تنبيه صوتي

### 22. 🪝 webhooks/ (خطاطيف الويب)
- إدارة الـ webhooks

---

## 📊 الإحصائيات النهائية

| البيان | العدد |
|--------|------|
| **الصفحات الرئيسية** | 22 |
| **ملفات الإعدادات** | 45+ |
| **إجمالي الملفات** | 150+ |
| **الـ CLI Commands** | 50 |
| **الـ API Endpoints** | 129 |

