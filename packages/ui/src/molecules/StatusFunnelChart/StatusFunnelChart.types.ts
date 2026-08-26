import type { Candidate } from '@repo/types';

export interface Props {
  counts: Record<Candidate['status'], number>;
}
