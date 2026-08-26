import { memo } from 'react';
import StatusChip from '../../atoms/StatusChip';
import type { Props } from './CandidateCard.types';
import {
  StyledCard,
  StyledCardContent,
  CardHeader,
  CandidateAvatar,
  CandidateInfo,
  NameRow,
  CandidateName,
  PositionRow,
  PositionText,
  CardDivider,
  ContactRow,
  ContactItem,
  ContactText,
  AppliedDate,
  AppliedText,
  WorkSmallIcon,
  EmailSmallIcon,
  PhoneSmallIcon,
  LocationSmallIcon,
} from './CandidateCard.styled';

function CandidateCard({ candidate }: Props) {
  const appliedDate = new Date(candidate.appliedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <CardHeader>
          <CandidateAvatar src={candidate.avatarUrl} alt={candidate.name} />

          <CandidateInfo>
            <NameRow>
              <CandidateName variant="subtitle1" noWrap>
                {candidate.name}
              </CandidateName>
              <StatusChip status={candidate.status} />
            </NameRow>
            <PositionRow>
              <WorkSmallIcon />
              <PositionText variant="body2" noWrap>
                {candidate.position} · {candidate.experience}y exp
              </PositionText>
            </PositionRow>
          </CandidateInfo>
        </CardHeader>

        <CardDivider />

        <ContactRow>
          <ContactItem>
            <EmailSmallIcon />
            <ContactText variant="caption" noWrap>{candidate.email}</ContactText>
          </ContactItem>
          <ContactItem>
            <PhoneSmallIcon />
            <ContactText variant="caption" noWrap>{candidate.phone}</ContactText>
          </ContactItem>
          <ContactItem>
            <LocationSmallIcon />
            <ContactText variant="caption" noWrap>{candidate.location}</ContactText>
          </ContactItem>
          <AppliedDate>
            <AppliedText variant="caption">Applied {appliedDate}</AppliedText>
          </AppliedDate>
        </ContactRow>
      </StyledCardContent>
    </StyledCard>
  );
}

export default memo(CandidateCard);
