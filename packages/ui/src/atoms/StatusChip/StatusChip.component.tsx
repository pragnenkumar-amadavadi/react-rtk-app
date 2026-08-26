import type { Candidate } from '@repo/types';
import type { Props } from './StatusChip.types';
import { STATUS_LABELS } from './StatusChip.constants';
import { StyledChip } from './StatusChip.styled';

const STATUS_COLORS: Record<Candidate['status'], 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  applied: 'default',
  screening: 'info',
  interview: 'primary',
  offer: 'warning',
  hired: 'success',
  rejected: 'error',
};

export default function StatusChip({ status }: Props) {
  return <StyledChip label={STATUS_LABELS[status]} color={STATUS_COLORS[status]} size="small" variant="outlined" />;
}
