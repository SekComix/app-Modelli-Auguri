import { GoogleGenerativeAI } from "@google/generative-ai";

// FIX: Uso 'as any' per evitare che TypeScript blocchi la compilazione
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

// Inizializza solo se c'è la chiave
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// --- 1. GENERAZIONE TESTO ---
export const generateArticleContent = async (prompt: string, context: string): Promise<string> => {
  if (!model) return "⚠️ Errore: Chiave API non trovata o non valida.";
  
  try {
    const fullPrompt = `Sei un giornalista. Contesto: ${context}. Richiesta: ${prompt}. Scrivi un testo breve in italiano.`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error(error);
    return "Impossibile generare il testo.";
  }
};

// --- 2. ANALISI FOTO ---
export const generateTextFromMedia = async (base64Image: string): Promise<{ headline: string, body: string }> => {
  if (!model) return { headline: "Manca Key", body: "Chiave API non rilevata." };

  try {
    const base64Data = base64Image.split(',')[1];
    const prompt = `Analizza questa immagine. Scrivi un titolo di giornale breve e 2 frasi di articolo. Rispondi SOLO JSON: { "headline": "...", "body": "..." }`;
    
    const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }]);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    return { headline: "Errore", body: "Non riesco ad analizzare l'immagine." };
  }
};

// --- 3. GENERAZIONE IMMAGINE (Pollinations - Gratis) ---
export const generateNewspaperImage = async (prompt: string, refImage?: string): Promise<string> => {
  let enhancedPrompt = prompt;

  // Se c'è la chiave, miglioriamo il prompt
  if (model) {
      try {
        const result = await model.generateContent(`Translate to English and describe for an image generator: "${prompt}"`);
        enhancedPrompt = result.response.text();
      } catch (e) { console.log("Uso prompt originale"); }
  }

  const seed = Math.floor(Math.random() * 1000);
  const encoded = encodeURIComponent(`${enhancedPrompt} vintage newspaper style, photorealistic, high detail`);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&seed=${seed}&nologo=true`;
};

// --- 4. PLACEHOLDER ---
export const generateNewspaperVideo = async (prompt: string) => "";
export const generateSpeech = async (text: string) => null;
export const playRawAudio = async () => null;
export const generateHistoricalContext = async () => ({ summary: "...", facts: "..." });
