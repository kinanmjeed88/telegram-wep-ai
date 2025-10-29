import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostListItem } from '../types';

const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<PostListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/get-posts-list');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: PostListItem[] = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <article className="page">
            <h1>المنشورات</h1>
            {loading && <div className="spinner"></div>}
            {error && <p className="error-message">خطأ في تحميل المنشورات: {error}</p>}
            {!loading && !error && (
                <div className="posts-list">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Link to={`/posts/${post.slug}`} key={post.slug} className="post-card">
                                <img src={post.image} alt={post.title} className="post-card-image" />
                                <div className="post-card-content">
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                    <span className="post-card-date">
                                        {new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>لا توجد منشورات لعرضها حالياً.</p>
                    )}
                </div>
            )}
        </article>
    );
};

export default PostsPage;
