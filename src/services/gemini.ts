import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurazione API Key (Gestione sicura per Vite)
const API_KEY = ((import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) || (process as any).env?.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Modello Veloce e Multimodale (Testo + Immagini)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 1. GENERAZIONE TESTO (AI Scrittore) ---
export const generateArticleContent = async (prompt: string, context: string): Promise<string> => {
  if (!API_KEY) return "⚠️ Manca API Key. Inseriscila nel file .env";
  
  try {
    const fullPrompt = `Sei un giornalista di un quotidiano storico.
    Contesto: ${context}.
    Richiesta utente: ${prompt}.
    
    Scrivi un testo breve, coinvolgente, in italiano corretto. 
    Usa un tono celebrativo ma professionale. Non usare markdown o asterischi.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Errore Gemini:", error);
    return "Impossibile generare il testo al momento. Riprova tra poco.";
  }
};

// --- 2. ANALISI FOTO -> TESTO (Vision) ---
export const generateTextFromMedia = async (base64Image: string): Promise<{ headline: string, body: string }> => {
  if (!API_KEY) return { headline: "Errore", body: "Manca API Key" };

  try {
    // Puliamo la stringa base64 (rimuoviamo l'intestazione "data:image/png;base64,")
    const base64Data = base64Image.split(',')[1];
    if (!base64Data) throw new Error("Immagine non valida");

    const prompt = `Guarda questa immagine. Scrivi un titolo di giornale (breve, max 6 parole) e un breve articolo di 2 frasi che descriva la scena come se fosse una notizia importante o un evento lieto.
    Rispondi SOLO in formato JSON: { "headline": "Titolo qui", "body": "Testo qui" }`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Pulizia JSON (a volte l'AI aggiunge ```json ... ```)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Errore Vision:", error);
    return { 
      headline: "FOTO MISTERIOSA", 
      body: "I nostri inviati stanno ancora analizzando questa immagine. Sembra un evento memorabile!" 
    };
  }
};

// --- 3. GENERAZIONE IMMAGINE REALE (Pollinations AI) ---
export const generateNewspaperImage = async (prompt: string, refImage?: string): Promise<string> => {
  try {
    // Passo 1: Usiamo Gemini per creare un prompt descrittivo in INGLESE (migliore per i generatori)
    const promptEnhancer = await model.generateContent(`Transform this simple request into a detailed image generation prompt for a vintage newspaper photo. Keep it concise. Request: "${prompt}". Output only the english prompt.`);
    const enhancedPrompt = (await promptEnhancer.response).text();
    
    // Passo 2: Usiamo Pollinations.ai (Servizio gratuito) per generare l'immagine
    // Aggiungiamo seed casuale per avere immagini sempre diverse
    const seed = Math.floor(Math.random() * 1000);
    const encodedPrompt = encodeURIComponent(`${enhancedPrompt} vintage newspaper style, black and white photography, high contrast, grainy texture`);
    
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true`;
  } catch (error) {
    // Fallback su archivio statico se fallisce
    return `https://loremflickr.com/800/600/vintage?lock=${Date.now()}`;
  }
};

// --- 4. CONTESTO STORICO (Compleanni) ---
export const generateHistoricalContext = async (year: number, lang: string = 'Italiano'): Promise<{ summary: string, facts: string }> => {
  if (!API_KEY) return { summary: "Dati non disponibili", facts: "-" };

  try {
    const prompt = `Dammi due brevi paragrafi sul mondo nel ${year} in ${lang}. 
    1. Un riassunto generale (politica/società).
    2. Tre curiosità veloci.
    Formatta JSON: { "summary": "testo", "facts": "testo" }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    return { summary: `Correva l'anno ${year}...`, facts: "Nessun dato storico recuperato." };
  }
};

// --- PLACEHOLDER (Video/Audio non supportati nel piano base) ---
export const generateNewspaperVideo = async (prompt: string): Promise<string> => {
  console.log("Video gen richiesto:", prompt);
  return ""; 
};

export const generateSpeech = async (text: string): Promise<ArrayBuffer | null> => {
  return null; // Usiamo SpeechSynthesis nativa del browser nel componente
};

export const playRawAudio = async (audioData: ArrayBuffer, context: AudioContext) => {
  return null; 
};
