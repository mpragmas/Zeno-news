'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'politics', label: 'Politics' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'sports', label: 'Sports' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
];

interface CategoryNavProps {
  className?: string;
}

export function CategoryNav({ className }: CategoryNavProps) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  return (
    <ScrollArea className={cn('w-full', className)}>
      <div className="flex items-center gap-2 pb-2">
        {CATEGORIES.map(({ value, label }) => {
          const href = value
            ? `/${locale}/explore?category=${value}`
            : `/${locale}/explore`;
          const isActive = activeCategory === value;

          return (
            <Link
              key={value}
              href={href}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/30'
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
