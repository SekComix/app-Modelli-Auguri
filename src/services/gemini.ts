import { GoogleGenAI, Modality } from "@google/genai";

// Helper to get the client safely by checking Env or LocalStorage
const getAiClient = () => {
  // 1. Try Environment Variable (Local Dev)
  if (process.env.API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // 2. Try Local Storage (Deployed App)
  const localKey = localStorage.getItem('GEMINI_API_KEY');
  if (localKey) {
    return new GoogleGenAI({ apiKey: localKey });
  }

  // 3. Ask User
  const userKey = prompt("🔑 ATTENZIONE: Per usare l'AI (Testi e Foto) serve una Chiave API di Google.\n\nSe non ce l'hai, cercala su Google 'Get Gemini API Key'.\n\nIncolla qui la tua Chiave:");
  if (userKey && userKey.trim().length > 10) {
    localStorage.setItem('GEMINI_API_KEY', userKey.trim());
    return new GoogleGenAI({ apiKey: userKey.trim() });
  }

  throw new Error("API Key mancante. Impossibile usare l'AI.");
};

const handleGeminiError = (error: any) => {
    console.error("Gemini API Error:", error);
    const msg = error?.message || error?.toString() || "";
    
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("⚠️ Quota AI esaurita (Troppe richieste). Attendi un minuto e riprova.");
    }
    if (msg.includes('API Key') || msg.includes('403')) {
        // If invalid key, clear it so user can enter again
        localStorage.removeItem('GEMINI_API_KEY');
        throw new Error("⚠️ Chiave API non valida o scaduta. Ricarica la pagina per inserirne una nuova.");
    }
    if (msg.includes('SAFETY')) {
        throw new Error("⚠️ Contenuto bloccato dai filtri di sicurezza (Safety).");
    }
    return `Errore AI: ${msg}`; 
};

export const generateArticleContent = async (topic: string, type: 'headline' | 'body' | 'full' | 'summary', language: string = 'Italiano', tone: string = 'journalistic'): Promise<string> => {
  try {
    const ai = getAiClient();
    const modelId = 'gemini-2.5-flash';
    
    let styleInstruction = "";
    switch (tone) {
        case 'witty': styleInstruction = "Usa un tono spiritoso, ironico e simpatico. Fai sorridere il lettore."; break;
        case 'joke': styleInstruction = "Scrivilo come se fosse una barzelletta o una battuta divertente."; break;
        case 'archaic': styleInstruction = "Usa un linguaggio arcaico, aulico e vintage tipico del 1900 o rinascimentale."; break;
        case 'sensational': styleInstruction = "Usa un tono sensazionalistico, esagerato, da 'Breaking News' scandalistica."; break;
        case 'poetic': styleInstruction = "Usa un tono poetico, evocativo, quasi in rima o molto dolce."; break;
        default: styleInstruction = "Usa un tono giornalistico classico, formale e oggettivo."; break; 
    }

    let prompt = "";
    
    if (type === 'headline') {
      prompt = `Agisci come un redattore esperto. Riscrivi o genera questo concetto: "${topic}".
      Obiettivo: Scrivi un titolo di giornale in lingua ${language}.
      Stile: ${styleInstruction}
      Regola: Non usare virgolette. Sii conciso.`;
    } else if (type === 'body') {
      prompt = `Agisci come un giornalista. Riscrivi o sviluppa questo concetto: "${topic}".
      Obiettivo: Scrivi il corpo di un articolo (circa 80-120 parole) in lingua ${language}.
      Stile: ${styleInstruction}
      Regola: Usa interruzioni di riga per i paragrafi.`;
    } else if (type === 'summary') {
      prompt = `Crea un sommario in lingua ${language} basato su: "${topic}".
      Stile: ${styleInstruction}
      Formato: Lista puntata semplice.`;
    } else {
      prompt = `Riscrivi questo testo in lingua ${language}: "${topic}".
      Stile: ${styleInstruction}`;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Impossibile generare il contenuto.";
  } catch (error) {
    return typeof error === 'string' ? error : handleGeminiError(error);
  }
};

export const generateHistoricalContext = async (year: number, language: string = 'Italiano'): Promise<{ summary: string, facts: string }> => {
  try {
    const ai = getAiClient();
    
    const prompt = `Sei un giornalista storico. Scrivi due parti distinte riguardo l'anno ${year} in lingua ${language}.
    PARTE 1: Un breve articolo nostalgico ed emozionante (circa 80 parole) su com'era il mondo in quell'anno. Inizia con "Correva l'anno ${year}..."
    PARTE 2: Una lista puntata di 3 curiosità (Miglior Film, Canzone famosa, Evento storico).
    Separa le due parti con "|||".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    const parts = text.split('|||');
    
    return {
        summary: parts[0]?.trim() || `Correva l'anno ${year}. Un anno di grandi cambiamenti e speranze.`,
        facts: parts[1]?.trim() || `- Cinema: Un grande anno per i film.\n- Musica: Le radio suonavano rock n roll.\n- Mondo: Tante innovazioni tecnologiche.`
    };

  } catch (error) {
      console.error("Error fetching history", error);
      return {
          summary: `Correva l'anno ${year}. Un anno indimenticabile.`,
          facts: `- Dati storici non disponibili al momento.`
      };
  }
};

