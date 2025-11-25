export interface ArticleData {
  id: string;
  type: ArticleType;
  headline: string;
  subheadline?: string;
  author: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  customHeight?: number; // <--- QUESTA È LA RIGA NUOVA FONDAMENTALE
}
