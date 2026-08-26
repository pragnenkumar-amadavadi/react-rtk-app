import type { Brand } from './brand';
import type { PaginatedResponse, PaginationParams } from './pagination';

export type CandidateId = Brand<number, 'CandidateId'>;

export function toCandidateId(id: number): CandidateId {
  return id as CandidateId;
}

// Single source of truth for candidate status values — the type is derived
// from this array so the two can never drift apart. Consumers that need the
// valid-values list at runtime (validation, filter options, iteration order)
// should import this rather than re-declaring their own copy.
export const CANDIDATE_STATUSES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const;

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export interface Candidate {
  id: CandidateId;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: CandidateStatus;
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
