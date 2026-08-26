import type { Candidate } from '@repo/types';

export interface Props {
  status: Candidate['status'];
  isUpdating?: boolean;
  onStatusChange: (status: Candidate['status']) => void;
}
