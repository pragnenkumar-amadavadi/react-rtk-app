import { useParams } from 'react-router-dom';
import type { Candidate } from '@repo/types';
import {
  useCandidateQuery,
  useUpdateCandidateStatusMutation,
} from '../../../features/candidates/candidateQueries';
import {
  useCandidateNotesQuery,
  useAddCandidateNoteMutation,
} from '../../../features/candidates/candidateNotesQueries';
import { CandidateDetailView } from '@repo/ui';

export default function CandidateDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: candidate, isLoading, isError } = useCandidateQuery(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCandidateStatusMutation();
  const { data: notes = [], isLoading: notesLoading } = useCandidateNotesQuery(id);
  const { mutate: addNote, isPending: notesSubmitting } = useAddCandidateNoteMutation(id);

  function handleStatusChange(status: Candidate['status']) {
    updateStatus({ id, status });
  }

  return (
    <CandidateDetailView
      candidate={candidate}
      isLoading={isLoading}
      isError={isError}
      isUpdatingStatus={isUpdatingStatus}
      onStatusChange={handleStatusChange}
      notes={notes}
      notesLoading={notesLoading}
      notesSubmitting={notesSubmitting}
      onAddNote={addNote}
    />
  );
}
