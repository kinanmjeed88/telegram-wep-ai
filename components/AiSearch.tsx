import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { APPS_DATABASE } from '../data/appsDatabase.ts';

interface AiSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiSearch: React.FC<AiSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResponse('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('الرجاء إدخال اسم التطبيق للبحث.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      setResponse(result.text);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-search-title"
    >
      <div
        className="bg-gray-800 w-full max-w-2xl p-6 rounded-xl shadow-lg border border-gray-700 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close AI search"
        >
          <i className="fas fa-times text-2xl"></i>
        </button>

        <h3 id="ai-search-title" className="text-xl md:text-2xl font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
          <i className="fas fa-robot mr-2"></i>
          ابحث عن تطبيق بمساعدة الذكاء الاصطناعي
        </h3>
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
            className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>جاري البحث...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                <span>اسأل</span>
              </>
            )}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        {response && (
          <div className="mt-6 p-4 bg-gray-900/70 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
            <p className="text-gray-200 whitespace-pre-wrap font-mono">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSearch;