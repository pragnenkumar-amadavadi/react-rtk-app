import type { Candidate } from './candidate';

export interface DashboardStats {
  openCandidates: number;
  openJobs: number;
  hiredThisMonth: number;
  candidateStatusCounts: Record<Candidate['status'], number>;
}
