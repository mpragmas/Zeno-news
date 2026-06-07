'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TrendingUp, Radio, ChevronRight } from 'lucide-react';
import { useTrendingStories } from '@/lib/hooks/useStories';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { getRelativeTime } from '@/lib/utils/date';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export function RightSidebar() {
  const t = useTranslations();
  const locale = useLocale();
  const { language } = usePreferencesStore();
  const { data: trending, isLoading } = useTrendingStories(language);

  const stories = trending?.data?.slice(0, 5) || [];

  return (
    <aside className="w-[300px] shrink-0">
      <ScrollArea className="h-[calc(100vh-4rem)] pr-1">
        <div className="space-y-6 py-4 pl-4">
          {/* Trending section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-trending" />
                <h2 className="text-sm font-semibold text-foreground">
                  {t('home.trending')}
                </h2>
              </div>
              <Link
                href={`/${locale}/explore`}
                className="text-xs text-primary hover:underline flex items-center gap-0.5"
              >
                {t('common.seeAll')}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TrendingItemSkeleton key={i} />
                  ))
                : stories.map((story, index) => (
                    <Link
                      key={story.id}
                      href={`/${locale}/story/${story.id}`}
                      className="flex gap-3 group items-start"
                    >
                      <span className="text-2xl font-black text-muted-foreground/30 leading-none mt-0.5 w-6 shrink-0 group-hover:text-primary transition-colors">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {story.canonicalTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(story.latestPublishedAt, language)}
                          </span>
                          {story.sourceCount > 1 && (
                            <span className="text-xs text-muted-foreground">
                              · {story.sourceCount} {t('common.sources')}
                            </span>
                          )}
                        </div>
                      </div>
                      {story.imageUrl && (
                        <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={story.imageUrl}
                            alt={story.canonicalTitle}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </Link>
                  ))}
            </div>
          </section>

          <Separator />

          {/* Quick category filters */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-primary" />
              Quick Filters
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'].map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/explore?category=${cat.toLowerCase()}`}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-accent hover:border-primary transition-colors text-muted-foreground hover:text-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          <Separator />

          {/* Language coverage */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">Language Coverage</h2>
            <div className="space-y-2">
              {[
                { lang: 'English', flag: '🇬🇧', code: 'en' },
                { lang: 'Français', flag: '🇫🇷', code: 'fr' },
                { lang: 'Kinyarwanda', flag: '🇷🇼', code: 'rw' },
              ].map(({ lang, flag, code }) => (
                <div key={code} className="flex items-center gap-2.5 text-sm">
                  <span className="text-base">{flag}</span>
                  <span className="text-muted-foreground">{lang}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                    {code.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}

function TrendingItemSkeleton() {
  return (
    <div className="flex gap-3 items-start">
      <Skeleton className="h-6 w-6 shrink-0" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
