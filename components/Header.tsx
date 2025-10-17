import React, { useState, useRef, useEffect } from 'react';

// ملاحظة: بيانات الصورة الأساسية الأصلية كانت تالفة.
// لقد استبدلتها بصورة رمزية مؤقتة.
const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E4YTlhMyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOC42ODUgMTkuMDk3QTkuNzIzIDkuNzIzIDAgMDAyMS43NSAxMmMwLTUuMzg1LTQuMzY1LTkuNzUtOS43NS05Ljc1UzIuMjUgNi42MTUgMi4yNSAxMmE5LjcyMyA5LjcyMyAwIDAwMy4wNjUgNy4wOTdBOTcxNiA5LjcxNiAwIDAwMTIgMjEuNzVhOS43MTYgOS43MTYgIDAgMDA2LjY4NS0yLjY1M3ptLTEyLjU0LTEuMjg1QTcuNDg2IDcuNDg2IDAgMDExMiAxNWE3LjQ4NiA3LjQ4NiAwIDAxNS44NTUgMi44MTJBODYuMjI0IDguMjI0IDAgMDExMiAyMC4yNWE4LjIyNCA4LjIyNCAwIDAxLTUuODU1LTIuNDM4ek0xNS43NSA5YTMuNzUgMy43NSAwIDExLTcuNSAwIDMuNzUgMy43NSAwIDAxNy41IDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+';

const Header: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
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
      <img
        src={profileImage}
        alt="Profile"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-gray-700 shadow-lg object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={handleImageClick}
        aria-label="Upload new profile picture"
        title="Click to upload a new picture"
        role="button"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        TechTouch
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        مختص بنشر التطبيقات الرياضيه و تطبيقات الأفلام والمسلسلات والاخبار وتطبيقات خدمية
      </p>
    </header>
  );
};

export default Header;
