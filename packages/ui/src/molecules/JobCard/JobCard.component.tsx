import { memo } from 'react';
import type { Props } from './JobCard.types';
import {
  CardLink,
  JobCardRoot,
  JobCardContent,
  JobTitle,
  CompanyText,
  MetaRow,
  SalaryText,
  JobTypeChip,
} from './JobCard.styled';

function JobCard({ job, onHover }: Props) {
  return (
    <CardLink to={`/jobs/${job.id}`} onMouseEnter={() => onHover?.(job.id)}>
      <JobCardRoot>
        <JobCardContent>
          <JobTitle variant="h6">{job.title}</JobTitle>
          <CompanyText variant="body2">{job.company}</CompanyText>
          <MetaRow>
            <JobTypeChip label={job.type} size="small" variant="outlined" />
            <CompanyText variant="caption">{job.location}</CompanyText>
          </MetaRow>
          <SalaryText variant="body2">{job.salary}</SalaryText>
        </JobCardContent>
      </JobCardRoot>
    </CardLink>
  );
}

export default memo(JobCard);
