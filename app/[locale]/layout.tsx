import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/common/Providers';
import { LocaleSync } from '@/components/common/LocaleSync';
import { AnalyticsBoot } from '@/components/common/AnalyticsBoot';
import { AppShell } from '@/components/layout/AppShell';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    description: t('search'),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'fr' | 'rw')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <LocaleSync />
        <AnalyticsBoot />
        <AppShell>
          {children}
        </AppShell>
      </Providers>
    </NextIntlClientProvider>
  );
}
