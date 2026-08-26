import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useJobQuery, useSubmitApplicationMutation } from '../../../features/jobs/jobQueries';
import { ApplicationStepView, type FieldConfig } from '@repo/ui';

const STEPS = ['Your Name', 'Experience', 'Offer'];

interface StepConfig {
  label: string;
  fieldConfig: FieldConfig;
  submitLabel: string;
}

const STEP_MAP: Record<string, StepConfig> = {
  '1': {
    label: 'Your Name',
    fieldConfig: { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Jane Doe' },
    submitLabel: 'Next',
  },
  '2': {
    label: 'Experience',
    fieldConfig: {
      name: 'experience',
      label: 'Years of Experience',
      type: 'number',
      placeholder: 'e.g. 3',
    },
    submitLabel: 'Next',
  },
  '3': {
    label: 'Expected Salary',
    fieldConfig: {
      name: 'expectedSalary',
      label: 'Expected Annual Salary ($)',
      type: 'number',
      placeholder: 'e.g. 80000',
    },
    submitLabel: 'Submit Application',
  },
};

export default function ApplicationPage() {
  const { jobId = '', step = '1' } = useParams<{ jobId: string; step: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: job } = useJobQuery(jobId);
  const { mutate: submitApplication, isPending } = useSubmitApplicationMutation();

  const stepConfig = STEP_MAP[step];
  const stepIndex = Number(step) - 1;

  // Accumulated form data carried forward via location.state
  const accumulated: Partial<{ name: string; experience: string; expectedSalary: string }> =
    location.state ?? {};

  // Derive default value for the current field from state so Back navigation restores input
  const defaultValue =
    accumulated[stepConfig?.fieldConfig.name as keyof typeof accumulated] ?? '';

  function handleSubmit(value: string) {
    const next = { ...accumulated, [stepConfig.fieldConfig.name]: value };

    if (step === '3') {
      submitApplication(
        {
          jobId,
          name: next.name ?? '',
          experience: Number(next.experience ?? 0),
          expectedSalary: Number(next.expectedSalary ?? 0),
        },
        {
          onSuccess: () => {
            navigate(`/jobs/${jobId}`, { state: { applied: true } });
          },
        },
      );
      return;
    }

    const nextStep = String(Number(step) + 1);
    navigate(`/jobs/${jobId}/apply/${nextStep}`, { state: next });
  }

  if (!stepConfig) {
    navigate(`/jobs/${jobId}`);
    return null;
  }

  return (
    <ApplicationStepView
      jobTitle={job?.title ?? ''}
      stepIndex={stepIndex}
      steps={STEPS}
      fieldConfig={stepConfig.fieldConfig}
      defaultValue={defaultValue}
      submitLabel={stepConfig.submitLabel}
      isLoading={isPending && step === '3'}
      onSubmit={handleSubmit}
    />
  );
}
