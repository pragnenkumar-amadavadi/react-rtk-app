import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import JobApplicants from '../../organisms/JobApplicants';
import type { Props } from './JobDetailView.types';
import {
  PageContainer,
  BackLink,
  DetailTitle,
  CompanyText,
  MetaRow,
  SalaryText,
  TypeChip,
  SectionDivider,
  SectionTitle,
  DescriptionText,
  RequirementList,
  ApplyButton,
  LoadingBox,
  DetailSpinner,
  ErrorAlert,
  SuccessAlert,
} from './JobDetailView.styled';

export default function JobDetailView({
  job,
  isLoading,
  isError,
  applied = false,
  applicants,
  applicantsLoading,
  applicantsError,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingBox>
          <DetailSpinner />
        </LoadingBox>
      </PageContainer>
    );
  }

  if (isError || !job) {
    return (
      <PageContainer>
        <BackLink to="/jobs">
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Jobs
        </BackLink>
        <ErrorAlert severity="error">Failed to load job details.</ErrorAlert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/jobs">
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Jobs
      </BackLink>

      {applied && (
        <SuccessAlert severity="success">
          {"You've successfully applied for this position!"}
        </SuccessAlert>
      )}

      <DetailTitle variant="h4">{job.title}</DetailTitle>
      <CompanyText variant="h6">{job.company}</CompanyText>

      <MetaRow>
        <TypeChip label={job.type} variant="outlined" />
        <CompanyText variant="body2">{job.location}</CompanyText>
      </MetaRow>
      <SalaryText variant="body1">{job.salary}</SalaryText>

      <SectionDivider />
      <SectionTitle variant="h6">About this role</SectionTitle>
      <DescriptionText variant="body1">{job.description}</DescriptionText>

      <SectionDivider />
      <SectionTitle variant="h6">Requirements</SectionTitle>
      <RequirementList>
        {job.requirements.map((req) => (
          <li key={req}>{req}</li>
        ))}
      </RequirementList>

      {!applied && (
        <ApplyButton
          variant="contained"
          size="large"
          onClick={() => navigate(`/jobs/${job.id}/apply/1`)}
        >
          Apply Now
        </ApplyButton>
      )}

      <JobApplicants applicants={applicants} isLoading={applicantsLoading} isError={applicantsError} />
    </PageContainer>
  );
}
