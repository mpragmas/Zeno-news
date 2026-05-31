'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Bookmark, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { StoryCard } from '@/components/story/StoryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date';

export default function BookmarksPage() {
  const t = useTranslations('bookmarks');
  const locale = useLocale();
  const { bookmarks, clearAll } = useBookmarksStore();

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-black text-foreground">{t('title')}</h1>
            <p className="text-sm text-muted-foreground">
              {bookmarks.length} {bookmarks.length === 1 ? 'story' : 'stories'} saved
            </p>
          </div>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-destructive hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Content */}
      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={t('empty')}
          description={t('emptySubtitle')}
        />
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookmarks.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div className="relative">
                  <StoryCard story={story} />
                  <div className="mt-2 px-1">
                    <p className="text-xs text-muted-foreground">
                      {t('addedOn')} {formatDate(story.bookmarkedAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
