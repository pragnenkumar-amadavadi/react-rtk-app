import type { DashboardStats } from '@repo/types';

export interface Props {
  stats: DashboardStats | undefined;
  isLoading: boolean;
  isError: boolean;
}
