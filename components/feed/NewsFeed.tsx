'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useStoriesInfinite } from '@/lib/hooks/useStories';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { StoryCard } from '@/components/story/StoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { StoriesParams } from '@/lib/types/api';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: 'easeOut',
    },
  }),
};

interface NewsFeedProps {
  params?: Omit<StoriesParams, 'page'>;
  initialLimit?: number;
  columns?: 1 | 2 | 3;
}

export function NewsFeed({ params = {}, initialLimit = 20, columns = 3 }: NewsFeedProps) {
  const { language } = usePreferencesStore();
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
  } = useStoriesInfinite({
    ...params,
    lang: language,
    limit: initialLimit,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const stories = data?.pages.flatMap((page) => page.data) || [];

  const gridClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';

  if (isError) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <p className="text-muted-foreground">Failed to load stories</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className={`grid ${gridClass} gap-4`}>
          {Array.from({ length: initialLimit }).map((_, i) => (
            <FeedSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <div className={`grid ${gridClass} gap-4`}>
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  custom={i % 9} // reset delay every 9 items
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* Load more sentinel */}
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : hasNextPage ? (
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load more stories
              </Button>
            ) : stories.length > 0 ? (
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
