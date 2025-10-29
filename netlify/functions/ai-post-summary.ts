import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { content, type } = JSON.parse(event.body || "{}");

    if (!content) {
      return { statusCode: 400, body: JSON.stringify({ error: "Post content is required." }) };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const prompt = type === 'share'
      ? `لخص النص التالي في 6 أسطر موجزة ومناسبة للمشاركة على وسائل التواصل الاجتماعي:\n\n${content}`
      : `لخص النص التالي بشكل احترافي ودقيق:\n\n${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const summary = response.text;

    return {
      statusCode: 200,
      body: JSON.stringify({ summary }),
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
