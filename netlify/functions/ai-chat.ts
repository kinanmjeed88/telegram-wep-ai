import { GoogleGenAI, Chat } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { history, message } = JSON.parse(event.body || "{}");

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "Message is required." }) };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history || [],
    });

    const result = await chat.sendMessageStream({ message });
    
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
        controller.close();
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: stream,
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
