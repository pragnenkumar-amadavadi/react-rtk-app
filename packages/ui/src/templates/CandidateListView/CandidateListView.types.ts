import type { Candidate, CandidateId } from '@repo/types';
import type { CandidateFormValues } from '../../organisms/AddCandidateDialog';

export interface CandidateListViewProps {
  candidates: Candidate[];
  total: number;
  isLoading: boolean;
  hasMore: boolean;
  isError: boolean;
  dialogOpen: boolean;
  status: Candidate['status'][];
  loadMore: () => void;
  onAddClick: () => void;
  onDialogClose: () => void;
  onDialogSubmit: (values: CandidateFormValues) => void;
  onCardHover: (id: CandidateId) => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: Candidate['status'][]) => void;
  selectedIds: Set<CandidateId>;
  onToggleSelect: (id: CandidateId) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onBulkStatusChange: (status: Candidate['status']) => void;
  isBulkUpdating?: boolean;
}
