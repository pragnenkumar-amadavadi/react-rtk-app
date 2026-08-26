export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number';
  placeholder?: string;
}

export interface Props {
  fieldConfig: FieldConfig;
  defaultValue?: string | number;
  onSubmit: (value: string) => void;
  submitLabel: string;
  isLoading?: boolean;
}
