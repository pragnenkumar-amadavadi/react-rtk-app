import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCandidateNotes, createCandidateNote } from '../../api/candidateNotesApi';

export const candidateNoteKeys = {
  all: ['candidateNotes'] as const,
  lists: () => [...candidateNoteKeys.all, 'list'] as const,
  list: (candidateId: string) => [...candidateNoteKeys.lists(), candidateId] as const,
};

export function candidateNotesQueryOptions(candidateId: string) {
  return queryOptions({
    queryKey: candidateNoteKeys.list(candidateId),
    queryFn: () => fetchCandidateNotes(candidateId),
    enabled: !!candidateId,
  });
}

export function useCandidateNotesQuery(candidateId: string) {
  return useQuery(candidateNotesQueryOptions(candidateId));
}

export function useAddCandidateNoteMutation(candidateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => createCandidateNote(candidateId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateNoteKeys.list(candidateId) });
    },
  });
}
