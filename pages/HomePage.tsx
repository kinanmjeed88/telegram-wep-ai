import React from 'react';
import siteData from '../data/site.json';

const HomePage: React.FC = () => {
    // Fallback to placeholder if picture is not set in site.json
    const profilePicture = siteData.profile.picture || "/images/profile-placeholder.png";

    return (
        <div className="profile-card">
            <img src={profilePicture} alt={`الصورة الشخصية لـ ${siteData.profile.name}`} className="profile-pic" />
            <h2>{siteData.profile.name}</h2>
            <p>{siteData.profile.bio}</p>
            <a href={siteData.settings.social.telegram} className="button" target="_blank" rel="noopener noreferrer">
                تواصل معي على تيليجرام
            </a>
        </div>
    );
};

export default HomePage;