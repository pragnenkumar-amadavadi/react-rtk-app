import type { Candidate } from '@repo/types';

export interface Props {
  applicants: Candidate[];
  isLoading: boolean;
  isError: boolean;
}
