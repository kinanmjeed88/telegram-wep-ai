import { GoogleGenAI, Type } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";
import type { App } from "../../types";

// Data moved from data/appsDatabase.ts to fix Hugo build error
const apps: App[] = [
  { name: 'Gaming 🏆 مناقشات', url: 'https://t.me/+ga-cVRm_MVNmNjFi' },
  { name: 'PS3 العاب', url: 'https://t.me/+7P4DCjUqJzs5MGMy' },
  { name: 'Photo 4k', url: 'https://t.me/+PQ_NBDulNVAxMDky' },
  { name: 'TechTouch Gaming 🏆', url: 'https://t.me/techtouch0' },
  { name: 'TechTouch 🎮 GAME PS&PC', url: 'https://t.me/techtouch4' },
  { name: 'pc & ps 🏆⁩ مناقشات', url: 'https://t.me/+B1bDJP1Tb143ZmUy' },
  { name: 'tech Prompt', url: 'https://t.me/kinan_tech' },
  { name: 'techtouch اكستريم', url: 'https://t.me/+F22ItxvHF0liZmQ6' },
  { name: 'techtouch الصور', url: 'https://t.me/techtouch5' },
  { name: 'ارشفه ملفات', url: 'https://t.me/+lbZCJG9IErxmMGE6' },
  { name: 'اكستريم 🎬 techtouch', url: 'https://t.me/techtouch1' },
  { name: 'التربية الفنية', url: 'https://t.me/+epRocB9hhmszYjli' },
  { name: 'العاب PS2', url: 'https://t.me/+a8ibDqXvgpc3MDIy' },
  { name: 'العاب Winlator', url: 'https://t.me/+RSUhB6QkeAplOWYy' },
  { name: 'العــراق', url: 'https://t.me/techtouch01' },
  { name: 'روابط البث المباشر', url: 'https://t.me/techtouch9' },
  { name: 'مسلسلات', url: 'https://t.me/+vzQJsg7OADNlZjBi' },
  { name: '💯 لمسة تقنية techtouch', url: 'https://t.me/techtouch7' },
  { name: '💯 مناقشات techtouch', url: 'https://t.me/techtouch6' },
  { name: 'حل مشكلة تحذير الحماية', url: 'https://t.me/techtouch7/238' },
  { name: 'معرفة النت عندك اي دقة تشاهد', url: 'https://t.me/techtouch7/3061' },
  { name: '❍ مدقق السرعة', url: 'https://t.me/techtouch7/3060' },
  { name: 'تطبيق النقل للشاشات', url: 'https://t.me/techtouch7/152' },
  { name: 'تطبيق داونلودر', url: 'https://t.me/techtouch7/2021' },
  { name: 'مجموعة تطبيقات مدفوعة', url: 'https://t.me/techtouch7/3125' },
  { name: 'Black Ultra', url: 'https://t.me/techtouch7/2719' },
  { name: 'OTF TV', url: 'https://t.me/techtouch7/3873' },
  { name: 'ZAIN LIVE', url: 'https://t.me/techtouch7/1992' },
  { name: 'الرئيس لايف', url: 'https://t.me/techtouch7/3569' },
  { name: 'Remo tv', url: 'https://t.me/techtouch7/3518' },
  { name: 'الكتلا tv', url: 'https://t.me/techtouch7/4129' },
  { name: 'SUMER TV', url: 'https://t.me/techtouch7/2346' },
  { name: 'Zoon TV Pro', url: 'https://t.me/techtouch7/3661' },
  { name: 'Yalla Shoot', url: 'https://t.me/techtouch7/674' },
  { name: 'Genral TV', url: 'https://t.me/techtouch7/4116' },
  { name: 'Mix Flix TV', url: 'https://t.me/techtouch7/1450' },
  { name: 'تـ AYA tv', url: 'https://t.me/techtouch7/4' },
  { name: 'Shoof', url: 'https://t.me/techtouch7/372' },
  { name: 'Arabic TV', url: 'https://t.me/techtouch7/126' },
  { name: 'RBTV77', url: 'https://t.me/techtouch7/1516?single' },
  { name: 'الوكا تيفي', url: 'https://t.me/techtouch7/140?single' },
  { name: 'يـاسيــن تيفي بــــرو', url: 'https://t.me/techtouch7/137' },
  { name: 'ياسين تيفي الاخضر', url: 'https://t.me/techtouch7/138' },
  { name: 'ياسين تيفي الاســود', url: 'https://t.me/techtouch7/136' },
  { name: 'cast x Tv', url: 'https://t.me/techtouch7/2042' },
  { name: 'العالم tv', url: 'https://t.me/techtouch7/1760' },
  { name: 'الاسطـورة tv', url: 'https://t.me/techtouch7/3742?single' },
  { name: 'دراما لايف tv', url: 'https://t.me/techtouch7/1686' },
  { name: 'Sport Juventus', url: 'https://t.me/techtouch7/1861?single' },
  { name: 'kora tv pro', url: 'https://t.me/techtouch7/3561' },
  { name: 'wced live', url: 'https://t.me/techtouch7/3850' },
  { name: 'كيرا tv', url: 'https://t.me/techtouch7/2597' },
  { name: 'KING TV', url: 'https://t.me/techtouch7/132' },
  { name: 'VIC TV', url: 'https://t.me/techtouch7/2702' },
  { name: 'AYMAN TV', url: 'https://t.me/techtouch7/513' },
  { name: 'Adam tv 4K', url: 'https://t.me/techtouch7/1699?single' },
  { name: 'Veo', url: 'https://t.me/techtouch7/160' },
  { name: 'VIO', url: 'https://t.me/techtouch7/189' },
  { name: 'Zerda Live', url: 'https://t.me/techtouch7/657' },
  { name: 'OTTO TV', url: 'https://t.me/techtouch7/1164' },
  { name: 'Ottplayer', url: 'https://t.me/techtouch7/1166' },
  { name: 'سكور سوفت', url: 'https://t.me/techtouch7/333' },
  { name: 'موقع الوزير', url: 'https://t.me/techtouch7/2003' },
  { name: 'مشغل كود اكستريم', url: 'https://t.me/techtouch7/1831?single' },
  { name: 'IPTV PRO', url: 'https://t.me/techtouch7/1832' },
  { name: 'حل مشكلة تحذير الحماية للتطبيقات', url: 'https://t.me/techtouch7/238' },
  { name: 'Cinemana X', url: 'https://t.me/techtouch7/173' },
  { name: 'CEE', url: 'https://t.me/techtouch7/174' },
  { name: 'سينمانا لينباك للشاشا', url: 'https://t.me/techtouch7/176?single' },
  { name: 'CEE لينباك للشاشات', url: 'https://t.me/techtouch7/178' },
  { name: 'سينمانا لكل الشبكات', url: 'https://t.me/techtouch7/1668' },
  { name: 'Move Witcher', url: 'https://t.me/techtouch7/165' },
  { name: 'Anime Witcher', url: 'https://t.me/techtouch7/2249' },
  { name: 'فودو موفي لكل الشبكات', url: 'https://t.me/techtouch7/170' },
  { name: 'EgyBest', url: 'https://t.me/techtouch7/1478' },
  { name: 'Egy watch', url: 'https://t.me/techtouch7/1032' },
  { name: 'FastMovies', url: 'https://t.me/techtouch7/1033' },
  { name: 'MovieBox', url: 'https://t.me/techtouch7/2070' },
  { name: 'فاصل HD', url: 'https://t.me/techtouch7/1473' },
  { name: 'Netflix م', url: 'https://t.me/techtouch7/2676' },
  { name: 'NETFLY', url: 'https://t.me/techtouch7/3797' },
  { name: 'دراما لايف', url: 'https://t.me/techtouch7/186' },
  { name: 'سي درامــا', url: 'https://t.me/techtouch7/1431?single' },
  { name: 'دراما وورد', url: 'https://t.me/techtouch7/187?single' },
  { name: 'سيمو دراما', url: 'https://t.me/techtouch7/191' },
  { name: 'تطبيق Bee tv', url: 'https://t.me/techtouch7/2263?single' },
  { name: 'HDO', url: 'https://t.me/techtouch7/258?single' },
  { name: 'HITV .', url: 'https://t.me/techtouch7/3860' },
  { name: 'تـ VIU فيو', url: 'https://t.me/techtouch7/1622' },
  { name: 'Loklok', url: 'https://t.me/techtouch7/1474' },
  { name: 'قصة عشق', url: 'https://t.me/techtouch7/4127' },
  { name: 'MeloShort', url: 'https://t.me/techtouch7/3087' },
  { name: 'DramaBoxNetShort ReelShort', url: 'https://t.me/techtouch7/2987?single' },
  { name: 'HiShortShortShows MeloShort', url: 'https://t.me/techtouch7/2990?single' },
  { name: 'Fun Drama و Micro Drama', url: 'https://t.me/techtouch7/3169?single' },
  { name: 'AniTaku', url: 'https://t.me/techtouch7/192' },
  { name: 'مسلسلات وكرتون انمي', url: 'https://t.me/techtouch7/193' },
  { name: 'انمي', url: 'https://t.me/techtouch7/194?single' },
  { name: 'انمي داي', url: 'https://t.me/techtouch7/3008?single' },
  { name: 'انمي داي 3.3', url: 'https://t.me/techtouch7/3016?single' },
  { name: 'كرتون عربي', url: 'https://t.me/techtouch7/199' },
  { name: 'Anifox', url: 'https://t.me/techtouch7/200' },
  { name: 'كرانشي رول', url: 'https://t.me/techtouch7/2048' },
  { name: 'Roya tv', url: 'https://t.me/techtouch7/1274' },
  { name: 'موقع افلام', url: 'https://t.me/techtouch7/1995' },
  { name: 'موقع بلكس', url: 'https://t.me/techtouch7/172' },
  { name: 'فيسبوك الذهبي', url: 'https://t.me/techtouch7/827?single' },
  { name: 'ماسنجر الذهبي', url: 'https://t.me/techtouch7/9?single' },
  { name: '✪ تـ واتساب الذهبي', url: 'https://t.me/techtouch7/3071' },
  { name: 'تيليكرام بلس و الذهبي', url: 'https://t.me/techtouch7/1811?single' },
  { name: 'انستكرام الذهبي', url: 'https://t.me/techtouch7/283' },
  { name: 'سناب جات الذهبي', url: 'https://t.me/techtouch7/1610' },
  { name: 'تويتر الذهبي', url: 'https://t.me/techtouch7/1275' },
  { name: 'تيكتوك الذهبي', url: 'https://t.me/techtouch7/1250?single' },
  { name: 'يوتيوب الذهبي', url: 'https://t.me/techtouch7/222?single' },
  { name: 'سناب تيوب الذهبي', url: 'https://t.me/techtouch7/2808' },
  { name: 'انستا برو', url: 'https://t.me/techtouch7/65' },
  { name: 'تروكولر اموليد الذهبي', url: 'https://t.me/techtouch7/3753' },
  { name: 'تكرار التطبيقات', url: 'https://t.me/techtouch7/1218' },
  { name: 'تحميل اي التطبيق من القائمة', url: 'https://t.me/techtouch7/28?single' },
  { name: 'SDdownloader', url: 'https://t.me/techtouch7/30' },
  { name: 'YTDLnis v1.8.4', url: 'https://t.me/techtouch7/1947' },
  { name: 'Adobe Premiere Rush', url: 'https://t.me/techtouch7/320' },
  { name: 'Adobe Express Premium', url: 'https://t.me/techtouch7/321' },
  { name: 'Photoshop Express Premium', url: 'https://t.me/techtouch7/323' },
  { name: 'Lightroom Premium', url: 'https://t.me/techtouch7/322' },
  { name: 'Alight Motion', url: 'https://t.me/techtouch7/2454' },
  { name: 'ToonMe', url: 'https://t.me/techtouch7/324?single' },
  { name: 'Photo Lab', url: 'https://t.me/techtouch7/895' },
  { name: 'Remini مجاني', url: 'https://t.me/techtouch7/456' },
  { name: 'Remini', url: 'https://t.me/techtouch7/2584?single' },
  { name: 'PicsArt', url: 'https://t.me/techtouch7/76' },
  { name: 'photoroom', url: 'https://t.me/techtouch7/896' },
  { name: 'magic eraser', url: 'https://t.me/techtouch7/1317' },
  { name: 'InShot', url: 'https://t.me/techtouch7/494' },
  { name: 'ShotCut AI', url: 'https://t.me/techtouch7/1162' },
  { name: 'Hypic pro', url: 'https://t.me/techtouch7/3540' },
  { name: 'Pixel Lab', url: 'https://t.me/techtouch7/99' },
  { name: 'CamScanner', url: 'https://t.me/techtouch7/495' },
  { name: '1.1.1.1', url: 'https://t.me/techtouch7/889' },
  { name: 'VPN', url: 'https://t.me/techtouch6/26476?single' },
  { name: 'NoPing', url: 'https://t.me/techtouch7/2623' },
  { name: 'باندا vpn', url: 'https://t.me/techtouch7/3671' },
  { name: 'mobioffice', url: 'https://t.me/techtouch7/1172' },
  { name: 'Office 365', url: 'https://t.me/techtouch7/37' },
  { name: 'مجموعة ادوات PDF', url: 'https://t.me/techtouch7/41?single' },
  { name: 'PDFelement', url: 'https://t.me/techtouch7/39' },
  { name: 'speechnotes', url: 'https://t.me/techtouch7/38' },
  { name: 'Noteshelf 3', url: 'https://t.me/techtouch7/350' },
  { name: 'ناسخ التطبيقات', url: 'https://t.me/techtouch7/203' },
  { name: 'ZArchiver', url: 'https://t.me/techtouch7/296' },
  { name: 'قطع النت عن التطبيقات', url: 'https://t.me/techtouch7/418' },
  { name: 'كاشف الاعلانات في الهاتف', url: 'https://t.me/techtouch7/802' },
  { name: 'نقل التطببقات للشاشة', url: 'https://t.me/techtouch7/2255' },
  { name: 'تطبيق داونلود البرتقالي للشاشات', url: 'https://t.me/techtouch7/2021' },
  { name: '1DM+ افضل تطبيق', url: 'https://t.me/techtouch7/3712' },
  { name: 'دراسة علم التشريح', url: 'https://t.me/techtouch7/44?single' },
  { name: 'تطبيق اطلس Atlas', url: 'https://t.me/techtouch7/44?single' },
  { name: 'الرسوم التوضيحية للاسنان', url: 'https://t.me/techtouch7/46' },
  { name: 'Dr.Fone', url: 'https://t.me/techtouch7/910' },
  { name: 'Disk Digger', url: 'https://t.me/techtouch7/741?single' },
  { name: 'نظام اندرويد ثانوي', url: 'https://t.me/techtouch7/3026' },
  { name: 'VPhoneOS', url: 'https://t.me/techtouch7/3677' },
  { name: 'كيبورد الذكاء الاصطناعي', url: 'https://t.me/techtouch7/1733' },
  { name: 'كيبورد القلعة المزخرف', url: 'https://t.me/techtouch7/80' },
  { name: 'كيبورد المزخرف الاحترافي', url: 'https://t.me/techtouch7/4100' },
  { name: 'كيبورد الايفون', url: 'https://t.me/techtouch7/3217' },
  { name: 'كيبورد الايفون الاصلي', url: 'https://t.me/techtouch7/3223' },
  { name: 'لانجر ايفون اصلي', url: 'https://t.me/techtouch7/3423' },
  { name: 'ChatOn', url: 'https://t.me/techtouch7/1489' },
  { name: 'Chat smith', url: 'https://t.me/techtouch7/1593' },
  { name: 'PDF AI', url: 'https://t.me/techtouch7/87' },
  { name: 'Genie AI', url: 'https://t.me/techtouch7/1103' },
  { name: 'Deep Think', url: 'https://t.me/techtouch7/1056' },
  { name: 'Mate AI', url: 'https://t.me/techtouch7/77' },
  { name: 'ChatBot', url: 'https://t.me/techtouch7/83' },
  { name: 'ملاحظات بالذكاء الاصطناعي', url: 'https://t.me/techtouch7/84' },
  { name: 'Question.AI', url: 'https://t.me/techtouch7/88' },
  { name: 'ASK AI', url: 'https://t.me/techtouch7/88' },
  { name: 'تعديل الصور بالذكاء الاصطناعي', url: 'https://t.me/techtouch7/91?single' },
  { name: 'FaceApp', url: 'https://t.me/techtouch7/1950' },
  { name: 'FaceOver', url: 'https://t.me/techtouch7/1825' },
  { name: 'Aiuta', url: 'https://t.me/techtouch7/94' },
  { name: 'Saifs ai', url: 'https://t.me/techtouch7/1758?single' },
  { name: 'Fitroom', url: 'https://t.me/techtouch7/2801' },
  { name: 'Livensa', url: 'https://t.me/techtouch7/225' },
  { name: 'Zeemo', url: 'https://t.me/techtouch7/1929' },
  { name: 'تحويل الصور الى كرتون بالذكاء', url: 'https://t.me/techtouch7/2087' },
  { name: 'صناعة فيديو بالذكاء', url: 'https://t.me/techtouch7/3167' },
  { name: 'قناة الصور دقة عالية 4K', url: 'https://t.me/techtouch5' },
  { name: '❌ حذف حساب التلي', url: 'https://t.me/techtouch7/161' },
  { name: '🚀قسم التطبيقات الرياضيه', url: 'https://t.me/techtouch7/124' },
  { name: 'روابط قنوات', url: 'https://t.me/techtouch7/4084' },
  { name: 'قسم الافــــــــلام', url: 'https://t.me/techtouch7/163' },
  { name: '🏖️تطبيقات اليوتيوب المعدل', url: 'https://t.me/techtouch7/237' },
  { name: 'قسم التطبيقــات', url: 'https://t.me/techtouch7/47' },
  { name: 'شروحات توضيح', url: 'https://t.me/techtouch7/671' },
  { name: 'قسم الذكاء الاصطناعي', url: 'https://t.me/techtouch7/95' },
  { name: 'تـ Cinemana X سينمانا', url: 'https://t.me/techtouch7/173' },
  { name: 'المنصة للشاشات', url: 'https://t.me/techtouch7/75' },
  { name: 'MYTV', url: 'https://t.me/techtouch7/204' },
  { name: '✪ تـ Viva cut', url: 'https://t.me/techtouch7/2975?single' },
  { name: '✪ تـ CapCut', url: 'https://t.me/techtouch7/3287' },
  { name: 'ناسخ تطبيقات', url: 'https://t.me/techtouch7/3472' },
];


