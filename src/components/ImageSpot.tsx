import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Zap, PenLine, Image as ImageIcon, Droplet, Film, Download, X, Plus, Volume2, VolumeX, FileText, GripHorizontal, Check, Trash2 } from 'lucide-react';
import { generateNewspaperImage, generateNewspaperVideo, generateTextFromMedia } from '../services/gemini';

interface ImageSpotProps {
  src?: string;
  onChange: (newSrc: string) => void;
  className?: string;
  context?: string;
  autoHeight?: boolean;
  filters?: string;
  onAnalyze?: (headline: string, body: string) => void;
  customHeight?: number;
  onHeightChange?: (height: number) => void;
  enableResizing?: boolean;
}

export const ImageSpot: React.FC<ImageSpotProps> = ({ 
  src, onChange, className = "", context = "Notizia generica", autoHeight = false, filters, onAnalyze, customHeight, onHeightChange, enableResizing = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [useOriginalColor, setUseOriginalColor] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [promptMode, setPromptMode] = useState<'image' | 'video'>('image');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVideo = src?.startsWith('data:video') || src?.startsWith('blob:') || src?.endsWith('.mp4') || src?.endsWith('.webm');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !onHeightChange) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      if (newHeight > 100 && newHeight < 2000) onHeightChange(newHeight);
    };
    const handleMouseUp = () => {
      setIsResizing(false); document.body.style.cursor = 'default'; document.body.style.userSelect = '';
    };
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize'; document.body.style.userSelect = 'none';
    }
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [isResizing, onHeightChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setReferenceImage(reader.result as string); reader.readAsDataURL(file); }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); if (!src) return;
    const filename = isVideo ? `video-${Date.now()}.mp4` : `foto-${Date.now()}.png`;
    const link = document.createElement('a'); link.href = src; link.download = filename; link.click();
  };

  const handleAutoGenerate = async () => {
    setIsLoading(true); setLoadingStep('Leggo l\'articolo...');
    try { await new Promise(resolve => setTimeout(resolve, 800)); setLoadingStep('Genero Foto...'); const newImage = await generateNewspaperImage(context); onChange(newImage); setUseOriginalColor(false); } catch (error: any) { alert("Errore generazione."); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const handleAnalyzeImage = async () => {
      if (!src || !onAnalyze) return; setIsLoading(true); setLoadingStep("Analizzo...");
      try { const { headline, body } = await generateTextFromMedia(src); onAnalyze(headline, body); } catch (error: any) { alert(error.message); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const openPromptDialog = (mode: 'image' | 'video') => { setCurrentPrompt(context); setPromptMode(mode); setReferenceImage(null); setShowPromptDialog(true); };

  const handleConfirmPrompt = async () => {
    setShowPromptDialog(false); if (!currentPrompt.trim() && !referenceImage) return; setIsLoading(true);
    try {
        if (promptMode === 'image') { setLoadingStep('Genero Immagine...'); const newImage = await generateNewspaperImage(currentPrompt, referenceImage || undefined); onChange(newImage); setUseOriginalColor(false); } 
        else { setLoadingStep('Genero Video...'); const newVideoUrl = await generateNewspaperVideo(currentPrompt.trim()); if (newVideoUrl) { onChange(newVideoUrl); setUseOriginalColor(false); setIsMuted(true); } }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const activeFilters = filters !== undefined ? filters : "grayscale contrast-125 sepia-[.15] brightness-90";
  const imageFilterClass = useOriginalColor ? "" : activeFilters;
  const heightStyle = customHeight ? { height: `${customHeight}px` } : {};
  const containerClass = autoHeight && !customHeight ? (src ? `w-full relative group bg-neutral-200 flex items-center justify-center ${className}` : `w-full min-h-[14rem] relative group bg-neutral-200 flex items-center justify-center ${className}`) : `relative group bg-neutral-200 overflow-hidden flex items-center justify-center ${className}`;

  return (
    <>
      <div ref={containerRef} className={containerClass} style={heightStyle}>
        {src ? ( isVideo ? <video ref={videoRef} src={src} autoPlay loop muted={isMuted} playsInline className={autoHeight && !customHeight ? `w-full h-auto block ${imageFilterClass}` : `w-full h-full object-cover ${imageFilterClass}`} /> : <img ref={imgRef} src={src} alt="Visual" crossOrigin="anonymous" className={autoHeight && !customHeight ? `w-full h-auto block ${imageFilterClass}` : `w-full h-full object-cover ${imageFilterClass}`} /> ) : ( <div className={`text-stone-400 flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30`}><ImageIcon size={48} /><span className="text-xs font-bold mt-2">AGGIUNGI IMMAGINE</span></div> )}
        
        {/* OVERLAY DI CONTROLLO */}
        <div className={src ? "absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 p-4 overlay-controls" : "absolute inset-0 bg-stone-200/50 flex flex-col items-center justify-center gap-4 z-20 p-4"}>
          <div className="flex gap-3">
            <button onClick={handleAutoGenerate} disabled={isLoading} className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30"><Zap size={18} className={isLoading ? "animate-pulse text-yellow-400" : "text-yellow-400"} /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Auto</span></button>
            <label className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30" onClick={(e) => e.stopPropagation()}><Upload size={18} className="text-blue-400" /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Upload</span><input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} onClick={(e) => { (e.currentTarget as HTMLInputElement).value = '' }} /></label>
            
            {/* NUOVO TASTO RIMUOVI */}
            {src && (
                <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="flex flex-col items-center justify-center w-14 h-14 bg-red-900/90 hover:bg-red-800 text-white rounded-lg shadow-md border border-red-700 transition-all transform hover:scale-105 cursor-pointer z-30">
                    <Trash2 size={18} className="text-white" />
                    <span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-white">Rimuovi</span>
                </button>
            )}
          </div>
          <div className="flex gap-2 mt-2">
              {src && (<button onClick={(e) => { e.stopPropagation(); setUseOriginalColor(!useOriginalColor); }} className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded transition-colors z-30 ${useOriginalColor ? 'bg-white text-stone-900 border-white' : 'bg-stone-900/90 text-stone-400 border-stone-600 hover:text-white'}`}><Droplet size={12} className={useOriginalColor ? "text-blue-500" : ""} /><span>{useOriginalColor ? 'Colore' : 'B/N'}</span></button>)}
          </div>
        </div>
        
        {enableResizing && (
            <div onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); }} className="absolute bottom-0 left-0 right-0 h-8 z-40 cursor-row-resize flex items-end justify-center group/handle opacity-0 group-hover:opacity-100 transition-opacity duration-200"><div className="w-full h-4 bg-gradient-to-t from-blue-500/50 to-transparent hover:from-blue-600/80 flex items-center justify-center"><div className="w-12 h-1.5 bg-white rounded-full shadow-sm flex items-center justify-center"><GripHorizontal size={12} className="text-blue-500"/></div></div></div>
        )}
        
        {isLoading && (<div className="absolute inset-0 bg-stone-900/95 flex items-center justify-center z-50 text-center p-4 animate-fade-in-up"><div><Zap className="animate-bounce text-yellow-400 mx-auto mb-3" size={40} /><p className="text-sm font-bold text-white uppercase tracking-wider animate-pulse">{loadingStep}</p></div></div>)}
      </div>
      {showPromptDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 border-stone-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <textarea value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} className="w-full bg-stone-50 border border-stone-300 p-3 rounded-lg mb-6 text-sm font-medium h-24 outline-none resize-none shadow-inner" placeholder="Descrivi..." autoFocus />
            <div className="flex justify-end gap-3"><button onClick={() => setShowPromptDialog(false)} className="px-4 py-2 text-stone-500 font-bold text-xs uppercase hover:bg-stone-100 rounded">Annulla</button><button onClick={handleConfirmPrompt} className="px-6 py-2 bg-stone-900 text-white font-bold text-xs uppercase rounded hover:bg-black shadow-lg flex items-center gap-2"><Check size={14}/> Genera</button></div>
          </div>
        </div>, document.body
      )}
    </>
  );
};
