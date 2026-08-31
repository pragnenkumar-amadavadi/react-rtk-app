import type { CandidateId, CandidateStatus } from './candidate';

export interface CandidateStatusHistoryEntry {
  id: number;
  candidateId: CandidateId;
  fromStatus: CandidateStatus;
  toStatus: CandidateStatus;
  changedAt: string;
}
