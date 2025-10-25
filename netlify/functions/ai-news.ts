import type { Handler } from "@netlify/functions";
import { GoogleGenAI, GenerateContentRequest } from "@google/genai";
import type { AiNewsPost } from '../../types.ts';

// Helper function to generate news
async function generateNews(ai: GoogleGenAI): Promise<AiNewsPost[]> {
  const systemInstruction = `تصرف كواجهة برمجة تطبيقات صامتة. مهمتك الوحيدة هي العثور على 5 أخبار هامة وحديثة حول "أحدث أدوات الذكاء الاصطناعي وكيفية استخدامها" وإرجاعها كسلسلة JSON صالحة.

**قواعد تنسيق صارمة:**
1.  يجب أن تكون استجابتك الكاملة عبارة عن سلسلة JSON صالحة.
2.  لا تقم بتضمين أي نص توضيحي أو مقدمات أو استنتاجات. لا تستخدم تنسيق Markdown مثل \`\`\`json.
3.  يجب أن تبدأ الاستجابة مباشرة بالرمز '[' وتنتهي بالرمز ']'.

**قواعد المحتوى:**
1.  **التركيز على الأدوات:** يجب أن يكون كل خبر عن أداة ذكاء اصطناعي محددة (جديدة أو تحديث هام لأداة موجودة).
2.  **الملخص:** يجب أن يكون الملخص بسيطًا ويوضح فائدة الأداة.
3.  **بنية الكائن:** يجب أن يتبع كل كائن في المصفوفة البنية التالية بدقة:
    - "title": (string) عنوان جذاب ومختصر للخبر (يفضل أن يتضمن اسم الأداة).
    - "summary": (string) ملخص بسيط ومباشر للخبر.
    - "sources": (array) مصفوفة تحتوي على مصدر أو مصدرين (1-2) موثوقين. كل مصدر هو كائن يحتوي على "title" و "uri".`;

  const request: GenerateContentRequest = {
      model: 'gemini-2.5-flash',
      contents: "ابحث وقدم لي 5 من آخر أخبار أدوات الذكاء الاصطناعي.",
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
  };

  const result = await ai.models.generateContent(request);
  const responseText = result.text;
  
  let jsonString = "";
  // Attempt to extract JSON from a markdown code block first
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
  } else {
      // Fallback: If no markdown block is found, try to find a JSON array in the text.
      const jsonLikeMatch = responseText.match(/(\[[\s\S]*\])/);
      if (jsonLikeMatch && jsonLikeMatch[0]) {
          jsonString = jsonLikeMatch[0];
      } else {
          console.error("Could not find JSON block or JSON-like structure in model response:", responseText);
          throw new Error("لم يتمكن النموذج من تنسيق الاستجابة بشكل صحيح.");
      }
  }

  try {
      return JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse extracted JSON string.", {
          error: e,
          jsonString: jsonString,
          fullResponse: responseText,
      });
      throw new Error("فشل تحليل البيانات المستلمة من النموذج.");
  }
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }) };
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const posts = await generateNews(ai);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(posts),
    };

  } catch (error: any) {
    console.error('Error in Netlify function (ai-news):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An internal error occurred: ${errorMessage}` }),
    };
  }
};

export { handler };
