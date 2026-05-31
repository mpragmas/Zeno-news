import { fetchApi } from './client';
import type { Story, StoryDetail } from '@/lib/types/story';
import type { Article } from '@/lib/types/article';
import type { PaginatedResponse, StoriesParams } from '@/lib/types/api';

export async function getStories(params: StoriesParams = {}): Promise<PaginatedResponse<Story>> {
  const searchParams = new URLSearchParams();
  if (params.lang) searchParams.set('lang', params.lang);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.category) searchParams.set('category', params.category);
  if (params.country) searchParams.set('country', params.country);
  if (params.continent) searchParams.set('continent', params.continent);
  if (params.region) searchParams.set('region', params.region);
  if (params.query) searchParams.set('query', params.query);

  const query = searchParams.toString();
  return fetchApi<PaginatedResponse<Story>>(`/stories${query ? `?${query}` : ''}`);
}

export async function getStory(id: string, lang = 'en'): Promise<StoryDetail> {
  return fetchApi<StoryDetail>(`/stories/${id}?lang=${lang}`);
}

export async function getStorySources(id: string, lang = 'en'): Promise<Article[]> {
  return fetchApi<Article[]>(`/stories/${id}/sources?lang=${lang}`);
}
