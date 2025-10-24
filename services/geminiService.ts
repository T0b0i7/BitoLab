import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("La variable d'environnement API_KEY n'est pas définie");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function fileToGenerativePart(base64Data: string) {
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

async function generateImage(base64Image: string, prompt: string): Promise<string> {
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
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Aucune image n'a été générée. Veuillez essayer une autre invite.");
}

export async function editImageWithPrompt(
  base64Image: string,
  prompt: string
): Promise<string> {
    return generateImage(base64Image, prompt);
}

const RESTORATION_PROMPT = `
Restaure cette photo ancienne, floue ou endommagée. 
- Répare les imperfections telles que les rayures, les déchirures ou la décoloration.
- Améliore considérablement les détails du visage et la clarté globale.
- Augmente la netteté et la résolution pour créer une version de haute qualité, comme si elle avait été prise récemment avec un appareil photo moderne.
- Ajuste la couleur et l'éclairage pour un rendu naturel et éclatant.
- Ne modifie pas la composition, n'ajoute ni ne supprime aucun élément de l'image originale.
`;

export async function restoreAndEnhanceImage(base64Image: string): Promise<string> {
    return generateImage(base64Image, RESTORATION_PROMPT);
}