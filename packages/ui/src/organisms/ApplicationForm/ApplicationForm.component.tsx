import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Props } from './ApplicationForm.types';
import { FormRoot, StepField, SubmitButton } from './ApplicationForm.styled';

function buildSchema(type: 'text' | 'number') {
  if (type === 'number') {
    return z.object({
      value: z.coerce
        .number({ error: 'Must be a number' })
        .min(0, 'Must be 0 or greater'),
    });
  }
  return z.object({
    value: z.string().min(1, 'This field is required'),
  });
}

export default function ApplicationForm({
  fieldConfig,
  defaultValue = '',
  onSubmit,
  submitLabel,
  isLoading = false,
}: Props) {
  const schema = buildSchema(fieldConfig.type);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { value: defaultValue },
  });

  function handleValid({ value }: z.output<typeof schema>) {
    onSubmit(String(value));
  }

  return (
    <FormRoot onSubmit={handleSubmit(handleValid)} noValidate>
      <Controller
        name="value"
        control={control}
        render={({ field }) => (
          <StepField
            {...field}
            label={fieldConfig.label}
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            required
            error={!!errors.value}
            helperText={errors.value?.message as string | undefined}
          />
        )}
      />
      <SubmitButton type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Submitting…' : submitLabel}
      </SubmitButton>
    </FormRoot>
  );
}
