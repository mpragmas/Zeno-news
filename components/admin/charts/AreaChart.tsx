'use client';

import { useId, useMemo, useState } from 'react';
import type { TimeBucket } from '@/lib/types/analytics';
import { formatBucketLabel, formatNumber } from '@/lib/utils/format';

interface AreaChartProps {
  data: TimeBucket[];
  height?: number;
  /** CSS color (defaults to the theme primary). */
  color?: string;
  interval?: 'day' | 'hour';
  valueLabel?: string;
}

/**
 * Dependency-free responsive area/line chart (Vercel-Analytics style) drawn with
 * pure SVG. Uses a 0–100 viewBox and `preserveAspectRatio="none"` so it scales
 * fluidly to any container width while the stroke stays crisp via vector-effect.
 */
export function AreaChart({
  data,
  height = 240,
  color = 'hsl(var(--primary))',
  interval = 'day',
  valueLabel = 'value',
}: AreaChartProps) {
  // useId() contains colons which can break SVG url(#id) refs in some browsers.
  const gradientId = `area-grad-${useId().replace(/:/g, '')}`;
  const [hover, setHover] = useState<number | null>(null);

  const { linePath, areaPath, max, points } = useMemo(() => {
    const n = data.length;
    if (n === 0) {
      return { linePath: '', areaPath: '', max: 0, points: [] as { x: number; y: number }[] };
    }
    const maxVal = Math.max(1, ...data.map((d) => d.value));
    const stepX = n > 1 ? 100 / (n - 1) : 0;
    const pts = data.map((d, i) => ({
      x: n > 1 ? i * stepX : 50,
      y: 100 - (d.value / maxVal) * 92 - 4, // 4% top/bottom padding
    }));
    const line = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');
    const area = `${line} L ${pts[pts.length - 1].x.toFixed(2)} 100 L ${pts[0].x.toFixed(2)} 100 Z`;
    return { linePath: line, areaPath: area, max: maxVal, points: pts };
  }, [data]);

  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No data for this range
      </div>
    );
  }

  const hovered = hover !== null ? data[hover] : null;
  const hoveredPt = hover !== null ? points[hover] : null;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  }

  return (
    <div
      className="relative w-full"
      style={{ height }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[25, 50, 75].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="hsl(var(--border))"
            strokeWidth="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {hoveredPt && (
          <>
            <line
              x1={hoveredPt.x}
              x2={hoveredPt.x}
              y1="0"
              y2="100"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.4"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={hoveredPt.x}
              cy={hoveredPt.y}
              r="3"
              fill={color}
              stroke="hsl(var(--background))"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hovered && hoveredPt && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-1.5 text-xs shadow-lg"
          style={{ left: `${hoveredPt.x}%`, top: 4 }}
        >
          <div className="font-semibold text-foreground">
            {formatNumber(hovered.value)}{' '}
            <span className="font-normal text-muted-foreground">{valueLabel}</span>
          </div>
          <div className="text-muted-foreground">
            {formatBucketLabel(hovered.bucket, interval)}
          </div>
        </div>
      )}

      {/* X axis labels (first / mid / last) */}
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{formatBucketLabel(data[0].bucket, interval)}</span>
        {data.length > 2 && (
          <span>{formatBucketLabel(data[Math.floor(data.length / 2)].bucket, interval)}</span>
        )}
        <span>{formatBucketLabel(data[data.length - 1].bucket, interval)}</span>
      </div>

      <span className="sr-only">Peak {formatNumber(max)} {valueLabel}</span>
    </div>
  );
}