// Helper functions for better search functionality
const normalizeArabicText = (text: string): string => {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ي]/g, 'ى')
    .trim();
};

const fuzzySearch = (query: string, apps: App[]): App[] => {
  const normalizedQuery = normalizeArabicText(query.toLowerCase());
  
  return apps.filter(app => {
    const normalizedAppName = normalizeArabicText(app.name.toLowerCase());
    
    // Exact match
    if (normalizedAppName.includes(normalizedQuery)) {
      return true;
    }
    
    // Partial match with word boundaries
    const queryWords = normalizedQuery.split(/\s+/);
    return queryWords.some(word => 
      normalizedAppName.includes(word) && word.length > 1
    );
  }).slice(0, 20); // Limit results
};

const categorizeSearch = (query: string, apps: App[]): App[] => {
  const categories = {
    'ألعاب': ['gaming', 'game', 'عاب', 'ps', 'pc'],
    'تسلية': ['tv', 'cinema', 'movie', 'drama', 'series', 'تيلي', 'فيديو'],
    'أخبار': ['news', 'أخبار'],
    'تطبيقات معدلة': ['gold', 'ذهبي', 'mod', 'تلي', 'واتساب'],
    'ذكاء اصطناعي': ['ai', 'chat', 'ذكاء', 'bot'],
    'تصميم': ['photo', 'design', 'photo', 'video', 'editing'],
    'إنتاجية': ['office', 'pdf', 'document', 'notes']
  };

  const lowerQuery = query.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return fuzzySearch(query, apps).filter(app =>
        keywords.some(keyword => app.name.toLowerCase().includes(keyword))
      );
    }
  }
  
  return fuzzySearch(query, apps);
};

