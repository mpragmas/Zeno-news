'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useTrendingStories } from '@/lib/hooks/useStories';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { StoryCard } from '@/components/story/StoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function TrendingSection() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { language } = usePreferencesStore();
  const { data, isLoading } = useTrendingStories(language);

  const stories = data?.data?.slice(1, 5) || []; // skip first (that's the hero)

  return (
    <section className="px-4 lg:px-6 py-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-trending" />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {t('trending')}
          </h2>
        </div>
        <Link
          href={`/${locale}/explore`}
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {tCommon('seeAll')}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-64 shrink-0">
              <Skeleton className="aspect-video w-full rounded-xl mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <ScrollArea>
          <div className="flex gap-4 pb-2">
            {stories.map((story) => (
              <div key={story.id} className="w-64 shrink-0">
                <StoryCard story={story} variant="compact" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
}
