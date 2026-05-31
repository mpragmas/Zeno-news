'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Clock, Layers } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getRelativeTime } from '@/lib/utils/date';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { StoryImage } from './StoryImage';
import type { Story } from '@/lib/types/story';

const CATEGORY_TEXT: Record<string, string> = {
  politics: 'text-violet-600 dark:text-violet-400',
  technology: 'text-sky-600 dark:text-sky-400',
  sports: 'text-emerald-600 dark:text-emerald-400',
  business: 'text-amber-600 dark:text-amber-400',
  health: 'text-rose-600 dark:text-rose-400',
  entertainment: 'text-pink-600 dark:text-pink-400',
  science: 'text-cyan-600 dark:text-cyan-400',
  general: 'text-primary',
};

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

export function StoryCard({ story, variant = 'default', className }: StoryCardProps) {
  const locale = useLocale();
  const { language } = usePreferencesStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarksStore();
  const t = useTranslations('common');

  const bookmarked = isBookmarked(story.id);
  const categoryKey = story.category?.toLowerCase() || 'general';
  const categoryText = CATEGORY_TEXT[categoryKey] || CATEGORY_TEXT.general;
  const primarySource = story.sources?.[0]?.source ?? null;

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) removeBookmark(story.id);
    else addBookmark(story);
  }

  const MetaRow = (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {story.category && (
        <span className={cn('eyebrow', categoryText)}>{story.category}</span>
      )}
      {story.category && <span className="text-border">·</span>}
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {getRelativeTime(story.latestPublishedAt, language)}
      </span>
      {story.sourceCount > 1 && (
        <>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {story.sourceCount} {t('sources')}
          </span>
        </>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <Link href={`/${locale}/story/${story.id}`} className="block h-full">
        <motion.div
          className={cn(
            'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-foreground/15 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]',
            className,
          )}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <StoryImage
            src={story.imageUrl}
            alt={story.canonicalTitle}
            seed={story.id}
            category={story.category}
            source={primarySource}
            className="aspect-[16/10] w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="flex flex-1 flex-col gap-2 p-3.5">
            {MetaRow}
            <h3 className="font-display text-[0.95rem] font-semibold leading-snug text-foreground line-clamp-3 transition-colors group-hover:text-primary">
              {story.canonicalTitle}
            </h3>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/story/${story.id}`} className="block h-full">
      <motion.div
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/15 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.3)]',
          className,
        )}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      >
        {/* Image */}
        <div className="relative">
          <StoryImage
            src={story.imageUrl}
            alt={story.canonicalTitle}
            seed={story.id}
            category={story.category}
            source={primarySource}
            className="aspect-[16/9] w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Bookmark button */}
          <motion.button
            onClick={handleBookmark}
            className={cn(
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors',
              bookmarked
                ? 'bg-primary text-white'
                : 'bg-black/30 text-white hover:bg-black/50',
            )}
            whileTap={{ scale: 0.88 }}
            aria-label={bookmarked ? t('bookmarked') : t('bookmark')}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </motion.button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {MetaRow}

          <h3 className="font-display text-xl font-semibold leading-tight text-foreground line-clamp-3 transition-colors group-hover:text-primary">
            {story.canonicalTitle}
          </h3>

          {story.canonicalSummary && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {story.canonicalSummary}
            </p>
          )}

          {/* Sources footer */}
          {story.sources && story.sources.length > 0 && (
            <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {story.sources.slice(0, 3).map((src) => (
                  <span
                    key={src.articleId}
                    className="max-w-[100px] truncate rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {src.source}
                  </span>
                ))}
                {story.sources.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{story.sources.length - 3}
                  </span>
                )}
              </div>
              {(story.country || story.region) && (
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {story.country || story.region}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
