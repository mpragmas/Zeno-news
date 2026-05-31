'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', shortLabel: 'EN' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', shortLabel: 'FR' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼', shortLabel: 'RW' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function LanguageSwitcher({ variant = 'icon', className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(newLocale: string) {
    // Replace current locale prefix with new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'icon' ? 'icon' : 'sm'}
          className={cn('gap-1.5', className)}
          aria-label="Switch language"
        >
          {variant === 'icon' ? (
            <>
              <Globe className="h-4 w-4" />
              <span className="sr-only">Language</span>
            </>
          ) : (
            <>
              <span className="text-base">{current.flag}</span>
              <span className="font-medium">{current.shortLabel}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Language / Langue
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={cn(
              'gap-2 cursor-pointer',
              locale === lang.code && 'bg-accent font-semibold'
            )}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
            {locale === lang.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
