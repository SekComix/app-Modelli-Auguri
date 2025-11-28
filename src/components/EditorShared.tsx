import React from 'react';
import { Type, Image as ImageIcon, AlignLeft, Trash2 } from 'lucide-react';
import { EditableText } from './EditableText';
import { ImageSpot } from './ImageSpot';
import { ContentBlock, BlockType, ThemeConfig } from '../types';

export const CrosswordGrid = () => {
    const gridMap = [[1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[1,1,0,1,1,1,1,1],[0,0,0,0,0,1,1,1],[1,1,0,1,1,1,1,1],[1,0,0,0,0,0,0,0],[1,1,0,1,1,1,1,1]];
    const numbers = [{r:1,c:2,n:2},{r:4,c:0,n:1},{r:6,c:1,n:3}];
    return (<div className="w-full max-w-sm mx-auto my-4"><div className="border-2 border-black bg-black p-1"><div className="grid grid-cols-8 gap-px bg-black">{gridMap.flat().map((cell,idx)=>{const r=Math.floor(idx/8);const c=idx%8;const num=numbers.find(n=>n.r===r&&n.c===c);return(<div key={idx} className={`aspect-square relative ${cell===1?'bg-black':'bg-white'}`}>{num&&<span className="absolute top-0.5 left-0.5 text-[8px] font-bold leading-none">{num.n}</span>}</div>)})}</div></div></div>);
};

// --- TOOLBAR FANTASMA (Ripristinata) ---
interface AddBlockProps {
    onAdd: (type: BlockType) => void;
    isSidebar?: boolean;
    isPreview: boolean;
    themeId?: string;
}

export const AddBlockControls: React.FC<AddBlockProps> = ({ onAdd, isSidebar, isPreview }) => {
  if(isPreview) return null;
  
  return (
    <div className="mt-2 mb-2 py-2 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 group border-t-2 border-b-2 border-dashed border-transparent hover:border-stone-300">
       <div className="flex gap-2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full border border-stone-300 shadow-lg transform scale-95 group-hover:scale-100 transition-all">
          <button onClick={()=>onAdd('headline')} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-blue-600 flex items-center gap-1" title="Titolo">
            <Type size={18}/>
          </button>
          <div className="w-px bg-stone-300 my-1"></div>
          <button onClick={()=>onAdd('paragraph')} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-blue-600 flex items-center gap-1" title="Testo">
            <AlignLeft size={18}/>
          </button>
          <div className="w-px bg-stone-300 my-1"></div>
          <button onClick={()=>onAdd('image')} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-blue-600 flex items-center gap-1" title="Foto">
            <ImageIcon size={18}/>
          </button>
       </div>
    </div>
  );
};

interface RenderBlocksProps {
    blocks: ContentBlock[];
    onUpdate: (id: string, value: string, height?: number) => void;
    onRemove: (id: string) => void;
    theme: ThemeConfig;
    isSidebar?: boolean;
    isPreview: boolean;
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks, onUpdate, onRemove, theme, isSidebar, isPreview }) => (
  <div className="w-full">
    {blocks.map((block) => (
      <div key={block.id} className="group relative mb-4 animate-fade-in-up">
        {!isPreview && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(block.id); }} 
            className="absolute -top-3 -right-3 z-50 p-1.5 bg-white text-stone-400 hover:text-red-600 border border-stone-200 hover:border-red-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
