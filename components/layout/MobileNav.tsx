'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Compass, Bookmark, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}`, icon: Home, label: t('home'), exact: true },
    { href: `/${locale}/explore`, icon: Compass, label: t('explore') },
    { href: `/${locale}/bookmarks`, icon: Bookmark, label: t('bookmarks') },
    { href: `/${locale}/profile`, icon: User, label: t('profile') },
    { href: `/${locale}/settings`, icon: Settings, label: t('settings') },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
      {navItems.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn('h-5 w-5', active && 'text-primary')} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
