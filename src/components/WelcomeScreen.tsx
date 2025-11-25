import React from 'react';
import { FolderOpen, RefreshCw, LayoutTemplate } from 'lucide-react';

interface WelcomeScreenProps {
  hasSavedData: boolean;
  onContinue: () => void;
  onNew: () => void;
  onLoad: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ hasSavedData, onContinue, onNew, onLoad }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-16 max-w-3xl w-full text-center border-4 border-stone-800">
        <div className="flex flex-col justify-center items-center leading-none select-none mb-8 scale-110">
              <span className="font-oswald font-bold text-6xl lg:text-8xl uppercase text-stone-900 tracking-tighter">THE SEK</span>
              <span className="font-oswald font-medium text-sm lg:text-xl uppercase text-stone-500 tracking-[0.4em] mt-2">CREATOR & DESIGNER</span>
        </div>
        <p className="text-stone-600 font-serif italic text-lg mb-12">Il tuo studio di redazione personale.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={onNew} className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex flex-col items-center justify-center text-left group border-2 border-blue-800">
            <div className="flex items-center gap-4 w-full"><div className="bg-blue-500 p-4 rounded-full group-hover:bg-blue-400 transition-colors shadow-inner"><LayoutTemplate size={32} /></div><div><h2 className="font-bold text-xl font-oswald tracking-wide uppercase">Apri Modello</h2><p className="text-xs opacity-80 font-sans">Inizia un nuovo giornale</p></div></div>
          </button>
          <button onClick={onContinue} disabled={!hasSavedData} className={`p-6 rounded-xl shadow-lg transition-all transform flex flex-col items-center justify-center text-left group border-2 ${hasSavedData ? 'bg-stone-800 text-white hover:bg-stone-900 hover:scale-105 border-black' : 'bg-stone-200 text-stone-400 cursor-not-allowed border-stone-300'}`}>
            <div className="flex items-center gap-4 w-full"><div className={`p-4 rounded-full transition-colors shadow-inner ${hasSavedData ? 'bg-stone-700 group-hover:bg-stone-600' : 'bg-stone-300'}`}><RefreshCw size={32} /></div><div><h2 className="font-bold text-xl font-oswald tracking-wide uppercase">Continua Lavoro</h2><p className="text-xs opacity-80 font-sans">{hasSavedData ? "Recupera l'ultima sessione." : "Nessuna sessione trovata."}</p></div></div>
          </button>
        </div>
        <div className="mt-10 pt-6 border-t border-stone-200">
          <button onClick={onLoad} className="text-stone-500 font-bold text-sm hover:text-blue-600 hover:underline transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"><FolderOpen size={16} /> Hai un file .JSON? Carica Backup</button>
        </div>
      </div>
    </div>
  );
};
