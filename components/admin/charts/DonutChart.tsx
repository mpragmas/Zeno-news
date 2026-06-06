'use client';

import { useMemo } from 'react';
import type { NameCount } from '@/lib/types/analytics';
import { formatNumber, formatPercent } from '@/lib/utils/format';

interface DonutChartProps {
  data: NameCount[];
  size?: number;
  formatName?: (name: string) => string;
}

const PALETTE = [
  'hsl(var(--primary))',
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
  '#64748b',
];

/** Compact donut + legend for categorical splits (devices, guest vs registered). */
export function DonutChart({ data, size = 160, formatName }: DonutChartProps) {
  const total = data.reduce((a, b) => a + b.count, 0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    let offset = 0;
    return data.map((d, i) => {
      const fraction = total > 0 ? d.count / total : 0;
      const seg = {
        name: d.name,
        count: d.count,
        color: PALETTE[i % PALETTE.length],
        dash: fraction * circumference,
        gap: circumference - fraction * circumference,
        offset,
        fraction,
      };
      offset += fraction * circumference;
      return seg;
    });
  }, [data, total, circumference]);

  if (!total) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height: size }}>
        No data
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        {segments.map((s) => (
          <circle
            key={s.name}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="12"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
          />
        ))}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 fill-foreground"
          style={{ transformOrigin: 'center', fontSize: '14px', fontWeight: 700 }}
        >
          {formatNumber(total)}
        </text>
      </svg>

      <ul className="flex-1 space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="capitalize text-foreground">
              {formatName ? formatName(s.name) : s.name}
            </span>
            <span className="ml-auto tabular-nums text-muted-foreground">
              {formatNumber(s.count)} · {formatPercent(s.fraction * 100, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
