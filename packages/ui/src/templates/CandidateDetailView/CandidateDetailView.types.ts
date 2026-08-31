import type { Candidate, CandidateNote, CandidateStatusHistoryEntry } from '@repo/types';

export interface CandidateDetailViewProps {
  candidate: Candidate | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdatingStatus?: boolean;
  onStatusChange: (status: Candidate['status']) => void;
  statusHistory: CandidateStatusHistoryEntry[];
  statusHistoryLoading: boolean;
  notes: CandidateNote[];
  notesLoading: boolean;
  notesSubmitting: boolean;
  onAddNote: (body: string) => void;
}
