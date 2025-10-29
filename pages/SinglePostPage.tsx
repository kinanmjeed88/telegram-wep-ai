import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/types';
import YoutubeEmbed from '@/components/YoutubeEmbed';

const SinglePostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [summary, setSummary] = useState('');
    const [details, setDetails] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await fetch(`/.netlify/functions/get-post?slug=${slug}`);
                if (!response.ok) {
                    throw new Error(`Post not found or error loading it.`);
                }
                const data: Post = await response.json();
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const handleAiAction = async (
        action: 'summary' | 'details' | 'share',
        setter: React.Dispatch<React.SetStateAction<string>>,
        loaderSetter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (!post) return;
        loaderSetter(true);
        setter('');

        try {
            const endpoint = action === 'details' ? '/.netlify/functions/ai-post-details' : '/.netlify/functions/ai-post-summary';
            const body = action === 'details' 
                ? JSON.stringify({ title: post.title, content: post.content })
                : JSON.stringify({ content: post.content, type: action === 'share' ? 'share' : 'summary' });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });
            if (!response.ok) throw new Error('Failed to get AI response.');

            const data = await response.json();
            
            if (action === 'share') {
                if (navigator.share) {
                    navigator.share({
                        title: post.title,
                        text: data.summary,
                        url: window.location.href,
                    }).catch(console.error);
                } else {
                    alert('المشاركة غير مدعومة في هذا المتصفح. يمكنك نسخ الرابط يدوياً.');
                }
            } else {
                setter(data.summary || data.details);
            }

        } catch (error) {
            console.error("AI Action failed:", error);
            setter("عذراً، حدث خطأ أثناء جلب البيانات من الذكاء الاصطناعي.");
        } finally {
            loaderSetter(false);
        }
    };

    if (loading) return <div className="spinner"></div>;
    if (error) return <div className="error-message">خطأ: {error} <Link to="/posts">العودة إلى المنشورات</Link></div>;
    if (!post) return <p>لم يتم العثور على المنشور.</p>;

    return (
        <article className="single-post">
            <header className="post-header">
                <h1>{post.title}</h1>
                <p className="post-meta">
                    تاريخ النشر: {new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </header>
            
            <img src={`/${post.image}`} alt={post.title} className="featured-image" />

            <div className="post-content">
                <p className="post-description">{post.description}</p>
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {post.youtube_url && <YoutubeEmbed url={post.youtube_url} />}
            
            {post.link && (
                <a href={post.link} className="button external-link-button" target="_blank" rel="noopener noreferrer">
                    زيارة الرابط الخارجي
                </a>
            )}

            <div className="ai-section">
                <h3>أدوات الذكاء الاصطناعي</h3>
                <div className="ai-actions">
                    <button onClick={() => handleAiAction('summary', setSummary, setSummaryLoading)} disabled={summaryLoading}>
                        {summaryLoading ? 'يتم التلخيص...' : 'تلخيص بالذكاء الاصطناعي'}
                    </button>
                    <button onClick={() => handleAiAction('details', setDetails, setDetailsLoading)} disabled={detailsLoading}>
                        {detailsLoading ? 'يتم البحث...' : 'معلومات أكثر ومصادر'}
                    </button>
                    <button onClick={() => handleAiAction('share', ()=>{}, setSummaryLoading)} disabled={summaryLoading}>
                        {summaryLoading ? 'يتم التحضير...' : 'مشاركة'}
                    </button>
                </div>
                
                {summaryLoading && <div className="spinner"></div>}
                {summary && (
                    <div className="ai-result">
                        <h4>ملخص المقال:</h4>
                        <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                )}
                
                {detailsLoading && <div className="spinner"></div>}
                {details && (
                    <div className="ai-result">
                        <h4>معلومات إضافية:</h4>
                        <ReactMarkdown>{details}</ReactMarkdown>
                    </div>
                )}
            </div>
        </article>
    );
};

export default SinglePostPage;