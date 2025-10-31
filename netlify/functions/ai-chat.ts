import { GoogleGenAI, Chat } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";

// Rate limiting configuration
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Simple in-memory rate limiting (for production, use Redis)
const requestCounts: { [key: string]: { count: number; resetTime: number } } = {};

const checkRateLimit = (clientIp: string): boolean => {
  const now = Date.now();
  const clientData = requestCounts[clientIp] || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > clientData.resetTime) {
    // Reset window
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }
  
  clientData.count++;
  requestCounts[clientIp] = clientData;
  return true;
};

const handler: Handler = async (event): Promise<HandlerResponse> => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }),
      headers: corsHeaders
    };
  }

  // Check rate limiting
  const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: "Too many requests. Please try again later." }),
      headers: corsHeaders
    };
  }

  try {
    // Validate API key
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key not configured');
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "Server configuration error: API key not found" }),
        headers: corsHeaders
      };
    }

    // Validate request body
    if (!event.body) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Request body is required" }),
        headers: corsHeaders
      };
    }

    const { history, message } = JSON.parse(event.body);

    if (!message || typeof message !== 'string') {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Valid message is required" }),
        headers: corsHeaders
      };
    }

    if (message.length > 4000) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Message too long (max 4000 characters)" }),
        headers: corsHeaders
      };
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Validate history format
    const validHistory = Array.isArray(history) ? history.filter(h => 
      h && typeof h === 'object' && 
      (h.role === 'user' || h.role === 'model') && 
      h.parts && Array.isArray(h.parts)
    ) : [];

    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: validHistory,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });

    const result = await chat.sendMessageStream({ message });
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
          controller.close();
        } catch (streamError) {
          console.error('Stream error:', streamError);
          controller.error(new Error('Failed to generate response'));
        }
      },
    });

    return {
      statusCode: 200,
      headers: { 
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
      body: stream,
    };

  } catch (e: unknown) {
    const error = e as Error;
    console.error('AI Chat error:', error);
    
    // Don't expose internal errors to users
    const userMessage = error.message.includes('quota') 
      ? 'تم تجاوز حد الاستخدام اليومي. يرجى المحاولة لاحقاً.'
      : error.message.includes('rate') 
      ? 'تم تجاوز حد الطلبات. يرجى الانتظار قليلاً ثم المحاولة.'
      : 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.';
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: userMessage }),
      headers: corsHeaders
    };
  }
};

export { handler };
