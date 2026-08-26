import { apiClient } from '@repo/api-client';
import type { Candidate, CandidateListParams, CandidateListResponse } from '@repo/types';
import type { CandidateFormValues } from '@repo/ui';

export async function fetchCandidates(params: CandidateListParams): Promise<CandidateListResponse> {
  const { data } = await apiClient.get<CandidateListResponse>('/candidates', { params });
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
