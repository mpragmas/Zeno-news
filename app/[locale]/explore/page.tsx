'use client';

import { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearch } from '@/lib/hooks/useSearch';
import { usePreferencesStore } from '@/lib/stores/preferences.store';

export default function ExplorePage() {
  const t = useTranslations('explore');
  const { language } = usePreferencesStore();

  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [lang, setLang] = useState('');

  const { query, setQuery, results, isLoading, totalResults } = useSearch({
    lang: (lang || language) as 'en' | 'fr' | 'rw',
    category,
    region,
  });

  function handleClearFilters() {
    setCategory('');
    setRegion('');
    setLang('');
  }

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-foreground mb-1">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">
          Discover stories from across Africa and the world
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <SearchFilters
        category={category}
        region={region}
        lang={lang}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
        onLangChange={setLang}
        onClear={handleClearFilters}
      />

      {/* Results */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        query={query}
        totalResults={totalResults}
      />
    </div>
  );
}
