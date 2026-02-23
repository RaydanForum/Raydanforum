# دليل نشر مشروع Raydan Forum

هذا الدليل يشرح كيفية نشر مشروع Raydan Forum تلقائياً على خادم FTP باستخدام GitHub Actions.

## المتطلبات الأساسية

1. حساب GitHub
2. معلومات FTP الخاصة بك
3. مشروع Supabase مُعد ومُجهز

## الخطوات

### 1. رفع الكود إلى GitHub

المشروع يستخدم المستودع الحالي: **Galal1129/raydan**

قم بتشغيل الأوامر التالية في terminal المشروع لرفع آخر التحديثات:

```bash
git add .
git commit -m "Update deployment configuration"
git push origin main
```

إذا لم تكن قد ربطت المشروع بالمستودع بعد، استخدم:

```bash
git remote add origin https://github.com/Galal1129/raydan.git
git push -u origin main
```

### 2. إضافة GitHub Secrets

الآن تحتاج لإضافة المعلومات الحساسة (Secrets) في GitHub:

1. اذهب إلى مستودعك على GitHub
2. اضغط على "Settings" (الإعدادات)
3. في القائمة الجانبية، اختر "Secrets and variables" > "Actions"
4. اضغط على "New repository secret" لكل سر من الأسرار التالية:

#### الأسرار المطلوبة:

**معلومات FTP:**
- **Name:** `FTP_SERVER`
  **Value:** `145.223.77.50`

- **Name:** `FTP_USERNAME`
  **Value:** `u292062174`

- **Name:** `FTP_PASSWORD`
  **Value:** `RaydanForum11!!`

- **Name:** `FTP_PORT`
  **Value:** `21`

- **Name:** `FTP_SERVER_DIR`
  **Value:** `public_html/`

**معلومات Supabase:**
- **Name:** `VITE_SUPABASE_URL`
  **Value:** (URL مشروع Supabase الخاص بك)

- **Name:** `VITE_SUPABASE_ANON_KEY`
  **Value:** (مفتاح Supabase Anon الخاص بك)

### 3. تفعيل GitHub Actions

بعد إضافة جميع الأسرار:

1. اذهب إلى تبويب "Actions" في مستودعك
2. ستجد workflow باسم "Deploy to FTP"
3. يمكنك تشغيله يدوياً بالضغط على "Run workflow"
4. أو سيعمل تلقائياً عند كل push على الفرع main

### 4. التحقق من النشر

بعد اكتمال الـ workflow:
1. اذهب إلى `http://raydanforum.org`
2. يجب أن ترى موقعك يعمل بشكل صحيح

## ملاحظات مهمة

- ملف `.htaccess` موجود في المشروع لدعم React Router
- لا تشارك ملف `.env` على GitHub (موجود في .gitignore)
- استخدم `.env.example` كمرجع للمتغيرات المطلوبة
- يتم النشر تلقائياً عند كل push إلى main
- يمكنك تشغيل النشر يدوياً من تبويب Actions

## استكشاف الأخطاء

### إذا ظهر الموقع صفحة بيضاء:

1. **تحقق من Console في المتصفح:**
   - افتح Developer Tools (F12)
   - راجع أخطاء JavaScript
   - تأكد من تحميل ملفات CSS و JS بشكل صحيح

2. **تحقق من ملف .htaccess:**
   - تأكد من أن ملف `.htaccess` موجود في `public_html/`
   - تأكد من أن `mod_rewrite` مفعل على السيرفر
   - يمكنك الاتصال بدعم Hostinger للتأكد

3. **تحقق من متغيرات البيئة:**
   - تأكد من إضافة `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` في GitHub Secrets
   - هذه المتغيرات ضرورية لعمل التطبيق

### إذا فشل النشر:

1. **تحقق من الأسرار في GitHub:**
   - اذهب إلى Settings > Secrets and variables > Actions
   - تأكد من إضافة جميع الأسرار المطلوبة
   - تأكد من عدم وجود مسافات زائدة في القيم

2. **راجع logs في GitHub Actions:**
   - اذهب إلى تبويب Actions
   - افتح آخر workflow run
   - راجع الأخطاء في خطوة "Deploy to FTP"

3. **تحقق من معلومات FTP:**
   - جرب الاتصال بـ FTP يدوياً باستخدام FileZilla
   - تأكد من صحة Server, Username, Password, Port

4. **تحقق من المسار على السيرفر:**
   - تأكد من أن `FTP_SERVER_DIR` يشير إلى `public_html/`
   - بعض السيرفرات تستخدم `public_html` بدون الشرطة `/` في النهاية

5. **تحقق من الأذونات:**
   - تأكد من أن المجلد `public_html/` له أذونات الكتابة
   - الأذونات المناسبة: 755 للمجلدات، 644 للملفات

### إذا ظهرت أخطاء 404:

1. **تأكد من وجود .htaccess:**
   ```bash
   # يجب أن يحتوي على:
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_FILENAME} !-l
   RewriteRule . /index.html [L]
   ```

2. **تأكد من تفعيل mod_rewrite:**
   - اتصل بدعم Hostinger للتأكد من أن Apache mod_rewrite مفعل

### نصائح إضافية:

- **بناء المشروع محلياً:** قبل الرفع، شغل `npm run build` محلياً للتأكد من عدم وجود أخطاء
- **اختبار FTP يدوياً:** جرب رفع ملفات dist/ يدوياً عبر FileZilla للتأكد من المسارات
- **مسح الكاش:** بعد النشر، امسح كاش المتصفح أو افتح الموقع في نافذة خاصة

## دعم إضافي

للمزيد من المساعدة، راجع:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
