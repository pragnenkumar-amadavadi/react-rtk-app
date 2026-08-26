import CandidateCard from '../../molecules/CandidateCard';
import type { Props } from './JobApplicants.types';
import {
  SectionRoot,
  SectionTitle,
  ApplicantGrid,
  CardLink,
  EmptyState,
  LoadingBox,
  ApplicantsSpinner,
  ErrorAlert,
} from './JobApplicants.styled';

export default function JobApplicants({ applicants, isLoading, isError }: Props) {
  return (
    <SectionRoot>
      <SectionTitle variant="h6">Applicants ({applicants.length})</SectionTitle>

      {isError ? (
        <ErrorAlert severity="error">Failed to load applicants.</ErrorAlert>
      ) : isLoading ? (
        <LoadingBox>
          <ApplicantsSpinner size={24} />
        </LoadingBox>
      ) : applicants.length === 0 ? (
        <EmptyState variant="body2">No applicants yet.</EmptyState>
      ) : (
        <ApplicantGrid>
          {applicants.map((applicant) => (
            <CardLink key={applicant.id} to={`/candidates/${applicant.id}`}>
              <CandidateCard candidate={applicant} />
            </CardLink>
          ))}
        </ApplicantGrid>
      )}
    </SectionRoot>
  );
}
