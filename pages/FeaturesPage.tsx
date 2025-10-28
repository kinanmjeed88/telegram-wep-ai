
import React from 'react';

interface FeaturesPageProps {
  onNavigateHome: () => void;
  onNavigateAiSearch: () => void;
  onNavigateAiNews: () => void;
  onNavigateAiImage: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string; onClick?: () => void; href?: string; }> = ({ icon, title, description, onClick, href }) => {
  const content = (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 text-center h-full flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
      <div className="text-4xl text-teal-400 mb-4">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return <div onClick={onClick}>{content}</div>;
};


const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigateHome, onNavigateAiSearch, onNavigateAiNews, onNavigateAiImage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-300 hover:text-teal-300 transition-colors duration-300 text-lg" aria-label="العودة للصفحة الرئيسية">
            <i className="fas fa-arrow-left"></i><span>العودة</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
                الميزات الرئيسية
            </h1>
            <p className="text-gray-400 mb-10">
                استكشف الأدوات والميزات المتقدمة التي نقدمها.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                 <FeatureCard 
                    icon="fa-image"
                    title="توليد الصور بالذكاء الاصطناعي"
                    description="حوّل أفكارك إلى صور فريدة باستخدام أحدث نماذج الذكاء الاصطناعي."
                    onClick={onNavigateAiImage}
                 />
                 <FeatureCard 
                    icon="fa-newspaper"
                    title="آخر أخبار الذكاء الاصطناعي"
                    description="اكتشف أحدث الأدوات التي تعمل بالذكاء الاصطناعي والتي يتم تلخيصها لك مباشرة."
                    onClick={onNavigateAiNews}
                 />
                 <FeatureCard 
                    icon="fa-robot"
                    title="المساعد الذكي"
                    description="ابحث عن تطبيقات أو اسأل عن أي شيء، وسيجيبك مساعدنا الذكي."
                    onClick={onNavigateAiSearch}
                 />
                 <FeatureCard 
                    icon="fa-paper-plane"
                    title="بوت الطلبات"
                    description="تواصل مع بوت الطلبات الخاص بنا على تيليجرام مباشرة."
                    href="https://t.me/techtouchAI_bot"
                 />
            </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
