import StatusChip from '../../atoms/StatusChip';
import type { CandidateDetailViewProps } from './CandidateDetailView.types';
import {
  PageContainer,
  BackLink,
  BackIcon,
  DetailCard,
  DetailHeader,
  DetailAvatar,
  HeaderInfo,
  NameRow,
  DetailName,
  SubtitleText,
  SectionDivider,
  ContactGrid,
  FieldLabel,
  FieldValue,
  LoadingBox,
  DetailSpinner,
  ErrorBox,
  DetailErrorAlert,
} from './CandidateDetailView.styled';

export default function CandidateDetailView({ candidate, isLoading, isError }: CandidateDetailViewProps) {
  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <LoadingBox>
          <DetailSpinner size={40} />
        </LoadingBox>
      </PageContainer>
    );
  }

  if (isError || !candidate) {
    return (
      <PageContainer maxWidth="md">
        <BackLink to="/">
          <BackIcon /> Back to candidates
        </BackLink>
        <ErrorBox>
          <DetailErrorAlert severity="error">
            Failed to load candidate. Please try again.
          </DetailErrorAlert>
        </ErrorBox>
      </PageContainer>
    );
  }

  const appliedDate = new Date(candidate.appliedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const expLabel = `${candidate.experience} yr${candidate.experience !== 1 ? 's' : ''} exp`;

  return (
    <PageContainer maxWidth="md">
      <BackLink to="/">
        <BackIcon /> Back to candidates
      </BackLink>

      <DetailCard>
        <DetailHeader>
          <DetailAvatar src={candidate.avatarUrl} alt={candidate.name} />
          <HeaderInfo>
            <NameRow>
              <DetailName variant="h5">{candidate.name}</DetailName>
              <StatusChip status={candidate.status} />
            </NameRow>
            <SubtitleText variant="body2">
              {candidate.position} · {expLabel}
            </SubtitleText>
          </HeaderInfo>
        </DetailHeader>

        <SectionDivider />

        <ContactGrid>
          <div>
            <FieldLabel variant="caption">Email</FieldLabel>
            <FieldValue variant="body1">{candidate.email}</FieldValue>
          </div>
          <div>
            <FieldLabel variant="caption">Phone</FieldLabel>
            <FieldValue variant="body1">{candidate.phone}</FieldValue>
          </div>
          <div>
            <FieldLabel variant="caption">Location</FieldLabel>
            <FieldValue variant="body1">{candidate.location}</FieldValue>
          </div>
          <div>
            <FieldLabel variant="caption">Applied</FieldLabel>
            <FieldValue variant="body1">{appliedDate}</FieldValue>
          </div>
        </ContactGrid>
      </DetailCard>
    </PageContainer>
  );
}
