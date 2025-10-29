import React from 'react';
import { NavLink } from 'react-router-dom';
import siteData from '../data/site.json';

const Header: React.FC = () => {
    const menu = [
        { name: "الرئيسية", url: "/" },
        { name: "قنواتي", url: "/channels" },
        { name: "المنشورات", url: "/posts" },
        { name: "دردشة AI", url: "/ai-chat" },
        { name: "مولد الصور AI", url: "/ai-image" },
        { name: "بحث التطبيقات AI", url: "/ai-search" }
    ];

    return (
        <header>
            <div className="announcement-bar">
                {siteData.settings.announcement}
            </div>
            <nav>
                <a href="/" className="site-title">{siteData.settings.siteName}</a>
                <ul>
                    {menu.map(item => (
                        <li key={item.name}>
                            <NavLink to={item.url}
                              className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;