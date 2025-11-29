import { ArticleData, ArticleType, EventType, FormatType, NewspaperData, ThemeId, ThemeConfig } from './types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // --- CLASSICI ---
  classic: { id: 'classic', label: 'Classico (B/N)', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fdfbf7]', textClass: 'text-stone-900', borderClass: 'border-black', titleFont: 'font-chomsky', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-125 sepia-[.15]', headerLayout: 'center' },
  italy: { id: 'italy', label: 'Italia (Corriere)', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fbf9f5]', textClass: 'text-neutral-900', borderClass: 'border-neutral-800', titleFont: 'font-playfair font-black tracking-tighter', headlineFont: 'font-merriweather font-bold', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-110', headerLayout: 'center' },
  vintage: { id: 'vintage', label: 'Vintage Antico', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#e8dcc6]', textClass: 'text-[#3e3024]', borderClass: 'border-[#5c4835]', titleFont: 'font-chomsky', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: 'sepia contrast-100 brightness-90 grayscale-[0.5]', headerLayout: 'center' },
  digital: { id: 'digital', label: 'Digitale Dinamico', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-slate-900 text-white', textClass: 'text-white', borderClass: 'border-slate-600', titleFont: 'font-oswald tracking-widest uppercase', headlineFont: 'font-oswald', bodyFont: 'font-roboto', imageFilter: '', headerLayout: 'digital' },
  modern: { id: 'modern', label: 'Moderno Color', language: 'Inglese', locale: 'en-US', bgClass: 'bg-white', textClass: 'text-slate-900', borderClass: 'border-blue-900', titleFont: 'font-oswald tracking-tighter', headlineFont: 'font-oswald', bodyFont: 'font-roboto', imageFilter: '', headerLayout: 'modern' },
  
  // --- ESTERI ---
  usa: { id: 'usa', label: 'USA (Times)', language: 'Inglese', locale: 'en-US', bgClass: 'bg-stone-50', textClass: 'text-black', borderClass: 'border-black', titleFont: 'font-chomsky', headlineFont: 'font-serif font-black', bodyFont: 'font-serif', imageFilter: 'grayscale contrast-150', headerLayout: 'center' },
  germany: { id: 'germany', label: 'Germania', language: 'Tedesco', locale: 'de-DE', bgClass: 'bg-[#e5e5e5]', textClass: 'text-black', borderClass: 'border-black', titleFont: 'font-unifraktur', headlineFont: 'font-playfair font-black', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-125', headerLayout: 'left' },
  france: { id: 'france', label: 'Francia', language: 'Francese', locale: 'fr-FR', bgClass: 'bg-[#fffbe6]', textClass: 'text-stone-800', borderClass: 'border-stone-800', titleFont: 'font-prata', headlineFont: 'font-prata', bodyFont: 'font-merriweather', imageFilter: 'grayscale-[0.8] sepia-[0.2] contrast-110', headerLayout: 'center' },

  // --- EVENTI SPECIALI (NUOVI!) ---
  birthday: { id: 'birthday', label: 'Compleanno', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fff5f5]', textClass: 'text-rose-900', borderClass: 'border-rose-400', titleFont: 'font-playfair font-black', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: '', headerLayout: 'center', decoration: 'confetti' },
  
  christmas: { id: 'christmas', label: 'Natale', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#f0fdf4]', textClass: 'text-red-900', borderClass: 'border-red-800', titleFont: 'font-chomsky text-red-800', headlineFont: 'font-playfair font-bold text-green-900', bodyFont: 'font-merriweather text-stone-900', imageFilter: 'contrast-110 brightness-105', headerLayout: 'center', decoration: 'snow' },
  
  easter: { id: 'easter', label: 'Pasqua', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fffbeb]', textClass: 'text-purple-800', borderClass: 'border-yellow-400', titleFont: 'font-dancing font-bold text-purple-700', headlineFont: 'font-playfair text-pink-600', bodyFont: 'font-merriweather text-stone-800', imageFilter: 'brightness-110 contrast-105 sepia-[0.2]', headerLayout: 'center' },
  
  halloween: { id: 'halloween', label: 'Halloween', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#2a1b3d]', textClass: 'text-orange-500', borderClass: 'border-orange-600', titleFont: 'font-creepster tracking-widest', headlineFont: 'font-oswald uppercase', bodyFont: 'font-roboto text-stone-300', imageFilter: 'grayscale contrast-125', headerLayout: 'center', decoration: 'spooky' },
  
  graduation: { id: 'graduation', label: 'Laurea', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-white', textClass: 'text-red-900', borderClass: 'border-red-700 border-double border-4', titleFont: 'font-playfair font-black uppercase', headlineFont: 'font-merriweather font-bold', bodyFont: 'font-merriweather', imageFilter: '', headerLayout: 'center', decoration: 'confetti' },
  
  wedding: { id: 'wedding', label: 'Matrimonio', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fafaf9]', textClass: 'text-stone-600', borderClass: 'border-stone-300', titleFont: 'font-greatvibes text-5xl', headlineFont: 'font-playfair italic', bodyFont: 'font-merriweather', imageFilter: 'sepia-[0.3] brightness-105', headerLayout: 'center', decoration: 'hearts' },
  
  baptism: { id: 'baptism', label: 'Battesimo/Nascita', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#eff6ff]', textClass: 'text-blue-400', borderClass: 'border-blue-200', titleFont: 'font-dancing font-bold', headlineFont: 'font-playfair', bodyFont: 'font-roboto', imageFilter: '', headerLayout: 'center' },
  
  communion: { id: 'communion', label: 'Comunione', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fffff0]', textClass: 'text-yellow-700', borderClass: 'border-yellow-300', titleFont: 'font-playfair font-black', headlineFont: 'font-merriweather', bodyFont: 'font-merriweather', imageFilter: '', headerLayout: 'center' }
};

export const INITIAL_ARTICLES: Record<string, ArticleData> = {
    'lead': { id: 'lead', type: ArticleType.LEAD, headline: "EVENTO SPECIALE", subheadline: "Una giornata indimenticabile da celebrare insieme", author: "La Redazione", content: "Oggi festeggiamo un momento unico. Scrivi qui il tuo articolo principale, racconta aneddoti divertenti o emozionanti. Clicca per modificare il testo e usa i widget per decorare.", imageUrl: "", imagePrompt: "Festa gioiosa vintage" },
    'sidebar': { id: 'sidebar', type: ArticleType.SIDEBAR, headline: "L'Angolo degli Auguri", author: "Amici & Parenti", content: "Spazio dedicato alle dediche veloci. 'Tanti auguri!', 'Siamo fieri di te!', 'Buona fortuna per il futuro!'." },
    'backMain': { id: 'backMain', type: ArticleType.BACK_PAGE_MAIN, headline: "I RICORDI PIÙ BELLI", author: "Album di Famiglia", content: "In questa sezione puoi inserire una foto del passato o un collage di momenti felici. Non dimenticare di aggiungere un QR Code per il video!", imageUrl: "", imagePrompt: "Foto ricordo famiglia" },
    'weather': { id: 'weather', type: ArticleType.WEATHER, headline: "Previsioni", author: "Meteo Felicità", content: "Prevista pioggia di abbracci e raffiche di baci per tutta la giornata." },
    'comic': { id: 'comic', type: ArticleType.COMIC, headline: "La Dedica", author: "Con Affetto", content: "Un pensiero speciale per te...", imageUrl: "" }
};

export const INITIAL_DATA: NewspaperData = {
  projectLabel: "Mio Progetto",
  themeId: 'classic', eventType: EventType.GENERIC, formatType: FormatType.NEWSPAPER, 
  publicationName: "IL CORRIERE DELLA FESTA", 
  date: new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), issueNumber: "Edizione Speciale", price: "Gratis", articles: INITIAL_ARTICLES,
  frontPageBlocks: [], backPageBlocks: [], sidebarBlocks: [], extraSpreads: [], indexContent: "- Cerimonia ... Pag. 2\n- Ricevimento ... Pag. 3\n- Sorprese ... Pag. 4", customBgColor: "#0f172a",
  eventConfig: { heroName1: "Nome", gender: 'M', date: new Date().toISOString().split('T')[0], wishesFrom: "Tutti noi" },
  widgets: [] 
};
