import React, { useState, useEffect } from 'react';
import type { AiNewsPost } from '../types.ts';

interface AiNewsPageProps {
  onNavigateHome: () => void;
}

const AiNewsPage: React.FC<AiNewsPageProps> = ({ onNavigateHome }) => {
  const [news, setNews] = useState<AiNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/.netlify/functions/ai-news', {
          method: 'POST',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.statusText}`);
        }
        const data: AiNewsPost[] = await response.json();
        setNews(data);
      } catch (e: any) {
        console.error(e);
        setError(`حدث خطأ أثناء جلب الأخبار: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

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
              <p className="text-gray-400 mt-2">{error}</p>
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
                  <h2 className="text-xl md:text-2xl font-bold text-teal-300 mb-4">{post.title}</h2>
                  <ul className="list-none space-y-2 pl-1">
                    {post.summary.split('\n').map((point, pointIndex) => (
                      point.trim() && (
                        <li key={pointIndex} className="text-gray-300 leading-relaxed flex items-start">
                          <span className="text-teal-400 mr-3 mt-1 shrink-0">◆</span>
                          <span>{point.replace(/^-/, '').trim()}</span>
                        </li>
                      )
                    ))}
                  </ul>
                  
                  {post.sources && post.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h3 className="font-semibold text-gray-400 mb-2">المصادر:</h3>
                      <ul className="list-none space-y-2">
                        {post.sources.map((source, sourceIndex) => (
                           <li key={sourceIndex} className="flex items-start">
                             <i className="fas fa-link text-gray-500 mt-1 mr-2 flex-shrink-0"></i>
                             <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-sm break-all">
                               {source.title || source.uri}
                             </a>
                           </li>
                        ))}
                      </ul>
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