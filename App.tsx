import React, { useState, useMemo } from 'react';
import Header from './components/Header.tsx';
import ChannelButton from './components/ChannelButton.tsx';
import { CATEGORIES, MAIN_CHANNEL_URL } from './constants.ts';
import type { Category, Channel } from './types.ts';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  let animationCounter = 0;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Header />
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            قنواتنا على تيليجرام
          </h2>

          <div className="relative w-full max-w-lg mx-auto mb-12">
            <input
              type="text"
              placeholder="ابحث عن قناة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              aria-label="Search for a channel"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-500"></i>
            </div>
          </div>

          <div className="space-y-12">
            {filteredCategories.map((category: Category) => (
              <section key={category.title}>
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-300 border-b-2 border-gray-700 pb-2 transition-colors duration-300 hover:text-teal-300">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {category.channels.map((channel: Channel) => (
                    <ChannelButton 
                      key={channel.name} 
                      channel={channel} 
                      animationIndex={animationCounter++} 
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
        <hr className="border-gray-700 my-12" />
        <footer className="text-center text-gray-500 pb-4">
            <p className="mb-2">
                <a href={MAIN_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 transition-colors duration-300">
                    <i className="fas fa-paper-plane mr-2"></i>
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