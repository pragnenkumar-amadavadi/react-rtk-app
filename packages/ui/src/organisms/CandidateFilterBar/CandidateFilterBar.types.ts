import type { Candidate } from '@repo/types';

export interface Props {
  status: Candidate['status'][];
  shownCount: number;
  totalCount: number;
  isInitialLoading: boolean;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: Candidate['status'][]) => void;
}
