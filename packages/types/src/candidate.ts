import type { Brand } from './brand';
import type { PaginatedResponse, PaginationParams } from './pagination';

export type CandidateId = Brand<number, 'CandidateId'>;

export function toCandidateId(id: number): CandidateId {
  return id as CandidateId;
}

export interface Candidate {
  id: CandidateId;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: number;
  location: string;
  avatarUrl: string;
  appliedAt: string;
}

export type CandidateListResponse = PaginatedResponse<Candidate>;

export type CandidateListParams = PaginationParams & {
  search?: string;
  status?: Candidate['status'][];
};

export interface BulkCandidateStatusResult {
  id: CandidateId;
  success: boolean;
  candidate?: Candidate;
  error?: string;
}

export interface BulkCandidateStatusResponse {
  results: BulkCandidateStatusResult[];
}
