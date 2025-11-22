import React, { useState, useEffect } from 'react';
import { ArticleType, NewspaperData, ContentBlock, BlockType, ThemeId, ExtraSpread, ArticleData, EventType, FormatType, WidgetData, WidgetType } from './types';
import { EditableText } from './components/EditableText';
import { ImageSpot } from './components/ImageSpot';
import { WidgetLibrary, WidgetLayer } from './components/StrilloneWidget';
import { Printer, Type, Image as ImageIcon, AlignLeft, Trash2, Palette, PlusCircle, MinusCircle, Cake, Check, Loader2, Mail, X, Heart, GraduationCap, Baby, Crown, Sparkles, LayoutTemplate, Snowflake, Sun, BookOpen, Wand2, Megaphone, Upload, Save, FolderOpen, HelpCircle, Download, Github, FilePlus, FileBox, AlertTriangle, Eye, ArrowLeft, FileDown } from 'lucide-react';
import { generateHistoricalContext } from './services/gemini';
import { WelcomeScreen } from './components/WelcomeScreen';

// --- THEME CONFIGURATION ---
interface ThemeConfig {
  id: ThemeId;
  label: string;
  language: string; // For AI prompts
  locale: string; // For date formatting
  bgClass: string;
  textClass: string;
  borderClass: string;
  titleFont: string;
  headlineFont: string;
  bodyFont: string;
  imageFilter: string; // Tailwind css filter classes
  headerLayout: 'center' | 'left' | 'modern' | 'digital';
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    label: 'Classico (B/N)',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#fdfbf7]',
    textClass: 'text-stone-900',
    borderClass: 'border-black',
    titleFont: 'font-chomsky',
    headlineFont: 'font-playfair',
    bodyFont: 'font-merriweather',
    imageFilter: 'grayscale contrast-125 sepia-[.15]',
    headerLayout: 'center'
  },
  italy: {
    id: 'italy',
    label: 'Italia (Corriere)',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#fbf9f5]',
    textClass: 'text-neutral-900',
    borderClass: 'border-neutral-800',
    titleFont: 'font-playfair font-black tracking-tighter',
    headlineFont: 'font-merriweather font-bold',
    bodyFont: 'font-merriweather',
    imageFilter: 'grayscale contrast-110',
    headerLayout: 'center'
  },
  vintage: {
    id: 'vintage',
    label: 'Vintage Antico',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#e8dcc6]',
    textClass: 'text-[#3e3024]',
    borderClass: 'border-[#5c4835]',
    titleFont: 'font-chomsky',
    headlineFont: 'font-playfair',
    bodyFont: 'font-merriweather',
    imageFilter: 'sepia contrast-100 brightness-90 grayscale-[0.5]',
    headerLayout: 'center'
  },
  birthday: { 
    id: 'birthday',
    label: 'Stile Compleanno',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#e8dcc6]',
    textClass: 'text-[#3e3024]',
    borderClass: 'border-[#5c4835]',
    titleFont: 'font-playfair font-black tracking-tight', 
    headlineFont: 'font-playfair',
    bodyFont: 'font-merriweather',
    imageFilter: 'sepia contrast-100 brightness-90 grayscale-[0.5]',
    headerLayout: 'center'
  },
  christmas: {
    id: 'christmas',
    label: 'Stile Natalizio',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#fdf2f2]', // Very light red/cream
    textClass: 'text-red-950',
    borderClass: 'border-green-900',
    titleFont: 'font-chomsky text-red-900',
    headlineFont: 'font-playfair font-bold text-green-900',
    bodyFont: 'font-merriweather text-stone-900',
    imageFilter: 'contrast-110 brightness-105 saturate-[0.8]', // Warm vintage color
    headerLayout: 'center'
  },
  easter: {
    id: 'easter',
    label: 'Stile Pasquale',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-[#ffffe0]', // Light yellow
    textClass: 'text-purple-900',
    borderClass: 'border-yellow-500',
    titleFont: 'font-playfair font-black text-purple-800',
    headlineFont: 'font-playfair text-pink-700',
    bodyFont: 'font-merriweather text-stone-800',
    imageFilter: 'brightness-110 contrast-105 sepia-[0.2]', // Bright and sunny
    headerLayout: 'center'
  },
  digital: {
    id: 'digital',
    label: 'Digitale Dinamico',
    language: 'Italiano',
    locale: 'it-IT',
    bgClass: 'bg-slate-900 text-white',
    textClass: 'text-white',
    borderClass: 'border-slate-600',
    titleFont: 'font-oswald tracking-widest uppercase',
    headlineFont: 'font-oswald',
    bodyFont: 'font-roboto',
    imageFilter: '', // No filter for digital
    headerLayout: 'digital'
  },
  modern: {
    id: 'modern',
    label: 'Moderno Color',
    language: 'Inglese',
    locale: 'en-US',
    bgClass: 'bg-white',
    textClass: 'text-slate-900',
    borderClass: 'border-blue-900',
    titleFont: 'font-oswald tracking-tighter',
    headlineFont: 'font-oswald',
    bodyFont: 'font-roboto',
    imageFilter: '',
    headerLayout: 'modern'
  },
  usa: {
    id: 'usa',
    label: 'USA (Times)',
    language: 'Inglese',
    locale: 'en-US',
    bgClass: 'bg-stone-50',
    textClass: 'text-black',
    borderClass: 'border-black',
    titleFont: 'font-chomsky',
    headlineFont: 'font-serif font-black',
    bodyFont: 'font-serif',
    imageFilter: 'grayscale contrast-150',
    headerLayout: 'center'
  },
  germany: {
    id: 'germany',
    label: 'Germania',
    language: 'Tedesco',
    locale: 'de-DE',
    bgClass: 'bg-[#e5e5e5]',
    textClass: 'text-black',
    borderClass: 'border-black',
    titleFont: 'font-unifraktur',
    headlineFont: 'font-playfair font-black',
    bodyFont: 'font-merriweather',
    imageFilter: 'grayscale contrast-125',
    headerLayout: 'left'
  },
  france: {
    id: 'france',
    label: 'Francia',
    language: 'Francese',
    locale: 'fr-FR',
    bgClass: 'bg-[#fffbe6]',
    textClass: 'text-stone-800',
    borderClass: 'border-stone-800',
    titleFont: 'font-prata',
    headlineFont: 'font-prata',
    bodyFont: 'font-merriweather',
    imageFilter: 'grayscale-[0.8] sepia-[0.2] contrast-110',
    headerLayout: 'center'
  }
};

const INITIAL_ARTICLES: Record<string, ArticleData> = {
    'lead': {
      id: 'lead',
      type: ArticleType.LEAD,
      headline: "EVENTO STORICO OGGI",
      subheadline: "I cittadini si riuniscono a migliaia mentre notizie senza precedenti arrivano in città",
      author: "Di Mario Rossi",
      content: "In una svolta di eventi che ha affascinato l'intera città, le autorità locali hanno annunciato questa mattina che il tanto atteso progetto è stato finalmente completato. La folla ha iniziato a radunarsi all'alba.\n\n\"È un giorno che racconteremo ai nostri nipoti\", ha osservato un passante.",
      imageUrl: "https://picsum.photos/800/600",
      imagePrompt: "Folla in strada anni 20 bianco e nero"
    },
    'sidebar': {
      id: 'sidebar',
      type: ArticleType.SIDEBAR,
      headline: "Notizia Curiosa",
      author: "Redazione",
      content: "Un evento insolito ha catturato l'attenzione del quartiere. I dettagli stanno ancora emergendo ma i residenti sono già in fermento.",
    },
    'backMain': {
      id: 'backMain',
      type: ArticleType.BACK_PAGE_MAIN,
      headline: "GRANDE SUCCESSO",
      author: "Sport & Cultura",
      content: "Un risultato straordinario raggiunto dopo anni di duro lavoro. La celebrazione continuerà per tutta la settimana.",
      imageUrl: "https://picsum.photos/800/400",
      imagePrompt: "Celebrazione vittoria vintage"
    },
    'weather': {
      id: 'weather',
      type: ArticleType.WEATHER,
      headline: "Meteo",
      author: "Col. Giuliacci",
      content: "Cieli sereni e temperature miti previste per tutto il weekend.",
    },
    'comic': {
      id: 'comic',
      type: ArticleType.COMIC,
      headline: "Vignetta",
      author: "Illustratore",
      content: "Una risata al giorno...",
      imageUrl: "" 
    }
};

// Initial Data
const INITIAL_DATA: NewspaperData = {
  themeId: 'classic',
  eventType: EventType.GENERIC,
  formatType: FormatType.NEWSPAPER,
  publicationName: "La Cronaca Quotidiana",
  date: new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  issueNumber: "Vol. CXXIV No. 42",
  price: "€1.50",
  articles: INITIAL_ARTICLES,
  frontPageBlocks: [],
  backPageBlocks: [],
  sidebarBlocks: [],
  extraSpreads: [], // Pages 2, 3, 4, 5 etc.
  indexContent: "- Esteri .......... Pag. 2\n- Economia ........ Pag. 4\n- Cruciverba ...... Pag. 11",
  customBgColor: "#0f172a", // Default dark slate for digital
  eventConfig: {
      heroName1: "Antonio",
      gender: 'M',
      date: '1965-11-18',
      age: 60,
      wishesFrom: "Barbara e Secondo"
  },
  widgets: [
      // TASK 1: Default Widget (Strillone) - Usiamo ./ per compatibilità GitHub
      {
          id: 'default-strillone',
          type: 'mascot',
          content: './strillone_antonio.png',
          style: {
              x: 20,
              y: 800, // Bottom left area
              width: 300,
              height: 300,
              rotation: 0,
              zIndex: 50,
              flipX: false
          }
      }
  ]
};

