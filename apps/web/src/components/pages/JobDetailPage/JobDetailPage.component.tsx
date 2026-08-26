import { useParams, useLocation } from 'react-router-dom';
import { useJobQuery } from '../../../features/jobs/jobQueries';
import { JobDetailView } from '@repo/ui';

export default function JobDetailPage() {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const location = useLocation();
  const applied = location.state?.applied === true;

  const { data: job, isLoading, isError } = useJobQuery(jobId);

  return <JobDetailView job={job} isLoading={isLoading} isError={isError} applied={applied} />;
}
