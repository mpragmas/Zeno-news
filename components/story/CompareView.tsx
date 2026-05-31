'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Columns2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Article } from '@/lib/types/article';
import { estimateReadingTime } from '@/lib/utils/reading';

interface CompareViewProps {
  articles: Article[];
}

export function CompareView({ articles }: CompareViewProps) {
  const t = useTranslations('story');
  const [isOpen, setIsOpen] = useState(false);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(Math.min(1, articles.length - 1));

  if (articles.length < 2) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Columns2 className="h-4 w-4" />
        {t('compare')}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Columns2 className="h-5 w-5" />
                  {t('compare')}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Source selectors */}
              <div className="grid grid-cols-2 gap-4 px-6 py-3 border-b border-border shrink-0">
                {[{ idx: leftIdx, setIdx: setLeftIdx }, { idx: rightIdx, setIdx: setRightIdx }].map(
                  ({ idx, setIdx }, colIdx) => (
                    <div key={colIdx}>
                      <select
                        value={idx}
                        onChange={(e) => setIdx(Number(e.target.value))}
                        className="w-full text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground"
                      >
                        {articles.map((article, i) => (
                          <option key={article.id} value={i}>
                            {article.source}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>

              {/* Side-by-side content */}
              <div className="flex-1 grid grid-cols-2 divide-x divide-border overflow-hidden">
                {[articles[leftIdx], articles[rightIdx]].map((article, i) => (
                  article ? (
                    <ScrollArea key={`${article.id}-${i}`} className="h-full">
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                            {article.source}
                          </p>
                          <h3 className="text-base font-bold text-foreground leading-snug font-serif">
                            {article.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {estimateReadingTime(article.content)} min read
                          </p>
                        </div>

                        {article.summary && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <p className="text-xs font-bold text-primary mb-1">{t('summary')}</p>
                            <p className="text-sm text-foreground">{article.summary}</p>
                          </div>
                        )}

                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line font-serif">
                          {article.content}
                        </div>
                      </div>
                    </ScrollArea>
                  ) : null
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
