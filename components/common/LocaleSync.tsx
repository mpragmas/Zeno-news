'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import type { Lang } from '@/lib/types/api';

/**
 * Keeps the client preferences `language` in sync with the URL locale.
 *
 * Client feeds (NewsFeed, TrendingSection, SectionFeed, BreakingTicker …)
 * fetch using `usePreferencesStore().language`. The LanguageSwitcher only
 * changes the URL locale, so without this the feeds would keep fetching the
 * previously stored language. Syncing here makes language switching actually
 * refetch every feed.
 */
export function LocaleSync() {
  const locale = useLocale() as Lang;
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const language = usePreferencesStore((s) => s.language);

  useEffect(() => {
    if (locale && locale !== language) {
      setLanguage(locale);
    }
  }, [locale, language, setLanguage]);

  return null;
}
