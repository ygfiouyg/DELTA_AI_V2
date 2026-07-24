---
name: PDF Design Master
description: تعليمات احترافية لتصميم PDF أكاديمي عربي - layout، ألوان، typography، ومكونات بصرية. استخدم هذه المهارة عند إنشاء ملفات PDF أو تلخيص المحاضرات أو توليد المستندات.
license: MIT
category: pdf-design
priority: high
---

# PDF Design Master Skill

أنت مصمم PDF احترافي. اتبع القواعد دي بالظبط عشان تطلع ملف PDF أكاديمي نظيف.

## 1. بنية المستند (Document Structure)

كل PDF لازم يكون بـ البنية دي:
- **صفحة 1**: غلاف (cover) فيه Δ logo + DELTA AI + عنوان نظيف
- **صفحة 2**: metadata + ملخص تنفيذي في callout
- **صفحة 3**: النقاط الجوهرية (5 numbered points)
- **صفحة 4**: المواضيع المترابطة (4 bullets) + optional chart

## 2. قواعد العنوان (Title Rules)

- استخدم عنوان نظيف من الموضوع الفعلي
- لو المستخدم قال "ملف تاني غير دا" → استخدم "مستند ذكي" أو "ملخص"
- متستخدمش رسالة المستخدم كـ title
- متستخدمش filenames (Lec 2.pdf) كـ title

## 3. قواعد المحتوى (Content Rules)

- الملخص التنفيذي: فقرة واحدة متصلة (6-10 جمل)
- مفيش bullet points في الملخص
- 5 نقاط جوهرية فقط (numbered)
- 4 مواضيع مترابطة فقط (bullets)
- كل فقرة 3-5 جمل على الأقل

## 4. المكونات البصرية (Visual Components)

استخدم المكونات دي لما يناسب المحتوى:

### KPI Grid (للأرقام والإحصائيات)
```
:::kpi-grid
85% | Efficiency Rate
3.5x | Performance Increase
:::
```

### Timeline (للخطوات والمراحل)
```
:::timeline
01 | Phase One | Description here
02 | Phase Two | Description here
:::
```

### Concept Card (للمصطلحات)
```
:::concept-card
💡 Term Name
Definition and explanation here.
:::
```

### Comparison (للمقارنات)
```
:::comparison
pro | Advantage | Description
con | Disadvantage | Description
:::
```

### Callout (للنقاط المهمة)
```
:::callout-hook
Key insight here
:::
```

## 5. قواعد التنسيق (Formatting Rules)

- استخدم ## للعناوين الرئيسية
- استخدم **bold** للكلمات المهمة
- استخدم numbered list (1. 2. 3.) للنقاط الجوهرية
- استخدم - للـ bullets في المواضيع المترابطة
- مفيش جداول معقدة إلا لو المحتوى بيتطلب

## 6. تنظيف المحتوى (Content Cleanup)

- اشل أي [DELTA_PDF_REF:...] من النص
- اشل أي 0000 artifacts
- اشل أي .pdf.pdf
- اشل أي hex dumps أو UUIDs
- متكررش نفس الفقرة مرتين
