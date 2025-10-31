import React, { useState, FormEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/types';

const AiChatPage: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingText, setStreamingText] = useState('');
    const [messageCount, setMessageCount] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, streamingText]);

    // Clear error when user starts typing
    useEffect(() => {
        if (input.trim()) {
            setError(null);
        }
    }, [input]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        // Validate input length
        if (input.length > 4000) {
            setError('الرسالة طويلة جداً (الحد الأقصى 4000 حرف)');
            return;
        }

        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: input.trim() }] };
        const currentHistory = [...history, newUserMessage];
        setHistory(currentHistory);
        setInput('');
        setLoading(true);
        setError(null);
        setMessageCount(prev => prev + 1);
        setStreamingText('');

        try {
            const response = await fetch('/.netlify/functions/ai-chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({ history: currentHistory.slice(-10) , message: input.trim() }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('تم تجاوز حد الطلبات. يرجى الانتظار قليلاً ثم المحاولة.');
                } else if (response.status === 502) {
                    throw new Error('حدث خطأ مؤقت في خدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى بعد قليل.');
                } else if (response.status === 500) {
                    throw new Error('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.');
                }
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('لم يتم استلام استجابة من الخادم');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let modelResponse = '';

            // Add empty AI message placeholder
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            // Handle streaming response
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                modelResponse += chunk;
                setStreamingText(modelResponse);
                
                // Update the last message in history
                setHistory(prev => {
                    const newHistory = [...prev];
                    if (newHistory.length > 0) {
                        newHistory[newHistory.length - 1] = { 
                            role: 'model', 
                            parts: [{ text: modelResponse }] 
                        };
                    }
                    return newHistory;
                });
            }

            // Clear streaming text and set final response
            setStreamingText('');
            setHistory(prev => {
                const newHistory = [...prev];
                if (newHistory.length > 0) {
                    newHistory[newHistory.length - 1] = { 
                        role: 'model', 
                        parts: [{ text: modelResponse }] 
                    };
                }
                return newHistory;
            });

        } catch (err) {
            console.error('Chat error:', err);
            const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
            setError(errorMessage);
            
            // Remove the placeholder AI message on error
            setHistory(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const clearChat = () => {
        setHistory([]);
        setMessageCount(0);
        setError(null);
        setStreamingText('');
    };

    const suggestedQuestions = [
        "ما هي أفضل تطبيقات الألعاب؟",
        "كيف يمكنني تحسين الأداء؟",
        "ما هي أفضل تطبيقات التصميم؟",
        "اقترح لي تطبيقات تحرير الصور"
    ];

    return (
        <div className="ai-feature-page">
            <div className="page-header">
                <div>
                    <h1>دردشة مع الذكاء الاصطناعي (Gemini)</h1>
                    <p>اطرح أي سؤال واحصل على إجابة من نموذج Gemini المتقدم.</p>
                    <div className="chat-stats">
                        <span>عدد الرسائل: {messageCount}</span>
                        {messageCount > 0 && (
                            <button onClick={clearChat} className="clear-chat-btn">
                                مسح المحادثة
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Suggested Questions */}
            {history.length === 0 && (
                <div className="suggested-questions">
                    <h3>أسئلة مقترحة:</h3>
                    <div className="questions-grid">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => setInput(question)}
                                className="suggested-question-btn"
                                disabled={loading}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat Container */}
            <div className="chat-container" ref={chatContainerRef}>
                {history.length === 0 ? (
                    <div className="welcome-message">
                        <h3>مرحباً بك في دردشة الذكاء الاصطناعي!</h3>
                        <p>يمكنك طرح أي سؤال والحصول على إجابة مفصلة من نموذج Gemini.</p>
                    </div>
                ) : (
                    history.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div className="message-content">
                                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                                {loading && msg.role === 'model' && streamingText === msg.parts[0].text && (
                                    <span className="typing-indicator">|</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {/* Streaming indicator */}
                {loading && streamingText && (
                    <div className="chat-message model">
                        <div className="message-avatar">🤖</div>
                        <div className="message-content">
                            <ReactMarkdown>{streamingText}</ReactMarkdown>
                            <span className="typing-indicator">|</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                        <button onClick={() => setError(null)} className="error-close">
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Form */}
            <form onSubmit={handleSubmit} className="chat-form">
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
                        aria-label="chat input"
                        disabled={loading}
                        maxLength={4000}
                        className={error ? 'input-error' : ''}
                    />
                    <div className="input-stats">
                        <span className={input.length > 3500 ? 'warning' : ''}>
                            {input.length}/4000
                        </span>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                    className="send-button"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            📤 إرسال
                        </>
                    )}
                </button>
            </form>

            {/* Tips */}
            <div className="chat-tips">
                <h4>💡 نصائح للاستخدام الأمثل:</h4>
                <ul>
                    <li>كن واضحاً ومحدداً في أسئلتك</li>
                    <li>يمكنك طرح أسئلة متابعة للحصول على مزيد من التفاصيل</li>
                    <li>استخدم اللغة العربية للحصول على أفضل النتائج</li>
                </ul>
            </div>
        </div>
    );
};

export default AiChatPage;
