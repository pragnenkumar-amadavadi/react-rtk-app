import { useState } from 'react';
import type { Candidate } from '@repo/types';
import { useCandidateList } from '../../../features/candidates/useCandidateList';
import {
  usePrefetchCandidate,
  useBulkUpdateCandidateStatusMutation,
} from '../../../features/candidates/candidateQueries';
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
    selectedIds,
    toggleSelect,
    selectAllVisible,
    clearSelection,
  } = useCandidateList();
  const prefetchCandidate = usePrefetchCandidate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: bulkUpdateStatus, isPending: isBulkUpdating } = useBulkUpdateCandidateStatusMutation();

  function handleBulkStatusChange(newStatus: Candidate['status']) {
    bulkUpdateStatus(
      { ids: Array.from(selectedIds), status: newStatus },
      { onSuccess: clearSelection },
    );
  }

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
      selectedIds={selectedIds}
      onToggleSelect={toggleSelect}
      onSelectAllVisible={selectAllVisible}
      onClearSelection={clearSelection}
      onBulkStatusChange={handleBulkStatusChange}
      isBulkUpdating={isBulkUpdating}
    />
  );
}
