import React from 'react';
import type { Channel } from '../types.ts';

interface ChannelButtonProps {
  channel: Channel;
  animationIndex: number;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel, animationIndex }) => {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`الانتقال إلى ${channel.name}`}
      className="block w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-md hover:from-teal-600 hover:to-sky-800 transition-all duration-300 transform hover:scale-105 channel-button-animation p-4"
      style={{ animationDelay: `${animationIndex * 100}ms` }}
    >
      <div className="flex items-center justify-center text-center h-full">
        <span className="font-semibold text-sm text-gray-100">
          {channel.name}
        </span>
      </div>
    </a>
  );
};

export default ChannelButton;
