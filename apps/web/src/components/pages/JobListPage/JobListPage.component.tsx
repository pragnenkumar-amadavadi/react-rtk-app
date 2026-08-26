import { useMemo } from 'react';
import { useJobsQuery, usePrefetchJob } from '../../../features/jobs/jobQueries';
import { JobListView } from '@repo/ui';

export default function JobListPage() {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useJobsQuery();

  const prefetchJob = usePrefetchJob();
  // Stable reference across renders where `data` hasn't changed — lets
  // React.memo(JobCard) skip re-rendering the whole (unvirtualized) grid.
  const jobs = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  return (
    <JobListView
      jobs={jobs}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
      onCardHover={prefetchJob}
    />
  );
}
