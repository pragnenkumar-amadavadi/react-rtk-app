import type { Candidate, CandidateId } from '@repo/types';
import type { CandidateFormValues } from '../../organisms/AddCandidateDialog';

export interface CandidateListViewProps {
  candidates: Candidate[];
  isLoading: boolean;
  hasMore: boolean;
  isError: boolean;
  dialogOpen: boolean;
  loadMore: () => void;
  onAddClick: () => void;
  onDialogClose: () => void;
  onDialogSubmit: (values: CandidateFormValues) => void;
  onCardHover: (id: CandidateId) => void;
}
