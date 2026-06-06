'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStories } from '@/lib/api/stories';
import { trackSearch } from '@/lib/analytics/tracker';
import type { Lang } from '@/lib/types/api';

const RECENT_SEARCHES_KEY = 'newssummary-recent-searches';
const MAX_RECENT = 10;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearches().filter((s) => s !== query);
    const updated = [query, ...recent].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

interface UseSearchOptions {
  lang?: Lang;
  category?: string;
  region?: string;
  debounceMs?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { lang = 'en', category = '', region = '', debounceMs = 300 } = options;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery, lang, category, region],
    queryFn: () =>
      getStories({
        query: debouncedQuery,
        lang,
        category: category || undefined,
        region: region || undefined,
        limit: 20,
      }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 30,
  });

  // Record each completed search (with its result count) exactly once.
  const trackedQueryRef = useRef<string>('');
  useEffect(() => {
    if (
      debouncedQuery.length >= 2 &&
      !isFetching &&
      data &&
      trackedQueryRef.current !== debouncedQuery
    ) {
      trackedQueryRef.current = debouncedQuery;
      trackSearch({
        query: debouncedQuery,
        resultCount: data.meta?.total ?? data.data?.length ?? 0,
        language: lang,
      });
    }
  }, [debouncedQuery, isFetching, data, lang]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      saveRecentSearch(value);
      setRecentSearches(getRecentSearches());
    }
  }, []);

  const clearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  return {
    query,
    setQuery: handleSearch,
    results: data?.data || [],
    isLoading: isLoading || isFetching,
    recentSearches,
    clearRecent,
    hasResults: (data?.data?.length || 0) > 0,
    totalResults: data?.meta?.total || 0,
  };
}
