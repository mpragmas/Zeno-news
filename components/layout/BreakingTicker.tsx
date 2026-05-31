'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { useStories } from '@/lib/hooks/useStories';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { isRecent } from '@/lib/utils/date';

export function BreakingTicker() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { language } = usePreferencesStore();

  const { data } = useStories({ lang: language, page: 1, limit: 10 });
  const recentStories = data?.data?.filter((s) => isRecent(s.latestPublishedAt, 3)) || [];

  if (recentStories.length === 0) return null;

  const tickerItems = [...recentStories, ...recentStories]; // duplicate for seamless loop

  return (
    <div className="flex items-stretch h-10 bg-breaking text-white overflow-hidden border-b border-breaking/20">
      {/* Label */}
      <div className="flex items-center gap-2 px-3 bg-breaking shrink-0 z-10 border-r border-white/20">
        <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {t('breaking')}
        </span>
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden ticker-wrap">
        <div className="ticker-content">
          {tickerItems.map((story, i) => (
            <Link
              key={`${story.id}-${i}`}
              href={`/${locale}/story/${story.id}`}
              className="inline-flex items-center gap-2 hover:underline text-sm font-medium whitespace-nowrap"
            >
              <span className="text-white/60">•</span>
              <span>{story.canonicalTitle}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
