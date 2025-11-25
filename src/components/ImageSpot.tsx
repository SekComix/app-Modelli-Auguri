import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Zap, PenLine, Image as ImageIcon, Droplet, Film, Download, X, Plus, Volume2, VolumeX, FileText, GripHorizontal, Check } from 'lucide-react';
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
      if (newHeight > 100) onHeightChange(newHeight);
    };
    const handleMouseUp = () => { setIsResizing(false); document.body.style.cursor = 'default'; };
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
    }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
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
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setReferenceImage(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!src) return;
    const filename = isVideo ? `video-giornale-${Date.now()}.mp4` : `immagine-giornale-${Date.now()}.png`;
    if (isVideo) {
         if (src.startsWith('data:') || src.startsWith('blob:')) {
            const link = document.createElement('a'); link.href = src; link.download = filename; link.click();
        } else {
             try {
                const response = await fetch(src); const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 100);
            } catch(e) { window.open(src, '_blank'); }
        }
        return;
    }
    if (imgRef.current) {
        try {
            const canvas = document.createElement('canvas'); canvas.width = imgRef.current.naturalWidth; canvas.height = imgRef.current.naturalHeight; const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(imgRef.current, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const link = document.createElement('a'); link.href = dataUrl; link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link);
            }
        } catch (err) { window.open(src, '_blank'); }
    }
  };

  const handleAutoGenerate = async () => {
    setIsLoading(true); setLoadingStep('Leggo l\'articolo...');
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); setLoadingStep('Genero Foto...');
      const newImage = await generateNewspaperImage(context); onChange(newImage); setUseOriginalColor(false);
    } catch (error: any) { alert(error.message || "Generazione fallita."); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const handleAnalyzeImage = async () => {
      if (!src || !onAnalyze) return; setIsLoading(true); setLoadingStep("Analizzo contenuto...");
      try { const { headline, body } = await generateTextFromMedia(src); onAnalyze(headline, body); } catch (error: any) { alert(error.message); } finally { setIsLoading(false); setLoadingStep(''); }
  };

  const openPromptDialog = (mode: 'image' | 'video') => {
    setCurrentPrompt(context.length > 200 ? context.substring(0, 200) + "..." : context); setPromptMode(mode); setReferenceImage(null); setShowPromptDialog(true);
  };

  const handleConfirmPrompt = async () => {
    setShowPromptDialog(false); if (!currentPrompt.trim() && !referenceImage) return; setIsLoading(true);
    try {
        if (promptMode === 'image') {
            setLoadingStep(referenceImage ? 'Modifico Immagine...' : 'Genero Foto...');
            const newImage = await generateNewspaperImage(currentPrompt, referenceImage || undefined); onChange(newImage); setUseOriginalColor(false);
        } else {
            setLoadingStep('Genero Video...');
            const newVideoUrl = await generateNewspaperVideo(currentPrompt.trim());
            if (newVideoUrl) { onChange(newVideoUrl); setUseOriginalColor(false); setIsMuted(true); }
        }
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
        <div className={src ? "absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 p-4" : "absolute inset-0 bg-stone-200/50 flex flex-col items-center justify-center gap-4 z-20 p-4"}>
          <div className="flex gap-3">
            <button onClick={handleAutoGenerate} disabled={isLoading} className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30"><Zap size={18} className={isLoading ? "animate-pulse text-yellow-400" : "text-yellow-400"} /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Auto</span></button>
            <button onClick={() => openPromptDialog('image')} disabled={isLoading} className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30"><PenLine size={18} className="text-purple-400" /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Prompt</span></button>
            <label className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30" onClick={(e) => e.stopPropagation()}><Upload size={18} className="text-blue-400" /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Upload</span><input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} onClick={(e) => { (e.currentTarget as HTMLInputElement).value = '' }} /></label>
            {src && onAnalyze && (<button onClick={handleAnalyzeImage} disabled={isLoading} className="flex flex-col items-center justify-center w-14 h-14 bg-stone-900/90 hover:bg-black text-white rounded-lg shadow-md border border-stone-700 transition-all transform hover:scale-105 cursor-pointer z-30"><FileText size={18} className="text-green-400" /><span className="text-[8px] font-bold uppercase mt-1 tracking-wider text-stone-300">Scrivi</span></button>)}
          </div>
          <div className="flex gap-2 mt-2">
              <button onClick={() => openPromptDialog('video')} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/90 hover:bg-black border border-stone-600 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors z-30"><Film size={12} className="text-red-500" /><span>Video AI</span></button>
              {isVideo && (<button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/90 hover:bg-black border border-stone-600 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors z-30">{isMuted ? <VolumeX size={12} className="text-stone-400"/> : <Volume2 size={12} className="text-green-400"/>}<span>{isMuted ? 'No Audio' : 'Audio'}</span></button>)}
              {src && (<button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/90 hover:bg-black border border-stone-600 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors z-30"><Download size={12} className="text-green-400" /><span>Salva</span></button>)}
              {src && (<button onClick={(e) => { e.stopPropagation(); setUseOriginalColor(!useOriginalColor); }} className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded transition-colors z-30 ${useOriginalColor ? 'bg-white text-stone-900 border-white' : 'bg-stone-900/90 text-stone-400 border-stone-600 hover:text-white'}`}><Droplet size={12} className={useOriginalColor ? "text-blue-500" : ""} /><span>{useOriginalColor ? 'Colore' : 'B/N'}</span></button>)}
          </div>
        </div>
        {enableResizing && (<div onMouseDown={() => setIsResizing(true)} className="absolute bottom-0 left-0 right-0 h-4 bg-transparent hover:bg-blue-500/20 cursor-row-resize flex items-center justify-center z-40 group/handle opacity-0 hover:opacity-100 transition-opacity"><div className="w-12 h-1 bg-stone-400/80 rounded-full group-hover/handle:bg-blue-500 flex items-center justify-center"><GripHorizontal size={12} className="text-white"/></div></div>)}
        {isLoading && (<div className="absolute inset-0 bg-stone-900/95 flex items-center justify-center z-50 text-center p-4 animate-fade-in-up"><div><Zap className="animate-bounce text-yellow-400 mx-auto mb-3" size={40} /><p className="text-sm font-bold text-white uppercase tracking-wider animate-pulse">{loadingStep}</p></div></div>)}
      </div>
      {showPromptDialog && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 border-stone-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-2 border-stone-200"><div className="flex items-center gap-2">{promptMode === 'image' ? <ImageIcon className="text-purple-600" size={24}/> : <Film className="text-red-600" size={24}/>}<h3 className="text-xl font-bold font-sans uppercase tracking-tight">{promptMode === 'image' ? 'Genera Immagine' : 'Genera Video AI'}</h3></div><button onClick={() => setShowPromptDialog(false)} className="text-stone-400 hover:text-red-500"><X size={24} /></button></div>
            {promptMode === 'image' && (<div className="mb-4 p-4 bg-stone-50 rounded-lg border border-dashed border-stone-300"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold uppercase text-stone-500">Immagine di Riferimento</span>{referenceImage && <button onClick={() => setReferenceImage(null)} className="text-[10px] text-red-500 hover:underline">Rimuovi</button>}</div>{referenceImage ? (<div className="relative h-32 w-full bg-stone-200 rounded overflow-hidden"><img src={referenceImage} className="w-full h-full object-contain" alt="Reference" /></div>) : (<label className="flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-stone-100 transition-colors rounded"><Plus size={24} className="text-stone-400 mb-1" /><span className="text-xs text-stone-500 font-bold">Carica Modello</span><input type="file" accept="image/*" className="hidden" onChange={handleReferenceFileChange} /></label>)}</div>)}
            <p className="text-sm text-stone-500 mb-2 font-serif italic">{referenceImage ? "Descrivi come vuoi MODIFICARE l'immagine caricata:" : "Descrivi l'immagine che vuoi creare:"}</p>
            <textarea value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} className="w-full bg-stone-50 border border-stone-300 p-3 rounded-lg mb-6 text-sm font-medium h-24 outline-none resize-none shadow-inner" placeholder="Es: Rendi lo sfondo spaziale, aggiungi un cappello..." autoFocus />
            <div className="flex justify-end gap-3"><button onClick={() => setShowPromptDialog(false)} className="px-4 py-2 text-stone-500 font-bold text-xs uppercase hover:bg-stone-100 rounded">Annulla</button><button onClick={handleConfirmPrompt} className="px-6 py-2 bg-stone-900 text-white font-bold text-xs uppercase rounded hover:bg-black shadow-lg flex items-center gap-2">{isLoading ? <Zap size={14} className="animate-spin text-yellow-400"/> : <Check size={14}/>} Genera</button></div>
          </div>
        </div>, document.body
      )}
    </>
  );
};