// --- EXTRACTED COMPONENTS ---

// Crossword Renderer Component
const CrosswordGrid = () => {
    // Custom Grid for Antonio (8x8)
    // 1 = black, 0 = white (input)
    const gridMap = [
        [1, 1, 1, 1, 1, 1, 1, 1], // 0
        [1, 1, 0, 1, 1, 1, 1, 1], // 1 - Starts 'P' (2 Down)
        [1, 1, 0, 1, 1, 1, 1, 1], // 2
        [1, 1, 0, 1, 1, 1, 1, 1], // 3
        [0, 0, 0, 0, 0, 1, 1, 1], // 4 - Starts 'M' (1 Across) - Crosses L
        [1, 1, 0, 1, 1, 1, 1, 1], // 5
        [1, 0, 0, 0, 0, 0, 0, 0], // 6 - Starts 'G' (3 Across)
        [1, 1, 0, 1, 1, 1, 1, 1], // 7
    ];

    const numbers = [
        { r: 1, c: 2, n: 2 }, // 2 Down (Puglia)
        { r: 4, c: 0, n: 1 }, // 1 Across (Milan)
        { r: 6, c: 1, n: 3 }, // 3 Across (Griglia)
    ];

    return (
        <div className="w-full max-w-sm mx-auto my-4">
            <div className="border-2 border-black bg-black p-1">
                <div className="grid grid-cols-8 gap-px bg-black">
                    {gridMap.flat().map((cell, idx) => {
                        const r = Math.floor(idx / 8);
                        const c = idx % 8;
                        const num = numbers.find(n => n.r === r && n.c === c);
                        
                        return (
                        <div key={idx} className={`aspect-square relative ${cell === 1 ? 'bg-black' : 'bg-white'}`}>
                            {num && <span className="absolute top-0.5 left-0.5 text-[8px] font-bold leading-none">{num.n}</span>}
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
};

interface AddBlockControlsProps {
  onAdd: (type: BlockType) => void;
  isSidebar?: boolean;
  themeId: ThemeId;
  isPreview?: boolean;
}

const AddBlockControls: React.FC<AddBlockControlsProps> = ({ onAdd, isSidebar, themeId, isPreview }) => {
  if (isPreview) return null;
  
  const isDigital = themeId === 'digital';
  const isChristmas = themeId === 'christmas';
  
  // High contrast logic
  let containerClass = "border-2 border-dashed border-stone-400 bg-white/40 hover:bg-white/80";
  let btnClass = "text-stone-800 hover:text-black hover:bg-stone-200/50";

  if (isDigital) {
     containerClass = "border-2 border-dashed border-white/40 bg-slate-800/50 hover:bg-slate-700/80";
     btnClass = "text-white hover:text-blue-200 hover:bg-white/10";
  } else if (isChristmas) {
     containerClass = "border-2 border-dashed border-green-400 bg-white/60 hover:bg-white/90";
     btnClass = "text-red-900 hover:text-green-900 hover:bg-green-100/50";
  }

  return (
    <div className={`${containerClass} p-2 flex ${isSidebar ? 'flex-col items-stretch' : 'justify-center'} gap-2 opacity-70 hover:opacity-100 transition-all print:hidden rounded-lg mt-4 shadow-sm`}>
      <button onClick={() => onAdd('headline')} className={`flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors ${btnClass}`}>
        <Type size={16} /> {isSidebar ? 'Titolo' : 'Agg. Titolo'}
      </button>
      <button onClick={() => onAdd('paragraph')} className={`flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors ${btnClass}`}>
        <AlignLeft size={16} /> {isSidebar ? 'Testo' : 'Agg. Testo'}
      </button>
      <button onClick={() => onAdd('image')} className={`flex items-center justify-center gap-1 text-xs font-bold uppercase py-1.5 rounded transition-colors ${btnClass}`}>
        <ImageIcon size={16} /> {isSidebar ? 'Foto' : 'Agg. Foto'}
      </button>
    </div>
  );
};

interface RenderBlocksProps {
  blocks: ContentBlock[];
  onUpdate: (id: string, val: string) => void;
  onRemove: (id: string) => void;
  theme: ThemeConfig;
  isSidebar?: boolean;
  aiContextOverride?: string;
  isPreview?: boolean;
}

const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks, onUpdate, onRemove, theme, isSidebar, aiContextOverride, isPreview }) => (
  <>
    {blocks.map((block, index) => {
      const isBox = block.style === 'box';
      const isQuote = block.style === 'quote';
      
      let containerClass = "group relative mb-4";
      if (!isPreview) containerClass += " animate-fade-in-up";
      
      if (isBox) {
        containerClass += theme.id === 'digital' 
          ? " bg-slate-800 border border-slate-600 p-4 rounded shadow-sm" 
          : " bg-stone-100 border border-stone-300 p-4 shadow-sm";
      }

      let colClass = isSidebar ? 'columns-1' : 'columns-2';
      if (block.cols === 1) colClass = 'columns-1';
      if (block.cols === 3) colClass = 'columns-3';

      if ((block.cols && block.cols > 1) || (!isSidebar && !block.cols)) {
          const ruleColor = theme.id === 'digital' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
          colClass += ` gap-6 [column-rule:1px_solid_${ruleColor}]`;
      }

      let smartContext = "Foto giornalistica";
      if (block.type === 'image') {
          const prevBlock = blocks[index - 1];
          const nextBlock = blocks[index + 1];
          if (prevBlock && (prevBlock.type === 'headline' || prevBlock.type === 'paragraph')) {
              smartContext = prevBlock.content;
          } else if (nextBlock && (nextBlock.type === 'headline' || nextBlock.type === 'paragraph')) {
              smartContext = nextBlock.content;
          }
      }

      let aiContext = aiContextOverride || "Notizia generica";
      if (block.type === 'headline') aiContext = "Titolo notizia";
      if (block.type === 'paragraph' && isQuote) aiContext = "Citazione famosa o dichiarazione";

      return (
      <div key={block.id} className={containerClass}>
        {!isPreview && (
        <button 
          onClick={() => onRemove(block.id)}
          className="absolute -left-8 top-0 p-1 text-red-400 hover:text-red-600 hidden group-hover:block print:hidden bg-white rounded-full shadow-sm border z-20"
          title="Rimuovi blocco"
        >
          <Trash2 size={14} />
        </button>
        )}

        {block.type === 'headline' && (
          <EditableText 
            value={block.content} 
            onChange={(v) => onUpdate(block.id, v)}
            className={`${theme.headlineFont} ${isSidebar ? 'text-xl' : 'text-3xl'} font-bold leading-tight my-2 ${isBox ? 'border-b mb-3 pb-2 uppercase tracking-wide text-lg' : ''}`}
            aiEnabled={!isPreview}
            aiContext={aiContext}
            language={theme.language}
            mode="headline"
          />
        )}
        
        {block.type === 'paragraph' && (
          <div className={`${colClass} ${theme.bodyFont} ${isQuote ? 'text-xl lg:text-2xl font-serif italic text-center leading-normal opacity-80 px-8 py-4' : 'text-sm text-justify leading-relaxed'}`}>
            <EditableText 
              value={block.content} 
              onChange={(v) => onUpdate(block.id, v)}
              multiline={true}
              aiEnabled={!isPreview}
              aiContext={aiContext}
              language={theme.language}
              mode="body"
            />
          </div>
        )}

        {block.type === 'image' && (
          <ImageSpot 
            src={block.content} 
            onChange={(v) => onUpdate(block.id, v)}
            className={`w-full my-4 ${theme.borderClass} border shadow-sm`}
            context={smartContext}
            autoHeight={true}
            filters={theme.imageFilter}
          />
        )}
      </div>
      );
    })}
  </>
);


// --- MAIN APP ---

const App: React.FC = () => {
  // STATE
  const [data, setData] = useState<NewspaperData>(() => {
      // Load from localStorage on init
      const saved = localStorage.getItem('newspaper_data');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              // INTELLIGENT MERGE:
              // If the saved data is old and missing widgets, add default widgets from INITIAL_DATA
              // This ensures the "Strillone" appears even for users with old saves.
              return {
                  ...INITIAL_DATA, // Start with defaults (includes widgets)
                  ...parsed,       // Overwrite with saved data
                  widgets: (parsed.widgets && parsed.widgets.length > 0) ? parsed.widgets : INITIAL_DATA.widgets
              };
          } catch (e) {
              console.error("Failed to parse save", e);
              return INITIAL_DATA;
          }
      }
      return INITIAL_DATA;
  });
  
  const [appConfig, setAppConfig] = useState(() => {
      const saved = localStorage.getItem('app_config');
      return saved ? JSON.parse(saved) : { title: 'The Daily Creator', logo: '' };
  });

  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // TASK 1: STATE
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // DIALOG STATES
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [backupFilename, setBackupFilename] = useState('');

  // AUTO-SAVE EFFECT
  useEffect(() => {
      localStorage.setItem('newspaper_data', JSON.stringify(data));
      localStorage.setItem('app_config', JSON.stringify(appConfig));
  }, [data, appConfig]);

  const currentTheme = THEMES[data.themeId];
  const isDigital = data.themeId === 'digital';
  const isPoster = data.formatType === FormatType.POSTER;
  const isCard = data.formatType === FormatType.CARD;

  // --- WIDGET HANDLERS (TASK 1) ---
  const handleAddWidget = (type: WidgetType, content: string, subType?: string) => {
      const newWidget: WidgetData = {
          id: `widget-${Date.now()}`,
          type,
          content,
          text: type === 'bubble' ? 'Clicca per modificare...' : type === 'text' ? 'IL TUO TESTO' : undefined,
          style: {
              x: window.innerWidth / 2 - 100, // Center loosely
              y: window.scrollY + 300,
              width: 200,
              height: 200,
              rotation: 0,
              zIndex: 50,
              fontSize: 24,
              color: '#000000',
              fontFamily: 'Chomsky',
              flipX: false
          }
      };
      // Special sizing for stickers
      if (type === 'sticker' && !subType) {
          newWidget.style.width = 100;
          newWidget.style.height = 100;
      }
      setData(prev => ({ ...prev, widgets: [...(prev.widgets || []), newWidget] }));
      setSelectedWidgetId(newWidget.id);
      setShowWidgetLibrary(false);
  };

  const setWidgets = (action: React.SetStateAction<WidgetData[]>) => {
      setData(prev => {
          const newWidgets = typeof action === 'function' ? action(prev.widgets || []) : action;
          return { ...prev, widgets: newWidgets };
      });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setAppConfig(prev => ({ ...prev, logo: reader.result as string }));
          reader.readAsDataURL(file);
      }
  };

  // --- SAVE & LOAD PROJECT LOGIC ---
  const openSaveDialog = () => {
      setBackupFilename(`giornale-backup-${new Date().toLocaleDateString('it-IT').replace(/\//g, '-')}`);
      setShowSaveDialog(true);
  }

  const handleConfirmSave = () => {
    const finalName = backupFilename.endsWith('.json') ? backupFilename : `${backupFilename}.json`;
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowSaveDialog(false);
  };

  const handleImportState = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const importedData = JSON.parse(event.target?.result as string);
              if (importedData && importedData.themeId) {
                  // Ensure loaded data has widgets array if missing
                  const finalData = {
                      ...importedData,
                      widgets: importedData.widgets || []
                  };
                  setData(finalData);
                  setShowWelcomeScreen(false); // Close welcome if loaded from there
                  alert("Progetto caricato con successo!");
              } else {
                  alert("File di salvataggio non valido.");
              }
          } catch (err) {
              alert("Errore nel caricamento del file.");
          }
      };
      reader.readAsText(file);
  };
  
  const handleConfirmReset = () => {
      setData(INITIAL_DATA);
      setAppConfig({ title: 'The Daily Creator', logo: '' });
      localStorage.removeItem('newspaper_data'); // Clear storage
      setShowWidgetLibrary(false);
      setShowResetDialog(false);
      setShowWelcomeScreen(false);
  };


  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as EventType;
      let newTheme = data.themeId;

      if (newType === EventType.CHRISTMAS) newTheme = 'christmas';
      if (newType === EventType.EASTER) newTheme = 'easter';
      if (newType === EventType.BIRTHDAY) newTheme = 'birthday';
      
      setData(prev => ({ ...prev, eventType: newType, themeId: newTheme }));
  };

  const updateTheme = (themeId: ThemeId) => {
      let newEventType = data.eventType;
      if (themeId === 'birthday') newEventType = EventType.BIRTHDAY;
      if (themeId === 'christmas') newEventType = EventType.CHRISTMAS;
      if (themeId === 'easter') newEventType = EventType.EASTER;

      const newData = { ...data, themeId, eventType: newEventType };
      
      if (newEventType !== EventType.GENERIC) {
           const currentYear = new Date().getFullYear();
           const birthYear = new Date(newData.eventConfig.date).getFullYear();
           const age = newEventType === EventType.BIRTHDAY ? currentYear - birthYear : newData.eventConfig.age;
           
           const configWithAge = { ...newData.eventConfig, age };
           const content = generateContentForEvent(newEventType, configWithAge);
           
           newData.articles = content.articles;
           newData.publicationName = content.pubName;
           newData.extraSpreads = content.extraPages;
           newData.indexContent = content.index;
           newData.eventConfig = configWithAge;
      }
      
      setData(newData);
  };

  // --- EVENT CONTENT GENERATOR ---
  const generateContentForEvent = (type: EventType, config: any): { articles: Record<string, ArticleData>, pubName: string, index: string, extraPages: ExtraSpread[] } => {
      const { heroName1, heroName2, gender, date, location, wishesFrom, age } = config;
      const year = new Date(date).getFullYear();
      const suffix = gender === 'M' ? 'o' : 'a';
      
      let articles = { ...INITIAL_ARTICLES };
      let pubName = data.publicationName;
      let index = data.indexContent;
      let extraPages: ExtraSpread[] = [];
      
      const isAntonio = heroName1.toLowerCase().includes('antonio');

      switch (type) {
          case EventType.WEDDING:
              pubName = "L'AMORE QUOTIDIANO";
              articles['lead'] = {
                  id: 'lead', type: ArticleType.LEAD,
                  headline: "OGGI SPOSI!",
                  subheadline: `Un matrimonio da favola per ${heroName1} e ${heroName2}. La città è in festa.`,
                  author: "Redazione Love",
                  content: `${location || 'La città'} si è svegliata con un'atmosfera magica. Oggi ${heroName1} e ${heroName2} coronano il loro sogno d'amore circondati dall'affetto di amici e parenti. "Sono la coppia più bella del mondo", ha dichiarato un invitato commosso. La cerimonia promette di essere l'evento dell'anno, con eleganza, emozioni e tanta felicità.`,
                  imageUrl: "https://picsum.photos/800/600", imagePrompt: "Wedding couple kissing vintage elegant black and white"
              };
              articles['sidebar'] = {
                  id: 'sidebar', type: ArticleType.SIDEBAR, headline: "Il Menu Reale", author: "Chef",
                  content: "Indiscrezioni parlano di un banchetto luculliano. Vini pregiati e pietanze gourmet attenderanno gli ospiti dopo il fatidico 'Sì'."
              };
              articles['backMain'] = {
                  id: 'backMain', type: ArticleType.BACK_PAGE_MAIN, headline: "VIAGGIO DI NOZZE DA SOGNO", author: "Travel Agency",
                  content: "Le valigie sono pronte. Gli sposi partiranno presto per una destinazione segreta (ma molto esotica) per godersi la meritata Luna di Miele.",
                  imageUrl: "https://picsum.photos/800/400", imagePrompt: "Vintage airplane honeymoon travel luggage"
              };
              break;
            // ... (Rest of cases handled similarly in updateTheme, kept concise here for brevity) ...
          case EventType.BIRTHDAY:
              pubName = "L'ECO DEL FESTEGGIATO";
              if (isAntonio) {
                  articles['lead'] = {
                      id: 'lead', type: ArticleType.LEAD,
                      headline: `ANTONIO: ${age} ANNI E NON SENTIRLI!`,
                      subheadline: `Dalla Puglia alla Montagna: storia di un Serramentista Milanista, del suo barbecue leggendario e di un giardino che fa invidia.`,
                      author: "Barbara e Secondo",
                      content: `È una notizia che ha sconvolto le Alpi e il Tavoliere: Antonio compie ${age} anni! Solare, spiritoso e sempre sorridente, è l'unico uomo capace di far crescere le zucchine con la forza del pensiero. \n\nIL SERRAMENTISTA ROSSONERO\nArtigiano infaticabile, Antonio chiude le finestre agli spifferi (e agli interisti) ma lascia sempre la porta aperta agli amici. Tra un lavoro perfetto e una grigliata, trova il tempo di tifare Milan e godersi la montagna, il suo habitat naturale.`,
                      imageUrl: "https://picsum.photos/800/600", imagePrompt: `Man 60 years old gardening vintage AC Milan scarf happy`
                  };
                  articles['sidebar'] = {
                    id: 'sidebar', type: ArticleType.SIDEBAR, headline: "MATTEO & MARCO", author: "I Ragazzi",
                    content: `"Zio Antonio, sei il nostro mito! Grazie per averci insegnato che nella vita due cose contano: ridere sempre e non bruciare la carne sulla griglia. Tanti auguri!"`
                  };
                  articles['backMain'] = {
                      id: 'backMain', type: ArticleType.BACK_PAGE_MAIN, headline: "PLAYBOY CHIAMA ANTONIO?", author: "Gossip USA",
                      content: `Clamoroso da Hollywood: pare che la nota rivista abbia offerto milioni per un servizio fotografico esclusivo ad Antonio. La risposta del festeggiato? "Non ho tempo, devo innaffiare i pomodori e poi c'è il derby in TV". Un vero sex symbol si vede da queste priorità.`,
                      imageUrl: "https://picsum.photos/800/400", imagePrompt: "Magazine cover vintage handsome man gardening"
                  };
                  articles['weather'] = {
                      id: 'weather', type: ArticleType.WEATHER, headline: "METEO FESTA", author: "Col. Barometro",
                      content: "ALLERTA METEO: Previste forti precipitazioni di PROSECCO su tutta la tavola imbandita. Venti moderati di allegria e temperature in netto rialzo dopo il taglio della torta. Si consiglia di non mettersi alla guida."
                  };
                  articles['comic'] = {
                      id: 'comic', type: ArticleType.COMIC, headline: "PADRE vs FIGLIO", author: "Campo Centrale",
                      content: "La sfida infinita a tennis con Paolo.",
                      imageUrl: "https://picsum.photos/400/300", imagePrompt: "Comic strip black and white vintage style father and son playing tennis with speech bubbles cartoons"
                  };
              } else {
                   articles['lead'] = {
                      id: 'lead', type: ArticleType.LEAD,
                      headline: `INCREDIBILE: SONO ${age}!`,
                      subheadline: `${heroName1} entra nel club dei '${age}' ma ne dimostra la metà.`,
                      author: "Dagli Inviati",
                      content: `È una notizia che ha fatto il giro del globo. Oggi festeggiamo un traguardo storico: ${age} anni di stile. Gli esperti confermano: "Non invecchia, matura come il vino buono". ${heroName1} sorride e conferma che il meglio deve ancora venire.`,
                      imageUrl: "https://picsum.photos/800/600", imagePrompt: `${gender === 'M' ? 'Man' : 'Woman'} elegant birthday vintage champagne`
                  };
                  articles['backMain'] = {
                      id: 'backMain', type: ArticleType.BACK_PAGE_MAIN, headline: "PLAYBOY INTERESSATA?", author: "Gossip USA",
                      content: `Voci dicono che la rivista americana sia interessata al fascino di ${heroName1}. "Troppo sexy per noi", pare abbia risposto.`,
                      imageUrl: "https://picsum.photos/800/400", imagePrompt: "Magazine cover vintage elegant"
                  };
                   articles['weather'] = {
                      id: 'weather', type: ArticleType.WEATHER, headline: "METEO FESTA", author: "Meteo",
                      content: "Pioggia di Prosecco e raffiche di tappi di spumante previste per tutta la serata."
                  };
              }
              break;
      }

      if (type === EventType.BIRTHDAY && age > 0) {
          const isAntonio = heroName1.toLowerCase().includes('antonio');
          const leftBlocks: ContentBlock[] = [
               { id: 'b1', type: 'headline', content: `L'ANNO D'ORO: ${year}` },
               { id: 'b2', type: 'paragraph', content: `Generazione automatica in corso... (Anno ${year})`, cols: 2 }, 
               { id: 'b3', type: 'image', content: 'https://picsum.photos/800/400?grayscale', style: 'standard' },
               { id: 'b4', type: 'headline', content: `CURIOSITÀ DEL ${year}`, style: 'box' },
               { id: 'b5', type: 'paragraph', content: `Generazione automatica in corso...`, cols: 1, style: 'box' },
          ];

          if (isAntonio) {
             leftBlocks.push({ id: 'sport65', type: 'headline', content: "SPORT 1965", style: 'box' });
             leftBlocks.push({ id: 'sport65_txt', type: 'paragraph', content: "- CALCIO: L'Inter vince lo scudetto 1964-65 (Un anno difficile per i rossoneri...)\n- CICLISMO: Felice Gimondi vince il Tour de France.", cols: 1, style: 'box' });
          }

          const rightBlocksStandard: ContentBlock[] = [
               { id: 'b7', type: 'headline', content: `Test: Sei un ${age}enne DOC?`, style: 'box' },
               { id: 'b8', type: 'paragraph', content: "1. Ti lamenti del meteo?\n2. Guardi i cantieri?\n3. Dici 'ai miei tempi'?\nSe sì... Auguri!", cols: 1, style: 'box' },
               { id: 'b11', type: 'paragraph', content: `Auguri speciali da:\n${wishesFrom || 'Tutti noi'}\n\n"Che questi ${age} anni siano solo l'inizio!"`, style: 'quote' }
          ];

          const rightBlocksAntonio: ContentBlock[] = [
               { id: 'ant_rebus_t', type: 'headline', content: "IL REBUS FACILE", style: 'box' },
               { id: 'ant_rebus_img', type: 'image', content: 'https://picsum.photos/400/200?grayscale', style: 'standard' },
               { id: 'ant_rebus_s', type: 'paragraph', content: "(Soluzione capovolta: I R U G U A)", style: 'standard' },
               
               { id: 'ant1', type: 'headline', content: `SFIDA IN FAMIGLIA: PAOLO VS ANTONIO`, style: 'standard' },
               { id: 'ant2', type: 'paragraph', content: "Non c'è Wimbledon che tenga. La vera sfida è tra Antonio e suo figlio Paolo. \n\nIl giovane tennista corre veloce, ma papà Antonio ribatte con l'esperienza (e qualche pallonetto insidioso). Chi vincerà il prossimo set? Paolo ha la tecnica, ma Antonio ha la grinta del serramentista!", cols: 2, style: 'standard' },
               
               { id: 'ant3', type: 'headline', content: "ENIGMISTICA: IL CRUCIVERBA", style: 'box' },
               { id: 'ant4_crossword', type: 'image', content: 'CROSSWORD_PLACEHOLDER', style: 'standard' }, 
               { id: 'ant5', type: 'paragraph', content: "ORIZZONTALI:\n1. Squadra del cuore (MILAN)\n3. Si usa per la carne (GRIGLIA)\n\nVERTICALI:\n2. Regione di nascita (PUGLIA)", cols: 1, style: 'box' },
               
               { id: 'ant6', type: 'headline', content: `L'ANGOLO DELLA RISATA`, style: 'box' },
               { id: 'ant7', type: 'paragraph', content: "Dottore: 'Antonio, per i 60 anni attenzione ai grassi'. Antonio: 'Dottore, se evito i grassi, chi la mangia la salsiccia? Non si spreca!'", cols: 1, style: 'box' },
          ];

          extraPages = [{
            id: 'birthday-internal', pageNumberLeft: 2, pageNumberRight: 3,
            leftBlocks: leftBlocks,
            rightBlocks: isAntonio ? rightBlocksAntonio : rightBlocksStandard
          }];
      }

      return { articles, pubName, index, extraPages };
  };

  const updateArticle = (id: string, field: string, value: string) => {
    setData(prev => ({ ...prev, articles: { ...prev.articles, [id]: { ...prev.articles[id], [field]: value } } }));
  };
  const updateMeta = (field: keyof NewspaperData, value: string | number) => setData(prev => ({ ...prev, [field]: value }));
  const updateEventConfig = (field: keyof NewspaperData['eventConfig'], value: any) => setData(prev => ({ ...prev, eventConfig: { ...prev.eventConfig, [field]: value } }));

  const handleApplyEventConfig = async () => {
      setIsUpdatingEvent(true);
      try {
          const { eventType, eventConfig } = data;
          const birthYear = new Date(eventConfig.date).getFullYear();
          const currentYear = new Date().getFullYear();
          const calculatedAge = eventType === EventType.BIRTHDAY || eventType === EventType.EIGHTEEN 
             ? (eventType === EventType.EIGHTEEN ? 18 : currentYear - birthYear) 
             : 0;
          
          const configWithAge = { ...eventConfig, age: calculatedAge };
          const content = generateContentForEvent(eventType, configWithAge);
          
          let extraSpreads = content.extraPages;
          if (eventType === EventType.BIRTHDAY) {
             const history = await generateHistoricalContext(birthYear, 'Italiano');
             extraSpreads = extraSpreads.map(s => ({
                 ...s,
                 leftBlocks: s.leftBlocks.map(b => {
                     if (b.id === 'b2') return { ...b, content: history.summary };
                     if (b.id === 'b5') return { ...b, content: history.facts };
                     return b;
                 })
             }));
          }

          setData(prev => ({
              ...prev, publicationName: content.pubName, articles: content.articles, indexContent: content.index, extraSpreads: extraSpreads, eventConfig: configWithAge
          }));

      } catch (e) { console.error(e); } finally { setIsUpdatingEvent(false); }
  };

  // ... (Block Management functions omitted for brevity, identical to before) ...
  const addBlock = (section: 'front' | 'back' | 'sidebar', type: BlockType) => {
    const newBlock: ContentBlock = { id: Date.now().toString(), type, content: type === 'image' ? '' : 'Nuovo contenuto...' };
    const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks';
    setData(prev => ({ ...prev, [listKey]: [...prev[listKey], newBlock] }));
  };
  const updateBlock = (section: 'front' | 'back' | 'sidebar', id: string, value: string) => {
    const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks';
    setData(prev => ({ ...prev, [listKey]: prev[listKey].map(b => b.id === id ? { ...b, content: value } : b) }));
  };
  const removeBlock = (section: 'front' | 'back' | 'sidebar', id: string) => {
    const listKey = section === 'front' ? 'frontPageBlocks' : section === 'back' ? 'backPageBlocks' : 'sidebarBlocks';
    setData(prev => ({ ...prev, [listKey]: prev[listKey].filter(b => b.id !== id) }));
  };
  const addSpread = () => {
     // ... existing logic ...
     const startPage = 2 + (data.extraSpreads.length * 2);
     const newSpread: ExtraSpread = { id: `spread-${Date.now()}`, pageNumberLeft: startPage, pageNumberRight: startPage + 1, leftBlocks: [], rightBlocks: [] };
     setData(prev => ({ ...prev, extraSpreads: [...prev.extraSpreads, newSpread] }));
  };
  const removeSpread = (id: string) => setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.filter(s => s.id !== id) }));
  const addBlockToSpread = (sid: string, side: 'left'|'right', type: BlockType) => {
     const newBlock: ContentBlock = { id: Date.now().toString(), type, content: type==='image'?'':'Nuovo contenuto...' };
     setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: [...(side==='left'?s.leftBlocks:s.rightBlocks), newBlock] } : s) }));
  };
  const updateBlockInSpread = (sid: string, side: 'left'|'right', bid: string, val: string) => {
     setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: s[side==='left'?'leftBlocks':'rightBlocks'].map(b => b.id===bid ? {...b, content: val} : b) } : s) }));
  };
  const removeBlockInSpread = (sid: string, side: 'left'|'right', bid: string) => {
     setData(prev => ({ ...prev, extraSpreads: prev.extraSpreads.map(s => s.id===sid ? {...s, [side==='left'?'leftBlocks':'rightBlocks']: s[side==='left'?'leftBlocks':'rightBlocks'].filter(b => b.id !== bid) } : s) }));
  };


  // Email Logic
  const handleEmailClick = () => setShowEmailDialog(true);
  
  // Simplified print trigger, now reliable because it's called from within the active preview
  const triggerPrint = () => {
      window.print();
  };


  // --- RENDER LOGIC ---
  const pageHeightClass = "h-[1350px] overflow-hidden";
  const customPageStyle = isDigital && data.customBgColor ? { backgroundColor: data.customBgColor } : {};

  const renderFrontPage = (wrapperClass: string) => {
    const ruleColor = data.themeId === 'digital' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    const columnRuleClass = `gap-6 [column-rule:1px_solid_${ruleColor}]`;
    
    return (
    <div 
      className={`${wrapperClass} ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative ${currentTheme.borderClass} ${!isDigital && !isPoster && !isPreviewMode ? 'border-r' : ''} print:w-full`}
      style={customPageStyle}
    >
      {data.themeId !== 'modern' && data.themeId !== 'digital' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
      )}

      {/* Header */}
      <header className={`${currentTheme.borderClass} border-b-4 pb-4 mb-6 text-center`}>
         {isPoster && <div className="text-xs uppercase font-bold mb-2 tracking-widest text-stone-500">Edizione Speciale Poster</div>}
         <EditableText 
            value={data.publicationName} 
            onChange={(v) => updateMeta('publicationName', v)} 
            className={`${currentTheme.titleFont} ${isPoster ? 'text-8xl lg:text-9xl' : 'text-6xl lg:text-8xl'} leading-tight ${currentTheme.textClass}`}
            language={currentTheme.language}
            aiEnabled={!isPreviewMode}
            aiContext="Nome della testata del giornale"
            mode="headline"
         />
         {!isPoster && (
             <div className={`flex justify-center gap-8 mt-2 text-xs font-bold uppercase tracking-widest border-t ${currentTheme.borderClass} pt-2 w-full max-w-md mx-auto ${currentTheme.textClass}`}>
                 <EditableText value={data.issueNumber} onChange={(v)=>updateMeta('issueNumber',v)} aiEnabled={!isPreviewMode} aiContext="Numero edizione" mode="headline" />
                 <EditableText value={data.date} onChange={(v)=>updateMeta('date',v)} aiEnabled={!isPreviewMode} aiContext="Data odierna" mode="headline" />
                 <EditableText value={data.price} onChange={(v)=>updateMeta('price',v)} aiEnabled={!isPreviewMode} aiContext="Prezzo giornale" mode="headline" />
             </div>
         )}
      </header>

      {/* Content Grid */}
      <div className={`${isPoster ? 'flex flex-col h-full' : 'grid grid-cols-12 gap-6'} h-full ${currentTheme.textClass}`}>
        
        {/* Main Column */}
        <div className={`${isPoster ? 'w-full flex-1 flex flex-col' : 'col-span-8'}`}>
          <article className="mb-6 flex-1 flex flex-col">
             <EditableText 
                value={data.articles['lead'].headline} 
                onChange={(v) => updateArticle('lead', 'headline', v)}
                className={`${currentTheme.headlineFont} ${isPoster ? 'text-6xl lg:text-7xl text-center my-8' : 'text-4xl lg:text-5xl'} leading-tight mb-2 font-bold`}
                aiEnabled={!isPreviewMode}
                aiContext="Titolo principale"
                mode="headline"
             />
             {!isPoster && (
                <EditableText 
                    value={data.articles['lead'].subheadline || ''} onChange={(v) => updateArticle('lead', 'subheadline', v)}
                    className={`${currentTheme.bodyFont} text-xl italic opacity-80 mb-4`}
                    aiEnabled={!isPreviewMode}
                    aiContext="Sottotitolo articolo"
                    mode="headline"
                />
             )}
             
             <ImageSpot 
                src={data.articles['lead'].imageUrl} onChange={(v) => updateArticle('lead', 'imageUrl', v)}
                className={`w-full mb-4 ${currentTheme.borderClass} border shadow-sm ${isPoster ? 'flex-1 object-cover min-h-[500px]' : ''}`}
                context={`${data.articles['lead'].headline}. ${data.articles['lead'].subheadline || ''}. Foto giornalistica vintage`}
                autoHeight={!isPoster}
                filters={currentTheme.imageFilter}
                onAnalyze={(h, b) => {
                    updateArticle('lead', 'headline', h);
                    updateArticle('lead', 'content', b);
                }}
             />

             {!isPoster && (
                 <div className={`columns-2 ${columnRuleClass} ${currentTheme.bodyFont} text-sm text-justify leading-relaxed`}>
                    <EditableText value={data.articles['lead'].content} onChange={(v) => updateArticle('lead', 'content', v)} multiline={true} aiEnabled={!isPreviewMode} aiContext="Articolo principale" mode="body" />
                 </div>
             )}
          </article>

          {!isPoster && (
              <div className={`${currentTheme.borderClass} border-t-2 pt-4 mt-2`}>
                  <RenderBlocks blocks={data.frontPageBlocks} onUpdate={(id,v)=>updateBlock('front',id,v)} onRemove={(id)=>removeBlock('front',id)} theme={currentTheme} isPreview={isPreviewMode} />
                  <AddBlockControls onAdd={(t)=>addBlock('front',t)} themeId={data.themeId} isPreview={isPreviewMode}/>
              </div>
          )}
        </div>

        {/* Sidebar (Hidden on Poster) */}
        {!isPoster && (
            <div className={`col-span-4 ${currentTheme.borderClass} border-l pl-4 flex flex-col gap-6`}>
                <div className={`${currentTheme.borderClass} border-2 p-3 bg-stone-200/50 text-stone-800`}>
                    <h3 className="font-sans font-bold uppercase text-sm border-b mb-2">In Questo Numero</h3>
                    <EditableText value={data.indexContent} onChange={(v)=>updateMeta('indexContent',v)} multiline={true} className="text-sm font-serif" aiEnabled={!isPreviewMode} aiContext="Sommario indice" mode="summary"/>
                </div>

                {data.eventType !== EventType.GENERIC && (
                    <div className="bg-yellow-50 border border-yellow-400 p-4 text-center text-stone-800">
                        <p className="text-[10px] uppercase font-bold tracking-widest">Protagonisti</p>
                        <div className="font-playfair font-black text-xl">{data.eventConfig.heroName1}</div>
                        {data.eventConfig.heroName2 && <div className="font-playfair font-black text-xl">& {data.eventConfig.heroName2}</div>}
                    </div>
                )}

                <article>
                    <EditableText value={data.articles['sidebar'].headline} onChange={(v)=>updateArticle('sidebar','headline',v)} className={`${currentTheme.headlineFont} text-2xl font-bold mb-2`} aiEnabled={!isPreviewMode} aiContext="Titolo spalla" mode="headline" />
                    <EditableText value={data.articles['sidebar'].content} onChange={(v)=>updateArticle('sidebar','content',v)} multiline={true} className="text-xs text-justify" aiEnabled={!isPreviewMode} aiContext="Articolo spalla" mode="body"/>
                </article>

                <div className="mt-4 border-t pt-4">
                    <RenderBlocks blocks={data.sidebarBlocks} onUpdate={(id,v)=>updateBlock('sidebar',id,v)} onRemove={(id)=>removeBlock('sidebar',id)} theme={currentTheme} isSidebar={true} isPreview={isPreviewMode} />
                    <AddBlockControls onAdd={(t)=>addBlock('sidebar',t)} isSidebar={true} themeId={data.themeId} isPreview={isPreviewMode} />
                </div>
            </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 text-xs font-bold">Pagina 1</div>
    </div>
    );
  };

  const renderInternalPage = (blocks: ContentBlock[], pn: number, sid: string, side: 'left'|'right') => (
    <div className={`w-full ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative print:w-full shadow-xl print:shadow-none print:break-after-page group/page ${currentTheme.textClass} flex flex-col`} style={customPageStyle}>
       <h3 className="text-xs uppercase font-bold text-stone-400 mb-4 border-b pb-2 flex-shrink-0">Pagina Interna</h3>
       
       <div className="flex-1 overflow-hidden flex flex-col">
       {blocks.some(b => b.content === 'CROSSWORD_PLACEHOLDER') ? (
            <>
                 {blocks.map((block, index) => {
                     if (block.content === 'CROSSWORD_PLACEHOLDER') {
                         return (
                             <div key={block.id} className="relative mb-4 group animate-fade-in-up">
                                {!isPreviewMode && <button onClick={() => removeBlockInSpread(sid, side, block.id)} className="absolute -left-8 top-0 p-1 text-red-400 hover:text-red-600 hidden group-hover:block print:hidden bg-white rounded-full shadow-sm border z-20"><Trash2 size={14}/></button>}
                                <CrosswordGrid />
                             </div>
                         )
                     }
                     return (
                        <div key={block.id} className="group relative mb-4 animate-fade-in-up">
                            {!isPreviewMode && <button onClick={() => removeBlockInSpread(sid, side, block.id)} className="absolute -left-8 top-0 p-1 text-red-400 hover:text-red-600 hidden group-hover:block print:hidden bg-white rounded-full shadow-sm border z-20"><Trash2 size={14}/></button>}
                            {block.type === 'headline' && <EditableText value={block.content} onChange={(v)=>updateBlockInSpread(sid,side,block.id,v)} className={`${currentTheme.headlineFont} text-2xl font-bold leading-tight my-2`} aiEnabled={!isPreviewMode} mode="headline" />}
                            {block.type === 'paragraph' && <EditableText value={block.content} onChange={(v)=>updateBlockInSpread(sid,side,block.id,v)} multiline={true} className={`${currentTheme.bodyFont} text-sm text-justify leading-relaxed`} aiEnabled={!isPreviewMode} mode="body" />}
                            {block.type === 'image' && <ImageSpot src={block.content} onChange={(v)=>updateBlockInSpread(sid,side,block.id,v)} className={`w-full my-4 ${currentTheme.borderClass} border`} autoHeight={true} filters={currentTheme.imageFilter} />}
                        </div>
                     )
                 })}
            </>
       ) : (
           <RenderBlocks blocks={blocks} onUpdate={(id,v)=>updateBlockInSpread(sid,side,id,v)} onRemove={(id)=>removeBlockInSpread(sid,side,id)} theme={currentTheme} isPreview={isPreviewMode} />
       )}
        <div className="mt-auto">
             <AddBlockControls onAdd={(t)=>addBlockToSpread(sid,side,t)} themeId={data.themeId} isPreview={isPreviewMode}/>
        </div>
       </div>

       <div className="mt-4 text-center text-xs font-bold flex-shrink-0">Pagina {pn}</div>
    </div>
  );

  const renderBackPage = (wrapperClass: string) => {
    const ruleColor = data.themeId === 'digital' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    const columnRuleClass = `gap-6 [column-rule:1px_solid_${ruleColor}]`;

    return (
     <div className={`${wrapperClass} ${pageHeightClass} ${!isDigital ? currentTheme.bgClass : ''} p-8 lg:p-12 relative ${currentTheme.textClass}`} style={customPageStyle}>
        {data.themeId !== 'modern' && data.themeId !== 'digital' && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        )}
        <header className={`${currentTheme.borderClass} border-b-2 pb-2 mb-6 flex justify-between items-end`}>
            <h2 className={`${currentTheme.headlineFont} text-4xl font-bold uppercase`}>Ultima Pagina</h2>
        </header>
        <article className="border-b pb-6 mb-6">
            <ImageSpot 
                src={data.articles['backMain'].imageUrl} onChange={(v)=>updateArticle('backMain','imageUrl',v)} 
                className={`w-full mb-4`} autoHeight={true} filters={currentTheme.imageFilter} 
                context={`${data.articles['backMain'].headline}. Stile copertina rivista magazine vintage.`}
                onAnalyze={(h, b) => {
                    updateArticle('backMain', 'headline', h);
                    updateArticle('backMain', 'content', b);
                }}
            />
            <EditableText value={data.articles['backMain'].headline} onChange={(v)=>updateArticle('backMain','headline',v)} className={`${currentTheme.headlineFont} text-5xl font-black italic uppercase leading-none mb-3`} aiEnabled={!isPreviewMode} aiContext="Titolo ultima pagina" mode="headline" />
            <EditableText value={data.articles['backMain'].content} onChange={(v)=>updateArticle('backMain','content',v)} multiline={true} className={`columns-2 ${columnRuleClass} text-sm text-justify`} aiEnabled={!isPreviewMode} aiContext="Articolo ultima pagina" mode="body"/>
        </article>
        <div className="grid grid-cols-2 gap-8 mt-auto">
            <div className={`border ${currentTheme.borderClass} p-4`}>
                <h3 className="uppercase font-bold text-sm mb-2">Meteo</h3>
                <EditableText value={data.articles['weather'].content} onChange={(v)=>updateArticle('weather','content',v)} multiline={true} className="font-serif text-sm" aiEnabled={!isPreviewMode} aiContext="Previsioni meteo" mode="body"/>
            </div>
            <div className={`border ${currentTheme.borderClass} p-4 text-center`}>
                 <h3 className="uppercase font-bold text-sm mb-2">Vignetta / Dedica</h3>
                 <ImageSpot 
                    src={data.articles['comic'].imageUrl} onChange={(v)=>updateArticle('comic','imageUrl',v)} 
                    className="w-full" autoHeight={true} filters={currentTheme.imageFilter} 
                    context={`${data.articles['comic'].headline}. ${data.articles['comic'].content}. Stile fumetto disegnato a mano bianco e nero con nuvolette.`}
                 />
                 <EditableText value={data.articles['comic'].content} onChange={(v)=>updateArticle('comic','content',v)} className="text-xs italic mt-2" aiEnabled={!isPreviewMode} aiContext="Didascalia vignetta" mode="headline"/>
            </div>
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-bold">Ultima Pagina</div>
     </div>
    );
  };

  // --- PRINT PREVIEW COMPONENT ---
  const PrintPreviewOverlay = () => (
      <div className="fixed inset-0 bg-stone-900 z-[1000] overflow-y-auto flex flex-col items-center p-8 print:bg-white print:p-0 print:block print:relative">
          {/* Preview Header */}
          <div className="w-full max-w-6xl flex justify-between items-center mb-8 text-white print:hidden">
              <div className="flex items-center gap-3">
                  <Eye size={24} className="text-green-400"/>
                  <h2 className="text-2xl font-bold uppercase tracking-wider">Anteprima di Stampa (Formato Booklet A3/A4)</h2>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => setIsPreviewMode(false)} className="bg-stone-700 hover:bg-stone-600 text-white px-6 py-3 rounded-full font-bold uppercase flex items-center gap-2">
                      <ArrowLeft size={18}/> Torna all'Editor
                  </button>
                  
                  {/* DISTINCT PRINT ACTIONS */}
                  <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold uppercase shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                      <FileDown size={20}/> CREA E SALVA PDF
                  </button>

                  <button 
                    onClick={() => window.print()} 
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-bold uppercase shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                      <Printer size={20}/> STAMPA SU CARTA
                  </button>
              </div>
          </div>

          <div className="text-white mb-4 print:hidden bg-blue-900/50 p-4 rounded-lg max-w-3xl text-center">
              <p className="font-bold">MODALITÀ FOGLIO PIEGATO:</p>
              <p className="text-sm opacity-80">Per creare un vero giornale: Stampa su A3 Fronte/Retro (Lato Corto). <br/>Foglio 1: Esterno (Ultima + Prima). Foglio 2: Interno (Pag 2 + Pag 3).</p>
          </div>

          {/* SHEET 1: OUTER SPREAD (BACK PAGE + FRONT PAGE) */}
          <div className="flex flex-col lg:flex-row bg-white shadow-2xl mb-12 print:shadow-none print:mb-0 print:w-full print:break-after-page">
             <div className="w-[800px] border-r border-dashed border-stone-300 print:w-1/2 print:border-none">
                {renderBackPage('w-full')}
             </div>
             <div className="w-[800px] print:w-1/2">
                {renderFrontPage('w-full')}
             </div>
          </div>

          {/* SHEET 2: INNER SPREAD (PAGE 2 + PAGE 3) */}
          {data.extraSpreads.map(spread => (
              <div key={spread.id} className="flex flex-col lg:flex-row bg-white shadow-2xl mb-12 print:shadow-none print:mb-0 print:w-full print:break-before-page print:break-after-page">
                  <div className="w-[800px] border-r border-dashed border-stone-300 print:w-1/2 print:border-none">
                    {renderInternalPage(spread.leftBlocks, spread.pageNumberLeft, spread.id, 'left')}
                  </div>
                  <div className="w-[800px] print:w-1/2">
                    {renderInternalPage(spread.rightBlocks, spread.pageNumberRight, spread.id, 'right')}
                  </div>
              </div>
          ))}
      </div>
  );

  if (showWelcomeScreen && !localStorage.getItem('newspaper_data')) {
    return (
      <>
        <input id="hidden-file-input" type="file" accept=".json" className="hidden" onChange={handleImportState} />
        <WelcomeScreen 
          hasSavedData={false} 
          onContinue={() => setShowWelcomeScreen(false)} 
          onNew={() => { handleConfirmReset(); setShowWelcomeScreen(false); }} 
          onLoad={() => { (document.getElementById('hidden-file-input') as HTMLInputElement)?.click(); }}
        />
      </>
    );
  }

  if (showWelcomeScreen && localStorage.getItem('newspaper_data')) {
      return (
        <>
        <input id="hidden-file-input" type="file" accept=".json" className="hidden" onChange={handleImportState} />
        <WelcomeScreen 
          hasSavedData={true} 
          onContinue={() => setShowWelcomeScreen(false)} 
          onNew={() => { handleConfirmReset(); setShowWelcomeScreen(false); }} 
          onLoad={() => { (document.getElementById('hidden-file-input') as HTMLInputElement)?.click(); }}
        />
        </>
      );
  }

  if (isPreviewMode) {
      return <PrintPreviewOverlay />;
  }

  return (
    <div className="min-h-screen bg-stone-800 p-4 lg:p-8 font-sans text-stone-900">
      
      {/* TOOLBAR */}
      <nav className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg p-3 mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden relative z-50">
        {/* LEFT: LOGO & TITLE */}
        <div className="flex items-center gap-3 mr-4">
          {appConfig.logo && <img src={appConfig.logo} alt="Logo" className="h-10 w-auto object-contain" />}
          <div className="text-xl font-bold text-stone-800 tracking-tight">
            <EditableText value={appConfig.title} onChange={(v) => setAppConfig(prev => ({ ...prev, title: v }))} aiEnabled={false} />
          </div>
          <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full" title="Carica Logo">
              <Upload size={16} className="text-gray-500"/>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
          </label>
          <button onClick={() => setShowHelpDialog(true)} className="bg-stone-200 hover:bg-stone-300 p-2 rounded-full text-stone-700" title="Guida ai Salvataggi"><HelpCircle size={18}/></button>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap flex-1 justify-end">
            {/* GROUP 1: FILE MANAGEMENT */}
            <div className="flex items-center gap-2 bg-stone-100 border border-stone-300 p-1.5 rounded-xl mr-2 shadow-sm">
                <div className="text-[10px] font-bold text-stone-400 uppercase px-2">File</div>
                <button onClick={() => setShowResetDialog(true)} className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs border border-stone-200" title="Inizia un nuovo progetto vuoto">
                    <FilePlus size={14}/> NUOVO PROGETTO
                </button>
                
                <div className="w-px h-6 bg-stone-300"></div>

                <button onClick={openSaveDialog} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm" title="Salva progetto corrente">
                    <Save size={14}/> SALVA PROGETTO
                </button>
                <label className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-lg font-bold text-xs border border-stone-200 cursor-pointer" title="Carica progetto salvato">
                    <FolderOpen size={14}/> CARICA PROGETTO
                    <input type="file" accept=".json" className="hidden" onChange={handleImportState}/>
                </label>
            </div>

           {/* GROUP 2: CONFIGURATION */}
           <div className="flex items-center gap-2 bg-white border border-stone-200 p-1.5 rounded-xl shadow-sm">
               {/* Event Selector */}
               <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-50">
                  <Sparkles size={14} className="text-purple-600"/>
                  <select 
                    className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-stone-700"
                    value={data.eventType}
                    onChange={handleEventTypeChange}
                  >
                      <option value={EventType.GENERIC}>Generico</option>
                      <option value={EventType.BIRTHDAY}>Compleanno</option>
                      <option value={EventType.EIGHTEEN}>18 Anni</option>
                      <option value={EventType.WEDDING}>Matrimonio</option>
                      <option value={EventType.BAPTISM}>Battesimo</option>
                      <option value={EventType.COMMUNION}>Comunione</option>
                      <option value={EventType.GRADUATION}>Laurea</option>
                      <option value={EventType.CHRISTMAS}>Natale</option>
                      <option value={EventType.EASTER}>Pasqua</option>
                  </select>
               </div>

               <div className="w-px h-6 bg-stone-200"></div>

               {/* Format Selector */}
               <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-50">
                  <LayoutTemplate size={14} className="text-blue-600"/>
                  <select 
                    className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-stone-700"
                    value={data.formatType}
                    onChange={(e) => setData(prev => ({ ...prev, formatType: e.target.value as FormatType }))}
                  >
                      <option value={FormatType.NEWSPAPER}>Giornale</option>
                      <option value={FormatType.POSTER}>Poster</option>
                      <option value={FormatType.CARD}>Biglietto</option>
                  </select>
               </div>

               <div className="w-px h-6 bg-stone-200"></div>

               {/* Theme Selector */}
               <select 
                className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-stone-700 px-2"
                value={data.themeId}
                onChange={(e) => updateTheme(e.target.value as ThemeId)}
              >
                {Object.values(THEMES).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>

               {isDigital && (
                <>
                    <div className="w-px h-6 bg-stone-200"></div>
                    <label className="flex items-center justify-center w-6 h-6 cursor-pointer hover:bg-stone-100 rounded">
                         <input type="color" value={data.customBgColor || '#0f172a'} onChange={(e) => updateMeta('customBgColor', e.target.value)} className="w-4 h-4 rounded-full border-0 p-0 overflow-hidden cursor-pointer"/>
                    </label>
                </>
               )}
           </div>

           {/* GROUP 3: ACTIONS */}
          <div className="flex items-center gap-2 ml-2">
               {/* PREVIEW BUTTON */}
               <button onClick={() => setIsPreviewMode(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md animate-pulse border-2 border-green-400" title="Anteprima PDF">
                  <Eye size={18} /> <span>ANTEPRIMA STAMPA</span>
               </button>

              <button onClick={() => setShowWidgetLibrary(!showWidgetLibrary)} className={`p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-colors border ${showWidgetLibrary ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`} title="Apri Strillone & Widget">
                  <Megaphone size={16} /> <span className="hidden lg:inline">Strillone & Widget</span>
              </button>
              <button onClick={handleEmailClick} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-md"><Mail size={16} /> <span className="hidden lg:inline">Invia PDF</span></button>
          </div>
        </div>
      </nav>
      
      {/* EVENT CONFIGURATION WIZARD */}
      {data.eventType !== EventType.GENERIC ? (
          <div className="max-w-[1600px] mx-auto mb-8 bg-white border-l-4 border-purple-500 rounded-r-xl p-6 shadow-lg print:hidden flex flex-wrap items-end gap-6 animate-fade-in-up">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xl w-full border-b pb-2 mb-2">
                  {data.eventType === EventType.WEDDING && <Heart className="text-red-500"/>}
                  {data.eventType === EventType.GRADUATION && <GraduationCap/>}
                  {data.eventType === EventType.BAPTISM && <Baby/>}
                  {data.eventType === EventType.EIGHTEEN && <Crown/>}
                  {data.eventType === EventType.CHRISTMAS && <Snowflake className="text-blue-400"/>}
                  {data.eventType === EventType.EASTER && <Sun className="text-yellow-500"/>}
                  {data.eventType === EventType.BIRTHDAY && <Cake className="text-pink-500"/>}
                  Configurazione {data.eventType}
              </div>
              
              {/* DYNAMIC FORM FIELDS */}
              <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">
                      {data.eventType === EventType.WEDDING ? 'Nome Sposo' : (data.eventType === EventType.GRADUATION ? 'Laureando/a' : 'Nome / Famiglia')}
                  </label>
                  <input type="text" className="border rounded px-3 py-2 text-sm bg-stone-50 w-40" value={data.eventConfig.heroName1} onChange={(e) => updateEventConfig('heroName1', e.target.value)} />
              </div>

              {data.eventType === EventType.WEDDING && (
                  <div className="flex flex-col">
                      <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">Nome Sposa</label>
                      <input type="text" className="border rounded px-3 py-2 text-sm bg-stone-50 w-40" value={data.eventConfig.heroName2 || ''} onChange={(e) => updateEventConfig('heroName2', e.target.value)} />
                  </div>
              )}

              {(data.eventType === EventType.BIRTHDAY || data.eventType === EventType.EIGHTEEN || data.eventType === EventType.GRADUATION || data.eventType === EventType.BAPTISM) && (
                   <div className="flex flex-col">
                      <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">Genere</label>
                      <select className="border rounded px-3 py-2 text-sm bg-stone-50" value={data.eventConfig.gender} onChange={(e) => updateEventConfig('gender', e.target.value)}>
                          <option value="M">Maschio</option>
                          <option value="F">Femmina</option>
                      </select>
                   </div>
              )}

              <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">Data Evento / Nascita</label>
                  <input type="date" className="border rounded px-3 py-2 text-sm bg-stone-50" value={data.eventConfig.date} onChange={(e) => updateEventConfig('date', e.target.value)} />
              </div>

              {data.eventType === EventType.WEDDING && (
                  <div className="flex flex-col">
                      <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">Luogo</label>
                      <input type="text" className="border rounded px-3 py-2 text-sm bg-stone-50" value={data.eventConfig.location || ''} onChange={(e) => updateEventConfig('location', e.target.value)} placeholder="Es. Roma"/>
                  </div>
              )}

               <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase text-stone-500 mb-1">Auguri Da</label>
                  <input type="text" className="border rounded px-3 py-2 text-sm bg-stone-50 w-40" value={data.eventConfig.wishesFrom || ''} onChange={(e) => updateEventConfig('wishesFrom', e.target.value)} placeholder="Es. Mamma e Papà"/>
              </div>
              
              <button 
                  onClick={handleApplyEventConfig}
                  disabled={isUpdatingEvent}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg ml-auto transition-transform active:scale-95"
              >
                  {isUpdatingEvent ? <Loader2 size={18} className="animate-spin"/> : <Check size={18} />} 
                  {isUpdatingEvent ? "Generazione Magica..." : "Applica Configurazione"}
              </button>
          </div>
      ) : (
          /* GENERIC MODE CTA */
          <div className="max-w-[1600px] mx-auto mb-8 flex justify-center print:hidden">
               <button 
                 onClick={() => setData(prev => ({ ...prev, eventType: EventType.BIRTHDAY, themeId: 'birthday' }))}
                 className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
               >
                  <Wand2 size={24} className="text-yellow-300" />
                  <span>Personalizza per un Evento (Compleanno, Matrimonio...)</span>
               </button>
          </div>
      )}

      {/* MAIN NEWSPAPER AREA (Visible only when NOT in preview mode for editing) */}
      <div className="max-w-[1600px] mx-auto shadow-2xl print:shadow-none transition-all duration-500 relative">
        {/* FORMAT LOGIC */}
        {isPoster ? (
             <div className="w-full bg-white print:w-full">
                 {renderFrontPage('w-full')}
             </div>
        ) : isCard ? (
            <div className="flex flex-col lg:flex-row bg-[#f0f0f0] print:flex-row print:w-full">
               {renderFrontPage('w-full lg:w-1/2 lg:border-r border-dashed border-stone-400')}
               {renderBackPage('w-full lg:w-1/2')}
             </div>
        ) : (
            isDigital ? (
              <div className="flex flex-col gap-8 print:block print:gap-0">
                 {renderFrontPage('w-full shadow-xl print:shadow-none print:break-after-page')}
                 {data.extraSpreads.map((spread) => (
                   <React.Fragment key={spread.id}>
                     {renderInternalPage(spread.leftBlocks, spread.pageNumberLeft, spread.id, 'left')}
                     {renderInternalPage(spread.rightBlocks, spread.pageNumberRight, spread.id, 'right')}
                   </React.Fragment>
                 ))}
                 {renderBackPage('w-full shadow-xl print:shadow-none print:break-after-page')}
                 <div className="flex justify-center py-8 print:hidden">
                    <button onClick={addSpread} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-xl font-bold transition-transform hover:scale-105">
                      <PlusCircle size={20} /> Aggiungi Pagine
                    </button>
                 </div>
              </div>
            ) : (
              <>
                 <div className={`flex flex-col lg:flex-row ${data.themeId !== 'modern' ? 'bg-[#f0f0f0]' : 'bg-white'} print:flex-row print:break-after-page`}>
                   {renderFrontPage('w-full lg:w-1/2')}
                   {renderBackPage('w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-stone-400 border-dashed')}
                 </div>
                 {data.extraSpreads.length > 0 && (
                   <div className="flex flex-col lg:flex-row bg-[#e8dcc6] print:flex-row mt-8 lg:mt-12 print:mt-0 border-t-8 border-stone-600 print:border-0">
                      {renderInternalPage(data.extraSpreads[0].leftBlocks, 2, data.extraSpreads[0].id, 'left')}
                      <div className="hidden print:block absolute top-1/2 left-0 w-full border-t border-dashed border-black"></div> 
                      {renderInternalPage(data.extraSpreads[0].rightBlocks, 3, data.extraSpreads[0].id, 'right')}
                      <button 
                        onClick={() => removeSpread(data.extraSpreads[0].id)} 
                        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full print:hidden shadow-lg hover:bg-red-700"
                        title="Rimuovi Inserto"
                      >
                          <Trash2 size={20}/>
                      </button>
                   </div>
                 )}
                 {data.extraSpreads.length === 0 && data.formatType === FormatType.NEWSPAPER && (
                     <div className="flex justify-center py-8 print:hidden">
                        <button onClick={addSpread} className="flex items-center gap-2 bg-stone-700 hover:bg-stone-900 text-white px-6 py-3 rounded-full shadow-xl font-bold transition-transform hover:scale-105">
                          <BookOpen size={20} /> Aggiungi Inserto Centrale (+2 Pagine)
                        </button>
                     </div>
                 )}
              </>
            )
        )}
        
        {/* TASK 1: GLOBAL WIDGET LAYER (Integrated here) */}
        <WidgetLayer 
           widgets={data.widgets || []} 
           setWidgets={setWidgets} 
           selectedId={selectedWidgetId} 
           setSelectedId={setSelectedWidgetId} 
        />
      </div>

      {/* TASK 1: WIDGET LIBRARY (Replaces StrilloneWidget) */}
      <WidgetLibrary 
          isOpen={showWidgetLibrary} 
          onClose={() => setShowWidgetLibrary(false)} 
          onAddWidget={handleAddWidget} 
      />
      
      {/* Floating Action Button for Widgets */}
      <button onClick={() => setShowWidgetLibrary(!showWidgetLibrary)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform hover:scale-110 z-[9999] border-4 border-white print:hidden" title="Apri Strillone & Widget"><Megaphone size={24} /></button>

      {/* SAVE BACKUP DIALOG */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowSaveDialog(false)}>
          <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 border-orange-500" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-orange-600">
              <Save size={20}/> Salva Backup Progetto
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Dai un nome al tuo file di salvataggio. Potrai ricaricarlo in futuro per recuperare tutti i contenuti.
            </p>
            
            <label className="text-xs font-bold uppercase text-stone-500 mb-1 block">Nome File</label>
            <input 
              type="text" 
              value={backupFilename} 
              onChange={(e) => setBackupFilename(e.target.value)} 
              className="w-full bg-stone-50 border border-stone-300 p-3 rounded-lg mb-6 font-medium outline-none focus:ring-2 focus:ring-orange-400"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
            />
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-stone-500 font-bold text-xs uppercase hover:bg-stone-100 rounded">Annulla</button>
              <button onClick={handleConfirmSave} className="px-6 py-2 bg-orange-600 text-white font-bold text-xs uppercase rounded hover:bg-orange-700 shadow-lg">
                Scarica File .JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PROJECT DIALOG */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowResetDialog(false)}>
          <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 border-red-500" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-red-600">
              <AlertTriangle size={24}/> Nuovo Progetto?
            </h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-900 mb-6">
               <p className="font-bold mb-2">ATTENZIONE:</p>
               <p>Tutte le modifiche non salvate andranno perse. Il giornale verrà riportato allo stato iniziale.</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResetDialog(false)} className="px-4 py-2 text-stone-500 font-bold text-xs uppercase hover:bg-stone-100 rounded">Annulla</button>
              <button onClick={handleConfirmReset} className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase rounded hover:bg-red-700 shadow-lg">
                Conferma Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal (CLEANED UP) */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowEmailDialog(false)}>
          <div className="bg-white text-stone-900 p-8 rounded-xl shadow-2xl max-w-md w-full border-2 border-stone-800" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-6 border-b pb-4">
               <h3 className="text-xl font-bold uppercase flex items-center gap-2"><Mail size={24} className="text-blue-600" /> Scrivi Email</h3>
               <button onClick={() => setShowEmailDialog(false)}><X size={24} /></button>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6 text-sm text-yellow-800 flex items-start gap-3">
               <AlertTriangle size={24} className="shrink-0 text-yellow-600"/>
               <div>
                   <p className="font-bold mb-1">HAI GIÀ IL PDF?</p>
                   <p>Ricordati di allegare manualmente il file che hai salvato dall'<strong>Anteprima di Stampa</strong>.</p>
               </div>
            </div>
            
            <div className="space-y-2">
                <button onClick={() => {
                    const subject = encodeURIComponent(`Giornale: ${data.publicationName}`);
                    const body = encodeURIComponent(`Ciao,\n\necco in allegato il file del giornale.\n\nISTRUZIONI PER LA STAMPA:\n1. Formato Carta: A3 (o A4)\n2. Orientamento: Orizzontale\n3. Fronte/Retro: Sì (Lato Corto / Short Edge)\n4. Scala: Adatta al foglio\n\n(Allega qui il PDF salvato)`);
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
                    window.open(gmailUrl, '_blank');
                    setShowEmailDialog(false);
                }} className="w-full bg-red-600 hover:bg-red-700 text-white p-3 font-bold uppercase rounded mb-2 flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform">
                   <Mail size={18}/> USA GMAIL (Web)
                </button>

                <button onClick={() => {
                    const subject = encodeURIComponent(data.publicationName);
                    const body = encodeURIComponent(`Ecco il giornale allegato.\n\nISTRUZIONI STAMPA:\n- A3 Orizzontale\n- Fronte/Retro (Lato Corto)`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    setShowEmailDialog(false);
                }} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 font-bold uppercase rounded flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform">
                   <Mail size={18}/> OUTLOOK / APP
                </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP / EXPLANATION DIALOG */}
      {showHelpDialog && (
         <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowHelpDialog(false)}>
            <div className="bg-white text-stone-900 p-8 rounded-xl shadow-2xl max-w-lg w-full border-4 border-stone-800 relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowHelpDialog(false)} className="absolute top-4 right-4 hover:bg-red-100 rounded-full p-1 text-red-500"><X size={24}/></button>
                
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 border-b pb-4">
                   <HelpCircle size={32} className="text-purple-600"/> Guida ai Salvataggi
                </h3>

                <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="bg-orange-100 p-3 rounded-lg"><Save size={24} className="text-orange-600"/></div>
                        <div>
                            <h4 className="font-bold text-lg">1. Tasto "Salva Backup"</h4>
                            <p className="text-sm text-stone-600 leading-relaxed">Salva i tuoi <strong>CONTENUTI</strong> (Testi, Foto, Layout). Usa questo se vuoi continuare a lavorare su questo giornale domani.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="bg-blue-100 p-3 rounded-lg"><Download size={24} className="text-blue-600"/></div>
                        <div>
                            <h4 className="font-bold text-lg">2. Icona "Download App" (Browser)</h4>
                            <p className="text-sm text-stone-600 leading-relaxed">Installa l'applicazione sul tuo Desktop. Utile per aprirla senza browser, ma <strong>non salva il tuo lavoro</strong>.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="bg-stone-200 p-3 rounded-lg"><Github size={24} className="text-black"/></div>
                        <div>
                            <h4 className="font-bold text-lg">3. Tasto "Save to GitHub"</h4>
                            <p className="text-sm text-stone-600 leading-relaxed">Salva il <strong>CODICE SORGENTE</strong> (per programmatori). Usa questo se vuoi portare il progetto su GitHub per svilupparlo.</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={() => setShowHelpDialog(false)} className="bg-stone-900 text-white px-8 py-3 rounded-lg font-bold uppercase hover:scale-105 transition-transform">Ho Capito!</button>
                </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;
