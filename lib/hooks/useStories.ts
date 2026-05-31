'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getStories } from '@/lib/api/stories';
import type { StoriesParams } from '@/lib/types/api';

export const STORIES_QUERY_KEY = 'stories';

export function useStoriesInfinite(params: Omit<StoriesParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [STORIES_QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getStories({ ...params, page: pageParam as number, limit: params.limit || 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useStories(params: StoriesParams = {}) {
  return useQuery({
    queryKey: [STORIES_QUERY_KEY, params],
    queryFn: () => getStories(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingStories(lang = 'en') {
  return useQuery({
    queryKey: [STORIES_QUERY_KEY, 'trending', lang],
    queryFn: () => getStories({ lang: lang as 'en' | 'fr' | 'rw', page: 1, limit: 5 }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useRwandaStories(lang = 'en') {
  return useQuery({
    queryKey: [STORIES_QUERY_KEY, 'rwanda', lang],
    queryFn: () => getStories({ lang: lang as 'en' | 'fr' | 'rw', country: 'Rwanda', page: 1, limit: 6 }),
    staleTime: 1000 * 60 * 5,
  });
}
