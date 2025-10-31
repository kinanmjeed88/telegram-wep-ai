# TechTouch - تطبيق ويب تيليجرام مع الذكاء الاصطناعي

<div align="center">
  <img width="1200" height="475" alt="TechTouch Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## نظرة عامة

**TechTouch** هو تطبيق ويب متطور يجمع بين عرض قنوات تيليجرام التقنية والترفيهية مع دمج ميزات الذكاء الاصطناعي المتقدمة. يوفر الموقع تجربة مستخدم متميزة مع دردشة ذكية، مولد صور، وبحث ذكي في التطبيقات.

## ✨ الميزات الرئيسية

### 🤖 الذكاء الاصطناعي
- **دردشة ذكية**: محادثة مباشرة مع نموذج Gemini المتقدم
- **مولد الصور**: إنشاء صور عالية الجودة من النصوص باستخدام Imagen 4.0
- **بحث ذكي**: مطابقة ذكية لاستفسارات المستخدمين مع 200+ تطبيق

### 📱 المحتوى
- **200+ قناة تطبيق**: مجموعة شاملة من قنوات تيليجرام
- **فئات متنوعة**: ألعاب، ترفيه، تطبيقات معدلة، أدوات إنتاجية
- **واجهة عربية**: دعم كامل للغة العربية

### 🛠️ التقنيات
- **React 18 + TypeScript**: واجهة أمامية حديثة وآمنة
- **Hugo**: إنشاء مواقع ثابتة سريعة
- **Netlify Functions**: وظائف خادمية بدون خادم
- **Google Gemini AI**: دمج ذكي مع خدمات AI

## 🚀 التشغيل المحلي

### المتطلبات
- Node.js 18+ 
- npm 8+
- مفتاح API لـ Google Gemini

### خطوات التثبيت

1. **استنساخ المستودع:**
   ```bash
   git clone https://github.com/kinanmjeed88/telegram-wep-ai.git
   cd telegram-wep-ai
   ```

2. **تثبيت المكتبات:**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة:**
   ```bash
   cp .env.example .env.local
   # املأ ملف .env.local بمفتاح API الخاص بك
   ```

4. **تشغيل التطبيق:**
   ```bash
   npm run dev
   ```

5. **تشغيل مع Netlify Functions:**
   ```bash
   npm run dev:netlify
   ```

## ⚙️ إعدادات البيئة

قم بإنشاء ملف `.env.local` وإضافة المفاتيح التالية:

```bash
# مفاتيح API المطلوبة
GEMINI_API_KEY=your_gemini_api_key_here
NETLIFY_API_KEY=your_netlify_api_key_here

# إعدادات التطبيق
NODE_ENV=development
VITE_APP_NAME=TechTouch
VITE_APP_VERSION=1.0.0

# إعدادات الأمان
API_RATE_LIMIT=10
ENABLE_RATE_LIMITING=true
```

## 📁 هيكل المشروع

```
telegram-wep-ai/
├── components/           # مكونات React قابلة لإعادة الاستخدام
├── pages/               # صفحات التطبيق
├── netlify/functions/   # وظائف Netlify الخلفية
├── content/             # محتوى Hugo (Markdown)
├── data/                # ملفات JSON للبيانات
├── layouts/             # تخطيطات Hugo
├── static/              # الملفات الثابتة
├── public/              # الملفات العامة
├── src/                 # مكونات إضافية
├── types.ts             # تعريفات TypeScript
├── constants.ts         # الثوابت العامة
├── package.json         # إعدادات المشروع
└── README.md            # هذا الملف
```

## 🛠️ Scripts المتاحة

```bash
npm run dev              # تشغيل خادم التطوير
npm run build            # بناء المشروع للإنتاج
npm run preview          # معاينة البناء
npm run type-check       # فحص أنواع TypeScript
npm run clean            # حذف الملفات المؤقتة
npm run netlify:dev      # تشغيل مع Netlify Functions
npm run deploy           # نشر على Netlify
```

## 🔧 التطوير

### إضافة صفحة جديدة
1. أنشئ ملف جديد في مجلد `pages/`
2. أضف route في `App.tsx`
3. أضف رابط في `Header.tsx`

### إضافة Netlify Function
1. أنشئ ملف جديد في `netlify/functions/`
2. استخدم TypeScript للحماية
3. أضف معالجة الأخطاء المناسبة

### تخصيص التصميم
- ملف التصميم الرئيسي: `static/css/style.css`
- التصميم المحسن: `static/css/enhanced-styles.css`

## 🔐 الأمان

- **Rate Limiting**: حماية من الطلبات المتكررة
- **Input Validation**: التحقق من صحة البيانات المدخلة
- **CORS Protection**: حماية cross-origin
- **API Key Security**: حماية مفاتيح API

## 📱 الميزات المتقدمة

### دردشة AI محسنة
- رسائل مقترحة للبدء
- مؤشر الكتابة المتحرك
- تاريخ المحادثة
- مسح المحادثة
- تحذير من الطول الزائد

### بحث ذكي
- البحث بالذكاء الاصطناعي
- البحث المحلي مع fuzzy matching
- تصنيف النتائج حسب الصلة
- دعم النصوص العربية

### واجهة مستخدم محسنة
- تصميم متجاوب (Responsive)
- دعم الوضع الليلي
- انتقالات سلسة
- رسائل خطأ واضحة

## 🧪 الاختبار

```bash
npm run test             # تشغيل الاختبارات
npm run lint             # فحص جودة الكود
npm run type-check       # فحص الأنواع
```

## 📊 الأداء

- **Static Generation**: مواقع ثابتة سريعة
- **Serverless Functions**: استجابة فورية
- **Caching**: تخزين مؤقت ذكي
- **Bundle Optimization**: تحسين حجم الحزمة

## 🌐 النشر

### Netlify (الطريقة الموصى بها)

1. **ربط المستودع:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify link
   ```

2. **النشر:**
   ```bash
   npm run deploy
   ```

### متغيرات البيئة في Netlify
- أضف المتغيرات في إعدادات المشروع
- `GEMINI_API_KEY`: مفتاح Gemini
- `API_KEY`: نفس مفتاح Gemini

## 📈 إحصائيات المشروع

- **+200 تطبيق وقناة**: قاعدة بيانات شاملة
- **3 ميزات AI**: دردشة، صور، بحث
- **6 صفحات رئيسية**: الرئيسية، قنوات، منشورات، AI
- **+10 مكونات React**: مكونات قابلة لإعادة الاستخدام

## 🤝 المساهمة

1. Fork المستودع
2. إنشاء branch جديد: `git checkout -b feature/amazing-feature`
3. Commit التغييرات: `git commit -m 'Add amazing feature'`
4. Push للـ branch: `git push origin feature/amazing-feature`
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🆘 الدعم والمساعدة

- **Issues**: [GitHub Issues](https://github.com/kinanmjeed88/telegram-wep-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kinanmjeed88/telegram-wep-ai/discussions)
- **Email**: contact@techtouch.com

## 🎯 الخطط المستقبلية

- [ ] إضافة قاعدة بيانات للمستخدمين
- [ ] نظام تقييمات ومراجعات
- [ ] تطبيق موبايل (React Native)
- [ ] ميزات AI إضافية
- [ ] نظام الاشتراكات
- [ ] API خارجي للتكامل

---

<div align="center">
  
**صُنع بـ ❤️ بواسطة كنان الصائغ**

[🌐 الموقع](https://techtouch.netlify.app) | [📱 تيليجرام](https://t.me/techtouch7) | [💼 LinkedIn](https://linkedin.com/in/kinan-tech)

</div>