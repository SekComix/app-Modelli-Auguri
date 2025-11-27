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

// --- CONTROLLI PER AGGIUNGERE BLOCCHI ---
interface AddBlockProps {
    onAdd: (type: BlockType) => void;
    isSidebar?: boolean;
    isPreview: boolean;
    themeId?: string; // Opzionale, per futuri usi
}

export const AddBlockControls: React.FC<AddBlockProps> = ({ onAdd, isSidebar, isPreview }) => {
  if(isPreview) return null;
  return (
    <div className={`border-2 border-dashed border-stone-400 bg-white/40 hover:bg-white/80 p-2 flex ${isSidebar?'flex-col items-stretch':'justify-center'} gap-2 opacity-70 hover:opacity-100 transition-all print:hidden rounded-lg mt-4 shadow-sm`}>
      <button onClick={()=>onAdd('headline')} className="flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors text-stone-800 hover:bg-stone-200/50"><Type size={16}/>{isSidebar?'Titolo':'Agg. Titolo'}</button>
      <button onClick={()=>onAdd('paragraph')} className="flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors text-stone-800 hover:bg-stone-200/50"><AlignLeft size={16}/>{isSidebar?'Testo':'Agg. Testo'}</button>
      <button onClick={()=>onAdd('image')} className="flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors text-stone-800 hover:bg-stone-200/50"><ImageIcon size={16}/>{isSidebar?'Foto':'Agg. Foto'}</button>
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
            className="absolute -top-3 -right-3 p-2 bg-white border-2 border-red-100 text-red-500 hover:text-white hover:bg-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer"
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
