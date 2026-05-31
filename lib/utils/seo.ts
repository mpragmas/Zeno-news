import type { Metadata } from 'next';
import type { Story } from '@/lib/types/story';
import type { Article } from '@/lib/types/article';

const APP_NAME = 'NewsSummary';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://newssummary.app';
const DEFAULT_DESCRIPTION = 'Stay informed with AI-powered news summaries from multiple sources across Africa and beyond.';
const DEFAULT_IMAGE = `${APP_URL}/og-image.jpg`;

export function generateStoryMetadata(story: Story, locale: string): Metadata {
  const title = `${story.canonicalTitle} | ${APP_NAME}`;
  const description = story.canonicalSummary?.substring(0, 160) || DEFAULT_DESCRIPTION;
  const image = story.imageUrl || DEFAULT_IMAGE;
  const url = `${APP_URL}/${locale}/story/${story.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: story.canonicalTitle }],
      type: 'article',
      publishedTime: story.latestPublishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateArticleMetadata(article: Article, locale: string): Metadata {
  const title = `${article.title} | ${APP_NAME}`;
  const description = article.summary?.substring(0, 160) || DEFAULT_DESCRIPTION;
  const image = article.imageUrl || DEFAULT_IMAGE;
  const url = `${APP_URL}/${locale}/article/${article.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generatePageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description = DEFAULT_DESCRIPTION, path = '', noIndex = false } = options;
  const fullTitle = `${title} | ${APP_NAME}`;
  const url = `${APP_URL}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: APP_NAME,
      images: [{ url: DEFAULT_IMAGE }],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
