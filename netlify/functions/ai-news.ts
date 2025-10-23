import type { Handler } from "@netlify/functions";
import { GoogleGenAI, GenerateContentRequest } from "@google/genai";
import { getStore } from "@netlify/blobs";
import type { AiNewsPost } from '../../types.ts';

// Helper function to generate news, extracted from the main handler
async function generateNewPosts(ai: GoogleGenAI, existingTitles: string[]): Promise<AiNewsPost[]> {
  const systemInstruction = `تصرف كواجهة برمجة تطبيقات صامتة. مهمتك الوحيدة هي العثور على 3 إلى 5 أخبار هامة وحديثة حول الذكاء الاصطناعي وإرجاعها كسلسلة JSON صالحة.

**قواعد تنسيق صارمة:**
1.  يجب أن تكون استجابتك الكاملة عبارة عن سلسلة JSON صالحة.
2.  لا تقم بتضمين أي نص توضيحي أو مقدمات أو استنتاجات. لا تستخدم تنسيق Markdown مثل \`\`\`json.
3.  يجب أن تبدأ الاستجابة مباشرة بالرمز '[' وتنتهي بالرمز ']'.

**قواعد المحتوى:**
1.  **تجنب التكرار:** لا تولد أخبارًا بعناوين مشابهة لهذه القائمة: [${existingTitles.join(', ')}].
2.  **بنية الكائن:** يجب أن يتبع كل كائن في المصفوفة البنية التالية بدقة:
    - "title": (string) عنوان جذاب ومختصر للخبر.
    - "summary": (string) ملخص للخبر على شكل نقاط (تبدأ كل نقطة بـ "-"). استخدم '\\n' للفصل بين النقاط.
    - "sources": (array) مصفوفة تحتوي على مصدرين (2) موثوقين بالضبط. كل مصدر هو كائن يحتوي على "title" و "uri".`;

  const request: GenerateContentRequest = {
      model: 'gemini-2.5-flash',
      contents: "ابحث وقدم لي آخر أخبار الذكاء الاصطناعي، مع تجنب المواضيع المذكورة سابقًا.",
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
      // Fallback: If no markdown block is found, try to find a JSON object/array in the text.
      const jsonLikeMatch = responseText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
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
  const ai = new GoogleGenAI({ apiKey });

  try {
    const store = getStore("ai_news_archive");
    const metadata = await store.get("metadata", { type: "json" });

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastUpdateDate = metadata?.lastUpdate ? new Date(metadata.lastUpdate).toISOString().split('T')[0] : null;

    let allNews: AiNewsPost[] = await store.get("all_news", { type: "json" }) || [];

    if (lastUpdateDate !== today) {
        const existingTitles = allNews.map(news => news.title);
        const newPosts = await generateNewPosts(ai, existingTitles);

        const existingTitlesSet = new Set(existingTitles.map(t => t.trim().toLowerCase()));
        const uniqueNewPosts = newPosts.filter(post => !existingTitlesSet.has(post.title.trim().toLowerCase()));
        
        if (uniqueNewPosts.length > 0) {
            allNews.unshift(...uniqueNewPosts);
            await store.setJSON("all_news", allNews);
        }

        await store.setJSON("metadata", { lastUpdate: new Date().toISOString() });
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(allNews),
    };
  } catch (error: any) {
    if (error.message && error.message.includes("The environment has not been configured to use Netlify Blobs")) {
      console.warn("Netlify Blobs not configured. Falling back to stateless mode.");
      try {
        const newPosts = await generateNewPosts(ai, []);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(newPosts),
        };
      } catch (generationError: any) {
        console.error('Error in fallback generation (ai-news):', generationError);
        const errorMessage = generationError instanceof Error ? generationError.message : 'An unknown error occurred.';
        return {
          statusCode: 500,
          body: JSON.stringify({ error: `An internal error occurred during fallback generation: ${errorMessage}` }),
        };
      }
    }

    console.error('Error in Netlify function (ai-news):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An internal error occurred: ${errorMessage}` }),
    };
  }
};

export { handler };