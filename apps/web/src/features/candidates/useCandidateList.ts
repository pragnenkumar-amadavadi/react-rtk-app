import { useMemo } from 'react';
import { useCandidatesQuery, useCreateCandidateMutation } from './candidateQueries';
import type { CandidateFormValues } from '@repo/ui';

export function useCandidateList() {
  const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage, isError } =
    useCandidatesQuery();

  const { mutateAsync: saveCandidate } = useCreateCandidateMutation();

  // Stable reference across renders where `data` hasn't changed (e.g. dialog
  // open/close) — lets Virtuoso and React.memo(CandidateCard) skip work.
  const candidates = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const isLoading = isFetching && candidates.length === 0;

  async function addCandidate(values: CandidateFormValues) {
    await saveCandidate(values);
  }

  function loadMore() {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }

  return {
    candidates,
    isLoading,
    hasMore: hasNextPage ?? false,
    isError,
    loadMore,
    addCandidate,
  };
}
