'use client';

import type { NameCount } from '@/lib/types/analytics';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface BarListProps {
  data: NameCount[];
  /** Tailwind bg color class for the bar fill. */
  barClassName?: string;
  emptyLabel?: string;
  max?: number;
  /** Optional label transform (e.g. uppercase locale codes). */
  formatName?: (name: string) => string;
}

/**
 * Horizontal "bar list" (Plausible / Vercel style) for ranked breakdowns:
 * publishers, languages, countries, searches, etc.
 */
export function BarList({
  data,
  barClassName = 'bg-primary/15',
  emptyLabel = 'No data',
  max,
  formatName,
}: BarListProps) {
  if (!data.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const maxValue = max ?? Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="space-y-1">
      {data.map((row) => {
        const pct = Math.max(2, (row.count / maxValue) * 100);
        return (
          <div
            key={row.name}
            className="relative flex items-center justify-between overflow-hidden rounded-md px-3 py-2 text-sm"
          >
            <div
              className={cn('absolute inset-y-0 left-0 rounded-md', barClassName)}
              style={{ width: `${pct}%` }}
            />
            <span className="relative z-10 truncate pr-3 font-medium text-foreground">
              {formatName ? formatName(row.name) : row.name}
            </span>
            <span className="relative z-10 shrink-0 tabular-nums text-muted-foreground">
              {formatNumber(row.count)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
