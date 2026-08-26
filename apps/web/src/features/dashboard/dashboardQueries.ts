import { useCallback } from 'react';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../api/dashboardApi';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export const dashboardStatsQueryOptions = queryOptions({
  queryKey: dashboardKeys.stats(),
  queryFn: fetchDashboardStats,
});

export function useDashboardStatsQuery() {
  return useQuery(dashboardStatsQueryOptions);
}

export function usePrefetchDashboardStats() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.prefetchQuery(dashboardStatsQueryOptions),
    [queryClient],
  );
}
