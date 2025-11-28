export enum ArticleType {
  LEAD = 'LEAD',
  SECONDARY = 'SECONDARY',
  SIDEBAR = 'SIDEBAR',
  BACK_PAGE_MAIN = 'BACK_PAGE_MAIN',
  WEATHER = 'WEATHER',
  COMIC = 'COMIC'
}

export interface ArticleData {
  id: string;
  type: ArticleType;
  headline: string;
  subheadline?: string;
  author: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  customHeight?: number;
}

export type BlockType = 'headline' | 'paragraph' | 'image';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  aiContext?: string;
  cols?: 1 | 2 | 3;
  style?: 'standard' | 'box' | 'quote';
  height?: number;
}

export interface ExtraSpread {
  id: string;
  pageNumberLeft: number;
  pageNumberRight: number;
  leftBlocks: ContentBlock[];
  rightBlocks: ContentBlock[];
}

export type ThemeId = 'classic' | 'modern' | 'vintage' | 'usa' | 'germany' | 'france' | 'italy' | 'digital' | 'birthday' | 'christmas' | 'easter';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  language: string;
  locale: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  titleFont: string;
  headlineFont: string;
  bodyFont: string;
  imageFilter: string;
  headerLayout: 'center' | 'left' | 'modern' | 'digital';
}

export enum EventType {
  GENERIC = 'GENERIC',
  BIRTHDAY = 'BIRTHDAY',
  EIGHTEEN = 'EIGHTEEN',
  WEDDING = 'WEDDING',
  BAPTISM = 'BAPTISM',
  COMMUNION = 'COMMUNION',
  GRADUATION = 'GRADUATION',
  CHRISTMAS = 'CHRISTMAS',
  EASTER = 'EASTER'
}

export enum FormatType {
  NEWSPAPER = 'NEWSPAPER',
  POSTER = 'POSTER',
  CARD = 'CARD'
}

export interface EventConfig {
  heroName1: string;
  heroName2?: string;
  gender: 'M' | 'F' | 'PLURAL';
  date: string;
  location?: string;
  age?: number;
  wishesFrom?: string;
}

export type WidgetType = 'mascot' | 'bubble' | 'sticker' | 'text' | 'qrcode';

export interface WidgetData {
  id: string;
  type: WidgetType;
  content: string;
  text?: string;
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    flipX?: boolean;
  };
}

export interface NewspaperData {
  projectLabel?: string; // <--- NUOVO CAMPO: Nome del salvataggio (diverso dalla testata)
  themeId: ThemeId;
  eventType: EventType;
  formatType: FormatType;
  publicationName: string;
  date: string;
  issueNumber: string;
  price: string;
  articles: Record<string, ArticleData>;
  frontPageBlocks: ContentBlock[];
  backPageBlocks: ContentBlock[];
  sidebarBlocks: ContentBlock[];
  indexContent: string;
  extraSpreads: ExtraSpread[];
  customBgColor?: string;
  eventConfig: EventConfig;
  widgets: WidgetData[];
}
