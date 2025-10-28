import type { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import type { SiteData } from '../../types.ts';

const getDefaultData = (): SiteData => ({
  settings: {
    siteName: "TechTouch تقنية",
    announcementText: "اهلا بكم في موقع techtouch الجديد .. تم تكوينه بالذكاء الاصطناعي",
    announcementLink: "https://t.me/techtouch7",
    primaryColor: "#14b8a6",
    socialLinks: {
      facebook: "https://www.facebook.com/share/17FBLKFBak/",
      instagram: "https://www.instagram.com/techtouch0?igsh=MXU4cXNzdjZnNDZqbQ==",
      youtube: "https://www.youtube.com/@kinanmajeed",
      tiktok: "https://www.tiktok.com/@techtouch6?_t=ZT-90iE288eVzC&_r=1",
      mainTelegram: "https://t.me/techtouch7",
    },
  },
  profile: {
    name: "كنان الصائغ",
    bio: "مطور ويب ومتخصص في التقنية. أشارك هنا أحدث التطبيقات والأخبار في عالم التكنولوجيا.",
    contactLink: "https://t.me/techtouchAI_bot",
  },
  channelCategories: [
      {
        title: 'القنوات الرئيسية',
        channels: [
          { name: '💯 لمسة تقنية techtouch', url: 'https://t.me/techtouch7' },
          { name: '💯 مناقشات techtouch', url: 'https://t.me/techtouch6' },
        ],
      },
      {
        title: 'قنوات الألعاب',
        channels: [ { name: 'Gaming 🏆', url: 'https://t.me/techtouch0' } ],
      },
  ],
  postCategories: [
    { id: "1", name: "أخبار تقنية" },
    { id: "2", name: "شروحات" }
  ],
  posts: [
    {
      id: "1",
      title: "مرحباً بك في موقعنا الجديد!",
      content: "هذا هو أول منشور تجريبي في الموقع. يمكنك تعديل هذا المنشور أو حذفه وإضافة منشورات جديدة من خلال لوحة التحكم الخاصة بالمدير.",
      categoryId: "1",
      createdAt: new Date().toISOString(),
    }
  ],
});


const handler: Handler = async (event) => {
  const store = getStore("siteData");
  const { ADMIN_PASSWORD } = process.env;

  if (!ADMIN_PASSWORD) {
     return { statusCode: 500, body: JSON.stringify({ error: "ADMIN_PASSWORD environment variable is not set." }) };
  }

  // --- HANDLE POST (UPDATE) REQUEST ---
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { password, data } = body;

      if (password !== ADMIN_PASSWORD) {
        return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized: Invalid password." }) };
      }

      if (!data) {
         return { statusCode: 400, body: JSON.stringify({ error: "Bad Request: No data provided." }) };
      }
      
      await store.setJSON("data", data);
      return { statusCode: 200, body: JSON.stringify({ message: "Data updated successfully." }) };

    } catch (error: any) {
      console.error("Error updating data:", error);
      return { statusCode: 500, body: JSON.stringify({ error: `Failed to update data: ${error.message}` }) };
    }
  }

  // --- HANDLE GET (FETCH) REQUEST ---
  if (event.httpMethod === 'GET') {
    try {
      let data: SiteData | undefined = await store.get("data", { type: "json" });

      if (!data) {
        console.log("No data found in blob store, seeding with default data.");
        const defaultData = getDefaultData();
        await store.setJSON("data", defaultData);
        data = defaultData;
      }
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data),
      };

    } catch (error: any) {
      console.error("Error fetching data:", error);
      return { statusCode: 500, body: JSON.stringify({ error: `Failed to fetch data: ${error.message}` }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
};

export { handler };
