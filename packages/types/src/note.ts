import type { CandidateId } from './candidate';

export interface CandidateNote {
  id: number;
  candidateId: CandidateId;
  body: string;
  createdAt: string;
}
