import type { Candidate } from '@repo/types';
import StatusChip, { STATUS_LABELS } from '../../atoms/StatusChip';
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

// Verb-phrase overrides for the two stages that don't read naturally as
// "Move to X" — every other stage derives its label from STATUS_LABELS.
const ACTION_LABEL_OVERRIDES: Partial<Record<Candidate['status'], string>> = {
  hired: 'Mark as Hired',
  rejected: 'Reject',
};

function actionLabelFor(status: Candidate['status']): string {
  return ACTION_LABEL_OVERRIDES[status] ?? `Move to ${STATUS_LABELS[status]}`;
}

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
              {actionLabelFor(next)}
            </ActionButton>
          ))}
        </ActionsRow>
      )}
    </StatusControlRoot>
  );
}
