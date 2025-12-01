import { GoogleGenerativeAI } from "@google/generative-ai";

// --- DIAGNOSTICA AVANZATA (Guarda la Console F12) ---
const envVite = (import.meta as any).env?.VITE_GEMINI_API_KEY;
const envProcess = (window as any).process?.env?.GEMINI_API_KEY;

console.log("--- DIAGNOSTICA API KEY ---");
console.log("1. Lettura da Vite:", envVite ? "PRESENTE (Inizia con " + envVite.substring(0,4) + "...)" : "ASSENTE");
console.log("2. Lettura da Process:", envProcess ? "PRESENTE" : "ASSENTE");

// Tenta di recuperare la chiave
const API_KEY = envVite || envProcess || "";

if (API_KEY) {
    console.log("✅ SUCCESS: Chiave caricata correttamente.");
} else {
    console.error("❌ ERROR: Nessuna chiave trovata.");
}
// ----------------------------------------------------

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 1. GENERAZIONE TESTO (AI Scrittore) ---
export const generateArticleContent = async (prompt: string, context: string): Promise<string> => {
  if (!API_KEY) {
      console.error("Tentativo di generare testo fallito: Manca API Key");
      return "⚠️ Errore Configurazione: La Chiave API non è stata caricata. Premi F12 e guarda la Console per i dettagli.";
  }
  
  try {
    const fullPrompt = `Sei un giornalista. Contesto: ${context}. Richiesta: ${prompt}. Scrivi un testo breve in italiano.`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Errore Gemini:", error);
    return "Impossibile generare il testo. Verifica la connessione o la quota API.";
  }
};

// --- 2. ANALISI FOTO (Vision) ---
export const generateTextFromMedia = async (base64Image: string): Promise<{ headline: string, body: string }> => {
  if (!API_KEY) return { headline: "Errore Key", body: "Chiave API mancante. Controlla F12." };

  try {
    const base64Data = base64Image.split(',')[1];
    const prompt = `Analizza questa immagine. Scrivi un titolo di giornale breve e 2 frasi di articolo. Rispondi SOLO JSON: { "headline": "...", "body": "..." }`;
    
    const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }]);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return { headline: "Errore Visione", body: "L'AI non riesce a vedere l'immagine." };
  }
};

// --- 3. GENERAZIONE IMMAGINE (Pollinations) ---
export const generateNewspaperImage = async (prompt: string, refImage?: string): Promise<string> => {
  let enhancedPrompt = prompt;

  // Se la chiave c'è, proviamo a migliorare il prompt, altrimenti usiamo quello base
  if (API_KEY) {
      try {
        const result = await model.generateContent(`Translate to English and describe for an image generator: "${prompt}"`);
        enhancedPrompt = result.response.text();
      } catch (e) { console.log("Gemini offline, uso prompt originale"); }
  } else {
      console.log("Nessuna API Key, passo direttamente alla generazione immagine con prompt semplice.");
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
