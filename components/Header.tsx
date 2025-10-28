import React from 'react';
import type { Profile } from '../types.ts';

interface HeaderProps {
  siteName: string;
  profile: Profile;
}

const Header: React.FC<HeaderProps> = ({ siteName, profile }) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
        {siteName}
      </h1>
      <p className="mt-4 text-xl text-gray-300 font-light">
        بواسطة: <span className="font-semibold">{profile.name}</span>
      </p>
      <p className="mt-2 text-md text-gray-400 max-w-2xl mx-auto">
        {profile.bio}
      </p>
    </header>
  );
};

export default Header;
