import React from 'react';
import { EditableText } from './EditableText';
import { ImageSpot } from './ImageSpot';
import { NewspaperData, ThemeConfig, BlockType } from '../types';
import { AddBlockControls, RenderBlocks } from './EditorShared';

interface RenderPosterProps {
  data: NewspaperData;
  theme: ThemeConfig;
  updateMeta: (field: keyof NewspaperData, value: string) => void;
  updateArticle: (id: string, field: string, value: any) => void;
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, value: string, height?: number) => void;
  removeBlock: (id: string) => void;
  isPreview: boolean;
}

export const RenderPoster: React.FC<RenderPosterProps> = ({ 
  data, theme, updateMeta, updateArticle, addBlock, updateBlock, removeBlock, isPreview 
}) => {
  
  // Stili specifici per il Poster
  const containerStyle = {
    minHeight: '1600px', // Molto alto per simulare A3
    padding: '40px',
    backgroundColor: data.customBgColor || (theme.id === 'digital' ? '#0f172a' : '#ffffff'),
    color: theme.id === 'digital' ? 'white' : 'black',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const
  };

  return (
    <div className={`print-container shadow-2xl relative ${theme.bgClass} ${theme.textClass}`} style={containerStyle}>
      
      {/* 1. HEADER: Titolo Gigante */}
      <header className="w-full mb-8 border-b-4 border-current pb-4">
        <div className="text-xs font-bold tracking-[0.5em] uppercase opacity-60 mb-2">
            {data.eventType} • {data.date}
        </div>
        <EditableText 
            value={data.publicationName} 
            onChange={(v) => updateMeta('publicationName', v)} 
            className={`${theme.titleFont} text-8xl lg:text-9xl leading-none font-black uppercase`} 
            aiEnabled={!isPreview} 
            mode="headline"
        />
         <div className="flex justify-center gap-8 mt-4 text-sm font-bold uppercase tracking-widest opacity-80">
            <EditableText value={data.issueNumber} onChange={(v)=>updateMeta('issueNumber',v)} aiEnabled={!isPreview}/>
         </div>
      </header>

      {/* 2. FOTO EROE (Enorme) */}
      <div className="w-full mb-8 relative group">
          <ImageSpot 
            src={data.articles['lead'].imageUrl} 
            onChange={(v) => updateArticle('lead', 'imageUrl', v)} 
            className="w-full shadow-xl border-4 border-current" 
            customHeight={data.articles['lead'].customHeight || 800} // Default altissimo per poster
            onHeightChange={(h) => updateArticle('lead', 'customHeight', h)}
            enableResizing={!isPreview}
            filters={theme.imageFilter}
          />
      </div>

      {/* 3. TESTO PRINCIPALE (Grande e Centrato) */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <EditableText 
            value={data.articles['lead'].headline} 
            onChange={(v) => updateArticle('lead', 'headline', v)} 
            className={`${theme.headlineFont} text-6xl font-bold mb-6 leading-tight`} 
            aiEnabled={!isPreview} 
            mode="headline"
        />
        <div className={`${theme.bodyFont} text-2xl px-8 leading-relaxed opacity-90`}>
            <EditableText 
                value={data.articles['lead'].content} 
                onChange={(v) => updateArticle('lead', 'content', v)} 
                multiline={true} 
                aiEnabled={!isPreview} 
                mode="body"
            />
        </div>
      </div>

      {/* 4. BLOCCHI AGGIUNTIVI (Se l'utente vuole aggiungere altro) */}
      <div className="w-full mt-auto">
         <RenderBlocks 
            blocks={data.frontPageBlocks} 
            onUpdate={(id, v, h) => updateBlock(id, v, h)} 
            onRemove={removeBlock} 
            theme={theme} 
            isPreview={isPreview}
         />
         <AddBlockControls onAdd={addBlock} isSidebar={false} isPreview={isPreview} />
      </div>

    </div>
  );
};
