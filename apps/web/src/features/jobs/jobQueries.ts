import { useCallback } from 'react';
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryClient } from '@repo/api-client';
import { fetchJobs, fetchJobById, submitApplication } from '../../api/jobsApi';
import type { ApplicationPayload, JobId } from '@repo/types';

const LIMIT = 12;

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: () => [...jobKeys.lists()] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export const jobsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: jobKeys.lists(),
  queryFn: async ({ pageParam }) => {
    const result = await fetchJobs({ page: pageParam as number, limit: LIMIT });
    // Seed the detail cache from list data so navigating to a job already in the
    // list renders instantly instead of firing a redundant fetchJobById.
    result.data.forEach((job) => {
      queryClient.setQueryData(jobKeys.detail(String(job.id)), job);
    });
    return result;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
});

export function useJobsQuery() {
  return useInfiniteQuery(jobsInfiniteQueryOptions);
}

export function usePrefetchJobs() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.prefetchInfiniteQuery(jobsInfiniteQueryOptions),
    [queryClient],
  );
}

export function jobDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });
}

export function useJobQuery(id: string) {
  return useQuery(jobDetailQueryOptions(id));
}

export function usePrefetchJob() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: JobId) => queryClient.prefetchQuery(jobDetailQueryOptions(String(id))),
    [queryClient],
  );
}

export function useSubmitApplicationMutation() {
  return useMutation({
    mutationFn: ({ jobId, ...payload }: ApplicationPayload & { jobId: string }) =>
      submitApplication(jobId, payload),
  });
}
