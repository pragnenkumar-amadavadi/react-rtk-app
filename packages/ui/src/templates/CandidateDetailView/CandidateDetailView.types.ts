import type { Candidate, CandidateNote } from '@repo/types';

export interface CandidateDetailViewProps {
  candidate: Candidate | undefined;
  isLoading: boolean;
  isError: boolean;
  notes: CandidateNote[];
  notesLoading: boolean;
  notesSubmitting: boolean;
  onAddNote: (body: string) => void;
}
