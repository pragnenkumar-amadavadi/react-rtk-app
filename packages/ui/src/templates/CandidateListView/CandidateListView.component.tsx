import { lazy, Suspense, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import AddIcon from '@mui/icons-material/Add';
import CandidateCard from '../../molecules/CandidateCard';
import CandidateFilterBar from '../../organisms/CandidateFilterBar';
import BulkStatusToolbar from '../../organisms/BulkStatusToolbar';
import type { CandidateListViewProps } from './CandidateListView.types';

// Lazy — pulls in react-hook-form + zod + MUI form fields, only needed once the
// user actually opens the dialog. Kept as a plain lazy() (not exported) since
// this file's default export is still the only component export.
const AddCandidateDialog = lazy(() => import('../../organisms/AddCandidateDialog'));
import {
  PageContainer,
  PageHeader,
  PageIcon,
  TitleBlock,
  PageTitle,
  AddButton,
  ErrorAlert,
  SkeletonList,
  SkeletonCard,
  SkeletonHeader,
  SkeletonTextBlock,
  SkeletonAvatar,
  SkeletonText,
  SkeletonChip,
  SkeletonDividerLine,
  SkeletonRow,
  FooterCenter,
  FooterEnd,
  ListSpinner,
  EndMessage,
  CardLink,
  CandidateRow,
  RowCheckbox,
  SelectionBar,
  SelectAllControl,
  SelectAllCheckbox,
} from './CandidateListView.styled';

function CardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonHeader>
        <SkeletonAvatar variant="circular" width={56} height={56} />
        <SkeletonTextBlock>
          <SkeletonText width="40%" height={24} />
          <SkeletonText width="60%" height={18} />
        </SkeletonTextBlock>
        <SkeletonChip width={72} height={24} />
      </SkeletonHeader>
      <SkeletonDividerLine width="100%" height={1} />
      <SkeletonRow>
        <SkeletonText width="30%" height={16} />
        <SkeletonText width="25%" height={16} />
        <SkeletonText width="20%" height={16} />
      </SkeletonRow>
    </SkeletonCard>
  );
}

function ListFooter({ isLoading, hasMore }: { isLoading: boolean; hasMore: boolean }) {
  if (isLoading) {
    return (
      <FooterCenter>
        <ListSpinner size={28} />
      </FooterCenter>
    );
  }
  if (!hasMore) {
    return (
      <FooterEnd>
        <EndMessage variant="body2">All candidates loaded</EndMessage>
      </FooterEnd>
    );
  }
  return null;
}

export default function CandidateListView({
  candidates,
  total,
  isLoading,
  hasMore,
  isError,
  dialogOpen,
  status,
  loadMore,
  onAddClick,
  onDialogClose,
  onDialogSubmit,
  onCardHover,
  onSearchChange,
  onStatusChange,
  selectedIds,
  onToggleSelect,
  onSelectAllVisible,
  onClearSelection,
  onBulkStatusChange,
  isBulkUpdating,
}: CandidateListViewProps) {
  const isInitialLoading = isLoading && candidates.length === 0;
  const allVisibleSelected = candidates.length > 0 && candidates.every((c) => selectedIds.has(c.id));
  const someVisibleSelected = candidates.some((c) => selectedIds.has(c.id));

  // Mount the dialog lazily on first open, then keep it mounted so MUI's
  // close (fade-out) transition still plays on subsequent closes.
  const [hasOpenedDialog, setHasOpenedDialog] = useState(dialogOpen);
  if (dialogOpen && !hasOpenedDialog) setHasOpenedDialog(true);

  return (
    <PageContainer maxWidth="md">
      <PageHeader>
        <PageIcon />
        <TitleBlock>
          <PageTitle variant="h5">Candidate List</PageTitle>
        </TitleBlock>
        <AddButton variant="contained" startIcon={<AddIcon />} onClick={onAddClick}>
          Add Candidate
        </AddButton>
      </PageHeader>

      <CandidateFilterBar
        status={status}
        shownCount={candidates.length}
        totalCount={total}
        isInitialLoading={isInitialLoading}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
      />

      {isError && (
        <ErrorAlert severity="error">
          Failed to load candidates. Make sure the mock server is running on port 8080.
        </ErrorAlert>
      )}

      {isInitialLoading ? (
        <SkeletonList>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </SkeletonList>
      ) : (
        <>
          <SelectionBar>
            <SelectAllControl
              control={
                <SelectAllCheckbox
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected && !allVisibleSelected}
                  onChange={onSelectAllVisible}
                />
              }
              label="Select all visible"
            />
            <BulkStatusToolbar
              selectedCount={selectedIds.size}
              isUpdating={isBulkUpdating}
              onMoveToStatus={onBulkStatusChange}
              onClear={onClearSelection}
            />
          </SelectionBar>

          <Virtuoso
            useWindowScroll
            data={candidates}
            endReached={() => { if (hasMore) loadMore(); }}
            overscan={400}
            itemContent={(_, candidate) => (
              <CandidateRow>
                <RowCheckbox
                  checked={selectedIds.has(candidate.id)}
                  onChange={() => onToggleSelect(candidate.id)}
                />
                <CardLink
                  to={`/candidates/${candidate.id}`}
                  onMouseEnter={() => onCardHover(candidate.id)}
                >
                  <CandidateCard candidate={candidate} />
                </CardLink>
              </CandidateRow>
            )}
            components={{
              Footer: () => <ListFooter isLoading={isLoading} hasMore={hasMore} />,
            }}
          />
        </>
      )}

      {hasOpenedDialog && (
        <Suspense fallback={null}>
          <AddCandidateDialog
            open={dialogOpen}
            onClose={onDialogClose}
            onSubmit={onDialogSubmit}
          />
        </Suspense>
      )}
    </PageContainer>
  );
}
