import React, { useState, useEffect } from 'react';
import { ArticleType, NewspaperData, ContentBlock, BlockType, ThemeId, ExtraSpread, ArticleData, EventType, FormatType, WidgetData, WidgetType } from './types';
import { EditableText } from './components/EditableText';
import { ImageSpot } from './components/ImageSpot';
import { WidgetLibrary, WidgetLayer } from './components/StrilloneWidget';
import { CrosswordGrid, AddBlockControls, RenderBlocks } from './components/EditorShared';
import { Dashboard } from './components/Dashboard';
import { Printer, Type, Image as ImageIcon, AlignLeft, Trash2, PlusCircle, Check, Loader2, Mail, X, HelpCircle, ArrowLeft, Newspaper, Coffee, Settings, Eye, BookOpen, Save, FolderOpen, Megaphone, Home, Download } from 'lucide-react';
import { generateHistoricalContext } from './services/gemini';
import { WelcomeScreen } from './components/WelcomeScreen';
import { THEMES, INITIAL_ARTICLES, INITIAL_DATA } from './data';

const PrintDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handlePrint = () => { window.print(); onClose(); };
  return (
    <div className="fixed inset-0 bg-stone-900/95 z-[9999] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-stone-800">
        <Printer size={48} className="mx-auto text-stone-800 mb-4" />
        <h2 className="text-2xl font-black font-oswald uppercase mb-2">Centro Stampa</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={handlePrint} className="border-2 border-stone-200 hover:border-blue-600 rounded-xl p-4 hover:bg-blue-50 font-bold">Stampa A4</button>
          <button onClick={handlePrint} className="border-2 border-stone-200 hover:border-purple-600 rounded-xl p-4 hover:bg-purple-50 font-bold">Stampa A3</button>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-red-500 font-bold text-xs uppercase">Annulla</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<NewspaperData>(() => {
      const saved = localStorage.getItem('newspaper_data');
      if (saved) { try { const parsed = JSON.parse(saved); return { ...INITIAL_DATA, ...parsed, widgets: (parsed.widgets && parsed.widgets.length > 0) ? parsed.widgets : INITIAL_DATA.widgets }; } catch (e) { return INITIAL_DATA; } }
      return INITIAL_DATA;
  });
  const [appConfig, setAppConfig] = useState(() => { const saved = localStorage.getItem('app_config'); return saved ? JSON.parse(saved) : { title: 'THE SEK CREATOR AND DESIGNER', logo: '' }; });
  
  const [showDashboard, setShowDashboard] = useState(true);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(() => !localStorage.getItem('newspaper_data')); 
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [backupFilename, setBackupFilename] = useState('');
  const [isVintageMode, setIsVintageMode] = useState(false); 
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  useEffect(() => { localStorage.setItem('newspaper_data', JSON.stringify(data)); localStorage.setItem('app_config', JSON.stringify(appConfig)); }, [data, appConfig]);

  const currentTheme = THEMES[data.themeId];
  const isDigital = data.themeId === 'digital';
  const isPoster = data.formatType === FormatType.POSTER;
  const isCard = data.formatType === FormatType.CARD;

  const saveProjectToLibrary = () => {
      const name = prompt("Che nome vuoi dare a questo progetto?", data.publicationName || "Nuovo Progetto");
      if (!name) return;
      try {
          const library = JSON.parse(localStorage.getItem('sek_projects_library') || '[]');
          const projectToSave = { ...data, publicationName: name, date: new Date().toLocaleDateString() };
          setData(projectToSave);
          const existingIdx = library.findIndex((p: NewspaperData) => p.publicationName === name);
          if (existingIdx >= 0) {
              if (confirm("Esiste già un progetto con questo nome. Sovrascrivere?")) { library[existingIdx] = projectToSave; } else { return; }
          } else { library.push(projectToSave); }
          localStorage.setItem('sek_projects_library', JSON.stringify(library));
          alert("Progetto salvato!");
      } catch (e) { alert("Memoria piena. Usa 'Scarica Backup'."); }
  };

  const loadProjectFromDashboard = (project: NewspaperData) => { setData(project); setShowDashboard(false); setShowWelcomeScreen(false); };

  const handleImportFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => { 
          try { 
              const importedData = JSON.parse(event.target?.result as string); 
              if (importedData && importedData.themeId) { 
                  setData({ ...importedData, widgets: importedData.widgets || [] }); 
                  setShowDashboard(false); 
                  setShowWelcomeScreen(false);
                  alert("Caricato!"); 
              } else { alert("File non valido."); } 
          } catch (err) { alert("Errore caricamento."); } 
      }; 
      reader.readAsText(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handleImportFile(e.target.files[0]); };
  const handleConfirmSave = () => { const finalName = backupFilename.endsWith('.json') ? backupFilename : `${backupFilename}.json`; const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = finalName; document.body.appendChild(link); link.click(); document.body.removeChild(link); setShowSaveDialog(false); };
  const handleConfirmReset = () => { setData(INITIAL_DATA); setAppConfig({ title: 'THE SEK CREATOR AND DESIGNER', logo: '' }); localStorage.removeItem('newspaper_data'); setShowWidgetLibrary(false); setShowResetDialog(false); setShowDashboard(true); setShowWelcomeScreen(false); };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setAppConfig(prev => ({ ...prev, logo: reader.result as string })); reader.readAsDataURL(file); } };
  const openSaveDialog = () => { setBackupFilename(`giornale-${new Date().toLocaleDateString('it-IT').replace(/\//g, '-')}`); setShowSaveDialog(true); }

  const updateTheme = (themeId: ThemeId) => { let newEventType = data.eventType; if (themeId === 'birthday') newEventType = EventType.BIRTHDAY; if (themeId === 'christmas') newEventType = EventType.CHRISTMAS; if (themeId === 'easter') newEventType = EventType.EASTER; const newData = { ...data, themeId, eventType: newEventType }; setData(newData); };
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const newType = e.target.value as EventType; let newTheme = data.themeId; if (newType === EventType.CHRISTMAS) newTheme = 'christmas'; if (newType === EventType.EASTER) newTheme = 'easter'; if (newType === EventType.BIRTHDAY) newTheme = 'birthday'; setShowConfigPanel(true); setData(prev => ({ ...prev, eventType: newType, themeId: newTheme })); };
  const updateArticle = (id: string, field: string, value: any) => setData(prev => ({ ...prev, articles: { ...prev.articles, [id]: { ...prev.articles[id], [field]: value } } }));
  const updateMeta = (field: keyof NewspaperData, value: string | number) => setData(prev => ({ ...prev, [field]: value }));
  const updateEventConfig = (field: keyof NewspaperData['eventConfig'], value: any) => setData(prev => ({ ...prev, eventConfig: { ...prev.eventConfig, [field]: value } }));

  const generateContentForEvent = (type: EventType, config: any): { pubName: string, articles: Record<string, ArticleData>, index: string, extraPages: ExtraSpread[] } => {
    let pubName = "La Cronaca Quotidiana"; let articles = JSON.parse(JSON.stringify(INITIAL_ARTICLES)); let index = "- Esteri .......... Pag. 2\n- Economia ........ Pag. 4\n- Cruciverba ...... Pag. 11"; let extraPages: ExtraSpread[] = []; const name = config.heroName1 || "Protagonista"; const genderSuffix = config.gender === 'F' ? 'a' : 'o'; let age = 0; if (config.date) { const birthYear = new Date(config.date).getFullYear(); const currentYear = new Date().getFullYear(); age = currentYear - birthYear; }
    switch (type) {
        case EventType.BIRTHDAY: pubName = `Il Corriere di ${name}`; articles['lead'].headline = `BUON COMPLEANNO ${name.toUpperCase()}!`; articles['lead'].subheadline = `Grande festa per i suoi splendidi ${age > 0 ? age : 'X'} anni`; articles['lead'].content = `Oggi è un giorno speciale! ${name} festeggia un traguardo importante...`; break;
        case EventType.WEDDING: pubName = `L'Eco degli Sposi`; articles['lead'].headline = `OGGI SPOSI!`; break;
    }
    return { pubName, articles, index, extraPages };
  };

  const handleApplyEventConfig = async () => { setIsUpdatingEvent(true); try { const { eventType, eventConfig } = data; const content = generateContentForEvent(eventType, eventConfig); setData(prev => ({ ...prev, publicationName: content.pubName, articles: content.articles, indexContent: content.index, extraSpreads: content.extraPages })); setShowConfigPanel(false); } catch (e) { console.error(e); } finally { setIsUpdatingEvent(false); } };
  
  const addBlock = (section: 'front'|'back'|'sidebar', type: BlockType) => { const newBlock: ContentBlock = { id: Date.now().toString(), type, content: type === 'image' ? '' : 'Nuovo...', height: type === 'image' ? 300 : undefined }; const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks'; setData(prev => ({ ...prev, [listKey]: [...prev[listKey], newBlock] })); };
  const updateBlock = (section: 'front'|'back'|'sidebar', id: string, value: string, height?: number) => { const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks'; setData(prev => ({ ...prev, [listKey]: prev[listKey].map(b => b.id === id ? { ...b, content: value, height: height !== undefined ? height : b.height } : b) })); };
  const removeBlock = (section: 'front'|'back'|'sidebar', id: string) => { const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks'; setData(prev => ({ ...prev, [listKey]: prev[listKey].filter(b => b.id !== id) })); };
  const addSpread = () => { const startPage = 2 + (data.extraSpreads.length * 2); const newSpread: ExtraSpread = { id: `spread-${Date.now()}`, pageNumberLeft: startPage, pageNumberRight: startPage + 1, leftBlocks: [], rightBlocks: [] }; setData(prev => ({ ...prev, extraSpreads: [...prev.extraSpreads, newSpread] })); };
  const addBlockToSpread = (sid: string, side: 'left'|'right', type: BlockType) => { const newBlock: ContentBlock = { id: Date.now().toString(), type, content: type==='image'?'':'Nuovo...', height: type === 'image' ? 300 : undefined }; setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: [...(side==='left'?s.leftBlocks:s.rightBlocks), newBlock] } : s) })); };
  const updateBlockInSpread = (sid: string, side: 'left'|'right', bid: string, val: string, height?: number) => { setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: s[side==='left'?'leftBlocks':'rightBlocks'].map(b => b.id===bid ? {...b, content: val, height: height !== undefined ? height : b.height } : b) } : s) })); };
  const removeBlockInSpread = (sid: string, side: 'left'|'right', bid: string) => { setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: s[side==='left'?'leftBlocks':'rightBlocks'].filter(b => b.id !== bid) } : s) })); };
  const handleAddWidget = (type: WidgetType, content: string, subType?: string) => { const newWidget: WidgetData = { id: `widget-${Date.now()}`, type, content, text: type === 'bubble' ? 'Clicca...' : type === 'text' ? 'TESTO' : undefined, style: { x: window.innerWidth/2-100, y: window.scrollY+300, width: 200, height: 200, rotation: 0, zIndex: 50, fontSize: 24, color: '#000000', fontFamily: 'Chomsky', flipX: false } }; if (type === 'sticker' && !subType) { newWidget.style.width = 100; newWidget.style.height = 100; } setData(prev => ({ ...prev, widgets: [...(prev.widgets || []), newWidget] })); setSelectedWidgetId(newWidget.id); setShowWidgetLibrary(false); };
  const setWidgets = (action: React.SetStateAction<WidgetData[]>) => { setData(prev => { const newWidgets = typeof action === 'function' ? action(prev.widgets || []) : action; return { ...prev, widgets: newWidgets }; }); };

  const pageHeightClass = "h-[1350px] overflow-hidden";
  const customPageStyle = isDigital && data.customBgColor ? { backgroundColor: data.customBgColor } : {};
  
  if (showDashboard && !showWelcomeScreen) {
      return <Dashboard currentData={data} onLoadProject={loadProjectFromDashboard} onNewProject={() => { setData(INITIAL_DATA); setShowDashboard(false); }} onImport={handleImportFile} />;
  }

  if (showWelcomeScreen) {
      return (<><input id="hidden-file-input" type="file" accept=".json" className="hidden" onChange={onFileInputChange}/><WelcomeScreen hasSavedData={false} onContinue={()=>{setShowWelcomeScreen(false); setShowDashboard(true);}} onNew={()=>{handleConfirmReset(); setShowWelcomeScreen(false); setShowDashboard(false);}} onLoad={()=>{document.getElementById('hidden-file-input')?.click()}}/></>);
  }

  const renderFrontPage = (wrapperClass: string) => (
    <div className={`${wrapperClass} ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative ${currentTheme.borderClass} ${!isDigital && !isPoster && !isPreviewMode ? 'border-r' : ''} print:w-full`} style={customPageStyle}>
      {isVintageMode && (<div className="absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-40 bg-[#d4c5a6]" style={{ filter: 'sepia(0.6) contrast(1.1)' }}><svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" /></svg></div>)}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent border-b-2 border-dashed border-red-500 opacity-50 print:hidden pointer-events-none z-50" title="Limite di stampa sicuro"></div>
      <header className={`${currentTheme.borderClass} border-b-4 pb-4 mb-6 text-center relative z-30`}>
         {isPoster && <div className="text-xs uppercase font-bold mb-2 tracking-widest text-stone-500">Edizione Speciale Poster</div>}
         <EditableText value={data.publicationName} onChange={(v) => updateMeta('publicationName', v)} className={`${currentTheme.titleFont} ${isPoster ? 'text-8xl lg:text-9xl' : 'text-6xl lg:text-8xl'} leading-tight ${currentTheme.textClass} overflow-visible`} language={currentTheme.language} aiEnabled={!isPreviewMode} aiContext="Nome della testata" mode="headline"/>
         {!isPoster && (<div className={`flex justify-center gap-8 mt-2 text-xs font-bold uppercase tracking-widest border-t ${currentTheme.borderClass} pt-2 w-full max-w-md mx-auto ${currentTheme.textClass}`}><EditableText value={data.issueNumber} onChange={(v)=>updateMeta('issueNumber',v)} aiEnabled={!isPreviewMode}/><EditableText value={data.date} onChange={(v)=>updateMeta('date',v)} aiEnabled={!isPreviewMode}/><EditableText value={data.price} onChange={(v)=>updateMeta('price',v)} aiEnabled={!isPreviewMode}/></div>)}
      </header>
      <div className={`${isPoster ? 'flex flex-col h-full' : 'grid grid-cols-12 gap-6'} h-full ${currentTheme.textClass} relative z-30`}>
        <div className={`${isPoster ? 'w-full flex-1 flex flex-col' : 'col-span-8'}`}>
          <article className="mb-6 flex-1 flex flex-col">
             <EditableText value={data.articles['lead'].headline} onChange={(v) => updateArticle('lead', 'headline', v)} className={`${currentTheme.headlineFont} ${isPoster ? 'text-6xl lg:text-7xl text-center my-8' : 'text-4xl lg:text-5xl'} leading-tight mb-2 font-bold`} aiEnabled={!isPreviewMode} aiContext="Titolo principale" mode="headline"/>
             {!isPoster && (<EditableText value={data.articles['lead'].subheadline || ''} onChange={(v) => updateArticle('lead', 'subheadline', v)} className={`${currentTheme.bodyFont} text-xl italic opacity-80 mb-4`} aiEnabled={!isPreviewMode} aiContext="Sottotitolo" mode="headline"/>)}
             <ImageSpot src={data.articles['lead'].imageUrl} onChange={(v) => updateArticle('lead', 'imageUrl', v)} className={`w-full mb-4 ${currentTheme.borderClass} border shadow-sm ${isPoster ? 'flex-1 object-cover min-h-[500px]' : ''}`} context={data.articles['lead'].headline} autoHeight={!isPoster} filters={currentTheme.imageFilter} enableResizing={!isPreviewMode} customHeight={data.articles['lead'].customHeight} onHeightChange={(h) => updateArticle('lead', 'customHeight', h)}/>
             {!isPoster && (<div className={`columns-2 gap-6 [column-rule:1px_solid_${isDigital?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)'}] ${currentTheme.bodyFont} text-sm text-justify leading-relaxed`}><EditableText value={data.articles['lead'].content} onChange={(v) => updateArticle('lead', 'content', v)} multiline={true} aiEnabled={!isPreviewMode} aiContext="Articolo principale" mode="body"/></div>)}
          </article>
          {!isPoster && (<div className={`${currentTheme.borderClass} border-t-2 pt-4 mt-2`}><RenderBlocks blocks={data.frontPageBlocks} onUpdate={(id:string,v:string,h?:number)=>updateBlock('front',id,v,h)} onRemove={(id:string)=>removeBlock('front',id)} theme={currentTheme} isPreview={isPreviewMode}/><AddBlockControls onAdd={(t:BlockType)=>addBlock('front',t)} themeId={data.themeId} isPreview={isPreviewMode}/></div>)}
        </div>
        {!isPoster && (<div className={`col-span-4 ${currentTheme.borderClass} border-l pl-4 flex flex-col gap-6`}><div className={`${currentTheme.borderClass} border-2 p-3 bg-stone-200/50 text-stone-800`}><h3 className="font-sans font-bold uppercase text-sm border-b mb-2">In Questo Numero</h3><EditableText value={data.indexContent} onChange={(v)=>updateMeta('indexContent',v)} multiline={true} className="text-sm font-serif" aiEnabled={!isPreviewMode} aiContext="Indice" mode="summary"/></div><article><EditableText value={data.articles['sidebar'].headline} onChange={(v)=>updateArticle('sidebar','headline',v)} className={`${currentTheme.headlineFont} text-2xl font-bold mb-2`} aiEnabled={!isPreviewMode} aiContext="Titolo spalla" mode="headline"/><EditableText value={data.articles['sidebar'].content} onChange={(v)=>updateArticle('sidebar','content',v)} multiline={true} className="text-xs text-justify" aiEnabled={!isPreviewMode} aiContext="Articolo spalla" mode="body"/></article><div className="mt-4 border-t pt-4"><RenderBlocks blocks={data.sidebarBlocks} onUpdate={(id:string,v:string,h?:number)=>updateBlock('sidebar',id,v,h)} onRemove={(id:string)=>removeBlock('sidebar',id)} theme={currentTheme} isSidebar={true} isPreview={isPreviewMode}/><AddBlockControls onAdd={(t:BlockType)=>addBlock('sidebar',t)} isSidebar={true} themeId={data.themeId} isPreview={isPreviewMode}/></div></div>)}
      </div>
    </div>
  );

  const renderInternalPage = (blocks: any[], pn: number, sid: string, side: 'left'|'right') => (
    <div className={`w-full ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative print:w-full shadow-xl print:shadow-none print:break-after-page group/page ${currentTheme.textClass} flex flex-col`} style={customPageStyle}>
       <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent border-b-2 border-dashed border-red-500 opacity-50 print:hidden pointer-events-none z-50"></div>
       {isVintageMode && (<div className="absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-40 bg-[#d4c5a6]" style={{ filter: 'sepia(0.6) contrast(1.1)' }}><svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilterInternal"><feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilterInternal)" /></svg></div>)}
       <div className="flex-1 overflow-hidden flex flex-col relative z-30"><RenderBlocks blocks={blocks} onUpdate={(id:string,v:string,h?:number)=>updateBlockInSpread(sid,side,id,v,h)} onRemove={(id:string)=>removeBlockInSpread(sid,side,id)} theme={currentTheme} isPreview={isPreviewMode}/><div className="mt-auto"><AddBlockControls onAdd={(t:BlockType)=>addBlockToSpread(sid,side,t)} themeId={data.themeId} isPreview={isPreviewMode}/></div></div>
       <div className="mt-4 text-center text-xs font-bold flex-shrink-0 relative z-30">Pagina {pn}</div>
    </div>
  );

  const renderBackPage = (wrapperClass: string) => (
     <div className={`${wrapperClass} ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative ${currentTheme.textClass}`} style={customPageStyle}>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent border-b-2 border-dashed border-red-500 opacity-50 print:hidden pointer-events-none z-50"></div>
        {isVintageMode && (<div className="absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-40 bg-[#d4c5a6]" style={{ filter: 'sepia(0.6) contrast(1.1)' }}><svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilterBack"><feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilterBack)" /></svg></div>)}
        <header className={`${currentTheme.borderClass} border-b-2 pb-2 mb-6 flex justify-between items-end relative z-30`}><h2 className={`${currentTheme.headlineFont} text-4xl font-bold uppercase`}>Ultima Pagina</h2></header>
        <article className="border-b pb-6 mb-6 relative z-30">
            <ImageSpot src={data.articles['backMain'].imageUrl} onChange={(v)=>updateArticle('backMain','imageUrl',v)} className={`w-full mb-4`} autoHeight={true} filters={currentTheme.imageFilter} context={data.articles['backMain'].headline} enableResizing={!isPreviewMode} customHeight={data.articles['backMain'].customHeight} onHeightChange={(h) => updateArticle('backMain', 'customHeight', h)}/>
            <EditableText value={data.articles['backMain'].headline} onChange={(v)=>updateArticle('backMain','headline',v)} className={`${currentTheme.headlineFont} text-5xl font-black italic uppercase leading-none mb-3`} aiEnabled={!isPreviewMode} mode="headline"/>
            <EditableText value={data.articles['backMain'].content} onChange={(v)=>updateArticle('backMain','content',v)} multiline={true} className={`columns-2 gap-6 [column-rule:1px_solid_${isDigital?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)'}] text-sm text-justify`} aiEnabled={!isPreviewMode} mode="body"/>
        </article>
        <div className="grid grid-cols-2 gap-8 mt-auto relative z-30"><div className={`border ${currentTheme.borderClass} p-4`}><h3 className="uppercase font-bold text-sm mb-2">Meteo</h3><EditableText value={data.articles['weather'].content} onChange={(v)=>updateArticle('weather','content',v)} multiline={true} className="font-serif text-sm" aiEnabled={!isPreviewMode} mode="body"/></div><div className={`border ${currentTheme.borderClass} p-4 text-center`}><h3 className="uppercase font-bold text-sm mb-2">Vignetta / Dedica</h3><ImageSpot src={data.articles['comic'].imageUrl} onChange={(v)=>updateArticle('comic','imageUrl',v)} className="w-full" autoHeight={true} filters={currentTheme.imageFilter} context={data.articles['comic'].content}/><EditableText value={data.articles['comic'].content} onChange={(v)=>updateArticle('comic','content',v)} className="text-xs italic mt-2" aiEnabled={!isPreviewMode} mode="headline"/></div></div>
     </div>
  );

  if (showWelcomeScreen && !localStorage.getItem('newspaper_data')) return (<><input id="hidden-file-input" type="file" accept=".json" className="hidden" onChange={onFileInputChange}/><WelcomeScreen hasSavedData={false} onContinue={()=>setShowWelcomeScreen(false)} onNew={()=>{handleConfirmReset();setShowWelcomeScreen(false)}} onLoad={()=>{document.getElementById('hidden-file-input')?.click()}}/></>);
  if (showWelcomeScreen && localStorage.getItem('newspaper_data')) return (<><input id="hidden-file-input" type="file" accept=".json" className="hidden" onChange={onFileInputChange}/><WelcomeScreen hasSavedData={true} onContinue={()=>setShowWelcomeScreen(false)} onNew={()=>{handleConfirmReset();setShowWelcomeScreen(false)}} onLoad={()=>{document.getElementById('hidden-file-input')?.click()}}/></>);
  
  return (
    <div className="min-h-screen bg-stone-800 p-4 lg:p-8 font-sans text-stone-900">
      <nav className="sticky top-0 z-[100] bg-white shadow-lg mb-8 print:hidden flex flex-col">
        <div className="max-w-[1600px] mx-auto w-full p-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 mr-4">
                <button onClick={() => setShowDashboard(true)} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-700 flex items-center gap-2 font-bold text-xs uppercase" title="Torna alla Home"><Home size={18}/> Home</button>
                <label className="cursor-pointer group relative" title="Carica Logo">
                    {appConfig.logo ? <img src={appConfig.logo} alt="Logo" className="h-12 w-auto object-contain" /> : <div className="h-12 w-12 bg-stone-200 rounded-lg flex items-center justify-center group-hover:bg-stone-300 transition-colors"><Newspaper size={28} className="text-stone-500"/></div>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                </label>
                <div className="flex flex-col justify-center leading-none select-none"><span className="font-oswald font-bold text-2xl uppercase text-stone-900 tracking-tighter">THE SEK</span><span className="font-oswald font-medium text-[10px] uppercase text-stone-500 tracking-[0.3em]">CREATOR & DESIGNER<
