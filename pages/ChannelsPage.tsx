
import React, { useState, useMemo } from 'react';
import ChannelButton from '../components/ChannelButton.tsx';
import type { ChannelCategory, Channel } from '../types.ts';

interface ChannelsPageProps {
  onNavigateHome: () => void;
  channelCategories: ChannelCategory[];
}

const ChannelsPage: React.FC<ChannelsPageProps> = ({ onNavigateHome, channelCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return channelCategories;
    }
    return channelCategories.map(category => {
      const filteredChannels = category.channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, channels: filteredChannels };
    }).filter(category => category.channels.length > 0);
  }, [searchTerm, channelCategories]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-8">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg" aria-label="العودة للصفحة الرئيسية">
            <i className="fas fa-arrow-left"></i><span>العودة</span>
          </button>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            قنواتنا على تيليجرام
          </h2>

          <div className="relative w-full max-w-lg mx-auto mb-6 flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث عن قناة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                aria-label="Search for a channel"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-500" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredCategories.map((category: ChannelCategory, categoryIndex: number) => (
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
      </main>
    </div>
  );
};

export default ChannelsPage;
