import type { Candidate } from '@repo/types';

export interface Props {
  selectedCount: number;
  isUpdating?: boolean;
  onMoveToStatus: (status: Candidate['status']) => void;
  onClear: () => void;
}
