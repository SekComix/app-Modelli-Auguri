import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Copy, FileText, Upload, Calendar, Edit3, Layout } from 'lucide-react';
import { NewspaperData } from '../types';

interface DashboardProps {
  currentData: NewspaperData | null;
  onLoadProject: (data: NewspaperData) => void;
  onNewProject: () => void;
  onImport: (file: File) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentData, onLoadProject, onNewProject, onImport }) => {
  const [projects, setProjects] = useState<NewspaperData[]>([]);

  // Carica progetti salvati all'avvio
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sek_projects_library');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch (e) { console.error("Errore lettura progetti", e); }
  }, []);

  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return;
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem('sek_projects_library', JSON.stringify(updated));
  };

  const handleDuplicate = (project: NewspaperData, e: React.MouseEvent) => {
    e.stopPropagation();
    const newProj = { ...project, publicationName: `${project.publicationName} (Copia)`, date: new Date().toLocaleDateString() };
    onLoadProject(newProj); // Carica come se fosse il corrente, l'utente poi salverà
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onImport(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8 font-sans text-stone-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-oswald font-bold text-5xl uppercase tracking-tighter mb-2">The Sek</h1>
            <p className="text-stone-500 font-serif italic">Archivio Progetti & Modelli</p>
          </div>
          
          <div className="flex gap-3">
            <label className="cursor-pointer bg-white border-2 border-stone-300 hover:border-blue-500 text-stone-600 hover:text-blue-600 px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
              <Upload size={20}/> Importa JSON
              <input type="file" accept=".json" className="hidden" onChange={handleFileChange}/>
            </label>
            <button onClick={onNewProject} className="bg-stone-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
              <PlusCircle size={20}/> Nuovo Progetto
            </button>
          </div>
        </div>

        {/* LISTA PROGETTI */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-stone-200">
            <Layout size={64} className="mx-auto text-stone-300 mb-4"/>
            <h3 className="text-xl font-bold text-stone-400">Nessun progetto salvato</h3>
            <p className="text-stone-400 mt-2">Crea il tuo primo capolavoro!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} onClick={() => onLoadProject(proj)} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500 relative">
                {/* Anteprima (Header colorato in base al tema) */}
                <div className={`h-32 p-6 flex flex-col justify-center items-center text-center ${proj.themeId === 'digital' ? 'bg-slate-900 text-white' : 'bg-[#f0f0f0] text-stone-900'}`}>
                  <h3 className="font-oswald font-bold text-2xl line-clamp-2 leading-tight">{proj.publicationName}</h3>
                  <span className="text-[10px] uppercase tracking-widest mt-2 opacity-70">{proj.themeId} • {proj.eventType}</span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                    <Calendar size={14}/> {proj.date}
                    <span className="mx-1">•</span>
                    <FileText size={14}/> {proj.issueNumber}
                  </div>
                  
                  {/* Azioni */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                    <button onClick={(e) => handleDuplicate(proj, e)} className="p-2 hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-lg transition-colors" title="Duplica come Modello">
                      <Copy size={18}/>
                    </button>
                    <button onClick={(e) => handleDelete(idx, e)} className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition-colors" title="Elimina">
                      <Trash2 size={18}/>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 ml-2">
                      APRI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
