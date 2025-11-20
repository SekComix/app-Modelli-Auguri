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
  imagePrompt?: string; // For AI generation context
}

export type BlockType = 'headline' | 'paragraph' | 'image';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content or Image URL
  aiContext?: string; // For regeneration
  // New layout properties
  cols?: 1 | 2 | 3; // Number of text columns
  style?: 'standard' | 'box' | 'quote'; // Visual style
}

export interface ExtraSpread {
  id: string;
  pageNumberLeft: number;
  pageNumberRight: number;
  leftBlocks: ContentBlock[];
  rightBlocks: ContentBlock[];
}

export type ThemeId = 'classic' | 'modern' | 'vintage' | 'usa' | 'germany' | 'france' | 'italy' | 'digital' | 'birthday' | 'christmas' | 'easter';

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
  heroName1: string; // Festeggiato, Sposo, Laureando
  heroName2?: string; // Sposa (opzionale)
  gender: 'M' | 'F' | 'PLURAL';
  date: string;
  location?: string;
  age?: number;
  wishesFrom?: string;
}

export interface NewspaperData {
  themeId: ThemeId;
  eventType: EventType;
  formatType: FormatType;
  publicationName: string;
  date: string;
  issueNumber: string;
  price: string;
  articles: Record<string, ArticleData>;
  // Standard fixed pages
  frontPageBlocks: ContentBlock[];
  backPageBlocks: ContentBlock[];
  sidebarBlocks: ContentBlock[];
  indexContent: string;
  // Dynamic middle pages
  extraSpreads: ExtraSpread[];
  // Customization
  customBgColor?: string; // Only for digital theme
  // Event Config
  eventConfig: EventConfig;
}