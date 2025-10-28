
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import AiSearchPage from './pages/AiSearchPage.tsx';
import AiNewsPage from './pages/AiNewsPage.tsx';
import FeaturesPage from './pages/FeaturesPage.tsx';
import ChannelsPage from './pages/ChannelsPage.tsx';
import AiImagePage from './pages/AiImagePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import PostsPage from './pages/PostsPage.tsx';
import type { SiteData } from './types.ts';

type Page = 'home' | 'ai-search' | 'ai-news' | 'features' | 'channels' | 'ai-image' | 'admin' | 'posts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await fetch('/.netlify/functions/data');
        if (!response.ok) {
          throw new Error('Failed to fetch site data');
        }
        const data = await response.json();
        setSiteData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSiteData();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'admin') {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check hash on initial load
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = `/${page}`;
    window.scrollTo(0, 0);
  };
  
  const navigateHome = () => {
    setCurrentPage('home');
    window.location.hash = '';
     window.scrollTo(0, 0);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-teal-400"></i>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <i className="fas fa-exclamation-triangle text-4xl text-sky-400 mb-4"></i>
        <h2 className="text-2xl mb-2">حدث خطأ</h2>
        <p className="text-center">{error || 'لم يتم العثور على بيانات الموقع.'}</p>
      </div>
    );
  }

  if (currentPage === 'admin') {
    return <AdminPage onNavigateHome={navigateHome} />;
  }
  if (currentPage === 'ai-search') {
    return <AiSearchPage onNavigateHome={navigateHome} />;
  }
  if (currentPage === 'ai-news') {
    return <AiNewsPage onNavigateHome={navigateHome} />;
  }
  if (currentPage === 'features') {
    return <FeaturesPage 
      onNavigateHome={navigateHome}
      onNavigateAiSearch={() => navigate('ai-search')}
      onNavigateAiNews={() => navigate('ai-news')}
      onNavigateAiImage={() => navigate('ai-image')}
    />;
  }
  if (currentPage === 'channels') {
    return <ChannelsPage onNavigateHome={navigateHome} channelCategories={siteData.channelCategories} />;
  }
  if (currentPage === 'ai-image') {
    return <AiImagePage onNavigateHome={navigateHome} />;
  }
  if (currentPage === 'posts') {
    return <PostsPage onNavigateHome={navigateHome} posts={siteData.posts} postCategories={siteData.postCategories} />;
  }

  const { settings, profile } = siteData;
  const socialLinks = settings.socialLinks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      {settings.announcementText && (
        <div style={{ backgroundColor: '#1f2937' }} className="text-center py-2 px-4 text-sm">
          <a href={settings.announcementLink || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {settings.announcementText}
          </a>
        </div>
      )}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Header siteName={settings.siteName} profile={profile} />

        <div className="flex justify-center items-center gap-6 mt-6">
          {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110"><i className="fab fa-facebook"></i></a>}
          {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110"><i className="fab fa-instagram"></i></a>}
          {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110"><i className="fab fa-youtube"></i></a>}
          {socialLinks.tiktok && <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl transform hover:scale-110"><i className="fab fa-tiktok"></i></a>}
        </div>
        
        <div className="mt-8 mb-6 max-w-lg mx-auto space-y-4">
          <button onClick={() => navigate('features')} className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1">
            <i className="fas fa-star"></i><span>✨ الميزات الرئيسية AI</span>
          </button>
          <button onClick={() => navigate('posts')} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1">
            <i className="fas fa-pen-alt"></i><span>المنشورات</span>
          </button>
          <button onClick={() => navigate('channels')} className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-gray-600/50 hover:from-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1">
            <i className="fab fa-telegram-plane"></i><span>قنواتنا على التيليكرام</span>
          </button>
        </div>

        <hr className="border-gray-700 my-6" />
        <footer className="text-center text-gray-500 pb-4">
          <p className="mb-4">
            <a href={socialLinks.mainTelegram} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 transition-colors duration-300">
              <i className="fas fa-paper-plane mr-2" aria-hidden="true"></i>انضم إلى قناتنا الرئيسية
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved. <a href="#/admin" className="opacity-10 hover:opacity-100 transition-opacity">.</a></p>
        </footer>
      </main>
    </div>
  );
};

export default App;
