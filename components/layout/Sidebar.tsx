'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Home,
  Compass,
  Bookmark,
  User,
  Settings,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AccountMenu } from '@/components/auth/AccountMenu';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export function Sidebar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}`, icon: Home, label: t('nav.home'), exact: true },
    { href: `/${locale}/explore`, icon: Compass, label: t('nav.explore') },
    { href: `/${locale}/bookmarks`, icon: Bookmark, label: t('nav.bookmarks') },
    { href: `/${locale}/profile`, icon: User, label: t('nav.profile') },
    { href: `/${locale}/settings`, icon: Settings, label: t('nav.settings') },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <Image
          src="/logo.png"
          alt="Zeno News"
          width={36}
          height={36}
          className="h-9 w-9 rounded-xl object-contain"
        />
        <div>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground">
            Zeno News
          </span>
          <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground leading-none">
            Stay informed in a minute
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom controls */}
      <div className="p-3 space-y-2">
        <AccountMenu />

        <div className="flex items-center justify-between px-2">
          <LanguageSwitcher variant="full" />
          <ThemeToggle />
        </div>

        {/* Keyboard shortcuts hint */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">
                <Keyboard className="h-3.5 w-3.5" />
                <span>Keyboard shortcuts</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">/</kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Toggle dark</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">D</kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>English</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">1</kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Français</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">2</kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Kinyarwanda</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">3</kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
