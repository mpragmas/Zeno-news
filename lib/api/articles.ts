import { fetchApi } from './client';
import type { Article } from '@/lib/types/article';
import type { PaginatedResponse, ArticlesParams } from '@/lib/types/api';

export async function getArticles(params: ArticlesParams = {}): Promise<PaginatedResponse<Article>> {
  const searchParams = new URLSearchParams();
  if (params.lang) searchParams.set('lang', params.lang);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return fetchApi<PaginatedResponse<Article>>(`/articles${query ? `?${query}` : ''}`);
}

export async function getArticle(id: string, lang = 'en'): Promise<Article> {
  return fetchApi<Article>(`/articles/${id}?lang=${lang}`);
}

export async function getRelatedArticles(id: string, lang = 'en'): Promise<Article[]> {
  return fetchApi<Article[]>(`/articles/${id}/related?lang=${lang}`);
}
