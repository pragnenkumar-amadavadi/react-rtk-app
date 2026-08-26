import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { candidateSchema, type CandidateFormValues } from './AddCandidateDialog.schema';
import type { Props } from './AddCandidateDialog.types';
import {
  StyledDialog,
  StyledDialogTitle,
  FormDivider,
  StyledDialogContent,
  FormGrid,
  FormField,
  StyledMenuItem,
  StyledDialogActions,
  CancelButton,
  SubmitButton,
} from './AddCandidateDialog.styled';

const POSITIONS = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'QA Engineer',
  'Data Scientist',
  'Mobile Engineer',
  'Engineering Manager',
];

const STATUSES: { value: CandidateFormValues['status']; label: string }[] = [
  { value: 'applied',   label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer',     label: 'Offer' },
  { value: 'hired',     label: 'Hired' },
  { value: 'rejected',  label: 'Rejected' },
];

export default function AddCandidateDialog({ open, onClose, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof candidateSchema>, unknown, CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      status: 'applied',
      experience: 0,
      location: '',
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function handleValid(values: CandidateFormValues) {
    onSubmit(values);
    reset();
    onClose();
  }

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>Add Candidate</StyledDialogTitle>
      <FormDivider />

      <StyledDialogContent>
        <FormGrid container spacing={2}>
          <FormGrid size={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Full Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </FormGrid>

          <FormGrid size={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Phone"
                  fullWidth
                  required
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Location"
                  fullWidth
                  required
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, sm: 8 }}>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  select
                  label="Position"
                  fullWidth
                  required
                  error={!!errors.position}
                  helperText={errors.position?.message}
                >
                  {POSITIONS.map((p) => (
                    <StyledMenuItem key={p} value={p}>{p}</StyledMenuItem>
                  ))}
                </FormField>
              )}
            />
          </FormGrid>

          <FormGrid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Experience (yrs)"
                  type="number"
                  fullWidth
                  required
                  slotProps={{ htmlInput: { min: 0, max: 50 } }}
                  error={!!errors.experience}
                  helperText={errors.experience?.message}
                />
              )}
            />
          </FormGrid>

          <FormGrid size={12}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  select
                  label="Status"
                  fullWidth
                  required
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  {STATUSES.map(({ value, label }) => (
                    <StyledMenuItem key={value} value={value}>{label}</StyledMenuItem>
                  ))}
                </FormField>
              )}
            />
          </FormGrid>
        </FormGrid>
      </StyledDialogContent>

      <FormDivider />
      <StyledDialogActions>
        <CancelButton onClick={handleClose} color="inherit">Cancel</CancelButton>
        <SubmitButton
          onClick={handleSubmit(handleValid)}
          variant="contained"
          disabled={isSubmitting}
        >
          Add Candidate
        </SubmitButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
