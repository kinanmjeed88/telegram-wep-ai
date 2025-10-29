import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { title, content } = JSON.parse(event.body || "{}");

    if (!title || !content) {
      return { statusCode: 400, body: JSON.stringify({ error: "Post title and content are required." }) };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const prompt = `بناءً على المقال التالي بعنوان "${title}" ومحتواه، قدم معلومات إضافية ومفصلة حول الموضوع. قم بتضمين مصادر وروابط موثوقة إن أمكن.

المحتوى:
${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    const details = response.text;

    return {
      statusCode: 200,
      body: JSON.stringify({ details }),
    };

  } catch (e: unknown) {
    const error = e as Error;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