const handler: Handler = async (event): Promise<HandlerResponse> => {
    if (event.httpMethod !== 'POST') {
        return { 
          statusCode: 405, 
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        if (!event.body) {
            return { 
              statusCode: 400, 
              body: JSON.stringify({ error: 'Request body is required' })
            };
        }

        const { query } = JSON.parse(event.body);
        
        if (!query || typeof query !== 'string') {
            return { 
              statusCode: 400, 
              body: JSON.stringify({ error: 'Valid query string is required' })
            };
        }

        if (query.length < 2) {
            return { 
              statusCode: 400, 
              body: JSON.stringify({ error: 'Query must be at least 2 characters long' })
            };
        }

        if (query.length > 100) {
            return { 
              statusCode: 400, 
              body: JSON.stringify({ error: 'Query too long (max 100 characters)' })
            };
        }

        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('API key not configured');
            return { 
              statusCode: 500, 
              body: JSON.stringify({ error: 'Server configuration error: API key not found' })
            };
        }

        // First try AI-powered search
        let foundApps: App[] = [];
        
        try {
            const ai = new GoogleGenAI({ apiKey });
            const appNames = apps.map(app => app.name);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `User query: "${query}". Available apps: [${appNames.join(', ')}]`,
                config: {
                    systemInstruction: `You are an expert app finder. Given a user query and a list of available app names, identify which apps the user is asking for. Your response must be a JSON array containing the exact names of the matched apps from the provided list. If no apps match, return an empty array.`,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                        },
                    },
                    temperature: 0.3, // Lower temperature for more consistent results
                },
            });

            const jsonStr = response.text.trim();
            const matchedNames = JSON.parse(jsonStr);
            foundApps = apps.filter(app => matchedNames.includes(app.name));
            
        } catch (aiError) {
            console.error('AI search failed, falling back to fuzzy search:', aiError);
            // Fallback to local search if AI fails
            foundApps = categorizeSearch(query, apps);
        }

        // If AI and categorization search found nothing, do basic fuzzy search
        if (foundApps.length === 0) {
            foundApps = fuzzySearch(query, apps);
        }
        
        // Sort results by relevance
        foundApps.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const queryLower = query.toLowerCase();
            
            // Exact matches first
            if (aName === queryLower) return -1;
            if (bName === queryLower) return 1;
            
            // Starts with query second
            if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
            if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
            
            // Contains query third
            if (aName.includes(queryLower) && !bName.includes(queryLower)) return -1;
            if (bName.includes(queryLower) && !aName.includes(queryLower)) return 1;
            
            return 0;
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
              apps: foundApps,
              count: foundApps.length,
              query: query,
              timestamp: new Date().toISOString()
            }),
        };

    } catch (e: unknown) {
        const error = e as Error;
        console.error('App search error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
              error: 'حدث خطأ في البحث. يرجى المحاولة مرة أخرى.',
              timestamp: new Date().toISOString()
            }),
        };
    }
};

export { handler };