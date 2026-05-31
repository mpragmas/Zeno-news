'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, BookmarkCheck, Bookmark, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SourceTabs } from './SourceTabs';
import { CompareView } from './CompareView';
import { ReadingProgress } from './ReadingProgress';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { getRelativeTime, formatDate } from '@/lib/utils/date';
import { estimateReadingTime } from '@/lib/utils/reading';
import type { StoryDetail as StoryDetailType } from '@/lib/types/story';

const CATEGORY_COLORS: Record<string, string> = {
  politics: 'category-politics',
  technology: 'category-technology',
  sports: 'category-sports',
  business: 'category-business',
  health: 'category-health',
  entertainment: 'category-entertainment',
  general: 'category-general',
};

interface StoryDetailProps {
  story: StoryDetailType;
}

export function StoryDetail({ story }: StoryDetailProps) {
  const locale = useLocale();
  const { language } = usePreferencesStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarksStore();
  const t = useTranslations('story');
  const tCommon = useTranslations('common');

  const bookmarked = isBookmarked(story.id);
  const categoryKey = story.category?.toLowerCase() || 'general';
  const articles = story.articles || [];
  const totalReadingTime = articles.reduce(
    (sum, a) => sum + estimateReadingTime(a.content),
    0
  );

  return (
    <article className="max-w-2xl mx-auto px-4 py-6">
      <ReadingProgress />

      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {tCommon('backToHome')}
        </Link>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {story.category && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[categoryKey] || CATEGORY_COLORS.general}`}>
            {story.category}
          </span>
        )}
        {story.languages?.map((lang) => (
          <Badge key={lang} variant="outline" className="text-[10px]">
            {lang.toUpperCase()}
          </Badge>
        ))}
        <span className="text-xs text-muted-foreground">
          {getRelativeTime(story.latestPublishedAt, language)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(story.latestPublishedAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight font-serif text-balance mb-4">
        {story.canonicalTitle}
      </h1>

      {/* AI Summary */}
      {story.canonicalSummary && (
        <div className="mb-6 bg-primary/5 border-l-4 border-primary rounded-r-xl p-4">
          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
            {t('summary')}
          </p>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {story.canonicalSummary}
          </p>
        </div>
      )}

      {/* Hero image */}
      {story.imageUrl && (
        <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 bg-muted">
          <Image
            src={story.imageUrl}
            alt={story.canonicalTitle}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Story stats */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground border-y border-border py-3">
        <span>
          <strong className="text-foreground">{story.sourceCount}</strong>{' '}
          {story.sourceCount === 1 ? tCommon('source') : tCommon('sources')}
        </span>
        <span>
          <strong className="text-foreground">{totalReadingTime}</strong> {t('readingTime')}
        </span>
        {story.country && (
          <span className="flex items-center gap-1">
            <Globe2 className="h-3.5 w-3.5" />
            {story.country}
          </span>
        )}
      </div>

      {/* Compare + Bookmark actions */}
      <div className="flex items-center gap-3 mb-8">
        <CompareView articles={articles} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => (bookmarked ? removeBookmark(story.id) : addBookmark(story))}
          className="gap-2"
        >
          {bookmarked ? (
            <>
              <BookmarkCheck className="h-4 w-4 text-primary" />
              {tCommon('bookmarked')}
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              {tCommon('bookmark')}
            </>
          )}
        </Button>
      </div>

      {/* Source tabs with articles */}
      {articles.length > 0 ? (
        <SourceTabs articles={articles} />
      ) : (
        <p className="text-muted-foreground text-sm">{t('noSummary')}</p>
      )}
    </article>
  );
}
