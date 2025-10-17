import React from 'react';
import type { Channel } from '../types';

interface ChannelButtonProps {
  channel: Channel;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel }) => {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex-grow text-center">
        <span className="font-bold text-lg text-gray-200 group-hover:text-white transition-colors duration-300">
          {channel.name}
        </span>
      </div>
    </a>
  );
};

export default ChannelButton;