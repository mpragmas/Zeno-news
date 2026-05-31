'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Clock, Layers, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getRelativeTime } from '@/lib/utils/date';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { StoryImage } from './StoryImage';
import type { Story } from '@/lib/types/story';

interface StoryHeroProps {
  story: Story;
  className?: string;
}

export function StoryHero({ story, className }: StoryHeroProps) {
  const locale = useLocale();
  const { language } = usePreferencesStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarksStore();
  const t = useTranslations('common');

  const bookmarked = isBookmarked(story.id);
  const primarySource = story.sources?.[0]?.source ?? null;

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) removeBookmark(story.id);
    else addBookmark(story);
  }

  return (
    <Link href={`/${locale}/story/${story.id}`} className="block">
      <motion.div
        className={cn(
          'group relative overflow-hidden rounded-3xl border border-border bg-card',
          className,
        )}
        whileHover={{ scale: 1.004 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[21/9]">
          <StoryImage
            src={story.imageUrl}
            alt={story.canonicalTitle}
            seed={story.id}
            category={story.category}
            source={primarySource}
            priority
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-9">
            <div className="max-w-3xl space-y-3.5">
              {/* Eyebrow meta */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white/85">
                {story.category && (
                  <span className="eyebrow rounded-full bg-white/15 px-2.5 py-1 text-white backdrop-blur-sm">
                    {story.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {getRelativeTime(story.latestPublishedAt, language)}
                </span>
                {story.sourceCount > 1 && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Layers className="h-3.5 w-3.5" />
                    {story.sourceCount} {t('sources')}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h2 className="font-display text-3xl font-semibold leading-[1.08] text-white text-balance lg:text-4xl xl:text-5xl">
                {story.canonicalTitle}
              </h2>

              {/* Summary */}
              {story.canonicalSummary && (
                <p className="max-w-2xl text-sm leading-relaxed text-white/80 line-clamp-2 lg:text-base">
                  {story.canonicalSummary}
                </p>
              )}

              {/* Sources + CTA */}
              <div className="flex items-center gap-3 pt-1">
                {story.sources && story.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {story.sources.slice(0, 4).map((src) => (
                      <span
                        key={src.articleId}
                        className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {src.source}
                      </span>
                    ))}
                  </div>
                )}
                <span className="ml-auto hidden items-center gap-1 text-sm font-medium text-white/90 transition-transform group-hover:translate-x-0.5 sm:flex">
                  {t('readMore')}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark */}
          <motion.button
            onClick={handleBookmark}
            className={cn(
              'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors',
              bookmarked
                ? 'bg-primary text-white'
                : 'bg-black/30 text-white hover:bg-black/50',
            )}
            whileTap={{ scale: 0.9 }}
            aria-label={bookmarked ? t('bookmarked') : t('bookmark')}
          >
            {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
