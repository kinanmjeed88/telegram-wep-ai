import React, { useState } from 'react';
import type { Channel } from '../types.ts';

interface ChannelButtonProps {
  channel: Channel;
  animationIndex: number;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel, animationIndex }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking copy
    e.stopPropagation(); // Stop event bubbling
    navigator.clipboard.writeText(channel.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div
      className="relative w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-md hover:from-teal-600 hover:to-sky-800 transition-all duration-300 transform hover:scale-105 channel-button-animation group"
      style={{ animationDelay: `${animationIndex * 100}ms` }}
    >
      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`الانتقال إلى ${channel.name}`}
        className="flex items-center justify-between w-full p-4"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <i className={`${channel.icon} text-teal-300`} aria-hidden="true"></i>
          <span className="font-semibold text-lg text-gray-100 truncate">
            {channel.name}
          </span>
        </div>
      </a>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label={`نسخ رابط ${channel.name}`}
        title="نسخ الرابط"
      >
        {copied ? (
          <i className="fas fa-check text-green-400" aria-hidden="true"></i>
        ) : (
          <i className="fas fa-copy" aria-hidden="true"></i>
        )}
      </button>
    </div>
  );
};

export default ChannelButton;