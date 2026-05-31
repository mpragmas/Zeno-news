import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

// UI + body: clean, neutral sans
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Editorial display: modern serif with character for headlines
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: {
    default: 'NewsSummary — AI-Powered News from Multiple Sources',
    template: '%s | NewsSummary',
  },
  description:
    'Stay informed with AI-powered news summaries aggregated from multiple sources across Africa and the world. Available in English, French, and Kinyarwanda.',
  keywords: ['news', 'Africa', 'Rwanda', 'AI summary', 'multilingual', 'journalism'],
  authors: [{ name: 'NewsSummary' }],
  creator: 'NewsSummary',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'rw_RW'],
    siteName: 'NewsSummary',
    title: 'NewsSummary — AI-Powered News from Multiple Sources',
    description: 'AI-powered news summaries from multiple sources, available in English, French, and Kinyarwanda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsSummary',
    description: 'AI-powered multilingual news summaries.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
