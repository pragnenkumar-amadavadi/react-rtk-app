import { apiClient } from '@repo/api-client';
import type {
  BulkCandidateStatusResponse,
  Candidate,
  CandidateId,
  CandidateListParams,
  CandidateListResponse,
} from '@repo/types';
import type { CandidateFormValues } from '@repo/ui';

export async function fetchCandidates(params: CandidateListParams): Promise<CandidateListResponse> {
  // Sent as a single comma-separated value rather than axios's default array
  // serialization (`status[]=a&status[]=b`) — Express 5's default "simple"
  // query parser (Node's built-in querystring) doesn't parse bracket notation
  // into an array, so `status[]=...` would silently never match server-side.
  const { status, ...rest } = params;
  const { data } = await apiClient.get<CandidateListResponse>('/candidates', {
    params: { ...rest, status: status && status.length > 0 ? status.join(',') : undefined },
  });
  return data;
}

export async function createCandidate(body: CandidateFormValues): Promise<Candidate> {
  const { data } = await apiClient.post<Candidate>('/candidates', body);
  return data;
}

export async function fetchCandidateById(id: string): Promise<Candidate> {
  const { data } = await apiClient.get<Candidate>(`/candidates/${id}`);
  return data;
}

export async function updateCandidateStatus({
  id,
  status,
}: {
  id: string;
  status: Candidate['status'];
}): Promise<Candidate> {
  const { data } = await apiClient.patch<Candidate>(`/candidates/${id}/status`, { status });
  return data;
}

export async function bulkUpdateCandidateStatus({
  ids,
  status,
}: {
  ids: CandidateId[];
  status: Candidate['status'];
}): Promise<BulkCandidateStatusResponse> {
  const { data } = await apiClient.patch<BulkCandidateStatusResponse>('/candidates/bulk-status', {
    ids,
    status,
  });
  return data;
}
