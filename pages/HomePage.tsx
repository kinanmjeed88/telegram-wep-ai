import React from 'react';
import { Link } from 'react-router-dom';
import siteData from '@/data/site.json';

const HomePage: React.FC = () => {
    // Fallback to placeholder if picture is not set in site.json
    const profilePicture = siteData.profile.picture || "/images/profile-placeholder.png";

    return (
        <>
            <div className="profile-card">
                <img src={profilePicture} alt={`الصورة الشخصية لـ ${siteData.profile.name}`} className="profile-pic" />
                <h2>{siteData.profile.name}</h2>
                <div className="bio">
                    {siteData.profile.bio.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>

                <div className="social-links">
                    {siteData.settings.socialLinks?.map(link => (
                        <a key={link.url} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer" aria-label={link.url}>
                            {link.icon}
                        </a>
                    ))}
                </div>
                
                <a href={siteData.settings.socialLinks?.[0]?.url || '#'} className="button" target="_blank" rel="noopener noreferrer">
                    تواصل معي على تيليجرام
                </a>
            </div>

            <section className="features-section">
                <h2>استكشف ميزات الذكاء الاصطناعي</h2>
                <div className="features-grid">
                    <Link to="/ai-chat" className="feature-card">
                        <h3>🤖 دردشة AI</h3>
                        <p>اطرح أي سؤال واحصل على إجابات فورية من Gemini.</p>
                    </Link>
                    <Link to="/ai-image" className="feature-card">
                        <h3>🎨 مولد الصور AI</h3>
                        <p>حوّل أفكارك إلى صور فريدة بلمسة زر.</p>
                    </Link>
                    <Link to="/ai-search" className="feature-card">
                        <h3>🔍 بحث التطبيقات AI</h3>
                        <p>ابحث بذكاء عن أي تطبيق أو قناة تريدها.</p>
                    </Link>
                </div>
            </section>
        </>
    );
};

export default HomePage;