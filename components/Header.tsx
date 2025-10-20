import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
        TechTouch
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        كل ما يخص التطبيقات، الأخبار التقنية
      </p>
    </header>
  );
};

// FIX: Completed the component and added a default export. The original file was truncated, which caused an import error in App.tsx.
export default Header;
