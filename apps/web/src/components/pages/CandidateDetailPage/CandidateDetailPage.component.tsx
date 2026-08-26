import { useParams } from 'react-router-dom';
import { useCandidateQuery } from '../../../features/candidates/candidateQueries';
import { CandidateDetailView } from '@repo/ui';

export default function CandidateDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: candidate, isLoading, isError } = useCandidateQuery(id);

  return (
    <CandidateDetailView
      candidate={candidate}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
