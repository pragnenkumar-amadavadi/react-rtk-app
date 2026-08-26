import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import StatTile from '../../molecules/StatTile';
import StatusFunnelChart from '../../molecules/StatusFunnelChart';
import type { Props } from './DashboardView.types';
import {
  PageContainer,
  PageTitle,
  StatGrid,
  ChartCard,
  ChartCardContent,
  ChartTitle,
  ErrorAlert,
  EmptyText,
} from './DashboardView.styled';

export default function DashboardView({ stats, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <PageTitle variant="h4">Dashboard</PageTitle>
        <EmptyText>Loading dashboard…</EmptyText>
      </PageContainer>
    );
  }

  if (isError || !stats) {
    return (
      <PageContainer maxWidth="md">
        <PageTitle variant="h4">Dashboard</PageTitle>
        <ErrorAlert severity="error">Failed to load dashboard stats. Please try again.</ErrorAlert>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <PageTitle variant="h4">Dashboard</PageTitle>

      <StatGrid>
        <StatTile label="Open candidates" value={stats.openCandidates} icon={<PeopleAltOutlinedIcon />} />
        <StatTile label="Open jobs" value={stats.openJobs} icon={<WorkOutlinedIcon />} />
        <StatTile label="Hired this month" value={stats.hiredThisMonth} icon={<CheckCircleOutlinedIcon />} />
      </StatGrid>

      <ChartCard variant="outlined">
        <ChartCardContent>
          <ChartTitle variant="h6">Candidate status funnel</ChartTitle>
          <StatusFunnelChart counts={stats.candidateStatusCounts} />
        </ChartCardContent>
      </ChartCard>
    </PageContainer>
  );
}
