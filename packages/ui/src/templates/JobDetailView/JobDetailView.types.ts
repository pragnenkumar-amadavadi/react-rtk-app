import type { Candidate, Job } from '@repo/types';

export interface Props {
  job: Job | undefined;
  isLoading: boolean;
  isError: boolean;
  applied?: boolean;
  applicants: Candidate[];
  applicantsLoading: boolean;
  applicantsError: boolean;
}
