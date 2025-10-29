import React from 'react';
import channelData from '../data/channelCategories.json';

const ChannelsPage: React.FC = () => {
    return (
        <article className="page">
            <h1>قنواتي</h1>
            <div className="channels-container">
                {channelData.categories.map(category => (
                    <section key={category.name} className="channel-category">
                        <h2>{category.name}</h2>
                        <div className="channel-grid">
                            {category.channels.map(channel => (
                                <a key={channel.name} href={channel.url} className="channel-card" target="_blank" rel="noopener noreferrer">
                                    <div className="channel-icon">{channel.icon}</div>
                                    <div className="channel-info">
                                        <h3>{channel.name}</h3>
                                        <p>{channel.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </article>
    );
};

export default ChannelsPage;