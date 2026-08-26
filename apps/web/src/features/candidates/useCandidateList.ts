import { useMemo, useState } from 'react';
import type { Candidate, CandidateId } from '@repo/types';
import { useCandidatesQuery, useCreateCandidateMutation } from './candidateQueries';
import type { CandidateFormValues } from '@repo/ui';

export function useCandidateList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Candidate['status'][]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<CandidateId>>(new Set());

  const filters = useMemo(
    () => ({
      search: search || undefined,
      status: status.length > 0 ? status : undefined,
    }),
    [search, status],
  );

  // The set of visible candidates changes entirely when filters change, so a
  // held-over selection would silently act on candidates the user can no
  // longer see. Reset during render (React's "adjusting state when a prop
  // changes" pattern) rather than an effect, to avoid an extra render pass.
  const [prevFilters, setPrevFilters] = useState(filters);
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    setSelectedIds(new Set());
  }

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

  function toggleSelect(id: CandidateId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    setSelectedIds((prev) => {
      const allSelected = candidates.length > 0 && candidates.every((c) => prev.has(c.id));
      return allSelected ? new Set() : new Set(candidates.map((c) => c.id));
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
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
    selectedIds,
    toggleSelect,
    selectAllVisible,
    clearSelection,
  };
}
