import type { Candidate, CandidateId } from './candidate';
import type { JobId } from './job';

export interface Application {
  id: number;
  jobId: JobId;
  candidateId: CandidateId;
  status: 'pending';
  appliedAt: string;
}

export interface ApplicantsResponse {
  data: Candidate[];
  total: number;
}
