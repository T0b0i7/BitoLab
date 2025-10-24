
const RESTORATION_PROMPT = `
Restaure cette photo ancienne, floue ou endommagée. 
- Répare les imperfections telles que les rayures, les déchirures ou la décoloration.
- Améliore considérablement les détails du visage et la clarté globale.
- Augmente la netteté et la résolution pour créer une version de haute qualité, comme si elle avait été prise récemment avec un appareil photo moderne.
- Ajuste la couleur et l'éclairage pour un rendu naturel et éclatant.
- Ne modifie pas la composition, n'ajoute ni ne supprime aucun élément de l'image originale.
`;

async function generateImage(base64Image: string, prompt: string): Promise<string> {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ base64Image, prompt }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || `Erreur du serveur: ${response.statusText}`);
  }

  if (responseData.imageUrl) {
    return responseData.imageUrl;
  }
  
  throw new Error("Aucune image n'a été reçue du serveur.");
}

export async function editImageWithPrompt(
  base64Image: string,
  prompt: string
): Promise<string> {
    return generateImage(base64Image, prompt);
}

export async function restoreAndEnhanceImage(base64Image: string): Promise<string> {
    return generateImage(base64Image, RESTORATION_PROMPT);
}
