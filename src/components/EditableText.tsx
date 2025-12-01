import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wand2, X, Sparkles, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus, Volume2, StopCircle, Palette, Type } from 'lucide-react';
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

const FONT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Giornale Antico', value: 'font-chomsky' },
    { label: 'Titolo Elegante', value: 'font-playfair' },
    { label: 'Testo Classico', value: 'font-merriweather' },
    { label: 'Moderno (Sans)', value: 'font-roboto' },
    { label: 'Impatto (Forte)', value: 'font-oswald' },
    { label: 'Macchina', value: 'font-mono' },
    { label: 'A Mano', value: 'font-handwriting' }
];

const SIZE_OPTIONS = [
    { label: 'Default', value: 0 },
    { label: 'Piccolo (-4)', value: -4 },
    { label: 'Medio (+8)', value: 8 },
    { label: 'Grande (+16)', value: 16 },
    { label: 'Titolo (+24)', value: 24 },
    { label: 'Gigante (+48)', value: 48 }
];

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, onChange, className = "", placeholder = "Modifica...", multiline = false, aiEnabled = true, aiContext = "", mode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isBold, setIsBold] = useState(className.includes('font-bold'));
  const [isItalic, setIsItalic] = useState(className.includes('italic'));
  const [isUnderline, setIsUnderline] = useState(className.includes('underline'));
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'|'justify'>('left');
  
  const [textColor, setTextColor] = useState<string>(''); 
  const [fontFamily, setFontFamily] = useState<string>(''); 
  const [fontSizeMod, setFontSizeMod] = useState(0); 
  const [tempFontSize, setTempFontSize] = useState("0");

  const inputRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const foundFont = FONT_OPTIONS.find(f => f.value && className.includes(f.value));
      if (foundFont) setFontFamily(foundFont.value);
  }, [className]);

  useEffect(() => { if (isEditing) setTempFontSize(fontSizeMod.toString()); }, [isEditing, fontSizeMod]);

  const handleSpeak = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
      if (!value) return;
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = 'it-IT'; utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
  };

  const handleQuickAi = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!value) return;
      const res = await generateArticleContent("Migliora questo testo rendendolo più professionale e accattivante.", value);
      if (res) onChange(res);
  };

  const commitFontSize = () => {
      const val = parseInt(tempFontSize);
      if (!isNaN(val)) setFontSizeMod(val);
      else setTempFontSize(fontSizeMod.toString());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && containerRef.current.contains(event.target as Node)) return;
        const toolbar = document.getElementById('text-toolbar-portal');
        if (toolbar && toolbar.contains(event.target as Node)) return;
        setIsEditing(false);
    };
    if (isEditing) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const cleanBaseClass = className.replace(/font-\w+/g, '').replace(/text-\w+-\d+/g, '').replace(/text-(left|center|right|justify)/g, '');
  const dynamicClassName = `${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''} text-${textAlign} ${fontFamily} ${cleanBaseClass}`.trim();
  const dynamicStyle = { color: textColor || undefined, fontSize: fontSizeMod !== 0 ? `calc(100% + ${fontSizeMod * 2}px)` : undefined };

  const Toolbar = () => {
      const portalTarget = document.getElementById('text-toolbar-portal');
      if (!portalTarget) return null;

      return createPortal(
        <div id="text-toolbar-portal-inner" className="flex flex-wrap gap-2 items-center text-xs animate-fade-in-up select-none bg-stone-100 px-3 py-2 rounded-lg border border-stone-300 shadow-xl mx-auto w-max max-w-[95vw] z-[9999]" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-white rounded border border-stone-200 px-1 h-7">
                <Type size={14} className="text-stone-400 mr-1"/>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="bg-transparent text-xs font-bold text-stone-700 outline-none w-28 py-1 cursor-pointer h-full">
                    {FONT_OPTIONS.map(f => <option key={f.label} value={f.value}>{f.label}</option>)}
                </select>
            </div>
            <div className="w-px h-4 bg-stone-300"></div>
            <div className="flex bg-white rounded border border-stone-200 h-7">
                <button onClick={() => setIsBold(!isBold)} className={`px-2 h-full hover:bg-stone-100 ${isBold ? 'text-blue-600 font-bold' : 'text-stone-600'}`}><Bold size={14}/></button>
                <div className="w-px h-full bg-stone-100"></div>
                <button onClick={() => setIsItalic(!isItalic)} className={`px-2 h-full hover:bg-stone-100 ${isItalic ? 'text-blue-600 italic' : 'text-stone-600'}`}><Italic size={14}/></button>
                <div className="w-px h-full bg-stone-100"></div>
                <button onClick={() => setIsUnderline(!isUnderline)} className={`px-2 h-full hover:bg-stone-100 ${isUnderline ? 'text-blue-600 underline' : 'text-stone-600'}`}><Underline size={14}/></button>
            </div>
            <div className="w-px h-4 bg-stone-300"></div>
            <div className="flex bg-white rounded border border-stone-200 h-7">
                <button onClick={() => setTextAlign('left')} className={`px-2 h-full hover:bg-stone-100 ${textAlign==='left'?'text-blue-600':'text-stone-600'}`}><AlignLeft size={14}/></button>
                <button onClick={() => setTextAlign('center')} className={`px-2 h-full hover:bg-stone-100 ${textAlign==='center'?'text-blue-600':'text-stone-600'}`}><AlignCenter size={14}/></button>
                <button onClick={() => setTextAlign('justify')} className={`px-2 h-full hover:bg-stone-100 ${textAlign==='justify'?'text-blue-600':'text-stone-600'}`}><AlignJustify size={14}/></button>
            </div>
            <div className="w-px h-4 bg-stone-300"></div>
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-white rounded border border-stone-200 h-7">
                    <button onClick={() => { const n = fontSizeMod - 2; setFontSizeMod(n); setTempFontSize(n.toString()); }} className="px-2 h-full hover:bg-stone-100 text-stone-600"><Minus size={12}/></button>
                    <select value={SIZE_OPTIONS.find(o => o.value === fontSizeMod) ? fontSizeMod : ''} onChange={(e) => { const val = Number(e.target.value); setFontSizeMod(val); setTempFontSize(val.toString()); }} className="w-16 text-center text-[10px] font-bold border-l border-r border-stone-100 h-full outline-none bg-transparent cursor-pointer">
                        <option value="" disabled>--</option>
                        {SIZE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                    <button onClick={() => { const n = fontSizeMod + 2; setFontSizeMod(n); setTempFontSize(n.toString()); }} className="px-2 h-full hover:bg-stone-100 text-stone-600"><Plus size={12}/></button>
                </div>
                <label className="flex items-center justify-center bg-white w-7 h-7 rounded border border-stone-200 cursor-pointer hover:bg-stone-50" title="Scegli Colore"><div className="w-4 h-4 rounded-full border border-stone-300" style={{backgroundColor: textColor || '#000000'}}></div><input type="color" value={textColor || '#000000'} onChange={(e) => setTextColor(e.target.value)} className="opacity-0 absolute w-0 h-0"/></label>
            </div>
            {aiEnabled && (<button onClick={() => setShowAiDialog(true)} className="ml-auto flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 h-7 rounded text-[10px] font-bold uppercase transition-colors border border-purple-200"><Wand2 size={12}/> AI</button>)}
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="ml-1 text-stone-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50" title="Chiudi"><X size={16}/></button>
        </div>, portalTarget
      );
  };

  if (isEditing) {
      return (
        <div ref={containerRef} className="relative group z-[50]" onClick={e => e.stopPropagation()}>
           <Toolbar />
           {multiline ? (
               <textarea 
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>} 
                    className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none resize-y min-h-[100px] ${dynamicClassName}`} 
                    style={sizeStyle} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()} // <--- FIX: BLOCCA IL DRAG MENTRE SELEZIONI
                    onClick={(e) => e.stopPropagation()}
               />
           ) : (
               <input 
                    ref={inputRef as React.RefObject<HTMLInputElement>} 
                    className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none ${dynamicClassName}`} 
                    style={sizeStyle} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()} // <--- FIX: BLOCCA IL DRAG
                    onClick={(e) => e.stopPropagation()}
               />
           )}
        </div>
      )
  }

  return (
    <div ref={containerRef} className={`relative group cursor-pointer hover:bg-blue-50/50 rounded transition-colors p-0.5 ${dynamicClassName} ${multiline ? 'whitespace-pre-wrap break-words' : ''}`} style={dynamicStyle} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
      {value || <span className="opacity-40 italic">{placeholder}</span>}
      <div className="absolute -top-4 right-0 hidden group-hover:flex gap-1 z-10 bg-white/90 backdrop-blur p-1 rounded-full shadow border border-stone-200">
         {value && (
             <>
                <button onClick={handleSpeak} className="text-blue-600 p-1 hover:scale-110 transition-transform" title="Ascolta">
                    {isSpeaking ? <StopCircle size={14} className="text-red-500 animate-pulse"/> : <Volume2 size={14}/>}
                </button>
                {aiEnabled && (
                    <button onClick={handleQuickAi} className="text-purple-600 p-1 hover:scale-110 transition-transform" title="Riscrivi con AI">
                        <Sparkles size={14}/>
                    </button>
                )}
             </>
         )}
      </div>
    </div>
  );
};
