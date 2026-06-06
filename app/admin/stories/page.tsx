'use client';

import { useCallback } from 'react';
import { AdminShell, useRegisterExport } from '@/components/admin/AdminShell';
import { Panel } from '@/components/admin/Panel';
import {
  DashboardError,
  useAuthErrorRedirect,
} from '@/components/admin/DashboardStates';
import { useStoryAnalytics } from '@/lib/hooks/useAdminAnalytics';
import { downloadCsv, formatNumber, formatPercent } from '@/lib/utils/format';

function StoriesContent() {
  const { data, isLoading, isError, refetch, error } = useStoryAnalytics();
  useAuthErrorRedirect(error);

  const handleExport = useCallback(() => {
    const rows = (data?.stories ?? []).map((s) => ({
      story: s.title,
      impressions: s.impressions,
      opens: s.opens,
      source_switches: s.sourceSwitches,
      outbound_clicks: s.clicks,
      bookmarks: s.bookmarks,
      shares: s.shares,
      ctr_percent: s.ctr,
    }));
    downloadCsv('story-performance.csv', rows);
  }, [data]);
  useRegisterExport(handleExport);

  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const stories = data?.stories ?? [];

  const cols = [
    'Impr.',
    'Opens',
    'Switches',
    'Clicks',
    'Saves',
    'Shares',
    'CTR',
  ];

  return (
    <Panel
      title="Top stories"
      description="Ranked by outbound clicks — the full engagement funnel"
      bodyClassName="p-0"
    >
      {isLoading ? (
        <div className="space-y-2 p-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No story engagement recorded for this range.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Story</th>
                {cols.map((c) => (
                  <th key={c} className="px-3 py-3 text-right font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stories.map((s, i) => (
                <tr
                  key={s.clusterId}
                  className="border-b border-border/60 transition-colors hover:bg-accent/40"
                >
                  <td className="max-w-md px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="truncate font-medium text-foreground">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(s.impressions)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(s.opens)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(s.sourceSwitches)}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">{formatNumber(s.clicks)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(s.bookmarks)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(s.shares)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatPercent(s.ctr)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

export default function StoriesPage() {
  return (
    <AdminShell title="Story performance" description="Per-story engagement & conversion">
      <StoriesContent />
    </AdminShell>
  );
}
