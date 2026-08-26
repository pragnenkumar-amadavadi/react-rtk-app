import { apiClient } from '@repo/api-client';
import type { DashboardStats } from '@repo/types';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
  return data;
}
