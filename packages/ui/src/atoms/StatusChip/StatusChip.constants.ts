import type { Candidate } from '@repo/types';

// Single source of truth for candidate status display labels — other
// components that render or offer a status (filter chips, bulk actions,
// status-change buttons) import this rather than re-declaring their own copy.
export const STATUS_LABELS: Record<Candidate['status'], string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};