export const generateTextFromMedia = async (mediaSrc: string, language: string = 'Italiano'): Promise<{ headline: string, body: string }> => {
  try {
    const ai = getAiClient();
    let base64Data = "";
    let mimeType = "image/jpeg";

    if (mediaSrc.startsWith('data:')) {
        const mime = mediaSrc.split(';')[0].split(':')[1];
        base64Data = mediaSrc.split(',')[1];
        mimeType = mime;
    } else {
        const resp = await fetch(mediaSrc);
        const blob = await resp.blob();
        const buffer = await blob.arrayBuffer();
        base64Data = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        mimeType = blob.type;
    }

    const prompt = `Agisci come un giornalista esperto. Analizza questo contenuto multimediale.
    Compito 1: Scrivi un TITOLO di giornale sensazionalistico o descrittivo basato su ciò che vedi.
    Compito 2: Scrivi un breve ARTICOLO (max 60 parole) che descriva la scena o la notizia.
    Lingua: ${language}.
    FORMATO RISPOSTA OBBLIGATORIO:
    TITOLO: [Il tuo titolo qui]
    CORPO: [Il tuo articolo qui]`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType, data: base64Data } },
                { text: prompt }
            ]
        }
    });

    const text = response.text || "";
    const headlineMatch = text.match(/TITOLO:\s*(.*?)(\n|$)/i);
    const bodyMatch = text.match(/CORPO:\s*([\s\S]*)/i);

    return {
        headline: headlineMatch ? headlineMatch[1].trim() : "ANALISI MULTIMEDIA COMPLETATA",
        body: bodyMatch ? bodyMatch[1].trim() : text
    };

  } catch (error) {
    const msg = handleGeminiError(error);
    return { headline: "ERRORE AI", body: msg };
  }
};

export const generateTextFromImage = generateTextFromMedia;

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: text }] }],
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                  },
              },
          },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
      handleGeminiError(e);
      return null;
  }
};

export const playRawAudio = async (base64Audio: string, audioContext: AudioContext): Promise<AudioBufferSourceNode> => {
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
    }

    const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    return source;
}


export const generateNewspaperImage = async (prompt: string, referenceImage?: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    if (referenceImage) {
        try {
            const base64Data = referenceImage.split(',')[1];
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                        { text: prompt || "Migliora questa immagine per un giornale" }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE] }
            });

            const parts = response.candidates?.[0]?.content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData) return `data:image/jpeg;base64,${part.inlineData.data}`;
                }
            }
            throw new Error("No image generated.");
        } catch (e) {
             throw new Error(handleGeminiError(e));
        }

    } else {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `Vintage newspaper photo, black and white, realistic. Subject: ${prompt}`,
                config: { numberOfImages: 1, aspectRatio: '4:3', outputMimeType: 'image/jpeg' }
            });
            
            const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
            if (base64ImageBytes) return `data:image/jpeg;base64,${base64ImageBytes}`;
            throw new Error("No image bytes returned");
        } catch (e) {
             throw new Error(handleGeminiError(e));
        }
    }

  } catch (error) {
    throw new Error(typeof error === 'string' ? error : "Errore Generazione Immagine");
  }
};

export const generateNewspaperVideo = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // We don't use window.aistudio here because we are in a standalone app context usually
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Vintage cinematic, black and white newspaper style: ${prompt}`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); 
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      // On client side we need the key to fetch the video if the link requires it
      const apiKey = process.env.API_KEY || localStorage.getItem('GEMINI_API_KEY');
      return `${downloadLink}&key=${apiKey}`;
    }
    throw new Error("Video generation failed.");

  } catch (error) {
     throw new Error(handleGeminiError(error));
  }
};
