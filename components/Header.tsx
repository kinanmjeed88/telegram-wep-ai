import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E4YTlhMyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOC42ODUgMTkuMDk3QTkuNzIzIDkuNzIzIDAgMDAyMS43NSAxMmMwLTUuMzg1LTQuMzY1LTkuNzUtOS43NS05Ljc1UzIuMjUgNi42MTUgMi4yNSAxMmE5LjcyMyA5LjcyMyAwIDAwMy4wNjUgNy4wOTdBOTcxNiA5LjcxNiAwIDAwMTIgMjEuNzVhOS43MTYgOS43MTYgIDAgMDA2LjY4NS0yLjY1M3ptLTEyLjU0LTEuMjg1QTcuNDg2IDcuNDg2IDAgMDExMiAxNWE3LjQ4NiA3LjQ4NiAwIDAxNS44NTUgMi44MTJBODYuMjI0IDguMjI0IDAgMDExMiAyMC4yNWE4LjIyNCA4LjIyNCAwIDAxLTUuODU1LTIuNDM4ek0xNS43NSA5YTMuNzUgMy43NSAwIDExLTcuNSAwIDMuNzUgMy43NSAwIDAxNy41IDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+';

const Header: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleImageClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <div
        className="relative w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto group"
        onClick={handleImageClick}
        role="button"
        aria-label="Upload new profile picture"
        title="Click to upload a new picture"
      >
        <img
          src={profileImage}
          alt="Profile"
          className={`w-full h-full rounded-full border-4 border-gray-700 shadow-lg object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-teal-400 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        />
        {!isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300">
            <i className="fas fa-camera text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></i>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-white text-3xl" aria-hidden="true"></i>
          </div>
        )}
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
        TechTouch
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        كل ما يخص التطبيقات، الأخبار التقنية، الأفلام، والترفيه الرقمي.
      </p>
    </header>
  );
};

export default Header;