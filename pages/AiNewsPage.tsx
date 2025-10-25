import React, { useState, useEffect, useCallback } from 'react';
import type { AiNewsPost } from '../types.ts';

interface AiNewsPageProps {
  onNavigateHome: () => void;
}

const AiNewsPage: React.FC<AiNewsPageProps> = ({ onNavigateHome }) => {
  const [news, setNews] = useState<AiNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = useCallback(async () => {
    const isInitialLoad = news.length === 0;
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setError('');

    try {
      const response = await fetch('/.netlify/functions/ai-news', {
        method: 'POST',
      });

      if (!response.ok) {
        let errorMsg = `فشل الطلب: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          console.error("Non-JSON error response from server:", await response.text().catch(() => 'Could not read error body'));
          errorMsg = 'فشل الاتصال بالخادم. قد يكون السبب انقطاع الشبكة أو مشكلة في الخادم.';
        }
        throw new Error(errorMsg);
      }
      
      const data: AiNewsPost[] = await response.json();
      setNews(prevNews => [...prevNews, ...data]);

    } catch (e: any) {
      console.error(e);
      let friendlyError = "حدث خطأ غير متوقع أثناء جلب الأخبار. الرجاء المحاولة مرة أخرى.";
      if (e.message?.includes('503') || e.message?.toLowerCase().includes('overloaded')) {
        friendlyError = "الخادم الخاص بالذكاء الاصطناعي مشغول حاليًا. الرجاء المحاولة مرة أخرى بعد لحظات.";
      } else if (e.message?.toLowerCase().includes('failed to fetch')) {
        friendlyError = "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
      } else {
        friendlyError = `حدث خطأ أثناء جلب الأخبار: ${e.message}`;
      }
      setError(friendlyError);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsFetchingMore(false);
      }
    }
  }, [news.length]);

  useEffect(() => {
    fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on component mount

  const downloadAsPdf = (post: AiNewsPost) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${post.title}</title>
            <style>
              body { font-family: sans-serif; line-height: 1.6; padding: 20px; direction: rtl; text-align: right; }
              h1 { color: #0d9488; } h3 { color: #555; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              a { color: #0ea5e9; text-decoration: none; } ul { list-style-type: none; padding: 0; }
            </style>
          </head>
          <body>
            <h1>${post.title}</h1>
            <p>${post.summary.replace(/\\n/g, '<br/>')}</p>
            ${post.sources && post.sources.length > 0 ? `
              <h3>المصادر:</h3>
              <ul>
                ${post.sources.map(s => `<li><a href="${s.uri}" target="_blank">${s.title || s.uri}</a></li>`).join('')}
              </ul>
            ` : ''}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const sharePost = async (post: AiNewsPost) => {
    const shareData = {
      title: `TechTouch | ${post.title}`,
      text: post.summary,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      console.error("Share failed, falling back to clipboard:", err);
      navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.url}`)
        .then(() => alert('تم نسخ رابط الخبر إلى الحافظة!'))
        .catch(clipErr => console.error("Clipboard write failed:", clipErr));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg" aria-label="العودة للصفحة الرئيسية">
            <i className="fas fa-arrow-left"></i><span>العودة</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            أحدث أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-center text-gray-400 mb-8">
            اكتشف أحدث الأدوات التي تعمل بالذكاء الاصطناعي والتي يتم تلخيصها لك مباشرة.
          </p>

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-teal-400"></i>
              <p className="mt-4 text-lg text-gray-300">جاري جلب آخر الأخبار...</p>
            </div>
          )}

          {error && news.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 border border-sky-500/30 rounded-lg p-6">
              <i className="fas fa-exclamation-triangle text-4xl text-sky-400"></i>
              <p className="mt-4 text-lg text-sky-300">عذراً، حدث خطأ</p>
              <p className="text-gray-400 mt-2 mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="bg-teal-600 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-500 ...">
                  <i className="fas fa-sync-alt mr-2"></i>إعادة المحاولة
              </button>
            </div>
          )}

          <div className="space-y-6">
            {news.map((post, index) => (
              <article
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 channel-button-animation"
                style={{ animationDelay: `${(index % 5) * 150}ms` }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-teal-300 mb-3">{post.title}</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.summary}</p>
                
                {post.sources && post.sources.length > 0 && (
                   <div className="mt-4 pt-3 border-t border-gray-700 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-gray-400 flex-shrink-0">المصادر:</h3>
                    {post.sources.map((source, sourceIndex) => (
                      <a key={sourceIndex} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                        {source.title || new URL(source.uri).hostname}
                      </a>
                    ))}
                  </div>
                )}
                 <div className="mt-5 pt-4 border-t border-gray-700 flex items-center justify-end gap-3">
                    <button onClick={() => sharePost(post)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                      <i className="fas fa-share-alt"></i>مشاركة
                    </button>
                    <button onClick={() => downloadAsPdf(post)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors duration-200">
                      <i className="fas fa-file-pdf"></i>تنزيل PDF
                    </button>
                  </div>
              </article>
            ))}
          </div>

          {!isLoading && (
            <div className="text-center mt-10">
              <button
                onClick={() => fetchNews()}
                disabled={isFetchingMore}
                className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed w-64 h-14 flex items-center justify-center"
              >
                {isFetchingMore ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i><span>جاري التحميل...</span></>
                ) : (
                  <><i className="fas fa-plus mr-2"></i><span>تحميل 5 منشورات أخرى</span></>
                )}
              </button>
            </div>
          )}

          {error && news.length > 0 && (
             <div className="text-center py-6">
                <p className="text-sky-400">{error}</p>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AiNewsPage;
