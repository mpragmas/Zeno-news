'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAdminFilter } from '@/components/admin/AdminFilterContext';

export function useOverview() {
  const { days, interval } = useAdminFilter();
  return useQuery({
    queryKey: ['admin', 'overview', days, interval],
    queryFn: () => adminApi.overview({ days, interval }),
  });
}

export function usePublishers() {
  const { days, interval } = useAdminFilter();
  return useQuery({
    queryKey: ['admin', 'publishers', days, interval],
    queryFn: () => adminApi.publishers({ days, interval, limit: 100 }),
  });
}

export function useUserAnalytics() {
  const { days, interval } = useAdminFilter();
  return useQuery({
    queryKey: ['admin', 'users', days, interval],
    queryFn: () => adminApi.users({ days, interval }),
  });
}

export function useStoryAnalytics() {
  const { days } = useAdminFilter();
  return useQuery({
    queryKey: ['admin', 'stories', days],
    queryFn: () => adminApi.stories({ days, limit: 50 }),
  });
}

export function useSearchAnalytics() {
  const { days } = useAdminFilter();
  return useQuery({
    queryKey: ['admin', 'search', days],
    queryFn: () => adminApi.search({ days, limit: 25 }),
  });
}
