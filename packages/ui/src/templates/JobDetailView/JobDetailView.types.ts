import type { Job } from '@repo/types';

export interface Props {
  job: Job | undefined;
  isLoading: boolean;
  isError: boolean;
  applied?: boolean;
}
