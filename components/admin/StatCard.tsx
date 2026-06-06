'use client';

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  /** Percentage change vs previous period; renders a colored trend chip. */
  trend?: number;
  live?: boolean;
  loading?: boolean;
}

export function StatCard({ label, value, sub, icon: Icon, trend, live, loading }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/15">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-live">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            Live
          </span>
        ) : (
          Icon && <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : (
          <span className="font-display text-2xl font-bold tabular-nums text-foreground">
            {value}
          </span>
        )}
        {typeof trend === 'number' && Number.isFinite(trend) && (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
              trend >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            )}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
