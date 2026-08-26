import { useParams } from 'react-router-dom';
import type { Candidate } from '@repo/types';
import {
  useCandidateQuery,
  useUpdateCandidateStatusMutation,
} from '../../../features/candidates/candidateQueries';
import { CandidateDetailView } from '@repo/ui';

export default function CandidateDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: candidate, isLoading, isError } = useCandidateQuery(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCandidateStatusMutation();

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
    />
  );
}
