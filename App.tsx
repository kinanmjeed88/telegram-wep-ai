
import React from 'react';
import Header from './components/Header.tsx';
import ChannelButton from './components/ChannelButton.tsx';
import { CHANNELS } from './constants.ts';
import type { Channel } from './types.ts';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Header />
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            قنواتنا على تيليجرام
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {CHANNELS.map((channel: Channel) => (
              <ChannelButton key={channel.name} channel={channel} />
            ))}
          </div>
        </div>
        <footer className="text-center text-gray-500 mt-16 pb-4">
            <p>&copy; {new Date().getFullYear()} TechTouch. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;