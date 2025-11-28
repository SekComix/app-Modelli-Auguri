import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORREZIONE QUI: Aggiunto 'Check' alla lista
import { Upload, X, Trash2, Move, Library, MessageCircle, Gift, Smile, Type, RotateCw, Copy, QrCode, Mic, Link as LinkIcon, ExternalLink, Heart, History, Star, Tag, Scissors, Eraser, Wrench, Maximize, Palette, FileText, Image as ImageIcon, Minimize, PenTool, Check } from 'lucide-react';
import { WidgetData, WidgetType } from '../types';
import { DEFAULT_ASSETS } from '../assetsData';

// --- FONT PER LE FIRME (Iniezione Dinamica) ---
const SIGNATURE_FONTS = [
    { name: 'Elegante', family: 'Great Vibes', url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' },
    { name: 'Semplice', family: 'Sacramento', url: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap' },
    { name: 'Pennarello', family: 'Permanent Marker', url: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap' },
    { name: 'Corsivo', family: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap' },
    { name: 'Scarabocchio', family: 'Reenie Beanie', url: 'https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap' }
];

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300; 
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); 
            };
        };
    });
};

interface WidgetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddWidget: (type: WidgetType, content: string, subType?: string, fontFamily?: string) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ isOpen, onClose, onAddWidget }) => {
    const [activeTab, setActiveTab] = useState<'mascots' | 'emotions' | 'bubbles' | 'stickers' | 'qr' | 'tools' | 'signatures'>('mascots');
    const [qrLink, setQrLink] = useState('');
    const [qrLabel, setQrLabel] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [selectedSigFont, setSelectedSigFont] = useState(SIGNATURE_FONTS[0].family);
    
