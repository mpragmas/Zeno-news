'use client';

import { useCallback } from 'react';
import { Clock, Globe, Repeat, UserCheck, Users } from 'lucide-react';
import { AdminShell, useRegisterExport } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { Panel } from '@/components/admin/Panel';
import { AreaChart } from '@/components/admin/charts/AreaChart';
import { BarList } from '@/components/admin/charts/BarList';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import {
  DashboardError,
  useAuthErrorRedirect,
} from '@/components/admin/DashboardStates';
import { useUserAnalytics } from '@/lib/hooks/useAdminAnalytics';
import { useAdminFilter } from '@/components/admin/AdminFilterContext';
import {
  downloadCsv,
  formatCompact,
  formatDuration,
  formatNumber,
  formatPercent,
} from '@/lib/utils/format';

const upper = (s: string) => s.toUpperCase();

function UsersContent() {
  const { interval } = useAdminFilter();
  const { data, isLoading, isError, refetch, error } = useUserAnalytics();
  useAuthErrorRedirect(error);

  const handleExport = useCallback(() => {
    if (!data) return;
    const b = data.breakdowns;
    const rows = [
      ...b.languages.map((r) => ({ dimension: 'language', name: r.name, count: r.count })),
      ...b.countries.map((r) => ({ dimension: 'country', name: r.name, count: r.count })),
      ...b.devices.map((r) => ({ dimension: 'device', name: r.name, count: r.count })),
      ...b.regions.map((r) => ({ dimension: 'region', name: r.name, count: r.count })),
      ...b.categories.map((r) => ({ dimension: 'category', name: r.name, count: r.count })),
    ];
    downloadCsv('user-breakdowns.csv', rows);
  }, [data]);
  useRegisterExport(handleExport);

  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const t = data?.totals;
  const b = data?.breakdowns;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Active users" value={formatCompact(t?.activeUsers ?? 0)} icon={Users} loading={isLoading} />
        <StatCard label="Guests" value={formatCompact(t?.guestUsers ?? 0)} icon={Users} loading={isLoading} />
        <StatCard label="Registered" value={formatCompact(t?.registeredUsers ?? 0)} icon={UserCheck} loading={isLoading} />
        <StatCard label="Returning" value={formatCompact(t?.returningUsers ?? 0)} icon={Repeat} loading={isLoading} />
        <StatCard label="Retention" value={formatPercent(t?.retentionRate ?? 0)} icon={Repeat} loading={isLoading} />
        <StatCard label="Avg. session" value={formatDuration(t?.avgSessionMs ?? 0)} icon={Clock} loading={isLoading} sub={`${t?.avgSessionDepth ?? 0} events`} />
      </div>

      <Panel title="Active users over time" description="Distinct visitors per day">
        <AreaChart data={data?.series.activeUsers ?? []} interval={interval} valueLabel="users" />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Devices">
          <DonutChart data={b?.devices ?? []} formatName={(n) => n} />
        </Panel>
        <Panel title="Audience type">
          <DonutChart
            data={[
              { name: 'Guests', count: t?.guestUsers ?? 0 },
              { name: 'Registered', count: t?.registeredUsers ?? 0 },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Languages" description="Most used app languages">
          <BarList data={b?.languages ?? []} formatName={upper} barClassName="bg-sky-500/15" />
        </Panel>
        <Panel
          title="Countries"
          description="Top regions by audience"
          action={<Globe className="h-4 w-4 text-muted-foreground" />}
        >
          <BarList data={b?.countries ?? []} barClassName="bg-emerald-500/15" />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Category interests" description="What readers engage with">
          <BarList data={b?.categories ?? []} barClassName="bg-violet-500/15" />
        </Panel>
        <Panel title="Region interests" description="Geographic interest of content read">
          <BarList data={b?.regions ?? []} barClassName="bg-amber-500/15" />
        </Panel>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {formatNumber(t?.newVisitors ?? 0)} new visitors this period
      </p>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AdminShell title="Users" description="Audience, retention & engagement">
      <UsersContent />
    </AdminShell>
  );
}
