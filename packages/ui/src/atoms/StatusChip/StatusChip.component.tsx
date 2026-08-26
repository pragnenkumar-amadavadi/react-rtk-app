import type { Candidate } from '@repo/types';
import type { Props } from './StatusChip.types';
import { StyledChip } from './StatusChip.styled';

const STATUS_CONFIG: Record<Candidate['status'], { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  applied:   { label: 'Applied',   color: 'default' },
  screening: { label: 'Screening', color: 'info' },
  interview: { label: 'Interview', color: 'primary' },
  offer:     { label: 'Offer',     color: 'warning' },
  hired:     { label: 'Hired',     color: 'success' },
  rejected:  { label: 'Rejected',  color: 'error' },
};

export default function StatusChip({ status }: Props) {
  const { label, color } = STATUS_CONFIG[status];
  return <StyledChip label={label} color={color} size="small" variant="outlined" />;
}
