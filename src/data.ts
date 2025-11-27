import { ArticleData, ArticleType, EventType, FormatType, NewspaperData, ThemeId, ThemeConfig } from './types';

// La definizione di ThemeConfig ora è in types.ts, qui la usiamo solo.

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: { id: 'classic', label: 'Classico (B/N)', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fdfbf7]', textClass: 'text-stone-900', borderClass: 'border-black', titleFont: 'font-chomsky', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-125 sepia-[.15]', headerLayout: 'center' },
  italy: { id: 'italy', label: 'Italia (Corriere)', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fbf9f5]', textClass: 'text-neutral-900', borderClass: 'border-neutral-800', titleFont: 'font-playfair font-black tracking-tighter', headlineFont: 'font-merriweather font-bold', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-110', headerLayout: 'center' },
  vintage: { id: 'vintage', label: 'Vintage Antico', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#e8dcc6]', textClass: 'text-[#3e3024]', borderClass: 'border-[#5c4835]', titleFont: 'font-chomsky', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: 'sepia contrast-100 brightness-90 grayscale-[0.5]', headerLayout: 'center' },
  birthday: { id: 'birthday', label: 'Stile Compleanno', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#e8dcc6]', textClass: 'text-[#3e3024]', borderClass: 'border-[#5c4835]', titleFont: 'font-playfair font-black tracking-tight', headlineFont: 'font-playfair', bodyFont: 'font-merriweather', imageFilter: 'sepia contrast-100 brightness-90 grayscale-[0.5]', headerLayout: 'center' },
  christmas: { id: 'christmas', label: 'Stile Natalizio', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#fdf2f2]', textClass: 'text-red-950', borderClass: 'border-green-900', titleFont: 'font-chomsky text-red-900', headlineFont: 'font-playfair font-bold text-green-900', bodyFont: 'font-merriweather text-stone-900', imageFilter: 'contrast-110 brightness-105 saturate-[0.8]', headerLayout: 'center' },
  easter: { id: 'easter', label: 'Stile Pasquale', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-[#ffffe0]', textClass: 'text-purple-900', borderClass: 'border-yellow-500', titleFont: 'font-playfair font-black text-purple-800', headlineFont: 'font-playfair text-pink-700', bodyFont: 'font-merriweather text-stone-800', imageFilter: 'brightness-110 contrast-105 sepia-[0.2]', headerLayout: 'center' },
  digital: { id: 'digital', label: 'Digitale Dinamico', language: 'Italiano', locale: 'it-IT', bgClass: 'bg-slate-900 text-white', textClass: 'text-white', borderClass: 'border-slate-600', titleFont: 'font-oswald tracking-widest uppercase', headlineFont: 'font-oswald', bodyFont: 'font-roboto', imageFilter: '', headerLayout: 'digital' },
  modern: { id: 'modern', label: 'Moderno Color', language: 'Inglese', locale: 'en-US', bgClass: 'bg-white', textClass: 'text-slate-900', borderClass: 'border-blue-900', titleFont: 'font-oswald tracking-tighter', headlineFont: 'font-oswald', bodyFont: 'font-roboto', imageFilter: '', headerLayout: 'modern' },
  usa: { id: 'usa', label: 'USA (Times)', language: 'Inglese', locale: 'en-US', bgClass: 'bg-stone-50', textClass: 'text-black', borderClass: 'border-black', titleFont: 'font-chomsky', headlineFont: 'font-serif font-black', bodyFont: 'font-serif', imageFilter: 'grayscale contrast-150', headerLayout: 'center' },
  germany: { id: 'germany', label: 'Germania', language: 'Tedesco', locale: 'de-DE', bgClass: 'bg-[#e5e5e5]', textClass: 'text-black', borderClass: 'border-black', titleFont: 'font-unifraktur', headlineFont: 'font-playfair font-black', bodyFont: 'font-merriweather', imageFilter: 'grayscale contrast-125', headerLayout: 'left' },
  france: { id: 'france', label: 'Francia', language: 'Francese', locale: 'fr-FR', bgClass: 'bg-[#fffbe6]', textClass: 'text-stone-800', borderClass: 'border-stone-800', titleFont: 'font-prata', headlineFont: 'font-prata', bodyFont: 'font-merriweather', imageFilter: 'grayscale-[0.8] sepia-[0.2] contrast-110', headerLayout: 'center' }
};

export const INITIAL_ARTICLES: Record<string, ArticleData> = {
    'lead': { id: 'lead', type: ArticleType.LEAD, headline: "EVENTO STORICO OGGI", subheadline: "I cittadini si riuniscono a migliaia mentre notizie senza precedenti arrivano in città", author: "Di Mario Rossi", content: "In una svolta di eventi che ha affascinato l'intera città, le autorità locali hanno annunciato questa mattina che il tanto atteso progetto è stato finalmente completato. La folla ha iniziato a radunarsi all'alba.\n\n\"È un giorno che racconteremo ai nostri nipoti\", ha osservato un passante.", imageUrl: "https://picsum.photos/800/600", imagePrompt: "Folla in strada anni 20 bianco e nero" },
    'sidebar': { id: 'sidebar', type: ArticleType.SIDEBAR, headline: "Notizia Curiosa", author: "Redazione", content: "Un evento insolito ha catturato l'attenzione del quartiere. I dettagli stanno ancora emergendo ma i residenti sono già in fermento." },
    'backMain': { id: 'backMain', type: ArticleType.BACK_PAGE_MAIN, headline: "GRANDE SUCCESSO", author: "Sport & Cultura", content: "Un risultato straordinario raggiunto dopo anni di duro lavoro. La celebrazione continuerà per tutta la settimana.", imageUrl: "https://picsum.photos/800/400", imagePrompt: "Celebrazione vittoria vintage" },
    'weather': { id: 'weather', type: ArticleType.WEATHER, headline: "Meteo", author: "Col. Giuliacci", content: "Cieli sereni e temperature miti previste per tutto il weekend." },
    'comic': { id: 'comic', type: ArticleType.COMIC, headline: "Vignetta", author: "Illustratore", content: "Una risata al giorno...", imageUrl: "" }
};

export const INITIAL_DATA: NewspaperData = {
  themeId: 'classic', eventType: EventType.GENERIC, formatType: FormatType.NEWSPAPER, 
  publicationName: "La Cronaca Quotidiana", 
  date: new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), issueNumber: "Vol. CXXIV No. 42", price: "€1.50", articles: INITIAL_ARTICLES,
  frontPageBlocks: [], backPageBlocks: [], sidebarBlocks: [], extraSpreads: [], indexContent: "- Esteri .......... Pag. 2\n- Economia ........ Pag. 4\n- Cruciverba ...... Pag. 11", customBgColor: "#0f172a",
  eventConfig: { heroName1: "Antonio", gender: 'M', date: '1965-11-18', age: 60, wishesFrom: "Barbara e Secondo" },
  widgets: [] 
};
