import React, { useState, FormEvent } from 'react';

const AiImagePage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await fetch('/.netlify/functions/ai-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const { image } = await response.json();
            setImageUrl(`data:image/jpeg;base64,${image}`);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-feature-page">
            <h1>مولد الصور بالذكاء الاصطناعي</h1>
            <p>اكتب وصفاً نصياً لإنشاء صورة فريدة باستخدام الذكاء الاصطناعي.</p>
            <form onSubmit={handleSubmit} className="image-gen-form">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: قط يرتدي قبعة فارس فضاء"
                    aria-label="image generation prompt"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'يتم الإنشاء...' : 'إنشاء صورة'}
                </button>
            </form>
            {error && <p className="error-message">خطأ: {error}</p>}
            {loading && <div className="spinner"></div>}
            {imageUrl && (
                <div className="image-result">
                    <h2>الصورة التي تم إنشاؤها:</h2>
                    <img src={imageUrl} alt={prompt} />
                </div>
            )}
        </div>
    );
};

export default AiImagePage;
