'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
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
}

export function SearchResults({ results, isLoading, query, totalResults }: SearchResultsProps) {
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

  if (!query) {
    return (
      <EmptyState
        icon={Search}
        title="Search news stories"
        description="Enter a keyword, topic, or source name to find stories from our database."
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={t('noResults')}
        description={`${t('tip')} — try "${query.split(' ')[0]}" or similar terms`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('resultsFor')}{' '}
        <strong className="text-foreground">"{query}"</strong>{' '}
        — {totalResults.toLocaleString()} stories
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
