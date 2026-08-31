import { apiClient } from '@repo/api-client';
import type { CandidateStatusHistoryEntry } from '@repo/types';

export async function fetchCandidateStatusHistory(candidateId: string): Promise<CandidateStatusHistoryEntry[]> {
  const { data } = await apiClient.get<CandidateStatusHistoryEntry[]>(`/candidates/${candidateId}/status-history`);
  return data;
}
