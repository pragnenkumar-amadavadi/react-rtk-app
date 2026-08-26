import type { Candidate } from '@repo/types';

export interface CandidateDetailViewProps {
  candidate: Candidate | undefined;
  isLoading: boolean;
  isError: boolean;
}
