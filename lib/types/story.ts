import type { Article } from './article';

export interface StorySourcePreview {
  articleId: string;
  source: string;
}

export interface Story {
  id: string;
  canonicalTitle: string;
  canonicalSummary: string | null;
  imageUrl: string | null;
  category: string | null;
  continent: string | null;
  region: string | null;
  country: string | null;
  language: string;
  sourceCount: number;
  articleCount: number;
  languages: string[];
  leadArticleId: string | null;
  sources: StorySourcePreview[];
  latestPublishedAt: string;
  createdAt: string;
}

export interface StoryDetail extends Story {
  articles: Article[];
}

export interface BookmarkedStory extends Story {
  bookmarkedAt: string;
  folderId?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  createdAt: string;
  count: number;
}
