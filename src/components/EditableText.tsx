import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wand2, X, Check, Sparkles, Smile, Feather, Newspaper, Siren, PartyPopper, Volume2, Loader2, VolumeX } from 'lucide-react';
import { generateArticleContent, generateSpeech, playRawAudio } from '../services/gemini';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  aiEnabled?: boolean;
  aiContext?: string; // Default context
  language?: string; // Language for AI generation
  mode?: 'headline' | 'body' | 'summary'; // Explicit generation mode
}

const TONES = [
    { id: 'journalistic', label: 'Giornalistico (Serio)', icon: <Newspaper size={16}/> },
    { id: 'witty', label: 'Spiritoso / Ironico', icon: <Smile size={16}/> },
    { id: 'joke', label: 'Barzelletta', icon: <PartyPopper size={16}/> },
    { id: 'archaic', label: 'Arcaico / Vintage', icon: <Feather size={16}/> },
    { id: 'sensational', label: 'Sensazionalistico', icon: <Siren size={16}/> },
    { id: 'poetic', label: 'Poetico / Aulico', icon: <Sparkles size={16}/> },
];

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "Modifica...", 
  multiline = false,
  aiEnabled = true, // Default to true now
  aiContext = "",
  language = "Italiano",
  mode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [prompt, setPrompt] = useState(value || aiContext);
  const [selectedTone, setSelectedTone] = useState('journalistic');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Initialize prompt when dialog opens
  useEffect(() => {
      if (showAiDialog) {
          setPrompt(value || aiContext || "Inserisci qui il testo da riscrivere...");
      }
  }, [showAiDialog, value, aiContext]);

  const handleConfirmGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const genType = mode || (multiline ? 'body' : 'headline');
      const result = await generateArticleContent(prompt, genType, language, selectedTone);
      onChange(result);
      setShowAiDialog(false);
    } catch (err) {
      alert("Impossibile generare il contenuto. Riprova.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Stop if currently speaking
      if (isSpeaking) {
          if (audioSourceRef.current) {
              audioSourceRef.current.stop();
              audioSourceRef.current = null;
          }
          setIsSpeaking(false);
          return;
      }

      if (!value) return;

      setIsLoadingSpeech(true);
      try {
          // 1. Generate RAW Audio Base64
          const audioBase64 = await generateSpeech(value);
          if (!audioBase64) throw new Error("No audio generated");

          // 2. Init Audio Context if needed
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          
          // 3. Resume context if suspended (browser policy)
          if (audioContextRef.current.state === 'suspended') {
             await audioContextRef.current.resume();
          }

          // 4. Decode and Play manually
          const source = await playRawAudio(audioBase64, audioContextRef.current);
          
          source.onended = () => setIsSpeaking(false);
          audioSourceRef.current = source;
          setIsSpeaking(true);

      } catch (error) {
          console.error("TTS Error", error);
          alert("Impossibile leggere il testo. Riprova.");
      } finally {
          setIsLoadingSpeech(false);
      }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        className={`w-full bg-yellow-50/50 border border-blue-300 p-1 outline-none resize-y ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        rows={6}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        className={`w-full bg-yellow-50/50 border border-blue-300 p-1 outline-none ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
    <div className="relative group cursor-text min-h-[1.5em]" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
      <div className={`${className} ${!value ? 'opacity-50 italic' : ''} whitespace-pre-line`}>
        {value || placeholder}
      </div>
      
      {/* Hover Tools */}
      <div className="absolute -top-6 right-0 hidden group-hover:flex gap-1 bg-white shadow-sm border rounded px-1 z-10" onClick={(e) => e.stopPropagation()}>
        {value && (
            <button
                onClick={handleSpeak}
                className={`p-1 rounded transition-colors flex items-center gap-1 ${isSpeaking ? 'bg-green-100 text-green-600' : 'hover:bg-blue-100 text-blue-600'}`}
                title={isSpeaking ? "Stop Lettura" : "Leggi Testo"}
            >
                {isLoadingSpeech ? <Loader2 size={12} className="animate-spin"/> : isSpeaking ? <VolumeX size={12}/> : <Volume2 size={12}/>}
            </button>
        )}
        
        <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider mr-1 self-center border-l pl-1 ml-1">Modifica</span>
        
        {aiEnabled && (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowAiDialog(true); }}
            className="p-1 hover:bg-purple-100 rounded text-purple-600 transition-colors flex items-center gap-1"
            title="Riscrivi con AI"
          >
            <Wand2 size={12} /> <span className="text-[9px] font-bold">AI</span>
          </button>
        )}
      </div>
    </div>

    {/* AI Rewrite Dialog - Portaled to body to avoid z-index/transform clipping */}
    {showAiDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 border-purple-500" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 border-b pb-2 border-stone-200">
                    <h3 className="text-lg font-bold font-sans uppercase flex items-center gap-2 text-purple-700">
                        <Wand2 size={20}/> Riscrivi Testo
                    </h3>
                    <button onClick={() => setShowAiDialog(false)} className="text-stone-400 hover:text-red-500"><X size={20} /></button>
                </div>

                <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Il tuo testo / Idea:</label>
                <textarea 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    className="w-full bg-stone-50 border border-stone-300 p-3 rounded-lg mb-4 text-sm font-medium h-24 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                    placeholder="Scrivi qui cosa vuoi dire..."
                    autoFocus
                />

                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Scegli lo Stile:</label>
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {TONES.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => setSelectedTone(tone.id)}
                            className={`flex items-center gap-2 p-2 rounded text-xs font-bold transition-all ${selectedTone === tone.id ? 'bg-purple-600 text-white shadow-md transform scale-105' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                        >
                            {tone.icon} {tone.label}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={() => setShowAiDialog(false)} className="px-4 py-2 text-stone-500 font-bold text-xs uppercase hover:bg-stone-100 rounded">Annulla</button>
                    <button 
                        onClick={handleConfirmGenerate} 
                        disabled={isGenerating}
                        className="px-6 py-2 bg-purple-600 text-white font-bold text-xs uppercase rounded hover:bg-purple-700 transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        {isGenerating ? <Sparkles size={14} className="animate-spin"/> : <Wand2 size={14}/>}
                        {isGenerating ? 'Scrivendo...' : 'Genera / Riscrivi'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )}
    </>
  );
};
