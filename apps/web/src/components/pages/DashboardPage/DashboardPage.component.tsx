import { useDashboardStatsQuery } from '../../../features/dashboard/dashboardQueries';
import { DashboardView } from '@repo/ui';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStatsQuery();

  return <DashboardView stats={data} isLoading={isLoading} isError={isError} />;
}
