import type { FieldConfig } from '../../organisms/ApplicationForm/ApplicationForm.types';

export interface Props {
  jobTitle: string;
  stepIndex: number;
  steps: string[];
  fieldConfig: FieldConfig;
  defaultValue?: string | number;
  submitLabel: string;
  isLoading?: boolean;
  onSubmit: (value: string) => void;
}
