'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Article } from '@/lib/types/article';
import { formatDate } from '@/lib/utils/date';
import { estimateReadingTime } from '@/lib/utils/reading';
import { Badge } from '@/components/ui/badge';
import { outboundHref, trackSourceSwitch } from '@/lib/analytics/tracker';

interface SourceTabsProps {
  articles: Article[];
  clusterId?: string;
}

export function SourceTabs({ articles, clusterId }: SourceTabsProps) {
  const t = useTranslations('story');
  const [activeTab, setActiveTab] = useState(articles[0]?.id || '');

  if (articles.length === 0) return null;

  function handleTabChange(value: string) {
    setActiveTab(value);
    const article = articles.find((a) => a.id === value);
    if (article) {
      trackSourceSwitch({ clusterId, articleId: article.id, source: article.source });
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 pt-1 -mx-4 px-4">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
          {articles.map((article) => (
            <TabsTrigger
              key={article.id}
              value={article.id}
              className="h-8 px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border border-border data-[state=active]:border-primary"
            >
              {article.source}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <AnimatePresence mode="wait">
        {articles.map((article) => (
          <TabsContent key={article.id} value={article.id}>
            {activeTab === article.id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Article meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{article.source}</span>
                  {article.publishedAt && (
                    <span>{formatDate(article.publishedAt)}</span>
                  )}
                  <Badge variant="outline" className="text-[10px]">
                    {article.originalLanguage?.toUpperCase()}
                  </Badge>
                  <span className="text-xs">
                    {estimateReadingTime(article.content)} {t('readingTime')}
                  </span>
                </div>

                {/* Article title */}
                <h2 className="text-xl font-bold text-foreground leading-snug font-serif">
                  {article.title}
                </h2>

                {/* Summary box if available */}
                {(article.summary || article.summaryFr || article.summaryRw) && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      {t('summary')}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {article.summary || article.summaryFr || article.summaryRw}
                    </p>
                  </div>
                )}

                {/* Article content */}
                <div
                  className="article-content prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
                />

                {/* Read original link — routed through the outbound tracker */}
                {article.url && (
                  <a
                    href={outboundHref(article.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('readOriginal')} {article.source}
                  </a>
                )}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  );
}
