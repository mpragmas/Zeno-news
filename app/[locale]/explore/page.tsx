'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearch } from '@/lib/hooks/useSearch';
import { usePreferencesStore } from '@/lib/stores/preferences.store';

// The simplified region filter maps each choice to the backend geo column that
// actually stores that value (continent / country).
function resolveRegion(region: string): { continent?: string; country?: string } {
  switch (region) {
    case 'africa':
      return { continent: 'Africa' };
    case 'rwanda':
      return { country: 'Rwanda' };
    case 'global':
      return { continent: 'Global' };
    default:
      return {};
  }
}

export default function ExplorePage() {
  const t = useTranslations('explore');
  // Language is taken from the user's saved preference — no in-page language filter.
  const { language } = usePreferencesStore();

  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');

  const geo = useMemo(() => resolveRegion(region), [region]);

  const { query, setQuery, results, isLoading, totalResults } = useSearch({
    lang: language,
    category,
    continent: geo.continent,
    country: geo.country,
    browse: true,
  });

  function handleClearFilters() {
    setCategory('');
    setRegion('');
  }

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-foreground mb-1">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pl-9"
          aria-label={t('searchPlaceholder')}
        />
      </div>

      {/* Filters */}
      <SearchFilters
        category={category}
        region={region}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
        onClear={handleClearFilters}
      />

      {/* Results */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        query={query}
        totalResults={totalResults}
        browse
      />
    </div>
  );
}
