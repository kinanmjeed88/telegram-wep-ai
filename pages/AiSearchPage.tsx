import React, { useState, FormEvent } from 'react';
import { App } from '@/types';

const AiSearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<App[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setError(null);
        setResults([]);
        setSearched(true);

        try {
            const response = await fetch('/.netlify/functions/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data.apps);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-feature-page">
            <h1>بحث عن التطبيقات بالذكاء الاصطناعي</h1>
            <p>اسأل عن أي تطبيق باللغة العربية أو الإنجليزية، وسأبحث لك عنه.</p>
            <form onSubmit={handleSubmit} className="app-search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="مثال: أريد تطبيق ياسين تيفي"
                    aria-label="app search query"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'يبحث...' : 'بحث'}
                </button>
            </form>

            {error && <p className="error-message">خطأ: {error}</p>}
            {loading && <div className="spinner"></div>}
            
            <div className="search-results">
                {searched && !loading && results.length > 0 && <h2>نتائج البحث:</h2>}
                {results.map((app, index) => (
                     <a key={index} href={app.url} className="channel-card" target="_blank" rel="noopener noreferrer">
                        <div className="channel-info">
                            <h3>{app.name}</h3>
                            <p>اضغط هنا للانتقال إلى رابط تيليجرام</p>
                        </div>
                    </a>
                ))}
                {searched && !loading && results.length === 0 && <p>لم يتم العثور على أي تطبيقات تطابق بحثك.</p>}
            </div>
        </div>
    );
};

export default AiSearchPage;