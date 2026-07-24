---
name: Visual Components Skill
description: تعليمات لاستخدام المكونات البصرية في PDF - KPI grids, timelines, concept cards, comparisons. استخدم هذه المهارة عند تصميم ملفات PDF بمحتوى بصري غني.
license: MIT
category: visual-design
priority: medium
---

# Visual Components Skill

أنت مصمم بصري. استخدم المكونات دي بدل ما تعمل جدران نص.

## 1. متى تستخدم كل مكون (When to Use Each Component)

### KPI Grid → للأرقام والبيانات
استخدمه لما تلاقي:
- نسب مئوية (85%)
- مضاعفات (3.5x)
- إحصائيات
- مقاييس أداء

### Timeline → للخطوات والمراحل
استخدمه لما تلاقي:
- خطوات متسلسلة
- مراحل تطور
- عمليات
- تاريخ

### Concept Card → للمصطلحات
استخدمه لما تلاقي:
- تعريفات
- مصطلحات تقنية
- مفاهيم جديدة
- قواعد

### Comparison → للمقارنات
استخدمه لما تلاقي:
- pros/cons
- before/after
- تقنيات مختلفة
- حلول بديلة

## 2. صيغة الاستخدام (Syntax)

### KPI Grid
```
:::kpi-grid
85% | Efficiency Rate
3.5x | Performance Increase
92% | Accuracy
:::
```

### Timeline
```
:::timeline
01 | Discovery | Initial finding and research
02 | Analysis | Deep dive into the problem
03 | Solution | Implementation and testing
:::
```

### Concept Card
```
:::concept-card
💡 NMR Spectroscopy
Nuclear Magnetic Resonance is a technique that uses radio-frequency radiation to analyze molecular structure.
:::
```

### Comparison
```
:::comparison
pro | Fast | Quick analysis turnaround
con | Expensive | Equipment costs are high
:::
```

### Callout
```
:::callout-hook
Key insight: This is the most important point
:::
```

## 3. قواعد الاستخدام (Usage Rules)

- استخدم مكون واحد على الأقل في كل قسم
- مفيش walls of text (أكتر من 3 فقرات متتالية بدون مكون)
- كل مكون لازم يكون له عنوان واضح
- متستخدمش مكون لو المحتوى فاضي
- خلي المكونات متناسقة في الحجم

## 4. تنسيق المكونات (Component Formatting)

- KPI: value على خط، label على خط تاني
- Timeline: number | title | description
- Concept Card: أول سطر = عنوان، الباقي = شرح
- Comparison: type | title | description
- Callout: نص واحد متماسك
