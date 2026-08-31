import type { CandidateStatusHistoryEntry } from '@repo/types';

export interface Props {
  history: CandidateStatusHistoryEntry[];
  isLoading: boolean;
}
