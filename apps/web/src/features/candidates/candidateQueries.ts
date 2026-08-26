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
import { fetchCandidates, createCandidate, fetchCandidateById } from '../../api/candidatesApi';
import type { CandidateId } from '@repo/types';

const LIMIT = 20;

// Query key factory — hierarchical so partial invalidation works at every level:
//   invalidate candidateKeys.all     → busts everything (candidates)
//   invalidate candidateKeys.lists() → busts every list variant (filtered, paginated, etc.)
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: () => [...candidateKeys.lists()] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
};

// Single source of truth for query config — shared by the hook, prefetch calls,
// and route loaders so key / fn / pagination logic never drift apart.
export const candidatesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: candidateKeys.lists(),
  queryFn: async ({ pageParam }) => {
    const result = await fetchCandidates({ page: pageParam as number, limit: LIMIT });
    // Seed the detail cache from list data so navigating to a candidate already in
    // the list renders instantly instead of firing a redundant fetchCandidateById.
    result.data.forEach((candidate) => {
      queryClient.setQueryData(candidateKeys.detail(String(candidate.id)), candidate);
    });
    return result;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
});

export function useCandidatesQuery() {
  return useInfiniteQuery(candidatesInfiniteQueryOptions);
}

// Returns a stable callback that warms the cache for the candidates list.
// No-ops when data is already fresh (respects global staleTime = 5 min).
// Use on nav-link hover or in route loaders to reduce perceived load time.
export function usePrefetchCandidates() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.prefetchInfiniteQuery(candidatesInfiniteQueryOptions),
    [queryClient],
  );
}

export function candidateDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: candidateKeys.detail(id),
    queryFn: () => fetchCandidateById(id),
    enabled: !!id,
  });
}

export function useCandidateQuery(id: string) {
  return useQuery(candidateDetailQueryOptions(id));
}

// Returns a callback that warms the detail cache for a single candidate by id.
// Attach to onMouseEnter of a candidate card — fires before navigation so the
// detail page renders with data already available.
export function usePrefetchCandidate() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: CandidateId) => queryClient.prefetchQuery(candidateDetailQueryOptions(String(id))),
    [queryClient],
  );
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}
