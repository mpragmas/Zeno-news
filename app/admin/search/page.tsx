'use client';

import { useCallback } from 'react';
import { Flame, Search, SearchX, Target } from 'lucide-react';
import { AdminShell, useRegisterExport } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { Panel } from '@/components/admin/Panel';
import { BarList } from '@/components/admin/charts/BarList';
import {
  DashboardError,
  useAuthErrorRedirect,
} from '@/components/admin/DashboardStates';
import { useSearchAnalytics } from '@/lib/hooks/useAdminAnalytics';
import { downloadCsv, formatCompact, formatPercent } from '@/lib/utils/format';

function SearchContent() {
  const { data, isLoading, isError, refetch, error } = useSearchAnalytics();
  useAuthErrorRedirect(error);

  const handleExport = useCallback(() => {
    const rows = (data?.topSearches ?? []).map((r) => ({
      query: r.name,
      count: r.count,
    }));
    downloadCsv('search-queries.csv', rows);
  }, [data]);
  useRegisterExport(handleExport);

  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const t = data?.totals;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total searches" value={formatCompact(t?.totalSearches ?? 0)} icon={Search} loading={isLoading} />
        <StatCard label="Success rate" value={formatPercent(t?.successRate ?? 0)} icon={Target} loading={isLoading} sub="returned ≥ 1 result" />
        <StatCard label="Failed searches" value={formatCompact(t?.failedSearches ?? 0)} icon={SearchX} loading={isLoading} sub="zero-result queries" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Top searched topics"
          description="Most popular queries"
          action={<Search className="h-4 w-4 text-muted-foreground" />}
        >
          <BarList data={data?.topSearches ?? []} barClassName="bg-primary/15" emptyLabel="No searches yet" />
        </Panel>

        <Panel
          title="Trending keywords"
          description="Rising vs the previous period"
          action={<Flame className="h-4 w-4 text-amber-500" />}
        >
          <BarList
            data={data?.trending ?? []}
            barClassName="bg-amber-500/15"
            emptyLabel="No trending change detected"
          />
        </Panel>
      </div>

      <Panel
        title="Failed searches"
        description="Content gaps — queries that returned nothing"
        action={<SearchX className="h-4 w-4 text-rose-500" />}
      >
        <BarList
          data={data?.failedSearches ?? []}
          barClassName="bg-rose-500/15"
          emptyLabel="No failed searches — great coverage!"
        />
      </Panel>
    </div>
  );
}

export default function SearchPage() {
  return (
    <AdminShell title="Search" description="What readers are looking for">
      <SearchContent />
    </AdminShell>
  );
}
