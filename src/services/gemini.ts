import { GoogleGenerativeAI } from "@google/generative-ai";

// FIX: Uso (import.meta as any) per evitare l'errore TypeScript durante la build
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 1. GENERAZIONE TESTO (AI Scrittore) ---
export const generateArticleContent = async (prompt: string, context: string): Promise<string> => {
  if (!API_KEY) return "⚠️ Errore: Chiave API mancante. Inseriscila nei Settings di GitHub.";
  
  try {
    const fullPrompt = `Sei un giornalista. Contesto: ${context}. Richiesta: ${prompt}. Scrivi un testo breve in italiano.`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error(error);
    return "Impossibile generare il testo.";
  }
};

// --- 2. ANALISI FOTO (Vision) ---
export const generateTextFromMedia = async (base64Image: string): Promise<{ headline: string, body: string }> => {
  if (!API_KEY) return { headline: "Manca Key", body: "Inserisci la chiave API per analizzare le foto." };

  try {
    const base64Data = base64Image.split(',')[1];
    const prompt = `Analizza questa immagine. Scrivi un titolo di giornale breve e 2 frasi di articolo. Rispondi SOLO JSON: { "headline": "...", "body": "..." }`;
    
    const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }]);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    return { headline: "Errore Analisi", body: "Non riesco a vedere l'immagine." };
  }
};

// --- 3. GENERAZIONE IMMAGINE (Pollinations) ---
export const generateNewspaperImage = async (prompt: string, refImage?: string): Promise<string> => {
  // Se c'è la chiave, usiamo Gemini per migliorare il prompt in inglese (funziona meglio)
  // Se NON c'è la chiave, usiamo il prompt così com'è (così la Zebra esce comunque!)
  let enhancedPrompt = prompt;

  if (API_KEY) {
      try {
        const result = await model.generateContent(`Translate to English and describe for an image generator: "${prompt}"`);
        enhancedPrompt = result.response.text();
      } catch (e) { 
        console.log("Gemini offline o key errata, uso prompt originale"); 
      }
  }

  // Generazione Reale (Funziona sempre, anche senza Key)
  const seed = Math.floor(Math.random() * 1000);
  const encoded = encodeURIComponent(`${enhancedPrompt} vintage newspaper style, photorealistic, high detail`);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&seed=${seed}&nologo=true`;
};

// --- 4. PLACEHOLDER VIDEO/AUDIO ---
export const generateNewspaperVideo = async (prompt: string) => "";
export const generateSpeech = async (text: string) => null;
export const playRawAudio = async () => null;
export const generateHistoricalContext = async () => ({ summary: "...", facts: "..." });
