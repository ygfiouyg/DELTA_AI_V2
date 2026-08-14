# 🔐 مصادقة Google Search Console

## 📋 اللينك المباشر للمصادقة:

```
https://search.google.com/search-console?resource_id=https://anov.ddns.net
```

## ✅ خطوات التحقق:

1. افتح اللينك ده في المتصفح
2. سجل الدخول بحساب Google بتاعك
3. اختار طريقة التحقق: **"ملف HTML"**
4. هتديك اسم ملف زي: `google1234567890.html`
5. انسخ اسم الملف ده

## 📝 أضف الملف على السيرفر:

افتح Terminal السيرفر واكتب (استبدل `google1234567890.html` باسم الملف بتاعك):

```bash
cd /opt/delta-ai
echo "google-site-verification: google1234567890.html" > public/google1234567890.html
docker compose restart
```

## ✅ تأكيد التحقق:

1. ارجع لـ Google Search Console
2. اضغط **"تأكيد" (Verify)**
3. هتلاقي رسالة: "تم التحقق من ملكية الموقع بنجاح"

## 🌐 اللينك النهائي للمنصة:

```
https://anov.ddns.net
```

## 📋 Google OAuth (لتسجيل الدخول بـ Google):

لو عايز تفعّل تسجيل الدخول بـ Google:

1. روح على: https://console.cloud.google.com
2. اعمل project جديد
3. فعّل Google+ API
4. اعمل OAuth credentials
5. في **Authorized redirect URIs** أضف:
   ```
   https://anov.ddns.net/api/auth/google/callback
   ```
6. خد `Client ID` و `Client Secret`
7. أضفهم في `.env`:
   ```bash
   echo "GOOGLE_CLIENT_ID=xxx" >> /opt/delta-ai/.env
   echo "GOOGLE_CLIENT_SECRET=xxx" >> /opt/delta-ai/.env
   docker compose restart
   ```
