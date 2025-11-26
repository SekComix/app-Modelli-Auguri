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
  
  // DIALOG STATES
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [promptMode, setPromptMode] = useState<'image' | 'video'>('image');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVideo = src?.startsWith('data:video') || src?.startsWith('blob:') || src?.endsWith('.mp4') || src?.endsWith('.webm');

  // --- REGOLA FERREA ALTEZZA ---
  // Se c'è customHeight (dalla maniglia o dal database) usa quella.
  // Se non c'è, usa un default di 300px (invece di 'auto' che fa saltare tutto).
  const heightValue = customHeight ? `${customHeight}px` : (autoHeight ? '300px' : '300px');
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !onHeightChange) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      if (newHeight > 100 && newHeight < 1500) onHeightChange(newHeight);
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
    setIsLoading(true); setLoadingStep('Generazione...');
    try { await new Promise(resolve => setTimeout(resolve, 800)); const newImage = await generateNewspaperImage(context); onChange(newImage); setUseOriginalColor(false); } catch (error: any) { alert("Errore."); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const handleAnalyzeImage = async () => {
      if (!src || !onAnalyze) return; setIsLoading(true); setLoadingStep("Analisi...");
      try { const { headline, body } = await generateTextFromMedia(src); onAnalyze(headline, body); } catch (error: any) { alert(error.message); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const openPromptDialog = (mode: 'image' | 'video') => { setCurrentPrompt(context); setPromptMode(mode); setReferenceImage(null); setShowPromptDialog(true); };

  const handleConfirmPrompt = async () => {
    setShowPromptDialog(false); if (!currentPrompt.trim() && !referenceImage) return; setIsLoading(true);
    try {
        if (promptMode === 'image') { setLoadingStep('Creo Immagine...'); const newImage = await generateNewspaperImage(currentPrompt, referenceImage || undefined); onChange(newImage); setUseOriginalColor(false); } 
        else { setLoadingStep('Creo Video...'); const newVideoUrl = await generateNewspaperVideo(currentPrompt.trim()); if (newVideoUrl) { onChange(newVideoUrl); setUseOriginalColor(false); setIsMuted(true); } }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const activeFilters = filters !== undefined ? filters : "grayscale contrast-125 sepia-[.15] brightness-90";
  const imageFilterClass = useOriginalColor ? "" : activeFilters;
  
  // STILE CONTENITORE: Larghezza 100% della colonna, Altezza Fissa, Overflow Nascosto
  const containerClass = `relative group bg-neutral-200 overflow-hidden w-full print:block ${className}`;

  return (
    <>
      <div ref={containerRef} className={containerClass} style={{ height: heightValue, minHeight: '100px' }}>
        {src ? ( 
            isVideo ? (
                <video ref={videoRef} src={src} autoPlay loop muted={isMuted} playsInline className={`absolute inset-0 w-full h-full object-cover ${imageFilterClass}`} />
            ) : (
                // object-cover: Taglia l'immagine per riempire il box senza deformare
                <img ref={imgRef} src={src} alt="Visual" crossOrigin="anonymous" className={`absolute inset-0 w-full h-full object-cover ${imageFilterClass}`} /> 
            ) 
        ) : ( 
            <div className={`flex flex-col items-center justify-center h-full text-stone-400 opacity-50 pointer-events-none`}>
                <ImageIcon size={40} />
                <span className="text-[10px] font-bold mt-2 uppercase">Carica Foto</span>
            </div> 
        )}
        
        {/* OVERLAY COMANDI */}
        <div className={src ? "absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-20 p-2 overlay-controls" : "absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 p-2"}>
          <div className="flex gap-2">
            <button onClick={handleAutoGenerate} disabled={isLoading} className="flex flex-col items-center justify-center w-12 h-12 bg-stone-900/90 hover:bg-black text-white rounded-lg border border-stone-700"><Zap size={16} className="text-yellow-400"/><span className="text-[7px] font-bold uppercase mt-1">Auto</span></button>
            <label className="flex flex-col items-center justify-center w-12 h-12 bg-stone-900/90 hover:bg-black text-white rounded-lg border border-stone-700 cursor-pointer" onClick={(e) => e.stopPropagation()}><Upload size={16} className="text-blue-400"/><span className="text-[7px] font-bold uppercase mt-1">Upload</span><input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} onClick={(e) => { (e.currentTarget as HTMLInputElement).value = '' }} /></label>
            {src && (
                <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="flex flex-col items-center justify-center w-12 h-12 bg-red-900/90 hover:bg-red-800 text-white rounded-lg border border-red-700 cursor-pointer">
                    <Trash2 size={16} className="text-white" />
                    <span className="text-[7px] font-bold uppercase mt-1">Via</span>
                </button>
            )}
          </div>
          {src && (
            <div className="flex gap-2">
               <button onClick={(e) => { e.stopPropagation(); setUseOriginalColor(!useOriginalColor); }} className={`px-2 py-1 text-[9px] font-bold uppercase rounded border ${useOriginalColor ? 'bg-white text-stone-900' : 'bg-stone-900 text-stone-400'}`}>{useOriginalColor ? 'Colore' : 'B/N'}</button>
               {isVideo && <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="px-2 py-1 text-[9px] font-bold uppercase rounded border bg-stone-900 text-white">{isMuted ? 'Unmute' : 'Mute'}</button>}
            </div>
          )}
        </div>
        
        {/* MANIGLIA RIDIMENSIONAMENTO */}
        {enableResizing && (
            <div onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); }} className="absolute bottom-0 left-0 right-0 h-6 z-40 cursor-row-resize flex items-end justify-center group/handle opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/50 to-transparent">
                <div className="w-10 h-1 bg-white/80 rounded-full mb-1 shadow-sm"></div>
            </div>
        )}
        
        {isLoading && (<div className="absolute inset-0 bg-stone-900/95 flex items-center justify-center z-50"><div><Zap className="animate-bounce text-yellow-400 mx-auto" size={32} /></div></div>)}
      </div>
      {showPromptDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}><div className="bg-white p-6 rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}><textarea value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} className="w-full border p-2 mb-4" placeholder="Descrivi..." /><button onClick={handleConfirmPrompt} className="bg-black text-white px-4 py-2 rounded">Genera</button></div></div>, document.body
      )}
    </>
  );
};
