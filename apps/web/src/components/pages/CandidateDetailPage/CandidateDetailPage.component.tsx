import { useParams } from 'react-router-dom';
import { useCandidateQuery } from '../../../features/candidates/candidateQueries';
import {
  useCandidateNotesQuery,
  useAddCandidateNoteMutation,
} from '../../../features/candidates/candidateNotesQueries';
import { CandidateDetailView } from '@repo/ui';

export default function CandidateDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: candidate, isLoading, isError } = useCandidateQuery(id);
  const { data: notes = [], isLoading: notesLoading } = useCandidateNotesQuery(id);
  const { mutate: addNote, isPending: notesSubmitting } = useAddCandidateNoteMutation(id);

  return (
    <CandidateDetailView
      candidate={candidate}
      isLoading={isLoading}
      isError={isError}
      notes={notes}
      notesLoading={notesLoading}
      notesSubmitting={notesSubmitting}
      onAddNote={addNote}
    />
  );
}