    const [savedQRs, setSavedQRs] = useState<{label: string, link: string}[]>(() => {
        try { const s = localStorage.getItem('saved_qrs'); return s ? JSON.parse(s) : []; } catch(e){return[];}
    });
    const [customMascots, setCustomMascots] = useState<{id: string, label: string, src: string}[]>(() => {
        try { const saved = localStorage.getItem('custom_mascots'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });

    // Carica i font dinamicamente
    useEffect(() => {
        SIGNATURE_FONTS.forEach(font => {
            if (!document.querySelector(`link[href="${font.url}"]`)) {
                const link = document.createElement('link');
                link.href = font.url;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) { alert("Solo immagini."); return; }
            setIsLoading(true);
            try {
                const compressedBase64 = await compressImage(file);
                onAddWidget('mascot', compressedBase64, 'custom');
                const newMascot = { id: `custom-${Date.now()}`, label: 'Mio Personaggio', src: compressedBase64 };
                const updatedMascots = [...customMascots, newMascot];
                setCustomMascots(updatedMascots);
                try { localStorage.setItem('custom_mascots', JSON.stringify(updatedMascots)); } catch (e) { alert("Memoria piena."); }
            } catch (err) { alert("Errore upload."); } finally { setIsLoading(false); }
        }
    };

    const removeCustomMascot = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(!confirm("Vuoi eliminare questa immagine?")) return;
        const updated = customMascots.filter(m => m.id !== id);
        setCustomMascots(updated);
        localStorage.setItem('custom_mascots', JSON.stringify(updated));
    };

    const handleGenerateQR = () => {
        if (!qrLink) return;
        onAddWidget('qrcode', qrLink);
        const finalLabel = qrLabel.trim() || `Link ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        const newEntry = { label: finalLabel, link: qrLink };
        const updatedQRs = [newEntry, ...savedQRs].slice(0, 10); 
        setSavedQRs(updatedQRs);
        localStorage.setItem('saved_qrs', JSON.stringify(updatedQRs));
        setQrLink('');
        setQrLabel('');
        onClose();
    };

    const handleAddSignature = () => {
        if (!signatureName.trim()) return;
        // Passiamo il font selezionato al widget
        onAddWidget('text', signatureName, 'signature', selectedSigFont);
        setSignatureName('');
        onClose();
    };
    
    const loadSavedQR = (link: string) => { onAddWidget('qrcode', link); onClose(); };
    
    const deleteSavedQR = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = savedQRs.filter((_, i) => i !== idx);
        setSavedQRs(updated);
        localStorage.setItem('saved_qrs', JSON.stringify(updated));
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col border-l-4 border-blue-500 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-stone-50 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2"><Library className="text-blue-600"/> Libreria Widget</h2>
                        <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-1">Crea, Carica, Decora</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full text-stone-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>

                <div className="flex border-b border-stone-200 overflow-x-auto">
                    <button onClick={() => setActiveTab('mascots')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'mascots' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}><Smile size={18}/> Personaggi</button>
                    <button onClick={() => setActiveTab('signatures')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'signatures' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50' : 'text-stone-400 hover:bg-stone-50'}`}><PenTool size={18}/> Firme</button>
                    <button onClick={() => setActiveTab('emotions')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'emotions' ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50' : 'text-stone-400 hover:bg-stone-50'}`}><Heart size={18}/> Emozioni</button>
                    <button onClick={() => setActiveTab('bubbles')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'bubbles' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}><MessageCircle size={18}/> Fumetti</button>
                    <button onClick={() => setActiveTab('stickers')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'stickers' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}><Gift size={18}/> Oggetti</button>
                    <button onClick={() => setActiveTab('qr')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'qr' ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50' : 'text-stone-400 hover:bg-stone-50'}`}><QrCode size={18}/> QR</button>
                    <button onClick={() => setActiveTab('tools')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'tools' ? 'text-green-600 border-b-4 border-green-600 bg-green-50' : 'text-stone-400 hover:bg-stone-50'}`}><Wrench size={18}/> Utili</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-stone-100/50">
                    {activeTab === 'mascots' && (
                        <>
                            <label className={`flex items-center gap-3 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors mb-6 group ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform"><Upload className="text-blue-500" size={20}/></div>
                                <div><h4 className="font-bold text-blue-900 text-sm">{isLoading ? 'CARICAMENTO...' : 'CARICA FOTO TUA'}</h4><p className="text-[10px] text-blue-600">Ottimizzata per il sito</p></div>
                                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleUpload}/>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {customMascots.map(m => (
                                    <div key={m.id} className="relative group">
                                        <button onClick={() => onAddWidget('mascot', m.src)} className="w-full bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2"><img src={m.src} alt={m.label} className="h-24 object-contain"/><span className="text-xs font-bold text-stone-600 uppercase">{m.label}</span></button>
                                        <button onClick={(e) => removeCustomMascot(m.id, e)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"><X size={12}/></button>
                                    </div>
                                ))}
                                {DEFAULT_ASSETS.mascots.map(m => (
                                    <button key={m.id} onClick={() => onAddWidget('mascot', m.src)} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2"><img src={m.src} alt={m.label} className="h-24 object-contain"/><span className="text-xs font-bold text-stone-600 uppercase">{m.label}</span></button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* TAB FIRME */}
                    {activeTab === 'signatures' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><PenTool size={18}/> Firma Digitale</h4>
                                <input 
                                    type="text" 
                                    value={signatureName} 
                                    onChange={(e) => setSignatureName(e.target.value)}
                                    placeholder="Scrivi il nome..." 
                                    className="w-full p-3 rounded-lg border border-indigo-200 mb-4 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <div className="grid grid-cols-1 gap-2">
                                    {SIGNATURE_FONTS.map(font => (
                                        <button 
                                            key={font.family}
                                            onClick={() => setSelectedSigFont(font.family)}
                                            className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center ${selectedSigFont === font.family ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-stone-800 border-stone-200 hover:border-indigo-300'}`}
                                        >
                                            <span style={{ fontFamily: font.family, fontSize: '1.2rem' }}>{signatureName || 'Anteprima Firma'}</span>
                                            {selectedSigFont === font.family && <Check size={16}/>}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleAddSignature}
                                    disabled={!signatureName}
                                    className="w-full mt-4 bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:opacity-50 transition-colors"
                                >
                                    AGGIUNGI FIRMA
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'emotions' && (
                        <div className="grid grid-cols-4 gap-4">
                            {DEFAULT_ASSETS.emotions.map(e => (<button key={e.id} onClick={() => onAddWidget('sticker', e.content)} className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 hover:border-pink-500 hover:shadow-md transition-all flex flex-col items-center justify-center aspect-square gap-1"><span className="text-3xl">{e.content}</span><span className="text-[9px] font-bold text-stone-500 uppercase truncate w-full text-center">{e.label}</span></button>))}
                        </div>
                    )}

                    {activeTab === 'bubbles' && (
                        <div className="grid grid-cols-2 gap-4">
                             {DEFAULT_ASSETS.bubbles.map(b => (<button key={b.id} onClick={() => onAddWidget('bubble', b.svg)} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2"><div className="h-20 w-full" dangerouslySetInnerHTML={{__html: b.svg}} /><span className="text-xs font-bold text-stone-600 uppercase">{b.label}</span></button>))}
                            <button onClick={() => onAddWidget('text', '')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2"><div className="h-20 flex items-center justify-center"><Type size={32} className="text-stone-400"/></div><span className="text-xs font-bold text-stone-600 uppercase">Solo Testo</span></button>
                        </div>
                    )}

                     {activeTab === 'stickers' && (
                        <div className="grid grid-cols-3 gap-4">
                            {DEFAULT_ASSETS.stickers.map(s => (<button key={s.id} onClick={() => onAddWidget('sticker', s.src || s.content)} className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2 aspect-square justify-center">{s.src ? <img src={s.src} className="h-10 w-10 object-contain"/> : <span className="text-4xl">{s.content}</span>}<span className="text-xs font-bold text-stone-600 uppercase truncate w-full text-center">{s.label}</span></button>))}
                        </div>
                    )}

                    {activeTab === 'qr' && (
                        <div className="space-y-6">
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2"><Mic size={18}/> Audio Dedica</h4>
                                <p className="text-xs text-stone-600 mb-3 leading-relaxed">1. Vai su Vocaroo.<br/>2. Registra e clicca "Salva e Condividi".<br/>3. Copia il link e incollalo qui.</p>
                                <a href="https://vocaroo.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-orange-200 hover:bg-orange-300 text-orange-900 py-2 rounded-lg font-bold text-xs transition-colors">Vai su Vocaroo <ExternalLink size={12}/></a>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-500 mb-2 block">Incolla Link Video/Audio</label>
                                <div className="flex gap-2 mb-2">
                                    <div className="relative flex-1"><LinkIcon size={16} className="absolute top-3 left-3 text-stone-400"/><input type="text" value={qrLink} onChange={(e) => setQrLink(e.target.value)} placeholder="https://..." className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none"/></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1"><Tag size={16} className="absolute top-3 left-3 text-stone-400"/><input type="text" value={qrLabel} onChange={(e) => setQrLabel(e.target.value)} placeholder="Nome del QR (es. Video Auguri)" className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none"/></div>
                                </div>
                            </div>
                            <button onClick={handleGenerateQR} disabled={!qrLink} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-stone-300 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"><QrCode size={20}/> GENERA QR CODE</button>
                            
                            {savedQRs.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-bold text-stone-600 flex items-center gap-2 mb-3 text-sm"><History size={16}/> I miei QR recenti</h4>
                                    <div className="space-y-2">
                                        {savedQRs.map((qr, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white p-2 border rounded shadow-sm">
                                                <div className="flex flex-col items-start overflow-hidden"><button onClick={() => loadSavedQR(qr.link)} className="text-xs font-bold text-blue-600 hover:underline truncate max-w-[200px] text-left">{qr.label}</button><span className="text-[10px] text-stone-400 truncate w-full">{qr.link}</span></div>
                                                <button onClick={(e) => deleteSavedQR(idx, e)} className="text-stone-400 hover:text-red-500 p-1"><Trash2 size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tools' && (
                        <div className="space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-1 text-sm"><Scissors size={16}/> Rimuovi Sfondo</h4>
                                <p className="text-[10px] text-stone-600 mb-2">Ritaglia persone e oggetti per mascotte.</p>
                                <a href="https://www.remove.bg/it/upload" target="_blank" rel="noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-bold text-xs flex items-center justify-center gap-2">Remo
