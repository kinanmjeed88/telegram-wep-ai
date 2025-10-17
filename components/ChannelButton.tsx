import React from 'react';
import type { Channel } from '../types.ts';

interface ChannelButtonProps {
  channel: Channel;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel }) => {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 text-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
    >
      <span className="font-semibold text-lg text-gray-100">
        {channel.name}
      </span>
    </a>
  );
};

export default ChannelButton;
