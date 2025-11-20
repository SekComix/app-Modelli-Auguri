
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Type, Image as ImageIcon, Move, RotateCw, Maximize, Settings, X, Check, ArrowLeftRight, Minus, Plus, Megaphone, Edit3 } from 'lucide-react';
import { generateNewspaperImage } from '../services/gemini';

interface StrilloneWidgetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const StrilloneWidget: React.FC<StrilloneWidgetProps> = ({ isVisible, onClose }) => {
  // Mascot State
  const [mascotImage, setMascotImage] = useState<string | null>(null); 
  const [scale, setScale] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Content State
  const [contentType, setContentType] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('EDIZIONE\nSTRAORDINARIA!');
  const [textColor, setTextColor] = useState('#000000');
  const [imageContent, setImageContent] = useState<string>('');
  const [fontSize, setFontSize] = useState(24);
  
  // Layout Calibration State
  const [boxX, setBoxX] = useState(30); // %
  const [boxY, setBoxY] = useState(40); // %
  const [boxW, setBoxW] = useState(40); // %
  const [boxH, setBoxH] = useState(25); // %
  const [boxRotate, setBoxRotate] = useState(-10); // deg

  // Dialogs
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);

  if (!isVisible) return null;

  const handleMascotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMascotImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setImageContent(reader.result as string);
          setContentType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiImageGen = async () => {
      const res = await generateNewspaperImage(textContent || "Immagine vintage");
      setImageContent(res);
      setContentType('image');
  };

  return createPortal(
    <>
      {/* MAIN WIDGET CONTAINER */}
      <div 
        className="fixed bottom-0 right-10 z-[500] group transition-transform duration-300 ease-out font-sans"
        style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'bottom center' 
        }}
      >
        <div className="relative">
            {/* CLOSE BUTTON (ALWAYS VISIBLE AND HUGE) */}
            <button 
                onClick={onClose} 
                className="absolute -top-12 -right-12 bg-red-600 text-white p-3 rounded-full shadow-xl hover:bg-red-700 z-[600] border-2 border-white"
                title="CHIUDI STRILLONE"
            >
                <X size={24} strokeWidth={3} />
            </button>

            {/* STATE 1: NO IMAGE LOADED */}
            {!mascotImage && (
                <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-dashed border-stone-400 w-72 text-center relative animate-fade-in-up">
                    <div className="mb-4 flex justify-center"><Megaphone size={48} className="text-stone-300"/></div>
                    <h3 className="font-bold text-stone-700 mb-2 text-lg">AGGIUNGI STRILLONE</h3>
                    <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                        Carica qui la tua immagine (PNG trasparente) del ragazzo con il giornale.
                    </p>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm cursor-pointer inline-flex items-center gap-2 shadow-md transition-transform hover:scale-105">
                        <Upload size={18}/> CARICA IMMAGINE
                        <input type="file" accept="image/png" className="hidden" onChange={handleMascotUpload}/>
                    </label>
                </div>
            )}

            {/* STATE 2: IMAGE LOADED */}
            {mascotImage && (
                <>
                <img 
                    src={mascotImage} 
                    alt="Strillone" 
                    className={`max-h-[600px] drop-shadow-2xl transition-transform duration-300 pointer-events-none ${isFlipped ? '-scale-x-100' : ''}`}
                />

                {/* THE EDITABLE CONTENT BOX */}
                <div 
                    className="absolute cursor-pointer ring-2 ring-transparent hover:ring-blue-400 hover:ring-dashed rounded overflow-hidden flex items-center justify-center text-center group/box"
                    style={{
                        left: `${boxX}%`,
                        top: `${boxY}%`,
                        width: `${boxW}%`,
                        height: `${boxH}%`,
                        transform: `rotate(${boxRotate}deg)`,
                        zIndex: 10
                    }}
                    onClick={() => setShowEditDialog(true)}
                    title="Clicca per modificare il contenuto"
                >
                    {contentType === 'text' ? (
                        <div 
                            className="w-full h-full flex items-center justify-center font-chomsky leading-none break-words p-1 select-none"
                            style={{ color: textColor, fontSize: `${fontSize}px` }}
                        >
                            {textContent}
                        </div>
                    ) : (
                        <img src={imageContent} className="w-full h-full object-cover" alt="Content" />
                    )}
                    <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover/box:opacity-100 pointer-events-none flex items-center justify-center">
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">MODIFICA</span>
                    </div>
                </div>

                {/* CONTROLS TOOLBAR */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white shadow-2xl border border-stone-300 p-2 rounded-xl pointer-events-auto scale-[0.85] origin-top z-50 whitespace-nowrap">
                    
                    <div className="flex items-center gap-1 bg-stone-100 rounded px-1">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-white rounded text-stone-600"><Minus size={18}/></button>
                        <span className="text-xs font-bold w-8 text-center text-stone-600">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:bg-white rounded text-stone-600"><Plus size={18}/></button>
                    </div>

                    <div className="w-px h-8 bg-stone-300 mx-1"></div>

                    <button onClick={() => setShowEditDialog(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-bold text-xs uppercase shadow-sm">
                        <Edit3 size={16}/> Modifica Foglio
                    </button>

                    <div className="w-px h-8 bg-stone-300 mx-1"></div>

                    <button onClick={() => setShowCalibration(true)} className="p-2 hover:bg-stone-100 rounded text-blue-600" title="Calibra Posizione">
                        <Settings size={20}/>
                    </button>
                    
                    <button onClick={() => setIsFlipped(!isFlipped)} className="p-2 hover:bg-stone-100 rounded text-stone-600" title="Rifletti Orizzontalmente">
                        <ArrowLeftRight size={20}/>
                    </button>

                    <label className="p-2 hover:bg-stone-100 rounded cursor-pointer text-stone-600" title="Cambia Immagine Strillone">
                        <Upload size={20}/>
                        <input type="file" accept="image/png" className="hidden" onChange={handleMascotUpload}/>
                    </label>
                </div>
                </>
            )}
        </div>
      </div>

      {/* EDIT CONTENT DIALOG */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={() => setShowEditDialog(false)}>
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border-2 border-blue-600 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Edit3 size={20} className="text-purple-600"/> Contenuto Foglio</h3>
                    <button onClick={() => setShowEditDialog(false)} className="text-stone-400 hover:text-red-500"><X size={20}/></button>
                </div>
                
                <div className="flex gap-2 mb-4">
                    <button onClick={() => setContentType('text')} className={`flex-1 py-2 text-sm font-bold rounded border ${contentType === 'text' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'hover:bg-stone-50 border-stone-200'}`}>TESTO</button>
                    <button onClick={() => setContentType('image')} className={`flex-1 py-2 text-sm font-bold rounded border ${contentType === 'image' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'hover:bg-stone-50 border-stone-200'}`}>IMMAGINE</button>
                </div>

                {contentType === 'text' ? (
                    <div className="space-y-4">
                        <textarea 
                            value={textContent} 
                            onChange={e => setTextContent(e.target.value)}
                            className="w-full border p-3 rounded bg-stone-50 text-center font-chomsky text-2xl h-28 focus:ring-2 focus:ring-purple-400 outline-none"
                            placeholder="Scrivi qui..."
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-stone-500 mb-1 block">Dimensione</label>
                                <input type="range" min="10" max="80" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-stone-500 mb-1 block">Colore</label>
                                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-8 w-full cursor-pointer rounded border"/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {imageContent ? (
                            <img src={imageContent} className="w-full h-32 object-contain bg-stone-100 rounded border" alt="Preview"/>
                        ) : (
                            <div className="w-full h-32 bg-stone-50 border border-dashed rounded flex items-center justify-center text-stone-400 text-xs">Nessuna immagine</div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex flex-col items-center justify-center p-3 border border-dashed rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                                <Upload size={20} className="mb-1 text-blue-500"/>
                                <span className="text-[10px] font-bold uppercase">Carica File</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageContentUpload}/>
                            </label>
                            <button onClick={handleAiImageGen} className="flex flex-col items-center justify-center p-3 border border-dashed rounded hover:bg-purple-50 hover:border-purple-300 transition-colors">
                                <ImageIcon size={20} className="mb-1 text-purple-500"/>
                                <span className="text-[10px] font-bold uppercase">Genera AI</span>
                            </button>
                        </div>
                    </div>
                )}

                <button onClick={() => setShowEditDialog(false)} className="w-full mt-6 bg-stone-900 text-white py-3 rounded-lg font-bold uppercase hover:bg-black shadow-lg">Conferma</button>
            </div>
        </div>
      )}

      {/* CALIBRATION DIALOG */}
      {showCalibration && (
          <div className="fixed top-20 right-20 bg-white shadow-2xl border border-blue-500 p-4 rounded-xl z-[1000] w-64 animate-fade-in-up">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h4 className="font-bold text-xs uppercase text-blue-600 flex items-center gap-2"><Settings size={14}/> Calibra Box Foglio</h4>
                  <button onClick={() => setShowCalibration(false)} className="hover:bg-stone-100 rounded p-1"><X size={14}/></button>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-2">
                      <Move size={16} className="text-stone-400"/>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase text-stone-500">Posizione (X / Y)</span>
                        <div className="flex gap-1">
                            <input type="range" min="0" max="100" value={boxX} onChange={e => setBoxX(Number(e.target.value))} className="w-full" title="Orizzontale"/>
                            <input type="range" min="0" max="100" value={boxY} onChange={e => setBoxY(Number(e.target.value))} className="w-full" title="Verticale"/>
                        </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Maximize size={16} className="text-stone-400"/>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase text-stone-500">Dimensione (L / A)</span>
                        <div className="flex gap-1">
                            <input type="range" min="5" max="100" value={boxW} onChange={e => setBoxW(Number(e.target.value))} className="w-full" title="Larghezza"/>
                            <input type="range" min="5" max="100" value={boxH} onChange={e => setBoxH(Number(e.target.value))} className="w-full" title="Altezza"/>
                        </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <RotateCw size={16} className="text-stone-400"/>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase text-stone-500">Rotazione</span>
                        <input type="range" min="-180" max="180" value={boxRotate} onChange={e => setBoxRotate(Number(e.target.value))} className="flex-1" title="Rotazione"/>
                      </div>
                  </div>
              </div>
              <p className="text-[10px] text-stone-500 mt-3 italic text-center bg-stone-50 p-2 rounded border">
                 Usa questi controlli per far combaciare il testo con il foglio nell'immagine.
              </p>
          </div>
      )}
    </>,
    document.body
  );
};
