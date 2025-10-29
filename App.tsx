import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ChannelsPage from './pages/ChannelsPage';
import PostsPage from './pages/PostsPage';
import AiChatPage from './pages/AiChatPage';
import AiImagePage from './pages/AiImagePage';
import AiSearchPage from './pages/AiSearchPage';
import siteData from './data/site.json';
import SinglePostPage from './pages/SinglePostPage';

const App: React.FC = () => {
    return (
        <div className="container">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/channels" element={<ChannelsPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/posts/:slug" element={<SinglePostPage />} />
                    <Route path="/ai-chat" element={<AiChatPage />} />
                    <Route path="/ai-image" element={<AiImagePage />} />
                    <Route path="/ai-search" element={<AiSearchPage />} />
                </Routes>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} {siteData.settings.siteName}. جميع الحقوق محفوظة.</p>
            </footer>
        </div>
    );
};

export default App;
