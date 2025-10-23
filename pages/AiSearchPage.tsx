import React, { useState } from 'react';
import { APPS_DATABASE } from '../data/appsDatabase.ts';

interface AiSearchPageProps {
  onNavigateHome: () => void;
}

type SearchMode = 'general' | 'apps';

interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

const AiSearchPage: React.FC<AiSearchPageProps> = ({ onNavigateHome }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('general');
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setQuery('');
    setResponse('');
    setError('');
    setSources([]);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('الرجاء إدخال سؤالك.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');
    setSources([]);

    try {
      let systemInstruction = '';
      if (searchMode === 'general') {
        systemInstruction = `أنت مساعد ذكي متكامل. مهمتك هي الإجابة على أسئلة المستخدم باللغة العربية بأسلوب واضح وطبيعي.
- نسق إجابتك بشكل جيد باستخدام الفقرات والنقاط عند الحاجة لتسهيل القراءة.
- اعتمد على مصادر البحث الموثوقة المتاحة لك لضمان دقة المعلومات.`;
      } else {
        // App search logic
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
        const appList = APPS_DATABASE.map(app => `- ${app.name}: ${app.url}`).join('\n');
        
        systemInstruction = `أنت مساعد ذكي متخصص في البحث عن تطبيقات لموقع "TechTouch". مهمتك تحليل استعلام المستخدم وتقديم المساعدة بناءً على القواعد التالية باللغة العربية:
1.  إذا كان المستخدم يسأل عن فئة تطبيقات (رياضة, أفلام, الذهبي)، قدم القائمة المخصصة لهذه الفئة.
2.  إذا كان المستخدم يبحث عن تطبيق معين بالاسم، ابحث في القائمة الكاملة وقدم الرابط إن وجد.
3.  إذا لم تجد التطبيق، أجب بلطف: "عذراً، لم أتمكن من العثور على التطبيق المطلوب في قائمتنا."
4.  إذا كان الاستعلام تحية أو سؤال عام، أجب: "أهلاً بك. أنا متخصص في البحث عن التطبيقات. يمكنك كتابة اسم تطبيق أو فئة."
---
قوائم الفئات:
- تطبيقات الرياضة:
${sportsAppsList}
- تطبيقات الأفلام:
${moviesAppsList}
- التطبيقات الذهبية:
${goldenAppsList}
---
القائمة الكاملة للبحث بالاسم:
${appList}`;
      }
      
      const apiResponse = await fetch('/.netlify/functions/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: query, systemInstruction, mode: searchMode }),
      });

      if (!apiResponse.ok) throw new Error(`Server error: ${apiResponse.statusText}`);
      const data = await apiResponse.json();
      if (data.error) throw new Error(data.error);

      setResponse(data.response);
      if(data.sources) setSources(data.sources);

    } catch (e: any) {
      console.error(e);
      setError(`حدث خطأ: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) handleSearch();
  };

  const renderResponse = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const renderLineWithLinks = (line: string, key: React.Key) => {
      const parts = line.split(urlRegex);
      return (
        <React.Fragment key={key}>
          {parts.map((part, index) =>
            part.match(urlRegex) ? (
              <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline break-all">{part}</a>
            ) : ( part )
          )}
        </React.Fragment>
      );
    };

    const paragraphs = text.split(/\n{2,}/);

    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return null;

      const listItems = lines.filter(line => /^\s*[-*•]\s/.test(line));
      const isList = listItems.length > 0 && listItems.length >= lines.length / 2;

      if (isList) {
        return (
          <ul key={pIndex} className="list-disc list-inside space-y-2 mb-4 pl-4">
            {lines.map((line, lIndex) => (
              <li key={lIndex} className="text-gray-200">
                {renderLineWithLinks(line.replace(/^\s*[-*•]\s/, ''), `${pIndex}-${lIndex}`)}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <p key={pIndex} className="text-gray-200 mb-4 whitespace-pre-wrap">
            {paragraph.split('\n').map((line, lIndex) => (
              <span key={lIndex} className="block">
                {renderLineWithLinks(line, `${pIndex}-${lIndex}`)}
              </span>
            ))}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg" aria-label="العودة للصفحة الرئيسية">
                <i className="fas fa-arrow-left"></i><span>العودة</span>
              </button>
            </div>
            
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex justify-center gap-2 mb-4">
                  <button onClick={() => handleModeChange('general')} className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${searchMode === 'general' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    <i className="fas fa-brain mr-2"></i>المساعد الذكي
                  </button>
                  <button onClick={() => handleModeChange('apps')} className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${searchMode === 'apps' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    <i className="fab fa-android mr-2"></i>البحث عن تطبيقات
                  </button>
                </div>

                <h1 id="ai-search-title" className="text-2xl md:text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
                  {searchMode === 'general' ? 'المساعد الذكي المتكامل' : 'البحث الذكي عن التطبيقات'}
                </h1>
                <p className="text-center text-gray-400 mb-6">
                  {searchMode === 'general' ? 'اسأل عن أي شيء، وسأجيبك بدقة من مصادر موثوقة.' : 'ابحث عن تطبيقات رياضية، أفلام، أو اكتب اسم تطبيق معين.'}
                </p>
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                              type="text"
                              placeholder={searchMode === 'general' ? 'اسأل عن أي شيء هنا...' : 'اكتب اسم التطبيق أو فئة...'}
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="w-full p-4 pl-12 bg-gray-900 border-2 border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                              aria-label={searchMode === 'general' ? 'Ask the smart assistant' : 'Search for an app'}
                              disabled={isLoading}
                              autoFocus
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <i className={`fas ${searchMode === 'general' ? 'fa-globe-americas' : 'fa-cogs'} text-gray-500`} aria-hidden="true"></i>
                            </div>
                        </div>
                        <button onClick={handleSearch} disabled={isLoading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {isLoading ? (<><i className="fas fa-spinner fa-spin"></i><span>جاري البحث...</span></>) : (<><i className="fas fa-paper-plane"></i><span>اسأل</span></>)}
                        </button>
                    </div>
                    {error && <p className="text-sky-400 mt-4 text-center">{error}</p>}
                    {(response || sources.length > 0) && (
                      <div className="mt-6 p-4 bg-gray-900/70 border border-gray-700 rounded-lg max-h-[50vh] overflow-y-auto">
                        {response && <div>{renderResponse(response)}</div>}
                        {sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <h4 className="text-gray-300 font-semibold mb-2">المصادر:</h4>
                            <ul className="list-none space-y-2">
                              {sources.map((source, index) => (
                                <li key={index} className="flex items-start">
                                  <i className="fas fa-link text-gray-500 mt-1 mr-2"></i>
                                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline text-sm break-all">
                                    {source.web.title || source.web.uri}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default AiSearchPage;