import React, { useState, useEffect } from 'react';
import type { SiteData, SiteSettings, Profile, ChannelCategory, PostCategory, Post, Channel } from '../types.ts';

interface AdminPageProps {
  onNavigateHome: () => void;
}

type AdminTab = 'site' | 'profile' | 'channels' | 'postCategories' | 'posts';

const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('site');

  useEffect(() => {
    const checkAuth = () => {
      const storedPassword = sessionStorage.getItem('adminPassword');
      if (storedPassword) {
        setPassword(storedPassword);
        setIsAuthenticated(true);
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const siteData: SiteData = await response.json();
      setData(siteData);
    } catch (error) {
      console.error(error);
      setAuthError('Could not load site data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      sessionStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Please enter a password.');
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch('/.netlify/functions/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data }),
      });
      const result = await response.json();
      if (!response.ok) {
          if (response.status === 401) {
              setSaveMessage('خطأ: كلمة المرور غير صحيحة. تم تسجيل الخروج.');
              sessionStorage.removeItem('adminPassword');
              setIsAuthenticated(false);
          } else {
              throw new Error(result.error || 'Failed to save data');
          }
      } else {
        setSaveMessage('تم حفظ التغييرات بنجاح!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error: any) {
      setSaveMessage(`فشل الحفظ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = <T extends keyof SiteData>(section: T, value: SiteData[T]) => {
    setData(prevData => prevData ? { ...prevData, [section]: value } : null);
  };

  if (!isAuthenticated) {
    return (
       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button onClick={onNavigateHome} className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-teal-300">
            <i className="fas fa-arrow-left"></i><span>العودة</span>
          </button>
          <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-teal-400">لوحة تحكم المدير</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {authError && <p className="text-red-400 mt-2 text-sm">{authError}</p>}
            <button type="submit" className="w-full mt-6 bg-teal-600 font-bold py-3 rounded-lg hover:bg-teal-500 transition-colors">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-teal-400"></i>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'site': return <SiteSettingsEditor settings={data.settings} onChange={(newSettings) => handleDataChange('settings', newSettings)} />;
      case 'profile': return <ProfileEditor profile={data.profile} onChange={(newProfile) => handleDataChange('profile', newProfile)} />;
      case 'channels': return <ChannelCategoriesEditor categories={data.channelCategories} onChange={(newCats) => handleDataChange('channelCategories', newCats)} />;
      case 'postCategories': return <PostCategoriesEditor categories={data.postCategories} onChange={(newCats) => handleDataChange('postCategories', newCats)} />;
      case 'posts': return <PostsEditor posts={data.posts} categories={data.postCategories} onChange={(newPosts) => handleDataChange('posts', newPosts)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-teal-400">لوحة التحكم</h1>
          <div>
            <button onClick={handleSave} disabled={isSaving} className="bg-teal-600 px-5 py-2 rounded-lg hover:bg-teal-500 transition-colors disabled:bg-gray-600">
              {isSaving ? <><i className="fas fa-spinner fa-spin mr-2"></i>جاري الحفظ...</> : <><i className="fas fa-save mr-2"></i>حفظ التغييرات</>}
            </button>
            <button onClick={onNavigateHome} className="mr-2 text-gray-300 hover:text-white px-4 py-2">الخروج</button>
          </div>
        </div>
        {saveMessage && <div className={`text-center p-2 ${saveMessage.includes('فشل') ? 'bg-red-500' : 'bg-green-500'}`}>{saveMessage}</div>}
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <nav className="flex flex-row md:flex-col flex-wrap gap-2">
              {(['site', 'profile', 'channels', 'postCategories', 'posts'] as AdminTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-right p-3 rounded-lg transition-colors text-sm md:text-base ${activeTab === tab ? 'bg-teal-600 font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  {tab === 'site' && '⚙️ إعدادات الموقع'}
                  {tab === 'profile' && '👤 الملف الشخصي'}
                  {tab === 'channels' && '📺 فئات القنوات'}
                  {tab === 'postCategories' && '🏷️ فئات المنشورات'}
                  {tab === 'posts' && '📝 المنشورات'}
                </button>
              ))}
            </nav>
          </aside>
          <div className="md:w-3/4 bg-gray-800 p-6 rounded-lg">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components for editing different data sections ---
const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
        {children}
    </div>
);
const TextInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = (props) => (
    <input type="text" {...props} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
);
const TextAreaInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string, rows?: number }> = (props) => (
    <textarea {...props} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
);


const SiteSettingsEditor: React.FC<{ settings: SiteSettings; onChange: (settings: SiteSettings) => void; }> = ({ settings, onChange }) => {
    const handleChange = (field: keyof SiteSettings, value: any) => {
        onChange({ ...settings, [field]: value });
    };
    const handleSocialChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
        onChange({ ...settings, socialLinks: { ...settings.socialLinks, [field]: value } });
    };

    return <div>
        <h2 className="text-2xl font-bold mb-4 text-teal-400">إعدادات الموقع</h2>
        <FormRow label="اسم الموقع"><TextInput value={settings.siteName} onChange={e => handleChange('siteName', e.target.value)} /></FormRow>
        <FormRow label="نص الإعلان"><TextInput value={settings.announcementText} onChange={e => handleChange('announcementText', e.target.value)} /></FormRow>
        <FormRow label="رابط الإعلان"><TextInput value={settings.announcementLink} onChange={e => handleChange('announcementLink', e.target.value)} /></FormRow>
        <hr className="my-6 border-gray-700" />
        <h3 className="text-xl font-bold mb-4 text-teal-400">روابط التواصل</h3>
        <FormRow label="فيسبوك"><TextInput value={settings.socialLinks.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} /></FormRow>
        <FormRow label="انستغرام"><TextInput value={settings.socialLinks.instagram} onChange={e => handleSocialChange('instagram', e.target.value)} /></FormRow>
        <FormRow label="يوتيوب"><TextInput value={settings.socialLinks.youtube} onChange={e => handleSocialChange('youtube', e.target.value)} /></FormRow>
        <FormRow label="تيك توك"><TextInput value={settings.socialLinks.tiktok} onChange={e => handleSocialChange('tiktok', e.target.value)} /></FormRow>
        <FormRow label="قناة التيليجرام الرئيسية"><TextInput value={settings.socialLinks.mainTelegram} onChange={e => handleSocialChange('mainTelegram', e.target.value)} /></FormRow>
    </div>
};

const ProfileEditor: React.FC<{ profile: Profile; onChange: (profile: Profile) => void; }> = ({ profile, onChange }) => {
     const handleChange = (field: keyof Profile, value: string) => {
        onChange({ ...profile, [field]: value });
    };
    return <div>
        <h2 className="text-2xl font-bold mb-4 text-teal-400">الملف الشخصي</h2>
        <FormRow label="الاسم"><TextInput value={profile.name} onChange={e => handleChange('name', e.target.value)} /></FormRow>
        <FormRow label="نبذة تعريفية"><TextAreaInput rows={4} value={profile.bio} onChange={e => handleChange('bio', e.target.value)} /></FormRow>
        <FormRow label="رابط التواصل (واتساب/تليجرام)"><TextInput value={profile.contactLink} onChange={e => handleChange('contactLink', e.target.value)} /></FormRow>
    </div>
};

const ChannelCategoriesEditor: React.FC<{ categories: ChannelCategory[]; onChange: (categories: ChannelCategory[]) => void; }> = ({ categories, onChange }) => {
    // Implement full CRUD for categories and channels
    const handleCatChange = (index: number, value: string) => {
        const newCats = [...categories];
        newCats[index].title = value;
        onChange(newCats);
    };
    const addCategory = () => onChange([...categories, {title: 'فئة جديدة', channels: []}]);
    const removeCategory = (index: number) => onChange(categories.filter((_, i) => i !== index));

    const handleChannelChange = (catIndex: number, chanIndex: number, field: keyof Channel, value: string) => {
        const newCats = [...categories];
        newCats[catIndex].channels[chanIndex][field] = value;
        onChange(newCats);
    }
    const addChannel = (catIndex: number) => {
        const newCats = [...categories];
        newCats[catIndex].channels.push({name: 'قناة جديدة', url: ''});
        onChange(newCats);
    }
    const removeChannel = (catIndex: number, chanIndex: number) => {
         const newCats = [...categories];
        newCats[catIndex].channels = newCats[catIndex].channels.filter((_, i) => i !== chanIndex);
        onChange(newCats);
    }

    return <div>
        <h2 className="text-2xl font-bold mb-4 text-teal-400">فئات القنوات</h2>
        {categories.map((cat, i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <TextInput value={cat.title} onChange={(e) => handleCatChange(i, e.target.value)} />
                    <button onClick={() => removeCategory(i)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-xs">حذف الفئة</button>
                </div>
                {cat.channels.map((chan, j) => (
                     <div key={j} className="flex items-center gap-2 mb-2 ml-4">
                        <TextInput value={chan.name} onChange={e => handleChannelChange(i, j, 'name', e.target.value)} placeholder="اسم القناة" />
                        <TextInput value={chan.url} onChange={e => handleChannelChange(i, j, 'url', e.target.value)} placeholder="رابط القناة" />
                        <button onClick={() => removeChannel(i, j)} className="bg-red-800 px-2 py-1 rounded hover:bg-red-700 text-xs">X</button>
                     </div>
                ))}
                <button onClick={() => addChannel(i)} className="bg-teal-800 px-3 py-1 rounded hover:bg-teal-700 text-xs mt-2 ml-4">+ إضافة قناة</button>
            </div>
        ))}
        <button onClick={addCategory} className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-500 mt-4">+ إضافة فئة جديدة</button>
    </div>
};

const PostCategoriesEditor: React.FC<{ categories: PostCategory[]; onChange: (categories: PostCategory[]) => void; }> = ({ categories, onChange }) => {
    const addCategory = () => onChange([...categories, {id: Date.now().toString(), name: 'فئة جديدة'}]);
    const removeCategory = (id: string) => onChange(categories.filter(c => c.id !== id));
    const handleCatChange = (id: string, name: string) => {
        onChange(categories.map(c => c.id === id ? {...c, name} : c));
    };

    return <div>
        <h2 className="text-2xl font-bold mb-4 text-teal-400">فئات المنشورات</h2>
        {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 mb-2">
                <TextInput value={cat.name} onChange={(e) => handleCatChange(cat.id, e.target.value)} />
                <button onClick={() => removeCategory(cat.id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-xs">حذف</button>
            </div>
        ))}
        <button onClick={addCategory} className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-500 mt-4">+ إضافة فئة</button>
    </div>
};

const PostsEditor: React.FC<{ posts: Post[]; categories: PostCategory[]; onChange: (posts: Post[]) => void; }> = ({ posts, categories, onChange }) => {
    const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);

    const handleSavePost = () => {
        if (!editingPost || !editingPost.title || !editingPost.categoryId) return;
        if (editingPost.id) { // Update
            onChange(posts.map(p => p.id === editingPost.id ? editingPost as Post : p));
        } else { // Create
            onChange([...posts, { ...editingPost, id: Date.now().toString(), createdAt: new Date().toISOString() } as Post]);
        }
        setEditingPost(null);
    };
    
    const removePost = (id: string) => onChange(posts.filter(p => p.id !== id));

    if (editingPost) {
        return <div>
            <h3 className="text-xl font-bold mb-4 text-teal-400">{editingPost.id ? 'تعديل المنشور' : 'منشور جديد'}</h3>
            <FormRow label="العنوان"><TextInput value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} /></FormRow>
            <FormRow label="الفئة">
                <select value={editingPost.categoryId || ''} onChange={e => setEditingPost({...editingPost, categoryId: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    <option value="">اختر فئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </FormRow>
            <FormRow label="المحتوى"><TextAreaInput rows={10} value={editingPost.content || ''} onChange={e => setEditingPost({...editingPost, content: e.target.value})} /></FormRow>
            <div className="flex gap-2 mt-4">
                 <button onClick={handleSavePost} className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-500">حفظ المنشور</button>
                 <button onClick={() => setEditingPost(null)} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500">إلغاء</button>
            </div>
        </div>
    }

    return <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-400">المنشورات</h2>
            <button onClick={() => setEditingPost({})} className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-500">+ منشور جديد</button>
        </div>
        <div className="space-y-2">
            {posts.map(post => (
                <div key={post.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <span>{post.title}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingPost(post)} className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 text-xs">تعديل</button>
                        <button onClick={() => removePost(post.id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-xs">حذف</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
};


export default AdminPage;
