import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wand2, X, Sparkles, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus, Volume2, StopCircle } from 'lucide-react';
import { generateArticleContent } from '../services/gemini';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  aiEnabled?: boolean;
  aiContext?: string;
  language?: string;
  mode?: 'headline' | 'body' | 'summary';
}

const COLORS = [
    { name: 'Nero', value: 'text-black' },
    { name: 'Rosso', value: 'text-red-900' },
    { name: 'Blu', value: 'text-blue-900' },
    { name: 'Verde', value: 'text-green-900' },
    { name: 'Bianco', value: 'text-white' },
];

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, onChange, className = "", placeholder = "Modifica...", multiline = false, aiEnabled = true, aiContext = "", mode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false); // Stato per l'audio
  
  const [isBold, setIsBold] = useState(className.includes('font-bold'));
  const [isItalic, setIsItalic] = useState(className.includes('italic'));
  const [isUnderline, setIsUnderline] = useState(className.includes('underline'));
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'|'justify'>('left');
  const [currentColor, setCurrentColor] = useState('');
  const [fontSizeMod, setFontSizeMod] = useState(0); 

  const inputRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // LOGICA AUDIO (SPEECH SYNTHESIS NATIVA)
  const handleSpeak = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          return;
      }
      if (!value) return;

      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = 'it-IT'; // Forza italiano
      utterance.rate = 0.9; // Leggermente più lento per stile lettura
      utterance.pitch = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            const toolbar = document.getElementById('text-toolbar-portal');
            if (toolbar && toolbar.contains(event.target as Node)) return;
            setIsEditing(false);
        }
    };
    if (isEditing) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const dynamicClassName = `
    ${isBold ? 'font-bold' : ''} 
    ${isItalic ? 'italic' : ''} 
    ${isUnderline ? 'underline' : ''} 
    ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : textAlign === 'justify' ? 'text-justify' : 'text-left'}
    ${currentColor}
    ${className} 
  `.trim();

  const sizeStyle = fontSizeMod !== 0 ? { fontSize: `calc(100% + ${fontSizeMod * 2}px)` } : {};

  const Toolbar = () => {
      const portalTarget = document.getElementById('text-toolbar-portal');
      if (!portalTarget) return null;

      return createPortal(
        <div 
            className="flex gap-2 items-center text-xs animate-fade-in-up select-none bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-300 shadow-lg mx-auto w-max"
            onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}
        >
            <span className="text-[10px] uppercase font-bold text-stone-400 mr-1 hidden lg:inline">Testo:</span>
            <div className="flex bg-white rounded border border-stone-200">
                <button onClick={() => setIsBold(!isBold)} className={`p-1.5 rounded-l hover:bg-stone-100 ${isBold ? 'text-blue-600 font-bold' : 'text-stone-600'}`}><Bold size={14}/></button>
                <button onClick={() => setIsItalic(!isItalic)} className={`p-1.5 hover:bg-stone-100 ${isItalic ? 'text-blue-600 italic' : 'text-stone-600'}`}><Italic size={14}/></button>
                <button onClick={() => setIsUnderline(!isUnderline)} className={`p-1.5 rounded-r hover:bg-stone-100 ${isUnderline ? 'text-blue-600 underline' : 'text-stone-600'}`}><Underline size={14}/></button>
            </div>
            <div className="w-px h-4 bg-stone-300 mx-1"></div>
            <div className="flex gap-1 items-center">
                {COLORS.map(c => (
                    <button key={c.name} onClick={() => setCurrentColor(c.value)} className={`w-3 h-3 rounded-full border border-stone-300 ${c.value.replace('text-', 'bg-')} hover:scale-125 transition-transform`} title={c.name}/>
                ))}
            </div>
            <div className="w-px h-4 bg-stone-300 mx-1"></div>
            <div className="flex bg-white rounded border border-stone-200">
                <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded-l hover:bg-stone-100 ${textAlign==='left'?'text-blue-600':'text-stone-600'}`}><AlignLeft size={14}/></button>
                <button onClick={() => setTextAlign('center')} className={`p-1.5 hover:bg-stone-100 ${textAlign==='center'?'text-blue-600':'text-stone-600'}`}><AlignCenter size={14}/></button>
                <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded-r hover:bg-stone-100 ${textAlign==='justify'?'text-blue-600':'text-stone-600'}`}><AlignJustify size={14}/></button>
            </div>
            <div className="w-px h-4 bg-stone-300 mx-1"></div>
            <div className="flex items-center bg-white rounded border border-stone-200">
                <button onClick={() => setFontSizeMod(p => p - 2)} className="p-1.5 hover:bg-stone-100 text-stone-600"><Minus size={12}/></button>
                <span className="font-mono text-[10px] w-6 text-center text-stone-800 font-bold">{fontSizeMod > 0 ? `+${fontSizeMod}` : fontSizeMod}</span>
                <button onClick={() => setFontSizeMod(p => p + 2)} className="p-1.5 hover:bg-stone-100 text-stone-600"><Plus size={12}/></button>
            </div>
            {aiEnabled && (
                <button onClick={() => setShowAiDialog(true)} className="ml-2 flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors border border-purple-200">
                    <Wand2 size={12}/> AI
                </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="ml-2 text-stone-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50" title="Chiudi"><X size={16}/></button>
        </div>,
        portalTarget
      );
  };

  if (isEditing) {
      return (
        <div ref={containerRef} className="relative group z-[50]" onClick={e => e.stopPropagation()}>
           <Toolbar />
           {multiline ? (
               <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none resize-y min-h-[100px] ${dynamicClassName}`} style={sizeStyle} value={value} onChange={(e) => onChange(e.target.value)}/>
           ) : (
               <input ref={inputRef as React.RefObject<HTMLInputElement>} className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none ${dynamicClassName}`} style={sizeStyle} value={value} onChange={(e) => onChange(e.target.value)}/>
           )}
        </div>
      )
  }

  return (
    <>
    <div 
        ref={containerRef}
        className={`relative group cursor-pointer hover:bg-blue-50/50 rounded transition-colors p-0.5 ${dynamicClassName}`}
        style={sizeStyle}
        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
    >
      {value || <span className="opacity-40 italic">{placeholder}</span>}
      
      {/* TASTO LETTURA AUDIO (Speaker) */}
      <div className="absolute -top-3 right-0 hidden group-hover:flex gap-1 z-10">
         {value && (
             <button onClick={handleSpeak} className="bg-white shadow text-blue-600 p-1 rounded-full hover:scale-110 transition-transform border border-blue-100" title="Leggi Testo">
                 {isSpeaking ? <StopCircle size={12} className="text-red-500 animate-pulse"/> : <Volume2 size={12}/>}
             </button>
         )}
      </div>
    </div>

    {showAiDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
             <div className="bg-white p-6 rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                 <h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><Sparkles className="text-purple-600"/> Riscrivi con AI</h3>
                 <textarea className="w-full border p-2 rounded mb-4" value={prompt || value} onChange={e => setPrompt(e.target.value)} placeholder="Cosa vuoi scrivere?"/>
                 <div className="flex justify-end gap-2">
                     <button onClick={() => setShowAiDialog(false)} className="px-4 py-2 text-gray-500">Annulla</button>
                     <button onClick={async () => {
                         try { const res = await generateArticleContent(prompt, mode || 'body'); onChange(res); } catch(e) { console.error(e); }
                         setShowAiDialog(false);
                     }} className="px-4 py-2 bg-purple-600 text-white rounded">Genera</button>
                 </div>
             </div>
        </div>,
        document.body
    )}
    </>
  );
};
