import React, { useState, useMemo } from 'react';
import type { Post, PostCategory } from '../types.ts';

interface PostsPageProps {
  onNavigateHome: () => void;
  posts: Post[];
  postCategories: PostCategory[];
}

const PostsPage: React.FC<PostsPageProps> = ({ onNavigateHome, posts, postCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryMap = useMemo(() => {
    return postCategories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);
  }, [postCategories]);

  const filteredPosts = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!selectedCategory) {
      return sortedPosts;
    }
    return sortedPosts.filter(post => post.categoryId === selectedCategory);
  }, [posts, selectedCategory]);

  const renderPostContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg" aria-label="العودة للصفحة الرئيسية">
            <i className="fas fa-arrow-left"></i><span>العودة</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            المنشورات
          </h1>
          <p className="text-center text-gray-400 mb-8">
            آخر الأخبار والشروحات والمقالات.
          </p>

          <div className="mb-6 flex justify-center flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${!selectedCategory ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              الكل
            </button>
            {postCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${selectedCategory === cat.id ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 channel-button-animation"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl md:text-2xl font-bold text-teal-300">{post.title}</h2>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full whitespace-nowrap">{categoryMap[post.categoryId] || 'غير مصنف'}</span>
                  </div>
                   <p className="text-xs text-gray-500 mb-4">
                    {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {renderPostContent(post.content)}
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">لا توجد منشورات في هذه الفئة حاليًا.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostsPage;
