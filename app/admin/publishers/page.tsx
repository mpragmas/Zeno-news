'use client';

import { Building2, ExternalLink, MousePointerClick, Users } from 'lucide-react';
import { useCallback } from 'react';
import { AdminShell, useRegisterExport } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { Panel } from '@/components/admin/Panel';
import { BarList } from '@/components/admin/charts/BarList';
import {
  DashboardError,
  useAuthErrorRedirect,
} from '@/components/admin/DashboardStates';
import { usePublishers } from '@/lib/hooks/useAdminAnalytics';
import {
  downloadCsv,
  formatCompact,
  formatNumber,
  formatPercent,
} from '@/lib/utils/format';
import type { PublisherRow } from '@/lib/types/analytics';

function PublisherCard({ p }: { p: PublisherRow }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold uppercase text-primary">
            {p.source.slice(0, 2)}
          </div>
          <span className="font-display font-semibold text-foreground">{p.source}</span>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {formatPercent(p.ctr)} CTR
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-display text-lg font-bold text-foreground">
            {formatCompact(p.clicks)}
          </div>
          <div className="text-[11px] text-muted-foreground">clicks</div>
        </div>
        <div>
          <div className="font-display text-lg font-bold text-foreground">
            {formatCompact(p.uniqueUsers || p.uniqueSessions)}
          </div>
          <div className="text-[11px] text-muted-foreground">readers</div>
        </div>
        <div>
          <div className="font-display text-lg font-bold text-foreground">
            {formatCompact(p.impressions)}
          </div>
          <div className="text-[11px] text-muted-foreground">impressions</div>
        </div>
      </div>

      {p.topCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
          {p.topCategories.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="rounded-full bg-secondary px-2 py-0.5 text-[11px] capitalize text-secondary-foreground"
            >
              {c.name} · {c.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PublishersContent() {
  const { data, isLoading, isError, refetch, error } = usePublishers();
  useAuthErrorRedirect(error);

  const handleExport = useCallback(() => {
    const rows = (data?.publishers ?? []).map((p) => ({
      publisher: p.source,
      clicks: p.clicks,
      impressions: p.impressions,
      ctr_percent: p.ctr,
      unique_users: p.uniqueUsers,
      unique_sessions: p.uniqueSessions,
    }));
    downloadCsv('publishers.csv', rows);
  }, [data]);
  useRegisterExport(handleExport);

  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const publishers = data?.publishers ?? [];
  const totals = data?.totals;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Outbound clicks" value={formatCompact(totals?.clicks ?? 0)} icon={ExternalLink} loading={isLoading} sub="total sent to publishers" />
        <StatCard label="Avg. CTR" value={formatPercent(totals?.ctr ?? 0)} icon={MousePointerClick} loading={isLoading} />
        <StatCard label="Readers referred" value={formatCompact(totals?.uniqueUsers ?? 0)} icon={Users} loading={isLoading} sub="unique users" />
        <StatCard label="Publishers" value={formatNumber(totals?.publisherCount ?? 0)} icon={Building2} loading={isLoading} />
      </div>

      <Panel title="Outbound traffic by publisher" description="Clicks we sent to each partner">
        <BarList
          data={publishers.map((p) => ({ name: p.source, count: p.clicks }))}
          emptyLabel="No outbound clicks recorded yet"
        />
      </Panel>

      <div>
        <h2 className="mb-3 font-display text-sm font-semibold text-foreground">
          Publisher performance
        </h2>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : publishers.length === 0 ? (
          <p className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
            No publisher data for this range.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {publishers.map((p) => (
              <PublisherCard key={p.source} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublishersPage() {
  return (
    <AdminShell title="Publishers" description="Traffic we send to publishing partners">
      <PublishersContent />
    </AdminShell>
  );
}
