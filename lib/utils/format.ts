/** Compact number formatting for dashboards: 12_430 → "12.4K". */
export function formatCompact(n: number): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatNumber(n: number): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('en').format(n);
}

export function formatPercent(n: number, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '0%';
  return `${n.toFixed(digits)}%`;
}

/** Milliseconds → "4m 12s" / "45s" / "1h 03m". */
export function formatDuration(ms: number): string {
  if (!ms || ms < 0) return '0s';
  const totalSeconds = Math.round(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

/** Short date label for chart axes ("Jun 6"). */
export function formatBucketLabel(iso: string, interval: 'day' | 'hour' = 'day'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  if (interval === 'hour') {
    return d.toLocaleTimeString('en', { hour: 'numeric' });
  }
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

/** Serialize an array of flat objects to a downloadable CSV string. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ];
  return lines.join('\n');
}

/** Trigger a client-side CSV download. */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (typeof window === 'undefined') return;
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
