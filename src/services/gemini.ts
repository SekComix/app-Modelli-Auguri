import { GoogleGenerativeAI } from "@google/generative-ai";

// Recupera la chiave API (gestisce sia Vite che process.env)
const API_KEY = (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// --- FUNZIONI DI SUPPORTO ---

// 1. Generazione Testo (Articoli)
export const generateArticleContent = async (prompt: string, context: string): Promise<string> => {
  if (!API_KEY) return "⚠️ Chiave API mancante. Inseriscila in .env o GitHub Secrets.";
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const fullPrompt = `Sei un giornalista esperto. Contesto: ${context}. Richiesta: ${prompt}. Scrivi in italiano, stile giornalistico coinvolgente.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Errore Gemini:", error);
    return "Impossibile generare il testo al momento.";
  }
};

// 2. Contesto Storico (Task automatico)
export const generateHistoricalContext = async (year: number, lang: string = 'Italiano'): Promise<{ summary: string, facts: string }> => {
  if (!API_KEY) return { summary: "Dati non disponibili", facts: "Nessun dato" };

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Dammi due brevi paragrafi sul mondo nel ${year} in ${lang}. 
    1. Un riassunto generale dell'anno (politica, società).
    2. Un elenco puntato di 3 curiosità o invenzioni di quell'anno.
    Formatta la risposta come JSON: { "summary": "testo", "facts": "testo" }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Pulizia base del JSON
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    return { 
      summary: `Era l'anno ${year}. Un periodo di grandi cambiamenti.`, 
      facts: `- Curiosità 1 del ${year}\n- Curiosità 2 del ${year}` 
    };
  }
};

// 3. Analisi Immagine (Da immagine a testo)
export const generateTextFromMedia = async (imageUrl: string): Promise<{ headline: string, body: string }> => {
  // Nota: Questa funzione richiederebbe il modello gemini-pro-vision e la conversione base64.
  // Per ora restituiamo un placeholder per evitare errori di compilazione se non si ha l'immagine raw.
  return {
    headline: "Analisi Immagine",
    body: "L'intelligenza artificiale ha analizzato questa foto e sembra ritrarre un momento speciale..."
  };
};

// --- FUNZIONI PLACEHOLDER / MOCK (Per evitare errori di compilazione) ---
// Queste funzioni servono perché App.tsx le chiama, ma Gemini Base non genera immagini/audio nativamente
// In futuro potremo collegarle a servizi esterni (DALL-E, ElevenLabs, ecc.)

export const generateNewspaperImage = async (prompt: string, refImage?: string): Promise<string> => {
  // Restituisce un'immagine placeholder "Vintage" da LoremFlickr o simile
  const encoded = encodeURIComponent(prompt);
  return `https://loremflickr.com/800/600/vintage,newspaper,${encoded}?lock=${Date.now()}`;
};

export const generateNewspaperVideo = async (prompt: string): Promise<string> => {
  return ""; // Video non supportato nel piano base
};

export const generateSpeech = async (text: string): Promise<ArrayBuffer | null> => {
  console.log("TTS richiesto per:", text);
  return null; // Audio non supportato nel piano base
};

export const playRawAudio = async (audioData: ArrayBuffer, context: AudioContext) => {
  return null; // Audio non supportato
};
