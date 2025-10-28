
import type { Handler } from "@netlify/functions";

/**
 * لتحويل ArrayBuffer إلى سلسلة Base64.
 * مكتبة Buffer متاحة في بيئة Node.js الخاصة بـ Netlify.
 */
// FIX: Replaced `Buffer` with `btoa` to resolve a TypeScript error where the Node.js `Buffer` type was not recognized.
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // --- إعدادات المسؤول ---
  // للحصول على هذه القيم:
  // 1. CLOUDFLARE_ACCOUNT_ID: سجّل الدخول إلى Cloudflare -> من الصفحة الرئيسية، ابحث عن معرف الحساب (Account ID) في عنوان URL أو في قسم "نظرة عامة" (Overview).
  // 2. CLOUDFLARE_API_TOKEN: من لوحة التحكم -> My Profile -> API Tokens -> Create Token -> استخدم قالب "Edit Cloudflare Workers".
  // أضف هذه القيم كمتغيرات بيئة (Environment variables) في إعدادات موقعك على Netlify.
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = process.env;

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    const errorMessage = 'Server configuration error: Missing Cloudflare credentials. المسؤول: يرجى تعيين متغيرات CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_API_TOKEN.';
    console.error(errorMessage);
    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }) };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt in request body' }) };
    }

    const model = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
    
    const cfResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!cfResponse.ok) {
        const errorText = await cfResponse.text();
        console.error(`Cloudflare API Error: ${cfResponse.status} ${cfResponse.statusText}`, errorText);
        return { statusCode: cfResponse.status, body: JSON.stringify({ error: `فشل الاتصال بخدمة توليد الصور: ${errorText}` }) };
    }

    // يتم إرجاع الصورة كبيانات ثنائية
    const imageArrayBuffer = await cfResponse.arrayBuffer();
    const base64Image = arrayBufferToBase64(imageArrayBuffer);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    };

  } catch (error) {
    console.error('Error in ai-image function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal error occurred while processing the image request.' }),
    };
  }
};

export { handler };
