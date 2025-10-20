import React, { useState, useMemo } from 'react';
import Header from './components/Header.tsx';
import ChannelButton from './components/ChannelButton.tsx';
import AiSearchPage from './pages/AiSearchPage.tsx';
import { CATEGORIES, MAIN_CHANNEL_URL } from './constants.ts';
import type { Category, Channel } from './types.ts';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return CATEGORIES;
    }
    return CATEGORIES.map(category => {
      const filteredChannels = category.channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, channels: filteredChannels };
    }).filter(category => category.channels.length > 0);
  }, [searchTerm]);
  
  const hasResults = filteredCategories.some(cat => cat.channels.length > 0);

  const categoryChannelCounts = useMemo(() => {
    const counts: number[] = [0];
    let total = 0;
    for (let i = 0; i < filteredCategories.length - 1; i++) {
      total += filteredCategories[i].channels.length;
      counts.push(total);
    }
    return counts;
  }, [filteredCategories]);

  if (currentPage === 'ai-search') {
    return <AiSearchPage onNavigateHome={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Header />

        <div className="flex justify-center items-center gap-6 mt-6">
            <a href="https://www.facebook.com/share/17FBLKFBak/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110">
                <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/techtouch0?igsh=MXU4cXNzdjZnNDZqbQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110">
                <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@kinanmajeed" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110">
                <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.tiktok.com/@techtouch6?_t=ZT-90iE288eVzC&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110">
                <i className="fab fa-tiktok"></i>
            </a>
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            قنواتنا على تيليجرام
          </h2>

          <div className="relative w-full max-w-lg mx-auto mb-6 flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث عن قناة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                aria-label="Search for a channel"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-500" aria-hidden="true"></i>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('ai-search')}
              className="flex-shrink-0 bg-teal-600 text-white font-semibold h-12 px-3 md:px-4 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              aria-label="ابحث عن تطبيق بمساعدة الذكاء الاصطناعي"
              title="ابحث عن تطبيق بمساعدة الذكاء الاصطناعي"
            >
              <i className="fas fa-robot text-lg"></i>
              <span className="text-xs md:text-sm">بحث AI</span>
            </button>
            <a
              href="https://t.me/techtouchAI_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-sky-600 text-white font-semibold h-12 px-3 md:px-4 rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              aria-label="بوت الطلبات"
              title="بوت الطلبات @techtouchAI_bot"
            >
              <i className="fas fa-paper-plane text-lg"></i>
              <span className="text-xs md:text-sm">بوت الطلبات</span>
            </a>
          </div>

          <div className="space-y-6">
            {filteredCategories.map((category: Category, categoryIndex: number) => (
              <section key={category.title}>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-300 border-b-2 border-gray-700 pb-2 transition-colors duration-300 hover:text-teal-300">
                  {category.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {category.channels.map((channel: Channel, channelIndex: number) => (
                    <ChannelButton 
                      key={channel.name} 
                      channel={channel} 
                      animationIndex={categoryChannelCounts[categoryIndex] + channelIndex} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {!hasResults && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">
                لا توجد قنوات تطابق بحثك.
              </p>
            </div>
          )}
        </div>
        <hr className="border-gray-700 my-6" />
        <footer className="text-center text-gray-500 pb-4">
            <p className="mb-4">
                <a href={MAIN_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 transition-colors duration-300">
                    <i className="fas fa-paper-plane mr-2" aria-hidden="true"></i>
                    انضم إلى قناتنا الرئيسية
                </a>
            </p>
            <p>&copy; {new Date().getFullYear()} TechTouch. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;