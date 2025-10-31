// Constants file for the TechTouch application
// This file is intentionally minimal - all type definitions moved to types.ts

export const API_ENDPOINTS = {
  AI_CHAT: '/.netlify/functions/ai-chat',
  AI_IMAGE: '/.netlify/functions/ai-image',
  AI_SEARCH: '/.netlify/functions/ai-search',
  GET_POSTS: '/.netlify/functions/get-posts-list',
  GET_POST: '/.netlify/functions/get-post',
  DATA: '/.netlify/functions/data'
};

export const CHANNELS_CATEGORIES = {
  GAMING: 'الألعاب',
  ENTERTAINMENT: 'التسلية',
  TECH: 'التقنية',
  EDUCATION: 'التعليم',
  NEWS: 'الأخبار'
};

export const APP_CATEGORIES = {
  GAMING: 'games',
  ENTERTAINMENT: 'entertainment',
  PRODUCTIVITY: 'productivity',
  SOCIAL: 'social_media',
  AI_TOOLS: 'ai_tools',
  MEDIA: 'media',
  UTILITIES: 'utilities'
};

export const VALIDATION_RULES = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_PROMPT_LENGTH: 500,
  MIN_SEARCH_QUERY_LENGTH: 2,
  MAX_SEARCH_RESULTS: 20
};

export const UI_MESSAGES = {
  LOADING: 'جاري التحميل...',
  SENDING: 'جاري الإرسال...',
  ERROR_OCCURRED: 'حدث خطأ ما',
  NO_RESULTS: 'لا توجد نتائج',
  ENTER_MESSAGE: 'اكتب رسالتك هنا...',
  SEND_MESSAGE: 'إرسال',
  GENERATING_IMAGE: 'جاري إنشاء الصورة...',
  SEARCHING: 'جاري البحث...'
};