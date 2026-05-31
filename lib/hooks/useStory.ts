'use client';

import { useQuery } from '@tanstack/react-query';
import { getStory, getStorySources } from '@/lib/api/stories';

export const STORY_QUERY_KEY = 'story';

export function useStory(id: string, lang = 'en') {
  return useQuery({
    queryKey: [STORY_QUERY_KEY, id, lang],
    queryFn: () => getStory(id, lang),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id,
  });
}

export function useStorySources(id: string, lang = 'en') {
  return useQuery({
    queryKey: [STORY_QUERY_KEY, id, 'sources', lang],
    queryFn: () => getStorySources(id, lang),
    staleTime: 1000 * 60 * 10,
    enabled: !!id,
  });
}
