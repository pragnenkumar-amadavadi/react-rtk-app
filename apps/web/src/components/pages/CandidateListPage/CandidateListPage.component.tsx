import { useState } from 'react';
import { useCandidateList } from '../../../features/candidates/useCandidateList';
import { usePrefetchCandidate } from '../../../features/candidates/candidateQueries';
import { CandidateListView } from '@repo/ui';

export default function CandidateListPage() {
  const {
    candidates,
    total,
    isLoading,
    hasMore,
    isError,
    loadMore,
    addCandidate,
    status,
    onSearchChange,
    onStatusChange,
  } = useCandidateList();
  const prefetchCandidate = usePrefetchCandidate();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <CandidateListView
      candidates={candidates}
      total={total}
      isLoading={isLoading}
      hasMore={hasMore}
      isError={isError}
      dialogOpen={dialogOpen}
      status={status}
      loadMore={loadMore}
      onAddClick={() => setDialogOpen(true)}
      onDialogClose={() => setDialogOpen(false)}
      onDialogSubmit={addCandidate}
      onCardHover={prefetchCandidate}
      onSearchChange={onSearchChange}
      onStatusChange={onStatusChange}
    />
  );
}
