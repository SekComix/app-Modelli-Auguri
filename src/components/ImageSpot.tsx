import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Zap, PenLine, Image as ImageIcon, Droplet, Film, Download, X, GripHorizontal, Check, Trash2, Volume2, VolumeX, FileText } from 'lucide-react';
import { generateNewspaperImage, generateNewspaperVideo, generateTextFromMedia } from '../services/gemini';

interface ImageSpotProps {
  src?: string;
  onChange: (newSrc: string) => void;
  className?: string;
  context?: string;
  filters?: string;
  onAnalyze?: (headline: string, body: string) => void;
  customHeight?: number;
  onHeightChange?: (height: number) => void;
  enableResizing?: boolean;
}

export const ImageSpot: React.FC<ImageSpotProps> = ({ 
  src, onChange, className = "", context = "Notizia", filters, onAnalyze, customHeight, onHeightChange, enableResizing = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [useOriginalColor, setUseOriginalColor] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  
  // Dialogs
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [promptMode, setPromptMode] = useState<'image' | 'video'>('image');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const isVideo = src?.startsWith('data:video') || src?.startsWith('blob:') || src?.endsWith('.mp4');

  // ALTEZZA: Se non definita, usa 300px di default. Mai 'auto'.
  const heightStyle = { height: customHeight ? `${customHeight}px` : '300px' };

  // DRAG HANDLE LOGIC
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !onHeightChange) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      // Limiti di sicurezza: min 100px, max 1200px
      if (newHeight > 100 && newHeight < 1200) {
        onHeightChange(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onHeightChange]);

  // HANDLERS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerate = async () => {
      setIsLoading(true); setLoadingStep('Generazione...');
      try { await new Promise(r => setTimeout(r, 1000)); const img = await generateNewspaperImage(context); onChange(img); } 
      catch (e) { alert("Errore generazione"); } finally { setIsLoading(false); }
  };

  const handleDownload = (e: React.MouseEvent) => {
      e.stopPropagation(); if(!src) return;
      const a = document.createElement('a'); a.href = src; a.download = `media-${Date.now()}.${isVideo?'mp4':'png'}`; a.click();
  };

  const activeFilters = filters || "grayscale contrast-125 sepia-[.15] brightness-90";
  const finalFilter = useOriginalColor ? "" : activeFilters;

  return (
    <>
      <div ref={containerRef} className={`relative group w-full bg-stone-200 overflow-hidden ${className}`} style={heightStyle}>
        {/* CONTENUTO VISIVO */}
        {src ? (
            isVideo ? (
                <video ref={videoRef} src={src} autoPlay loop muted={isMuted} className={`absolute inset-0 w-full h-full object-cover ${finalFilter}`} />
            ) : (
                <img ref={imgRef} src={src} className={`absolute inset-0 w-full h-full object-cover ${finalFilter}`} alt="Content" />
            )
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 opacity-50 pointer-events-none">
                <ImageIcon size={48} />
                <span className="text-[10px] font-bold mt-2">CARICA FOTO</span>
            </div>
        )}

        {/* OVERLAY COMANDI (Visibile al passaggio del mouse) */}
        <div className={`absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center gap-3 z-20 transition-opacity duration-200 ${src ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex gap-2">
                <button onClick={handleAutoGenerate} disabled={isLoading} className="flex flex-col items-center justify-center w-12 h-12 bg-stone-800 text-white rounded border border-stone-600 hover:bg-black"><Zap size={16} className="text-yellow-400"/><span className="text-[8px] font-bold uppercase mt-1">AI</span></button>
                <label className="flex flex-col items-center justify-center w-12 h-12 bg-stone-800 text-white rounded border border-stone-600 hover:bg-black cursor-pointer" onClick={e=>e.stopPropagation()}>
                    <Upload size={16} className="text-blue-400"/>
                    <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} onClick={e => (e.target as any).value = null}/>
                </label>
                {src && (
                    <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="flex flex-col items-center justify-center w-12 h-12 bg-red-900 text-white rounded border border-red-700 hover:bg-red-800">
                        <Trash2 size={16} /><span className="text-[8px] font-bold uppercase mt-1">Via</span>
                    </button>
                )}
            </div>
            {src && (
                <div className="flex gap-2">
                    <button onClick={(e) => {e.stopPropagation(); setUseOriginalColor(!useOriginalColor)}} className="px-2 py-1 text-[9px] font-bold bg-white text-black rounded uppercase">Colore/BN</button>
                    <button onClick={handleDownload} className="px-2 py-1 text-[9px] font-bold bg-white text-black rounded uppercase">Salva</button>
                </div>
            )}
        </div>

        {/* MANIGLIA RIDIMENSIONAMENTO */}
        {enableResizing && (
            <div 
                onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); }}
                className="absolute bottom-0 left-0 right-0 h-6 z-30 cursor-row-resize flex items-end justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
            >
                <div className="w-full h-3 bg-gradient-to-t from-blue-600/50 to-transparent flex items-center justify-center">
                    <div className="w-12 h-1 bg-white rounded-full shadow-sm" />
                </div>
            </div>
        )}

        {isLoading && <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 text-white font-bold animate-pulse">{loadingStep}</div>}
      </div>
    </>
  );
};
