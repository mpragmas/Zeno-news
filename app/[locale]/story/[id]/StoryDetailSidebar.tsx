'use client';

import Link from 'next/link';
import { Clock, Layers, ExternalLink, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { estimateReadingTime } from '@/lib/utils/reading';
import { formatDate } from '@/lib/utils/date';
import { OutboundLink } from '@/components/common/OutboundLink';
import type { StoryDetail } from '@/lib/types/story';

interface StoryDetailSidebarProps {
  story: StoryDetail;
  locale: string;
}

export function StoryDetailSidebar({ story, locale }: StoryDetailSidebarProps) {
  const articles = story.articles || [];
  const totalReadingTime = articles.reduce((sum, a) => sum + estimateReadingTime(a.content), 0);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-5 space-y-6">
        {/* Reading stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Reading Info
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{totalReadingTime} min total read</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{story.sourceCount} sources covered</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sources list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Sources ({articles.length})
          </h3>
          <div className="space-y-2">
            {articles.map((article) => (
              <div key={article.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{article.source}</p>
                  <p className="text-xs text-muted-foreground">
                    {estimateReadingTime(article.content)} min · {article.originalLanguage?.toUpperCase()}
                  </p>
                </div>
                {article.url && (
                  <OutboundLink
                    articleId={article.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary shrink-0 mt-0.5"
                    aria-label={`Read original at ${article.source}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </OutboundLink>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Story metadata */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Details
          </h3>
          <dl className="space-y-2 text-sm">
            {story.category && (
              <div>
                <dt className="text-muted-foreground text-xs">Category</dt>
                <dd className="text-foreground font-medium capitalize">{story.category}</dd>
              </div>
            )}
            {story.country && (
              <div>
                <dt className="text-muted-foreground text-xs">Country</dt>
                <dd className="text-foreground font-medium">{story.country}</dd>
              </div>
            )}
            {story.region && (
              <div>
                <dt className="text-muted-foreground text-xs">Region</dt>
                <dd className="text-foreground font-medium">{story.region}</dd>
              </div>
            )}
            {story.languages && story.languages.length > 0 && (
              <div>
                <dt className="text-muted-foreground text-xs">Languages</dt>
                <dd className="text-foreground font-medium">
                  {story.languages.map((l) => l.toUpperCase()).join(', ')}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground text-xs">Published</dt>
              <dd className="text-foreground font-medium">{formatDate(story.latestPublishedAt)}</dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Back to home */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <BookOpen className="h-4 w-4" />
          More stories
        </Link>
      </div>
    </ScrollArea>
  );
}
