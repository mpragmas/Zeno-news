'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface PanelProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

/** Standard dashboard card container with an optional header + action slot. */
export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  return (
    <section className={cn('rounded-xl border border-border bg-card', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            {title && (
              <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}
