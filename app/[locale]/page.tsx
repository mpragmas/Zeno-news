import { getTranslations } from 'next-intl/server';
import { getStories } from '@/lib/api/stories';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { StoryHero } from '@/components/story/StoryHero';
import { TrendingSection } from '@/components/feed/TrendingSection';
import { SectionFeed } from '@/components/feed/SectionFeed';
import { NewsFeed } from '@/components/feed/NewsFeed';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { MapPin, Newspaper, Globe2 } from 'lucide-react';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: 'NewsSummary — AI-Powered Multilingual News',
    description: 'Stay informed with AI-powered news summaries from multiple sources. Available in English, French, and Kinyarwanda.',
  };
}

async function HeroStory({ locale }: { locale: string }) {
  try {
    const data = await getStories({ lang: locale as 'en' | 'fr' | 'rw', page: 1, limit: 1 });
    const hero = data.data[0];
    if (!hero) return null;
    return <StoryHero story={hero} className="mb-1" />;
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div>
      {/* Breaking news ticker */}
      <Suspense fallback={null}>
        <BreakingTicker />
      </Suspense>

      <div className="px-4 lg:px-6 pt-7 pb-2">
        {/* Hero story */}
        <div className="mb-2">
          <div className="mb-3 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" />
            <span className="eyebrow text-muted-foreground">{t('hero')}</span>
          </div>
          <Suspense fallback={<Skeleton className="aspect-[21/9] w-full rounded-3xl" />}>
            <HeroStory locale={locale} />
          </Suspense>
        </div>
      </div>

      {/* Trending horizontal scroll */}
      <Suspense fallback={<div className="px-4 lg:px-6 py-5"><Skeleton className="h-48 w-full rounded-xl" /></div>}>
        <TrendingSection />
      </Suspense>

      {/* Rwanda section */}
      <SectionFeed
        title={t('rwanda')}
        icon={<MapPin className="h-5 w-5 text-primary" />}
        params={{ country: 'Rwanda' }}
        seeAllHref={`/${locale}/explore?country=Rwanda`}
        columns={3}
        limit={6}
      />

      {/* East Africa section */}
      <SectionFeed
        title={t('eastAfrica')}
        icon={<Globe2 className="h-5 w-5 text-primary" />}
        params={{ region: 'East Africa' }}
        seeAllHref={`/${locale}/explore?region=East+Africa`}
        columns={3}
        limit={6}
      />

      {/* Latest news infinite scroll */}
      <section className="px-4 lg:px-6 py-7 border-t border-border">
        <div className="mb-5 flex items-center gap-2.5">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {t('latest')}
          </h2>
        </div>
        <NewsFeed columns={3} initialLimit={20} />
      </section>
    </div>
  );
}
