import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Trash2, Move, Edit3, Library, MessageCircle, Gift, Smile, Type, RotateCw, Copy, Search, GripHorizontal, QrCode, Mic, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { WidgetData, WidgetType } from '../types';

// --- PRESET ASSETS ---
const ASSETS = {
    mascots: [
        // FIX: Relative path for GitHub Pages compatibility
        { id: 'custom_antonio', label: 'IL TUO STRILLONE', src: './strillone_antonio.png' }, 
        { id: 'strillone', label: 'Strillone', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995655.png' },
        { id: 'gentleman', label: 'Gentleman', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png' },
        { id: 'santa', label: 'Babbo Natale', src: 'https://cdn-icons-png.flaticon.com/512/744/744546.png' },
        { id: 'befana', label: 'Befana', src: 'https://cdn-icons-png.flaticon.com/512/2316/2316794.png' },
        { id: 'graduate', label: 'Laureato', src: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png' },
        { id: 'bride', label: 'Sposa', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405546.png' },
        { id: 'groom', label: 'Sposo', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405451.png' }
    ],
    stickers: [
        { id: 'cake', label: 'Torta', content: '🎂' },
        { id: 'champagne', label: 'Spumante', content: '🍾' },
        { id: 'wreath', label: 'Alloro', content: '🌿' },
        { id: 'rose', label: 'Rosa', content: '🌹' },
        { id: 'party', label: 'Festa', content: '🎉' },
        { id: 'ring', label: 'Anello', content: '💍' },
        { id: 'topsecret', label: 'Top Secret', src: 'https://cdn-icons-png.flaticon.com/512/9373/9373844.png' },
        { id: 'approved', label: 'Approvato', src: 'https://cdn-icons-png.flaticon.com/512/5229/5229357.png' }
    ],
    bubbles: [
        { id: 'speech1', label: 'Fumetto 1', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 Q10,10 100,10 T190,75 Q190,140 100,140 L60,140 L30,150 L40,130 Q10,130 10,75" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'thought', label: 'Pensiero', svg: `<svg viewBox="0 0 200 150"><path d="M20,75 Q20,10 100,10 T180,75 Q180,130 100,130 L60,130 L40,150 L50,120 Q20,120 20,75" fill="white" stroke="black" stroke-width="3" stroke-dasharray="5,5"/></svg>` },
        { id: 'shout', label: 'Urlo', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 L30,40 L10,10 L60,30 L100,5 L140,30 L190,10 L170,40 L190,75 L170,110 L190,140 L140,120 L100,145 L60,120 L10,140 L30,110 Z" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'sign', label: 'Cartello', svg: `<svg viewBox="0 0 200 150"><rect x="10" y="10" width="180" height="100" fill="#f0f0f0" stroke="#5c4835" stroke-width="4"/><rect x="90" y="110" width="20" height="40" fill="#5c4835"/></svg>` }
    ]
};

// --- LIBRARY COMPONENT (The Drawer) ---
interface WidgetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddWidget: (type: WidgetType, content: string, subType?: string) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ isOpen, onClose, onAddWidget }) => {
    const [activeTab, setActiveTab] = useState<'mascots' | 'bubbles' | 'stickers' | 'qr'>('mascots');
    const [qrLink, setQrLink] = useState('');

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onAddWidget('mascot', reader.result as string, 'custom');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateQR = () => {
        if (!qrLink) return;
        onAddWidget('qrcode', qrLink);
        setQrLink('');
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col border-l-4 border-blue-500 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="p-6 bg-stone-50 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                            <Library className="text-blue-600"/> Libreria Widget
                        </h2>
                        <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-1">Task 1 & 2: Mascotte, Oggetti & QR</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full text-stone-500 hover:text-red-500 transition-colors">
                        <X size={24}/>
                    </button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-stone-200 overflow-x-auto">
                    <button onClick={() => setActiveTab('mascots')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'mascots' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}>
                        <Smile size={18}/> Personaggi
                    </button>
                    <button onClick={() => setActiveTab('bubbles')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'bubbles' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}>
                        <MessageCircle size={18}/> Fumetti
                    </button>
                    <button onClick={() => setActiveTab('stickers')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'stickers' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-stone-400 hover:bg-stone-50'}`}>
                        <Gift size={18}/> Oggetti
                    </button>
                    <button onClick={() => setActiveTab('qr')} className={`flex-1 py-4 px-2 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'qr' ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50' : 'text-stone-400 hover:bg-stone-50'}`}>
                        <QrCode size={18}/> QR & Audio
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-100/50">
                    {activeTab === 'mascots' && (
                        <>
                            <label className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors mb-6 group">
                                <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload className="text-blue-500" size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">CARICA FOTO TUA</h4>
                                    <p className="text-[10px] text-blue-600">PNG Trasparente consigliato</p>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleUpload}/>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {ASSETS.mascots.map(m => (
                                    <button key={m.id} onClick={() => onAddWidget('mascot', m.src)} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2">
                                        <img src={m.src} alt={m.label} className="h-24 object-contain" onError={(e) => {e.currentTarget.src='https://cdn-icons-png.flaticon.com/512/1170/1170688.png'; e.currentTarget.title='File non trovato in /public'}} />
                                        <span className="text-xs font-bold text-stone-600 uppercase">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'bubbles' && (
                        <div className="grid grid-cols-2 gap-4">
                             {ASSETS.bubbles.map(b => (
                                <button key={b.id} onClick={() => onAddWidget('bubble', b.svg)} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2">
                                    <div className="h-20 w-full" dangerouslySetInnerHTML={{__html: b.svg}} />
                                    <span className="text-xs font-bold text-stone-600 uppercase">{b.label}</span>
                                </button>
                            ))}
                            <button onClick={() => onAddWidget('text', '')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2">
                                <div className="h-20 flex items-center justify-center"><Type size={32} className="text-stone-400"/></div>
                                <span className="text-xs font-bold text-stone-600 uppercase">Solo Testo</span>
                            </button>
                        </div>
                    )}

                     {activeTab === 'stickers' && (
                        <div className="grid grid-cols-3 gap-4">
                            {ASSETS.stickers.map(s => (
                                <button key={s.id} onClick={() => onAddWidget('sticker', s.src || s.content)} className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-2 aspect-square justify-center">
                                    {s.src ? <img src={s.src} className="h-10 w-10 object-contain"/> : <span className="text-4xl">{s.content}</span>}
                                    <span className="text-xs font-bold text-stone-600 uppercase truncate w-full text-center">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'qr' && (
                        <div className="space-y-6">
                            {/* 1. AUDIO RECORDING INSTRUCTIONS */}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                                    <Mic size={18}/> Vuoi un Audio Augurio?
                                </h4>
                                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                                    1. Clicca qui sotto per andare su Vocaroo.<br/>
                                    2. Registra la tua voce e clicca "Salva e Condividi".<br/>
                                    3. Copia il link che ti danno e incollalo qui sotto.
                                </p>
                                <a 
                                    href="https://vocaroo.com/" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-orange-200 hover:bg-orange-300 text-orange-900 py-2 rounded-lg font-bold text-xs transition-colors"
                                >
                                    Vai su Vocaroo <ExternalLink size={12}/>
                                </a>
                            </div>

                            {/* 2. LINK INPUT */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-500 mb-2 block">Incolla Link (Youtube, Drive, Vocaroo)</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon size={16} className="absolute top-3 left-3 text-stone-400"/>
                                        <input 
                                            type="text" 
                                            value={qrLink} 
                                            onChange={(e) => setQrLink(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. GENERATE BUTTON */}
                            <button 
                                onClick={handleGenerateQR}
                                disabled={!qrLink}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-stone-300 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                            >
                                <QrCode size={20}/> GENERA QR CODE
                            </button>

                            <p className="text-[10px] text-stone-400 text-center mt-4">
                                Il QR Code verrà aggiunto al giornale come un'immagine che puoi spostare e ridimensionare.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- INDIVIDUAL DRAGGABLE ITEM ---
interface DraggableWidgetProps {
    widget: WidgetData;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (changes: Partial<WidgetData['style']> & { text?: string }) => void;
    onRemove: () => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ widget, isSelected, onSelect, onUpdate, onRemove }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
    
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState({ w: 0, h: 0 });

    const [isEditingText, setIsEditingText] = useState(false);

    // DRAG LOGIC
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            if (isDragging) {
                const dx = clientX - dragStart.x;
                const dy = clientY - dragStart.y;
                onUpdate({ x: initialPos.x + dx, y: initialPos.y + dy });
            } else if (isResizing) {
                 const dx = clientX - resizeStart.x;
                 const dy = clientY - resizeStart.y;
                 onUpdate({ width: Math.max(30, initialSize.w + dx), height: Math.max(30, initialSize.h + dy) });
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, isResizing, dragStart, resizeStart, initialPos, initialSize, onUpdate]);

    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (isEditingText) return;
        // e.stopPropagation(); // Removed to allow touch scrolling if not targeting widget
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        onSelect();
        setIsDragging(true);
        setDragStart({ x: clientX, y: clientY });
        setInitialPos({ x: widget.style.x, y: widget.style.y });
    };

    const startResize = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setIsResizing(true);
        setResizeStart({ x: clientX, y: clientY });
        setInitialSize({ w: widget.style.width, h: widget.style.height });
    };

    const handleRotate = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newRot = (widget.style.rotation + 45) % 360;
        onUpdate({ rotation: newRot });
    };

    return (
        <div
            ref={nodeRef}
            className={`absolute group cursor-move select-none ${isSelected ? 'z-[50]' : 'z-[10]'}`}
            style={{
                left: widget.style.x,
                top: widget.style.y,
                width: widget.style.width,
                height: widget.style.height,
                transform: `rotate(${widget.style.rotation}deg) scaleX(${widget.style.flipX ? -1 : 1})`,
                zIndex: isSelected ? 999 : widget.style.zIndex,
                touchAction: 'none' // Prevent scrolling while dragging
            }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            onDoubleClick={() => (widget.type === 'bubble' || widget.type === 'text') && setIsEditingText(true)}
        >
            {/* CONTENT RENDERER */}
            <div className="w-full h-full relative pointer-events-none">
                {widget.type === 'qrcode' ? (
                     <div className="w-full h-full bg-white p-2 border-2 border-black relative shadow-lg">
                         <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(widget.content)}`} 
                            alt="QR Code" 
                            className="w-full h-full object-contain" 
                            draggable={false}
                         />
                         <div className="absolute -bottom-6 left-0 right-0 text-center bg-black text-white text-[10px] py-0.5 font-bold uppercase tracking-widest">SCAN ME</div>
                     </div>
                ) : widget.type === 'bubble' ? (
                     <div className="w-full h-full relative">
                         <div className="w-full h-full" dangerouslySetInnerHTML={{__html: widget.content}} />
                         <div className="absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-auto">
                             {isEditingText ? (
                                 <textarea 
                                    autoFocus
                                    className="w-full h-full bg-transparent outline-none resize-none text-center overflow-hidden"
                                    style={{ fontSize: `${widget.style.fontSize}px`, fontFamily: widget.style.fontFamily, color: widget.style.color }}
                                    value={widget.text}
                                    onChange={(e) => onUpdate({ text: e.target.value })}
                                    onBlur={() => setIsEditingText(false)}
                                    onMouseDown={e => e.stopPropagation()}
                                    onTouchStart={e => e.stopPropagation()}
                                 />
                             ) : (
                                 <span style={{ fontSize: `${widget.style.fontSize}px`, fontFamily: widget.style.fontFamily, color: widget.style.color, whiteSpace: 'pre-wrap' }}>{widget.text || "Doppio clic..."}</span>
                             )}
                         </div>
                     </div>
                ) : widget.type === 'text' ? (
                    <div className="w-full h-full flex items-center justify-center pointer-events-auto">
                        {isEditingText ? (
                             <input 
                                autoFocus
                                className="w-full bg-transparent outline-none text-center border-2 border-blue-300 border-dashed"
                                style={{ fontSize: `${widget.style.fontSize}px`, fontFamily: widget.style.fontFamily, color: widget.style.color, fontWeight: 'bold' }}
                                value={widget.text}
                                onChange={(e) => onUpdate({ text: e.target.value })}
                                onBlur={() => setIsEditingText(false)}
                                onMouseDown={e => e.stopPropagation()}
                                onTouchStart={e => e.stopPropagation()}
                             />
                        ) : (
                             <span className="font-bold drop-shadow-md" style={{ fontSize: `${widget.style.fontSize}px`, fontFamily: widget.style.fontFamily, color: widget.style.color }}>{widget.text || "Testo"}</span>
                        )}
                    </div>
                ) : (
                    // IMAGES / STICKERS
                    (widget.content.startsWith('<svg') || widget.content.startsWith('data:image/svg')) ? 
                        <div dangerouslySetInnerHTML={{__html: widget.content}} className="w-full h-full drop-shadow-xl"/> :
                        (widget.content.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u) ? 
                            <div className="w-full h-full flex items-center justify-center" style={{fontSize: `${Math.min(widget.style.width, widget.style.height)}px`}}>{widget.content}</div> :
                            <img src={widget.content} alt="widget" className="w-full h-full object-contain drop-shadow-xl pointer-events-none" draggable={false} />
                        )
                )}
            </div>

            {/* SELECTION UI (HANDLES) */}
            {isSelected && (
                <div className="absolute -inset-2 border-2 border-blue-500 rounded-lg pointer-events-none">
                    {/* Resize Handle */}
                    <div 
                        className="absolute -bottom-3 -right-3 w-8 h-8 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize pointer-events-auto flex items-center justify-center shadow-md z-50"
                        onMouseDown={startResize}
                        onTouchStart={startResize}
                    >
                        <div className="w-3 h-3 bg-blue-500 rounded-full"/>
                    </div>
                    
                    {/* Rotate Handle */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full cursor-pointer pointer-events-auto flex items-center justify-center shadow-md" onClick={handleRotate}>
                        <RotateCw size={14} className="text-blue-600"/>
                    </div>

                    {/* Toolbar */}
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-2 bg-white shadow-xl border border-stone-200 p-2 rounded-lg pointer-events-auto scale-90 z-50">
                        <button onClick={(e) => { e.stopPropagation(); onUpdate({ flipX: !widget.style.flipX }); }} className="p-2 hover:bg-stone-100 rounded bg-stone-50" title="Rifletti Orizzontale"><Move size={16}/></button>
                        <button onClick={(e) => { e.stopPropagation(); onUpdate({ zIndex: widget.style.zIndex + 1 }); }} className="p-2 hover:bg-stone-100 rounded bg-stone-50" title="Porta Su"><Copy size={16}/></button>
                        <div className="w-px bg-stone-300 h-6 my-auto"/>
                        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2 hover:bg-red-100 text-red-500 rounded bg-red-50" title="Elimina"><Trash2 size={16}/></button>
                        {(widget.type === 'bubble' || widget.type === 'text') && (
                            <>
                            <div className="w-px bg-stone-300 h-6 my-auto"/>
                             <input type="color" value={widget.style.color} onChange={(e) => onUpdate({color: e.target.value})} className="w-8 h-8 p-0 border-0 rounded cursor-pointer"/>
                             <button onClick={(e) => { e.stopPropagation(); onUpdate({ fontSize: (widget.style.fontSize || 20) + 2 }); }} className="p-2 font-bold text-xs hover:bg-stone-100 border rounded">A+</button>
                             <button onClick={(e) => { e.stopPropagation(); onUpdate({ fontSize: (widget.style.fontSize || 20) - 2 }); }} className="p-2 font-bold text-xs hover:bg-stone-100 border rounded">A-</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN LAYER COMPONENT ---
interface WidgetLayerProps {
    widgets: WidgetData[];
    setWidgets: React.Dispatch<React.SetStateAction<WidgetData[]>>;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
}

export const WidgetLayer: React.FC<WidgetLayerProps> = ({ widgets, setWidgets, selectedId, setSelectedId }) => {
    
    const handleUpdate = (id: string, changes: Partial<WidgetData['style']> & { text?: string }) => {
        setWidgets(prev => prev.map(w => {
            if (w.id !== id) return w;
            const { text, ...styleChanges } = changes;
            return {
                ...w,
                text: text !== undefined ? text : w.text,
                style: { ...w.style, ...styleChanges }
            };
        }));
    };

    const handleRemove = (id: string) => {
        setWidgets(prev => prev.filter(w => w.id !== id));
        setSelectedId(null);
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[50]">
             {/* Click on empty space to deselect */}
            <div className="absolute inset-0 pointer-events-auto" onMouseDown={(e) => { if(e.target === e.currentTarget) setSelectedId(null); }} onTouchStart={(e) => { if(e.target === e.currentTarget) setSelectedId(null); }} style={{ display: selectedId ? 'block' : 'none' }}/>
            
            {widgets.map(w => (
                <div key={w.id} className="pointer-events-auto">
                    <DraggableWidget 
                        widget={w}
                        isSelected={selectedId === w.id}
                        onSelect={() => setSelectedId(w.id)}
                        onUpdate={(changes) => handleUpdate(w.id, changes)}
                        onRemove={() => handleRemove(w.id)}
                    />
                </div>
            ))}
        </div>
    );
};
