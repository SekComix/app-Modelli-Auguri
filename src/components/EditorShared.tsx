import React from 'react';
import { Type, Image as ImageIcon, AlignLeft, Trash2, PlusCircle } from 'lucide-react';
import { EditableText } from './EditableText';
import { ImageSpot } from './ImageSpot';
import { ContentBlock, BlockType, ThemeConfig } from '../types';

// --- GRIGLIA CRUCIVERBA ---
export const CrosswordGrid = () => {
    const gridMap = [[1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[0,0,0,0,0,1,1,1],[1,1,0,1,1,1,1,1],[1,0,0,0,0,0,0,0],[1,1,0,1,1,1,1,1]];
    const numbers = [{r:1,c:2,n:2},{r:4,c:0,n:1},{r:6,c:1,n:3}];
    return (<div className="w-full max-w-sm mx-auto my-4"><div className="border-2 border-black bg-black p-1"><div className="grid grid-cols-8 gap-px bg-black">{gridMap.flat().map((cell,idx)=>{const r=Math.floor(idx/8);const c=idx%8;const num=numbers.find(n=>n.r===r&&n.c===c);return(<div key={idx} className={`aspect-square relative ${cell===1?'bg-black':'bg-white'}`}>{num&&<span className="absolute top-0.5 left-0.5 text-[8px] font-bold leading-none">{num.n}</span>}</div>)})}</div></div></div>);
};

// --- CONTROLLI PER AGGIUNGERE BLOCCHI (FLUTTUANTI) ---
interface AddBlockProps {
    onAdd: (type: BlockType) => void;
    isSidebar?: boolean;
    isPreview: boolean;
}

export const AddBlockControls: React.FC<AddBlockProps> = ({ onAdd, isSidebar, isPreview }) => {
  if(isPreview) return null;
  return (
    <div className="mt-4 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-300 group">
       <div className="flex gap-2 bg-stone-100 p-1 rounded-full border border-stone-300 shadow-sm group-hover:shadow-md transform scale-90 group-hover:scale-100 transition-all">
          <button onClick={()=>onAdd('headline')} className="p-2 hover:bg-white rounded-full text-stone-600 hover:text-stone-900 flex items-center gap-1" title="Aggiungi Titolo"><Type size={16}/></button>
          <button onClick={()=>onAdd('paragraph')} className="p-2 hover:bg-white rounded-full text-stone-600 hover:text-stone-900 flex items-center gap-1" title="Aggiungi Testo"><AlignLeft size={16}/></button>
          <button onClick={()=>onAdd('image')} className="p-2 hover:bg-white rounded-full text-stone-600 hover:text-stone-900 flex items-center gap-1" title="Aggiungi Foto"><ImageIcon size={16}/></button>
       </div>
    </div>
  );
};

// --- RENDERIZZATORE DI BLOCCHI ---
interface RenderBlocksProps {
    blocks: ContentBlock[];
    onUpdate: (id: string, value: string, height?: number) => void;
    onRemove: (id: string) => void;
    theme: ThemeConfig;
    isSidebar?: boolean;
    isPreview: boolean;
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks, onUpdate, onRemove, theme, isSidebar, isPreview }) => (
  <>
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
  </>
);
