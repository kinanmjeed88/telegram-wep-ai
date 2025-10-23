import type { Handler } from "@netlify/functions";
import { GoogleGenAI, GenerateContentRequest } from "@google/genai";

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }) };
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `أنت صحفي تقني متخصص في الذكاء الاصطناعي. مهمتك هي البحث عن آخر 3 إلى 5 أخبار هامة حول الذكاء الاصطناعي خلال الـ 48 ساعة الماضية.
    يجب عليك تنسيق الإجابة بالكامل ككتلة JSON واحدة (code block) تحتوي على مصفوفة من الكائنات. لا تضف أي نص تمهيدي أو ختامي خارج كتلة JSON.
    يجب أن يتبع كل كائن في المصفوفة البنية التالية بدقة:
    - "title": (string) عنوان جذاب ومختصر للخبر.
    - "summary": (string) ملخص مفصل للخبر يشرح أهم النقاط بوضوح.
    - "sources": (array) مصفوفة تحتوي على كائنين على الأقل للمصادر الموثوقة. كل كائن مصدر يجب أن يحتوي على "title" (string) و "uri" (string).
    
    مثال على البنية المطلوبة:
    \`\`\`json
    [
      {
        "title": "عنوان الخبر الأول",
        "summary": "ملخص تفصيلي للخبر الأول...",
        "sources": [
          { "title": "اسم المصدر 1", "uri": "https://example.com/news1" },
          { "title": "اسم المصدر 2", "uri": "https://example.com/source2" }
        ]
      }
    ]
    \`\`\``;

    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: "ابحث وقدم لي آخر أخبار الذكاء الاصطناعي.",
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
        },
    };

    const result = await ai.models.generateContent(request);
    
    const responseText = result.text;

    // Extract JSON from markdown code block
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      console.error("Failed to extract JSON from model response:", responseText);
      throw new Error("لم يتمكن النموذج من تنسيق الاستجابة بشكل صحيح. حاول مرة أخرى.");
    }

    const jsonString = jsonMatch[1];
    const newsData = JSON.parse(jsonString);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(newsData),
    };
  } catch (error) {
    console.error('Error in Netlify function (ai-news):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An internal error occurred: ${errorMessage}` }),
    };
  }
};

export { handler };
