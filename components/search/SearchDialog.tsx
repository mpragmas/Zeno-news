'use client';

import { useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useLocale, useTranslations } from 'next-intl';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUIStore } from '@/lib/stores/ui.store';
import { useSearch } from '@/lib/hooks/useSearch';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { getRelativeTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

export function SearchDialog() {
  const t = useTranslations('search');
  const locale = useLocale();
  const { searchOpen, closeSearch } = useUIStore();
  const { language } = usePreferencesStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    clearRecent,
    hasResults,
  } = useSearch({ lang: language });

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen, setQuery]);

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
        onClick={(e) => e.target === e.currentTarget && closeSearch()}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: -8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <Command shouldFilter={false}>
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
              ) : (
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 hover:bg-accent"
              >
                ESC
              </button>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              {/* Recent searches */}
              {!query && recentSearches.length > 0 && (
                <Command.Group heading="">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t('recent')}
                    </span>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.slice(0, 5).map((term) => (
                    <Command.Item
                      key={term}
                      value={term}
                      onSelect={() => setQuery(term)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-accent text-sm text-muted-foreground"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {term}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* No query state */}
              {!query && recentSearches.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-muted-foreground">{t('placeholder')}</p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-60">{t('tip')}</p>
                </div>
              )}

              {/* Results */}
              {query.length >= 2 && !isLoading && (
                <>
                  {hasResults ? (
                    <Command.Group heading="">
                      <div className="px-2 py-1.5 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Stories
                        </span>
                      </div>
                      {results.map((story) => (
                        <Command.Item
                          key={story.id}
                          value={story.id}
                          onSelect={() => closeSearch()}
                          className="p-0"
                        >
                          <Link
                            href={`/${locale}/story/${story.id}`}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-accent w-full"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                                {story.canonicalTitle}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                {story.category && (
                                  <span className={cn(
                                    'px-1.5 py-0.5 rounded text-[10px] font-medium',
                                    `category-${story.category.toLowerCase()}`
                                  )}>
                                    {story.category}
                                  </span>
                                )}
                                <span>{getRelativeTime(story.latestPublishedAt, language)}</span>
                                <span>{story.sourceCount} sources</span>
                              </div>
                            </div>
                          </Link>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ) : (
                    <Command.Empty className="py-12 text-center">
                      <p className="text-sm text-muted-foreground">{t('noResults')}</p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-60">{t('tip')}</p>
                    </Command.Empty>
                  )}
                </>
              )}

              {/* Loading state */}
              {query.length >= 2 && isLoading && (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground mt-2">{t('searching')}</p>
                </div>
              )}
            </Command.List>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded font-mono">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded font-mono">↵</kbd> select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded font-mono">ESC</kbd> close
              </span>
            </div>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
