import type { Props } from './ApplicationStepView.types';
import ApplicationForm from '../../organisms/ApplicationForm';
import StepIndicator from '../../molecules/StepIndicator';
import {
  PageContainer,
  StepCard,
  StepHeading,
  JobTitleText,
  IndicatorWrapper,
} from './ApplicationStepView.styled';

export default function ApplicationStepView({
  jobTitle,
  stepIndex,
  steps,
  fieldConfig,
  defaultValue,
  submitLabel,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <PageContainer>
      <StepCard elevation={2}>
        <StepHeading variant="h5">Apply for a Position</StepHeading>
        <JobTitleText variant="body1">{jobTitle}</JobTitleText>

        <IndicatorWrapper>
          <StepIndicator steps={steps} currentStep={stepIndex} />
        </IndicatorWrapper>

        <ApplicationForm
          fieldConfig={fieldConfig}
          defaultValue={defaultValue}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
          isLoading={isLoading}
        />
      </StepCard>
    </PageContainer>
  );
}
