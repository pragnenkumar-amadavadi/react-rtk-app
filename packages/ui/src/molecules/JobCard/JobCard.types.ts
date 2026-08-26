import type { Job, JobId } from '@repo/types';

export interface Props {
  job: Job;
  onHover?: (id: JobId) => void;
}
