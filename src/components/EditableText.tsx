import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wand2, X, Sparkles, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus } from 'lucide-react';
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
  value, 
  onChange, 
  className = "", 
  placeholder = "Modifica...", 
  multiline = false,
  aiEnabled = true,
  aiContext = "",
  mode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [prompt, setPrompt] = useState("");
  
  // Style State
  const [isBold, setIsBold] = useState(className.includes('font-bold'));
  const [isItalic, setIsItalic] = useState(className.includes('italic'));
  const [isUnderline, setIsUnderline] = useState(className.includes('underline'));
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'|'justify'>('left');
  const [currentFont, setCurrentFont] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [fontSizeMod, setFontSizeMod] = useState(0); 

  const inputRef = useRef<HTMLElement>(null);

  // Focus automatico quando si apre l'editor
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const dynamicClassName = `
    ${isBold ? 'font-bold' : ''} 
    ${isItalic ? 'italic' : ''} 
    ${isUnderline ? 'underline' : ''} 
    ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : textAlign === 'justify' ? 'text-justify' : 'text-left'}
    ${currentFont}
    ${currentColor}
    ${className} 
  `.trim();

  const sizeStyle = fontSizeMod !== 0 ? { fontSize: `calc(100% + ${fontSizeMod * 2}px)` } : {};

  // Toolbar Component
  const Toolbar = () => {
      const portalTarget = document.getElementById('text-toolbar-portal');
      if (!portalTarget) return null; // Se la toolbar non trova il posto, non si mostra (evita errori)

      return createPortal(
        <div 
            className="flex gap-2 items-center text-xs animate-fade-in-up select-none bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-300 shadow-lg mx-auto w-max"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
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
        <div className="relative group z-[50]" onClick={e => e.stopPropagation()}>
           <Toolbar />
           {multiline ? (
               <textarea
                   ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                   className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none resize-y min-h-[100px] ${dynamicClassName}`}
                   style={sizeStyle}
                   value={value}
                   onChange={(e) => onChange(e.target.value)}
                   onBlur={() => {
                        // Ritardo leggero per permettere click sui bottoni della toolbar prima di chiudere
                        setTimeout(() => {
                           if (!document.activeElement?.closest('#text-toolbar-portal')) {
                               // setIsEditing(false); // Commentato per permettere click manuale sulla X
                           }
                        }, 200);
                   }}
               />
           ) : (
               <input
                   ref={inputRef as React.RefObject<HTMLInputElement>}
                   className={`w-full bg-yellow-50/20 border-2 border-blue-400 p-1 outline-none ${dynamicClassName}`}
                   style={sizeStyle}
                   value={value}
                   onChange={(e) => onChange(e.target.value)}
               />
           )}
           {/* Overlay cliccabile per chiudere cliccando fuori */}
           <div className="fixed inset-0 z-[-1]" onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} />
        </div>
      )
  }

  return (
    <>
    <div 
        className={`relative group cursor-pointer hover:bg-blue-50/50 rounded transition-colors p-0.5 ${dynamicClassName}`}
        style={sizeStyle}
        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
    >
      {value || <span className="opacity-40 italic">{placeholder}</span>}
    </div>

    {showAiDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
             <div className="bg-white p-6 rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                 <h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><Sparkles className="text-purple-600"/> Riscrivi con AI</h3>
                 <textarea 
                    className="w-full border p-2 rounded mb-4" 
                    value={prompt || value} 
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Cosa vuoi scrivere?"
                 />
                 <div className="flex justify-end gap-2">
                     <button onClick={() => setShowAiDialog(false)} className="px-4 py-2 text-gray-500">Annulla</button>
                     <button onClick={async () => {
                         try {
                             const res = await generateArticleContent(prompt, mode || 'body');
                             onChange(res);
                         } catch(e) { console.error(e); }
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
