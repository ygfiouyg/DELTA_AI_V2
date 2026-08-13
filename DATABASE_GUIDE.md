# 📊 دليل قاعدة البيانات

## 📍 فين الداتا بيز؟

### على السيرفر (Hetzner):
```
/opt/delta-ai/db/custom.db       ← الملف الفعلي
```

### جوه الـ Docker Container:
```
/app/data/custom.db              ← النسخة اللي بتشتغل
```

## 🛠️ كيف تفتح الداتا بيز؟

### الطريقة الأولى: من السيرفر مباشرة
```bash
# تثبيت sqlite3 (لو مش موجود)
apt install -y sqlite3

# فتح الداتا بيز
sqlite3 /opt/delta-ai/db/custom.db

# أوامر مفيدة:
.tables                          # عرض كل الجداول
SELECT COUNT(*) FROM ToolRegistry;   # عدد الأدوات
SELECT COUNT(*) FROM SkillRegistry;  # عدد المهارات
SELECT name, category FROM ToolRegistry WHERE isInstalled=1 LIMIT 10;  # الأدوات المثبتة
.quit                            # خروج
```

### الطريقة الثانية: من جوه الـ Docker
```bash
# فتح الداتا بيز جوه الـ container
docker exec -it delta-ai sqlite3 /app/data/custom.db
```

### الطريقة الثالثة: من المتصفح (Web)
1. افتح: `https://anov.ddns.net/api/massive-tools/stats`
2. هتلاقي إحصائيات الأدوات والمهارات

## 📋 محتويات الداتا بيز

### جدول ToolRegistry (الأدوات)
| الحقل | الوصف |
|-------|-------|
| name | اسم الأداة |
| source | المصدر (pypi, github, local) |
| category | الفئة (ai, data, media, web, utility) |
| isInstalled | هل مثبتة |
| isVerified | هل متحقق منها |
| summary | وصف مختصر |

### جدول SkillRegistry (المهارات)
| الحقل | الوصف |
|-------|-------|
| name | اسم المهارة |
| source | المصدر |
| category | الفئة |
| skillType | النوع (tool, workflow, agent) |

## 📊 إحصائيات

- **ToolRegistry:** ~862,000 أداة (metadata من PyPI)
- **SkillRegistry:** 70 مهارة
- **حجم الداتا بيز:** ~290MB (لما تكون مليانة)

## 🔄 تحديث الداتا بيز

### إعادة بناء الأدوات من PyPI:
```bash
cd /opt/delta-ai
python3 scripts/fast_pypi_rebuild.py
```

### إضافة أدوات من GitHub:
```bash
python3 scripts/github_tools_phase2.py
```
