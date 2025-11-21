import React from 'react';
import { FilePlus, FolderOpen, RefreshCw } from 'lucide-react';

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
            className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex flex-col items-center justify-center text-left"
          >
            <div className="flex items-center gap-4 w-full">
              <FilePlus size={40} />
              <div>
                <h2 className="font-bold text-xl">Nuovo Progetto</h2>
                <p className="text-sm opacity-80">Ricomincia da un foglio bianco.</p>
              </div>
            </div>
          </button>

          {/* Continue Session */}
          <button
            onClick={onContinue}
            disabled={!hasSavedData}
            className="bg-stone-800 text-white p-6 rounded-xl shadow-lg hover:bg-stone-900 transition-all transform hover:scale-105 flex flex-col items-center justify-center text-left disabled:bg-stone-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            <div className="flex items-center gap-4 w-full">
              <RefreshCw size={40} className={hasSavedData ? "animate-spin-slow" : ""} />
              <div>
                <h2 className="font-bold text-xl">Continua Sessione</h2>
                <p className="text-sm opacity-80">{hasSavedData ? "Riprendi il tuo ultimo lavoro." : "Nessun lavoro salvato."}</p>
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
            Oppure carica un progetto da un file di backup (.json)
          </button>
        </div>
      </div>
    </div>
  );
};
