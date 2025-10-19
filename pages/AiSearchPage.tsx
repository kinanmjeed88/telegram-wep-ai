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
      setError('الرجاء إدخال اسم التطبيق للبحث.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const appList = APPS_DATABASE
        .map(app => `- ${app.name}: ${app.url}`)
        .join('\n');

      const systemInstruction = `You are a friendly and helpful assistant for the "TechTouch" Telegram channel list. Your primary language is Arabic.
Your task is to find the correct Telegram link for a requested application from the provided list.
- If you find one or more matching apps, respond politely in Arabic.
- Present the result clearly with the app name and the link. For example: "تفضل، هذا هو رابط تطبيق [اسم التطبيق]: [الرابط]".
- If multiple versions or links exist for the same app name, list them all.
- If you cannot find the app, say so politely in Arabic, for example: "عذراً، لم أتمكن من العثور على التطبيق المطلوب في قائمتنا."
- Do not provide any information that is not in the list. Do not make up links.
- Your response must be only in Arabic.

Here is the list of applications:
${appList}`;

      const userQuery = `Please find the app with the name: "${query}"`;
      
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
                <h1 id="ai-search-title" className="text-2xl md:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
                  <i className="fas fa-robot mr-2"></i>
                  البحث الذكي عن التطبيقات
                </h1>
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                            type="text"
                            placeholder="اكتب اسم التطبيق هنا..."
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
                    {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                    {response && (
                    <div className="mt-6 p-4 bg-gray-900/70 border border-gray-700 rounded-lg max-h-80 overflow-y-auto">
                        <p className="text-gray-200 whitespace-pre-wrap font-mono">{response}</p>
                    </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default AiSearchPage;
