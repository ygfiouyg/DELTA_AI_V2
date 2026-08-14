# ☤ دليل Hermes Agent

## 📍 فين Hermes؟

Hermes مثبت على السيرفر في:
```
~/.hermes/
```

## 🚀 كيف تصل له؟

### الطريقة الأولى: عبر Terminal السيرفر
```bash
# 1. ادخل على السيرفر بـ SSH
ssh root@46.224.234.21

# 2. شغل Hermes
hermes

# 3. أو ابدأ محادثة مباشرة
hermes -z "Hello, how are you?"
```

### الطريقة الثانية: من المنصة (Web UI)
```
https://anov.ddns.net
```
1. سجل الدخول
2. من القائمة (3 نقاط) → اختار "🤖 مركز الوكلاء"
3. اختار "☤ Hermes Agent"
4. ابدأ الدردشة!

### الطريقة الثالثة: عبر API
```bash
curl -X POST https://anov.ddns.net/api/hermes/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

## 🔑 تفعيل Hermes

Hermes محتاج API key عشان يرد:
```bash
# أضف مفتاح (اختر واحد)
echo 'OPENROUTER_API_KEY=sk-or-xxx' >> ~/.hermes/.env
# أو
echo 'OPENAI_API_KEY=sk-xxx' >> ~/.hermes/.env
# أو
echo 'ANTHROPIC_API_KEY=sk-xxx' >> ~/.hermes/.env
```

## ⚙️ إعدادات Hermes

```bash
# إعداد Hermes (interactive)
hermes setup

# تغيير الموديل
hermes model

# تفعيل الأدوات
hermes tools

# عرض الحالة
hermes status
```

## 🧪 تجربة Hermes

```bash
# محادثة سريعة
hermes -z "اكتبلي قصيدة عن مصر"

# استخدام أدوات محددة
hermes -z "ابحث عن أخبار الذكاء الاصطناعي" -t web

# استخدام skills
hermes -z "لخصلي المقال ده" --skills summarize
```
