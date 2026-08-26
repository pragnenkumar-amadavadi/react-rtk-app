import type { Props } from './JobListView.types';
import JobCard from '../../molecules/JobCard';
import {
  PageContainer,
  PageTitle,
  JobGrid,
  LoadMoreRow,
  LoadMoreButton,
  EmptyText,
  ErrorAlert,
} from './JobListView.styled';

export default function JobListView({
  jobs,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onCardHover,
}: Props) {
  if (isLoading) {
    return (
      <PageContainer>
        <PageTitle variant="h4">Jobs</PageTitle>
        <EmptyText>Loading jobs…</EmptyText>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageTitle variant="h4">Jobs</PageTitle>
        <ErrorAlert severity="error">Failed to load jobs. Please try again.</ErrorAlert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle variant="h4">Jobs</PageTitle>

      {jobs.length === 0 ? (
        <EmptyText>No jobs available.</EmptyText>
      ) : (
        <JobGrid>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onHover={onCardHover} />
          ))}
        </JobGrid>
      )}

      {hasNextPage && (
        <LoadMoreRow>
          <LoadMoreButton
            variant="outlined"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load More'}
          </LoadMoreButton>
        </LoadMoreRow>
      )}
    </PageContainer>
  );
}
