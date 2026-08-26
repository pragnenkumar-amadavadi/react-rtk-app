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
import {
  fetchCandidates,
  createCandidate,
  fetchCandidateById,
  updateCandidateStatus,
  bulkUpdateCandidateStatus,
} from '../../api/candidatesApi';
import type { Candidate, CandidateId, CandidateListParams } from '@repo/types';

const LIMIT = 20;

// The filter subset of CandidateListParams — page/limit are pagination
// mechanics, not part of what makes one list "variant" different from another.
export type CandidateListFilters = Pick<CandidateListParams, 'search' | 'status'>;

// Query key factory — hierarchical so partial invalidation works at every level:
//   invalidate candidateKeys.all     → busts everything (candidates)
//   invalidate candidateKeys.lists() → busts every list variant (filtered, paginated, etc.)
//   invalidate candidateKeys.list(f) → busts one exact filter combination
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: (filters: CandidateListFilters = {}) => [...candidateKeys.lists(), filters] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
};

// Single source of truth for query config — shared by the hook, prefetch calls,
// and route loaders so key / fn / pagination logic never drift apart.
function buildCandidatesInfiniteQueryOptions(filters: CandidateListFilters = {}) {
  return infiniteQueryOptions({
    queryKey: candidateKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      const result = await fetchCandidates({ page: pageParam as number, limit: LIMIT, ...filters });
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
}

// Unfiltered variant — used by the route loader and nav-hover prefetch, neither
// of which know about the in-page filter state.
export const candidatesInfiniteQueryOptions = buildCandidatesInfiniteQueryOptions();

export function useCandidatesQuery(filters: CandidateListFilters = {}) {
  return useInfiniteQuery(buildCandidatesInfiniteQueryOptions(filters));
}

// Returns a stable callback that warms the cache for the unfiltered candidates
// list. No-ops when data is already fresh (respects global staleTime = 5 min).
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

// Optimistic — a deliberate, scoped exception to preferring invalidateQueries
// (see CLAUDE.md section 9): this is the app's highest-frequency interaction,
// so the detail cache is patched immediately in onMutate and rolled back in
// onError if the request fails. onSettled still resyncs from the server,
// which is also what busts the list cache (not optimistically patched here).
export function useUpdateCandidateStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCandidateStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: candidateKeys.detail(id) });
      const previousCandidate = queryClient.getQueryData<Candidate>(candidateKeys.detail(id));
      if (previousCandidate) {
        queryClient.setQueryData<Candidate>(candidateKeys.detail(id), { ...previousCandidate, status });
      }
      return { previousCandidate };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCandidate) {
        queryClient.setQueryData(candidateKeys.detail(id), context.previousCandidate);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(id) });
    },
  });
}

export function useBulkUpdateCandidateStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpdateCandidateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}
