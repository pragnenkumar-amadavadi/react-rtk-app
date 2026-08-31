import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchCandidateStatusHistory } from '../../api/candidateStatusHistoryApi';

export const candidateStatusHistoryKeys = {
  all: ['candidateStatusHistory'] as const,
  lists: () => [...candidateStatusHistoryKeys.all, 'list'] as const,
  list: (candidateId: string) => [...candidateStatusHistoryKeys.lists(), candidateId] as const,
};

export function candidateStatusHistoryQueryOptions(candidateId: string) {
  return queryOptions({
    queryKey: candidateStatusHistoryKeys.list(candidateId),
    queryFn: () => fetchCandidateStatusHistory(candidateId),
    enabled: !!candidateId,
  });
}

export function useCandidateStatusHistoryQuery(candidateId: string) {
  return useQuery(candidateStatusHistoryQueryOptions(candidateId));
}
