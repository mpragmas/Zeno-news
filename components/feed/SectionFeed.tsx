'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { useStories } from '@/lib/hooks/useStories';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { StoryCard } from '@/components/story/StoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { StoriesParams } from '@/lib/types/api';
import type { ReactNode } from 'react';

interface SectionFeedProps {
  title: string;
  /** Pass a rendered JSX element, e.g. <MapPin className="h-5 w-5 text-primary" /> */
  icon?: ReactNode;
  params: StoriesParams;
  seeAllHref?: string;
  columns?: 2 | 3;
  limit?: number;
}

export function SectionFeed({
  title,
  icon,
  params,
  seeAllHref,
  columns = 3,
  limit = 6,
}: SectionFeedProps) {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { language } = usePreferencesStore();

  const { data, isLoading } = useStories({ ...params, lang: language, limit });
  const stories = data?.data || [];

  return (
    <section className="px-4 lg:px-6 py-7 border-t border-border">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {tCommon('seeAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div
          className={`grid gap-4 ${
            columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <StorySkeleton key={i} />
          ))}
        </div>
      ) : stories.length > 0 ? (
        <div
          className={`grid gap-4 ${
            columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No stories found
        </p>
      )}
    </section>
  );
}

function StorySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
