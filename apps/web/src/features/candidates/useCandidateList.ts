import { useMemo, useState } from 'react';
import type { Candidate } from '@repo/types';
import { useCandidatesQuery, useCreateCandidateMutation } from './candidateQueries';
import type { CandidateFormValues } from '@repo/ui';

export function useCandidateList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Candidate['status'][]>([]);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      status: status.length > 0 ? status : undefined,
    }),
    [search, status],
  );

  const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage, isError } =
    useCandidatesQuery(filters);

  const { mutateAsync: saveCandidate } = useCreateCandidateMutation();

  // Stable reference across renders where `data` hasn't changed (e.g. dialog
  // open/close) — lets Virtuoso and React.memo(CandidateCard) skip work.
  const candidates = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const total = data?.pages[data.pages.length - 1]?.total ?? 0;
  const isLoading = isFetching && candidates.length === 0;

  async function addCandidate(values: CandidateFormValues) {
    await saveCandidate(values);
  }

  function loadMore() {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }

  return {
    candidates,
    total,
    isLoading,
    hasMore: hasNextPage ?? false,
    isError,
    loadMore,
    addCandidate,
    search,
    status,
    onSearchChange: setSearch,
    onStatusChange: setStatus,
  };
}
