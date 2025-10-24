import { GoogleGenAI, Modality } from "@google/genai";

function fileToGenerativePart(base64Data) {
  const match = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Chaîne de données d'image base64 invalide.");
  }
  const mimeType = match[1];
  const data = match[2];

  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("API_KEY environment variable is not set.");
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "La configuration du serveur est incomplète (clé API manquante)." }),
    };
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const { base64Image, prompt } = JSON.parse(event.body);

    if (!base64Image || !prompt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Image ou invite manquante dans la requête.' }),
      };
    }

    const imagePart = fileToGenerativePart(base64Image);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        };
      }
    }
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "L'IA n'a pas généré d'image. Veuillez essayer une autre invite." }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || "Une erreur interne du serveur est survenue." }),
    };
  }
};
