import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Prompt is required" }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;

    return {
      statusCode: 200,
      body: JSON.stringify({ image: base64ImageBytes }),
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
