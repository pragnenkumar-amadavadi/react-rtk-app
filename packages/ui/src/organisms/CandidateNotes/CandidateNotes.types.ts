import type { CandidateNote } from '@repo/types';

export interface Props {
  notes: CandidateNote[];
  isLoading: boolean;
  isSubmitting: boolean;
  onAddNote: (body: string) => void;
}
