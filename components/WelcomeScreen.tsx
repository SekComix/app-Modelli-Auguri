import React from 'react';
import { FilePlus, FolderOpen, RefreshCw, LayoutTemplate } from 'lucide-react';

interface WelcomeScreenProps {
  hasSavedData: boolean;
  onContinue: () => void;
  onNew: () => void;
  onLoad: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ hasSavedData, onContinue, onNew, onLoad }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 max-w-2xl w-full text-center border-4 border-stone-800">
        <h1 className="font-chomsky text-6xl lg:text-8xl text-stone-900 mb-2">The Daily Creator</h1>
        <p className="text-stone-600 font-serif italic text-lg mb-8">Il tuo studio di redazione personale.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Project */}
          <button
            onClick={onNew}
            className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex flex-col items-center justify-center text-left group"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="bg-blue-500 p-3 rounded-full group-hover:bg-blue-400 transition-colors">
                 <LayoutTemplate size={32} />
              </div>
              <div>
                <h2 className="font-bold text-xl">Apri Modello</h2>
                <p className="text-sm opacity-80">Carica il template standard (es. Antonio) e inizia.</p>
              </div>
            </div>
          </button>

          {/* Continue Session */}
          <button
            onClick={onContinue}
            disabled={!hasSavedData}
            className={`p-6 rounded-xl shadow-lg transition-all transform flex flex-col items-center justify-center text-left group ${hasSavedData ? 'bg-stone-800 text-white hover:bg-stone-900 hover:scale-105' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`p-3 rounded-full transition-colors ${hasSavedData ? 'bg-stone-700 group-hover:bg-stone-600' : 'bg-stone-300'}`}>
                <RefreshCw size={32} className={hasSavedData ? "" : ""} />
              </div>
              <div>
                <h2 className="font-bold text-xl">Continua Lavoro</h2>
                <p className="text-sm opacity-80">{hasSavedData ? "Recupera l'ultima sessione salvata." : "Nessuna sessione trovata."}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Load from Backup */}
        <div className="mt-8">
          <button 
            onClick={onLoad}
            className="text-stone-500 font-bold text-sm hover:text-stone-800 hover:underline transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FolderOpen size={16} />
            Hai un file .JSON? Carica Backup
          </button>
        </div>
      </div>
    </div>
  );
};
