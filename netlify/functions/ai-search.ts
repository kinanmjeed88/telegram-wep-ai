import type { Handler } from "@netlify/functions";
import { GoogleGenAI, GenerateContentRequest } from "@google/genai";

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { userQuery, systemInstruction, mode } = JSON.parse(event.body || '{}');

    if (!userQuery || !systemInstruction || !mode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing userQuery, systemInstruction, or mode' }) };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }) };
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemInstruction,
        },
    };

    if (mode === 'general') {
      request.config.tools = [{ googleSearch: {} }];
    }

    const result = await ai.models.generateContent(request);
    
    const responseText = result.text;
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: responseText, sources: sources }),
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal error occurred while processing your request.' }),
    };
  }
};

export { handler };
