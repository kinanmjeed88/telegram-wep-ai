import React from 'react';

interface YoutubeEmbedProps {
  url: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url }) => {
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(url);

  if (!videoId) {
    return <p>رابط يوتيوب غير صالح.</p>;
  }

  return (
    <div className="youtube-embed">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

export default YoutubeEmbed;
