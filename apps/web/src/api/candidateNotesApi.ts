import { apiClient } from '@repo/api-client';
import type { CandidateNote } from '@repo/types';

export async function fetchCandidateNotes(candidateId: string): Promise<CandidateNote[]> {
  const { data } = await apiClient.get<CandidateNote[]>(`/candidates/${candidateId}/notes`);
  return data;
}

export async function createCandidateNote(candidateId: string, body: string): Promise<CandidateNote> {
  const { data } = await apiClient.post<CandidateNote>(`/candidates/${candidateId}/notes`, { body });
  return data;
}
