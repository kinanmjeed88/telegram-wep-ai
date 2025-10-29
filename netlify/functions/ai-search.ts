import { GoogleGenAI, Type } from "@google/genai";
import type { Handler, HandlerResponse } from "@netlify/functions";
import { apps } from "../../data/appsDatabase";

const handler: Handler = async (event): Promise<HandlerResponse> => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { query } = JSON.parse(event.body || '{}');
        if (!query) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Query is required' }) };
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const appNames = apps.map(app => app.name);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User query: "${query}". Available apps: [${appNames.join(', ')}]`,
            config: {
                systemInstruction: `You are an expert app finder. Given a user query and a list of available app names, identify which apps the user is asking for. Your response must be a JSON array containing the exact names of the matched apps from the provided list. If no apps match, return an empty array.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const matchedNames = JSON.parse(jsonStr);

        const foundApps = apps.filter(app => matchedNames.includes(app.name));
        
        return {
            statusCode: 200,
            body: JSON.stringify({ apps: foundApps }),
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
