import { useState } from 'react';
import { useCandidateList } from '../../../features/candidates/useCandidateList';
import { usePrefetchCandidate } from '../../../features/candidates/candidateQueries';
import { CandidateListView } from '@repo/ui';

export default function CandidateListPage() {
  const { candidates, isLoading, hasMore, isError, loadMore, addCandidate } = useCandidateList();
  const prefetchCandidate = usePrefetchCandidate();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <CandidateListView
      candidates={candidates}
      isLoading={isLoading}
      hasMore={hasMore}
      isError={isError}
      dialogOpen={dialogOpen}
      loadMore={loadMore}
      onAddClick={() => setDialogOpen(true)}
      onDialogClose={() => setDialogOpen(false)}
      onDialogSubmit={addCandidate}
      onCardHover={prefetchCandidate}
    />
  );
}
