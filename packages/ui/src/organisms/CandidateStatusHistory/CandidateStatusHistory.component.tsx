import StatusChip from '../../atoms/StatusChip';
import { formatTimestamp } from '../../utils/formatTimestamp';
import type { Props } from './CandidateStatusHistory.types';
import {
  SectionRoot,
  SectionTitle,
  HistoryList,
  HistoryItem,
  TransitionRow,
  ArrowIcon,
  HistoryTimestamp,
  EmptyState,
  LoadingBox,
  HistorySpinner,
} from './CandidateStatusHistory.styled';

export default function CandidateStatusHistory({ history, isLoading }: Props) {
  return (
    <SectionRoot>
      <SectionTitle variant="h6">Status History</SectionTitle>

      {isLoading ? (
        <LoadingBox>
          <HistorySpinner size={24} />
        </LoadingBox>
      ) : history.length === 0 ? (
        <EmptyState variant="body2">No status changes yet.</EmptyState>
      ) : (
        <HistoryList>
          {history.map((entry) => (
            <HistoryItem key={entry.id}>
              <TransitionRow>
                <StatusChip status={entry.fromStatus} />
                <ArrowIcon />
                <StatusChip status={entry.toStatus} />
              </TransitionRow>
              <HistoryTimestamp variant="caption">{formatTimestamp(entry.changedAt)}</HistoryTimestamp>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </SectionRoot>
  );
}
