import type { Candidate } from '@repo/types';
import StatusChip from '../../atoms/StatusChip';
import type { Props } from './CandidateStatusControl.types';
import { StatusControlRoot, ActionsRow, ActionButton } from './CandidateStatusControl.styled';

// Sensible next stages per current status — enforced only here, on the FE.
// The BE accepts any valid status; this is what keeps the UI from offering
// nonsensical transitions like "Hired" -> "Applied".
const NEXT_STATUSES: Record<Candidate['status'], Candidate['status'][]> = {
  applied: ['screening', 'rejected'],
  screening: ['interview', 'rejected'],
  interview: ['offer', 'rejected'],
  offer: ['hired', 'rejected'],
  hired: [],
  rejected: [],
};

const ACTION_LABELS: Record<Candidate['status'], string> = {
  applied: 'Move to Applied',
  screening: 'Move to Screening',
  interview: 'Move to Interview',
  offer: 'Move to Offer',
  hired: 'Mark as Hired',
  rejected: 'Reject',
};

export default function CandidateStatusControl({ status, isUpdating = false, onStatusChange }: Props) {
  const nextStatuses = NEXT_STATUSES[status];

  return (
    <StatusControlRoot>
      <StatusChip status={status} />
      {nextStatuses.length > 0 && (
        <ActionsRow>
          {nextStatuses.map((next) => (
            <ActionButton
              key={next}
              size="small"
              variant={next === 'rejected' ? 'outlined' : 'contained'}
              color={next === 'rejected' ? 'error' : 'primary'}
              disabled={isUpdating}
              onClick={() => onStatusChange(next)}
            >
              {ACTION_LABELS[next]}
            </ActionButton>
          ))}
        </ActionsRow>
      )}
    </StatusControlRoot>
  );
}
