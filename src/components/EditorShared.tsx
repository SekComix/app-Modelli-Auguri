import React from 'react';
import { Type, Image as ImageIcon, AlignLeft, Trash2 } from 'lucide-react';
import { EditableText } from './EditableText';
import { ImageSpot } from './ImageSpot';
import { ContentBlock, BlockType, ThemeConfig } from '../types';

// --- GRIGLIA CRUCIVERBA ---
export const CrosswordGrid = () => {
    const gridMap = [[1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[0,0,0,0,0,1,1,1],[1,1,0,1,1,1,1,1],[1,0,0,0,0,0,0,0],[1,1,0,1,1,1,1,1]];
    const numbers = [{r:1,c:2,n:2},{r:4,c:0,n:1},{r:6,c:1,n:3}];
    return (<div className="w-full max-w-sm mx-auto my-4"><div className="border-2 border-black bg-black p-1"><div className="grid grid-cols-8 gap-px bg-black">{gridMap.flat().map((cell,idx)=>{const r=Math.floor(idx/8);const c=idx%8;const num=numbers.find(n=>n.r===r&&n.c===c);return(<div key={idx} className={`aspect-square relative ${cell===1?'bg-black':'bg-white'}`}>{num&&<span className="absolute top-0.5 left-0.5 text-[8px] font-bold leading-none">{num.n}</span>}</div>)})}</div></div></div>);
};

// --- CONTROLLI AGGIUNTA (ADESIVI IN BASSO) ---
interface AddBlockProps {
    onAdd: (type: BlockType) => void;
    isSidebar?: boolean;
    isPreview: boolean;
    themeId?: string;
}

export const AddBlockControls: React.FC<AddBlockProps> = ({ onAdd, isSidebar, isPreview }) => {
  if(isPreview) return null;
  
  // MODIFICA QUI: Absolute positioning per fissarlo in basso al contenitore padre
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300 group w-max">
       <div className="flex gap-3 bg-stone-900/90 backdrop-blur-sm p-2 rounded-full border border-stone-700 shadow-2xl transform scale-90 group-hover:scale-100 transition-all">
          <button onClick={()=>onAdd('headline')} className="flex flex-col items-center justify-center w-10 h-10 hover:bg-stone-700 rounded-full text-white transition-colors" title="Titolo">
            <Type size={18}/>
          </button>
          <div className="w-px bg-stone-700 h-10"></div>
          <button onClick={()=>onAdd('paragraph')} className="flex flex-col items-center justify-center w-10 h-10 hover:bg-stone-700 rounded-full text-white transition-colors" title="Testo">
            <AlignLeft size={18}/>
          </button>
          <div className="w-px bg-stone-700 h-10"></div>
          <button onClick={()=>onAdd('image')} className="flex flex-col items-center justify-center w-10 h-10 hover:bg-stone-700 rounded-full text-white transition-colors" title="Foto">
            <ImageIcon size={18}/>
          </button>
       </div>
       {/* Etichetta visibile solo in hover */}
       <div className="text-center mt-1">
           <span className="bg-black/70 text-white text-[9px] px-2 py-1 rounded uppercase font-bold tracking-widest">Aggiungi Elemento</span>
       </div>
    </div>
  );
};

// --- RENDER BLOCCHI ---
interface RenderBlocksProps {
    blocks: ContentBlock[];
    onUpdate: (id: string, value: string, height?: number) => void;
    onRemove: (id: string) => void;
    theme: ThemeConfig;
    isSidebar?: boolean;
    isPreview: boolean;
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks, onUpdate, onRemove, theme, isSidebar, isPreview }) => (
  <div className="pb-16"> {/* Padding bottom per non coprire l'ultimo elemento con la toolbar */}
    {blocks.map((block) => (
      <div key={block.id} className="group relative mb-4 animate-fade-in-up">
        {!isPreview && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(block.id); }} 
            className="absolute -top-2 -right-2 p-1.5 bg-white border border-stone-200 text-stone-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer"
            title="Elimina blocco"
          >
            <Trash2 size={14}/>
          </button>
        )}
        
        {block.type === 'headline' && (
            <EditableText value={block.content} onChange={(v)=>onUpdate(block.id, v)} className={`${theme.headlineFont} ${isSidebar?'text-xl':'text-3xl'} font-bold leading-tight my-2`} aiEnabled={!isPreview} aiContext="Titolo" mode="headline"/>
        )}
        
        {block.type === 'paragraph' && (
            <div className={`${isSidebar?'columns-1':'columns-2 gap-6'} ${theme.bodyFont} text-sm text-justify leading-relaxed`}>
                <EditableText value={block.content} onChange={(v)=>onUpdate(block.id, v)} multiline={true} aiEnabled={!isPreview} aiContext="Testo" mode="body"/>
            </div>
        )}
        
        {block.type === 'image' && (
            <ImageSpot 
                src={block.content} 
                onChange={(v)=>onUpdate(block.id, v)} 
                className={`w-full my-4 ${theme.borderClass} border shadow-sm`} 
                autoHeight={true} 
                filters={theme.imageFilter} 
                enableResizing={!isPreview} 
                customHeight={block.height} 
                onHeightChange={(h) => onUpdate(block.id, block.content, h)} 
            />
        )}
      </div>
    ))}
  </div>
);
