'use client';

import {
  Activity,
  CalendarDays,
  CalendarRange,
  Clock,
  ExternalLink,
  Eye,
  MousePointerClick,
  Repeat,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { Panel } from '@/components/admin/Panel';
import { AreaChart } from '@/components/admin/charts/AreaChart';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import {
  DashboardError,
  useAuthErrorRedirect,
} from '@/components/admin/DashboardStates';
import { useOverview } from '@/lib/hooks/useAdminAnalytics';
import { useAdminFilter } from '@/components/admin/AdminFilterContext';
import {
  formatCompact,
  formatDuration,
  formatNumber,
  formatPercent,
} from '@/lib/utils/format';

function OverviewContent() {
  const { interval } = useAdminFilter();
  const { data, isLoading, isError, refetch, error } = useOverview();
  useAuthErrorRedirect(error);

  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const t = data?.totals;

  return (
    <div className="space-y-6">
      {/* Headline metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Live users"
          value={formatNumber(t?.liveUsers ?? 0)}
          live
          loading={isLoading}
          sub="active in last 5 min"
        />
        <StatCard label="DAU" value={formatNumber(t?.dau ?? 0)} icon={Activity} loading={isLoading} sub="daily active" />
        <StatCard label="WAU" value={formatNumber(t?.wau ?? 0)} icon={CalendarDays} loading={isLoading} sub="weekly active" />
        <StatCard label="MAU" value={formatNumber(t?.mau ?? 0)} icon={CalendarRange} loading={isLoading} sub="monthly active" />
        <StatCard label="Total users" value={formatNumber(t?.totalUsers ?? 0)} icon={Users} loading={isLoading} sub={`${formatNumber(t?.newUsers ?? 0)} new this period`} />
        <StatCard label="Stories read" value={formatCompact(t?.storiesRead ?? 0)} icon={Eye} loading={isLoading} />
        <StatCard label="Outbound clicks" value={formatCompact(t?.outboundClicks ?? 0)} icon={ExternalLink} loading={isLoading} sub="sent to publishers" />
        <StatCard label="Engagement" value={formatPercent(t?.engagementRate ?? 0)} icon={MousePointerClick} loading={isLoading} sub="clicks ÷ impressions" />
        <StatCard label="Avg. session" value={formatDuration(t?.avgSessionMs ?? 0)} icon={Clock} loading={isLoading} sub={`${t?.avgSessionDepth ?? 0} events / session`} />
        <StatCard label="Returning" value={formatNumber(t?.returningUsers ?? 0)} icon={Repeat} loading={isLoading} sub={`${formatNumber(t?.newVisitors ?? 0)} new visitors`} />
        <StatCard label="Impressions" value={formatCompact(t?.impressions ?? 0)} icon={TrendingUp} loading={isLoading} />
        <StatCard label="Registered" value={formatNumber(t?.registeredUsers ?? 0)} icon={Users} loading={isLoading} sub={`${formatNumber(t?.guestUsers ?? 0)} guests`} />
      </div>

      {/* Trend charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Active users" description="Distinct visitors per day">
          <AreaChart data={data?.series.activeUsers ?? []} interval={interval} valueLabel="users" />
        </Panel>
        <Panel title="Outbound publisher clicks" description="Readers sent to publishers">
          <AreaChart
            data={data?.series.outboundClicks ?? []}
            interval={interval}
            color="#10b981"
            valueLabel="clicks"
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Stories read" description="Article opens over time" className="lg:col-span-2">
          <AreaChart
            data={data?.series.storiesRead ?? []}
            interval={interval}
            color="#6366f1"
            valueLabel="reads"
          />
        </Panel>
        <Panel title="Audience" description="Guest vs registered">
          <DonutChart
            data={[
              { name: 'Guests', count: t?.guestUsers ?? 0 },
              { name: 'Registered', count: t?.registeredUsers ?? 0 },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <AdminShell title="Overview" description="Platform health & growth at a glance">
      <OverviewContent />
    </AdminShell>
  );
}
