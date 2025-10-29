import React, { useState, FormEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

const AiChatPage: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        const currentHistory = [...history, newUserMessage];
        setHistory(currentHistory);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: currentHistory.slice(0, -1) , message: input }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let modelResponse = '';

            setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                modelResponse += decoder.decode(value, { stream: true });
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                    return newHistory;
                });
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-feature-page">
            <h1>دردشة مع الذكاء الاصطناعي (Gemini)</h1>
            <p>اطرح أي سؤال واحصل على إجابة من نموذج Gemini.</p>
            <div className="chat-container" ref={chatContainerRef}>
                {history.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                         <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    aria-label="chat input"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'يفكر...' : 'إرسال'}
                </button>
            </form>
            {error && <p className="error-message">خطأ: {error}</p>}
        </div>
    );
};

export default AiChatPage;