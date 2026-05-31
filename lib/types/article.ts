export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  summaryFr: string | null;
  summaryRw: string | null;
  originalLanguage: string;
  source: string;
  url: string;
  imageUrl: string | null;
  category: string | null;
  continent: string | null;
  region: string | null;
  country: string | null;
  publishedAt: string;
  createdAt: string;
}
