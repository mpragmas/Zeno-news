import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getStory } from '@/lib/api/stories';
import { generateStoryMetadata } from '@/lib/utils/seo';
import { StoryDetail } from '@/components/story/StoryDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { StoryDetailSidebar } from './StoryDetailSidebar';

interface StoryPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { locale, id } = await params;
  try {
    const story = await getStory(id, locale);
    return generateStoryMetadata(story, locale);
  } catch {
    return { title: 'Story Not Found' };
  }
}

async function StoryContent({ locale, id }: { locale: string; id: string }) {
  let story;
  try {
    story = await getStory(id, locale);
  } catch {
    notFound();
  }

  return (
    <div className="flex gap-0">
      {/* Main article content */}
      <div className="flex-1 min-w-0">
        <StoryDetail story={story} />
      </div>

      {/* Right sidebar (desktop only) */}
      <aside className="hidden xl:block w-72 shrink-0 border-l border-border">
        <StoryDetailSidebar story={story} locale={locale} />
      </aside>
    </div>
  );
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { locale, id } = await params;

  return (
    <Suspense fallback={<StoryDetailSkeleton />}>
      <StoryContent locale={locale} id={id} />
    </Suspense>
  );
}

function StoryDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-4/5" />
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
