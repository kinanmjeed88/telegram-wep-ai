import React, { useState, useEffect, useCallback } from 'react';
import type { AiNewsPost } from '../types.ts';

interface AiNewsPageProps {
  onNavigateHome: () => void;
}

const AiNewsPage: React.FC<AiNewsPageProps> = ({ onNavigateHome }) => {
  const [news, setNews] = useState<AiNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/ai-news', {
        method: 'POST',
      });

      if (!response.ok) {
        let errorMsg = `فشل الطلب: ${response.status} ${response.statusText}`;
        try {
          // Attempt to parse a JSON error body from the function
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          // If the body isn't JSON, it might be an HTML error from the gateway (e.g., timeout)
          console.error("Non-JSON error response from server:", await response.text().catch(() => 'Could not read error body'));
          errorMsg = 'فشل الاتصال بالخادم. قد يكون السبب انقطاع الشبكة أو مشكلة في الخادم.';
        }
        throw new Error(errorMsg);
      }
      
      const data: AiNewsPost[] = await response.json();
      setNews(data);

    } catch (e: any) {
      console.error(e);
      let friendlyError = "حدث خطأ غير متوقع أثناء جلب الأخبار. الرجاء المحاولة مرة أخرى.";
      if (e.message && (e.message.includes('503') || e.message.toLowerCase().includes('overloaded'))) {
        friendlyError = "الخادم الخاص بالذكاء الاصطناعي مشغول حاليًا. الرجاء المحاولة مرة أخرى بعد لحظات.";
      } else if (e.message && e.message.toLowerCase().includes('failed to fetch')) {
        friendlyError = "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
      } else {
        friendlyError = `حدث خطأ أثناء جلب الأخبار: ${e.message}`;
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
            آخر أخبار وتطورات الذكاء الاصطناعي
          </h1>
          <p className="text-center text-gray-400 mb-8">
            يتم جلب هذه الأخبار تلقائياً بواسطة الذكاء الاصطناعي لضمان حصولك على أحدث المعلومات.
          </p>

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-teal-400"></i>
              <p className="mt-4 text-lg text-gray-300">جاري جلب آخر الأخبار...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 bg-gray-800/50 border border-sky-500/30 rounded-lg p-6">
              <i className="fas fa-exclamation-triangle text-4xl text-sky-400"></i>
              <p className="mt-4 text-lg text-sky-300">عذراً، حدث خطأ</p>
              <p className="text-gray-400 mt-2 mb-6">{error}</p>
              <button
                  onClick={fetchNews}
                  disabled={isLoading}
                  className="bg-teal-600 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  إعادة المحاولة
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-6">
              {news.map((post, index) => (
                <article
                  key={index}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 channel-button-animation"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-teal-300 mb-3">{post.title}</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {post.summary.replace(/^- /gm, '').replace(/\n/g, ' ').trim()}
                  </p>
                  
                  {post.sources && post.sources.length > 0 && (
                     <div className="mt-4 pt-3 border-t border-gray-700 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-semibold text-gray-400 flex-shrink-0">المصادر:</h3>
                      {post.sources.map((source, sourceIndex) => (
                        <React.Fragment key={sourceIndex}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                            {source.title || new URL(source.uri).hostname}
                          </a>
                          {sourceIndex < post.sources.length - 1 && <span className="text-gray-600">|</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AiNewsPage;
