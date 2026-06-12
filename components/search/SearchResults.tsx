'use client';

import { useTranslations } from 'next-intl';
import { StoryCard } from '@/components/story/StoryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Story } from '@/lib/types/story';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  results: Story[];
  isLoading: boolean;
  query: string;
  totalResults: number;
  /** Browse mode shows the latest stories before any query is typed. */
  browse?: boolean;
}

export function SearchResults({
  results,
  isLoading,
  query,
  totalResults,
  browse = false,
}: SearchResultsProps) {
  const t = useTranslations('search');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // No query typed yet and browse mode is off → invite the user to search.
  if (!query && !browse) {
    return (
      <EmptyState
        icon={Search}
        title={t('browseTitle')}
        description={t('browseDescription')}
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={t('noResults')}
        description={
          query
            ? `${t('tip')} — "${query.split(' ')[0]}"`
            : t('tip')
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {query ? (
          <>
            {t('resultsFor')}{' '}
            <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>{' '}
            — {totalResults.toLocaleString()}
          </>
        ) : (
          <>
            <strong className="text-foreground">{t('latestStories')}</strong>{' '}
            — {totalResults.toLocaleString()}
          </>
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
