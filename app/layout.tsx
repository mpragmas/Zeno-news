import type { Metadata, Viewport } from 'next';
// Self-hosted fonts (variable) — bundled locally so the build never depends on
// fonts.googleapis.com, which is unreliable on some networks. The font-family
// names ('Inter Variable' / 'Fraunces Variable') are wired to --font-sans /
// --font-serif in globals.css.
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces/full.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Zeno News — Stay Informed in a Minute',
    template: '%s | Zeno News',
  },
  description:
    'Stay informed with AI-powered news summaries aggregated from multiple sources across Africa and the world. Available in English, French, and Kinyarwanda.',
  keywords: ['news', 'Africa', 'Rwanda', 'AI summary', 'multilingual', 'journalism'],
  authors: [{ name: 'Zeno News' }],
  creator: 'Zeno News',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'rw_RW'],
    siteName: 'Zeno News',
    title: 'Zeno News — Stay Informed in a Minute',
    description: 'AI-powered news summaries from multiple sources, available in English, French, and Kinyarwanda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno News',
    description: 'AI-powered multilingual news summaries.',
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
