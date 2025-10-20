import React, { useState } from 'react';
import { APPS_DATABASE } from '../data/appsDatabase.ts';

interface AiSearchPageProps {
  onNavigateHome: () => void;
}

const AiSearchPage: React.FC<AiSearchPageProps> = ({ onNavigateHome }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('الرجاء إدخال استفسارك أو اسم التطبيق للبحث.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const SPORTS_KEYWORDS = ['رياضيه', 'Yalla Shoot', 'kora tv', 'Sport Juventus', 'IPTV', 'اكستريم', 'سكور سوفت', 'Ottplayer', 'OTTO TV', 'Zerda Live', 'VIO', 'Veo', 'Adam tv', 'AYMAN TV', 'VIC TV', 'KING TV', 'كيرا tv', 'wced live', 'دراما لايف tv', 'الاسطـورة tv', 'العالم tv', 'cast x Tv', 'ياسين تيفي', 'الوكا تيفي', 'RBTV77', 'Arabic TV', 'Shoof', 'AYA tv', 'Mix Flix TV', 'Genral TV', 'Zoon TV Pro', 'SUMER TV', 'الكتلا tv', 'Remo tv', 'الرئيس لايف', 'ZAIN LIVE', 'OTF TV', 'Black Ultra'];
      const MOVIES_KEYWORDS = ['MYTV', 'المنصة للشاشات', 'Cinemana', 'سينمانا', 'الافــــــــلام', 'بلكس', 'افلام', 'Roya tv', 'كرانشي رول', 'Anifox', 'كرتون', 'انمي', 'مسلسلات', 'Drama', 'Short', 'عشق', 'Loklok', 'VIU', 'HITV', 'HDO', 'Bee tv', 'دراما', 'NETFLY', 'Netflix', 'فاصل HD', 'MovieBox', 'FastMovies', 'Egy', 'فودو موفي', 'Witcher', 'CEE'];
      const GOLDEN_KEYWORDS = ['الذهبي'];

      const filterApps = (keywords: string[]) => {
          const regex = new RegExp(keywords.join('|'), 'i');
          return APPS_DATABASE.filter(app => regex.test(app.name))
                            .map(app => `- ${app.name}: ${app.url}`)
                            .join('\n');
      };

      const sportsAppsList = filterApps(SPORTS_KEYWORDS);
      const moviesAppsList = filterApps(MOVIES_KEYWORDS);
      const goldenAppsList = filterApps(GOLDEN_KEYWORDS);
      
      const appList = APPS_DATABASE
        .map(app => `- ${app.name}: ${app.url}`)
        .join('\n');

      const systemInstruction = `أنت مساعد ذكي وودود لموقع "TechTouch". لغتك الأساسية هي العربية. مهمتك هي تحليل استعلام المستخدم وتقديم المساعدة بناءً على القواعد التالية:

1.  **إذا كان استعلام المستخدم عبارة عن تحية أو محادثة عامة (مثل "مرحباً"، "كيف حالك"، "شكراً") ولا يطلب تطبيقًا معينًا:**
    *   أجب برسالة الترحيب التالية بالضبط: "أهلاً بك في موقع techtouch. يمكنك كتابة اسم تطبيقات رياضية أو أفلام ومسلسلات أو ذكاء اصطناعي وسأرد من خلال البيانات المرفوعة".

2.  **إذا كان المستخدم يسأل عن فئة من التطبيقات:**
    *   **تطبيقات الرياضة:** إذا احتوى الطلب على كلمات مثل "رياضة"، "رياضية"، "رياضه"، "الرياضه", "مباريات"، "كرة قدم"، قدم القائمة التالية بعنوان "تفضل، هذه هي التطبيقات الرياضية المتوفرة:":
${sportsAppsList}
    *   **تطبيقات الأفلام والمسلسلات:** إذا احتوى الطلب على كلمات مثل "أفلام"، "افلام"، "مسلسلات"، "سينما"، "دراما"، "انمي"، قدم القائمة التالية بعنوان "تفضل، هذه هي تطبيقات الأفلام والمسلسلات المتوفرة:":
${moviesAppsList}
    *   **التطبيقات الذهبية:** إذا احتوى الطلب على كلمة "الذهبي" أو "ذهبية"، قدم القائمة التالية بعنوان "تفضل، هذه هي التطبيقات الذهبية المتوفرة:":
${goldenAppsList}
    *   قدم القائمة المطلوبة فقط. إذا كان الطلب يطابق أكثر من فئة، قدم كل الفئات المطابقة.

3.  **إذا كان المستخدم يبحث عن تطبيق معين بالاسم (وليس فئة):**
    *   ابحث في القائمة الكاملة للتطبيقات عن اسم التطبيق.
    *   إذا وجدت تطابقًا، أجب بلطف وقدم النتيجة بوضوح مع اسم التطبيق والرابط. مثال: "تفضل، هذا هو رابط تطبيق [اسم التطبيق]: [الرابط]".
    *   إذا لم تجد التطبيق، أجب بلطف: "عذراً، لم أتمكن من العثور على التطبيق المطلوب في قائمتنا."

4.  **قواعد عامة:**
    *   أعطِ الأولوية للبحث عن الفئات (القاعدة 2) قبل البحث بالاسم (القاعدة 3).
    *   لا تقدم أي معلومات غير موجودة في القوائم. لا تخترع روابط.
    *   يجب أن يكون ردك باللغة العربية فقط.

---
القائمة الكاملة للتطبيقات للبحث بالاسم:
${appList}
`;

      const userQuery = `هذا هو استعلام المستخدم: "${query}"`;
      
      const apiResponse = await fetch('/.netlify/functions/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery, systemInstruction }),
      });

      if (!apiResponse.ok) {
        throw new Error(`Server returned an error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.response);

    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };
  
  const renderResponseWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <p className="text-gray-200 whitespace-pre-wrap font-mono">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline break-all"
              >
                {part}
              </a>
            );
          }
          return part;
        })}
      </p>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg"
                aria-label="العودة للصفحة الرئيسية"
              >
                <i className="fas fa-arrow-left"></i>
                <span>العودة</span>
              </button>
            </div>
            
            <div className="w-full max-w-3xl mx-auto">
                <h1 id="ai-search-title" className="text-2xl md:text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
                  <i className="fas fa-robot mr-2"></i>
                  البحث الذكي عن التطبيقات
                </h1>
                <p className="text-center text-gray-400 mb-6">
                  يمكنك البحث عن تطبيقات رياضه افلام مسلسلات وتطبيقات بكتابة اسم التطبيق
                </p>
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                            type="text"
                            placeholder="اكتب اسم التطبيق هنا أو تحدث معي..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full p-4 pl-12 bg-gray-900 border-2 border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            aria-label="Search for an app with AI"
                            disabled={isLoading}
                            autoFocus
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-cogs text-gray-500" aria-hidden="true"></i>
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>جاري البحث...</span>
                            </>
                            ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                <span>اسأل</span>
                            </>
                            )}
                        </button>
                    </div>
                    {error && <p className="text-sky-400 mt-4 text-center">{error}</p>}
                    {response && (
                    <div className="mt-6 p-4 bg-gray-900/70 border border-gray-700 rounded-lg max-h-80 overflow-y-auto">
                        {renderResponseWithLinks(response)}
                    </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default AiSearchPage;