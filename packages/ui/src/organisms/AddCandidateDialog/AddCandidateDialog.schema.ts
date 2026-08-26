import { z } from 'zod';

export const candidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  position: z.string().min(1, 'Position is required'),
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']),
  experience: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .max(50, 'Must be 50 or fewer years'),
  location: z.string().min(1, 'Location is required'),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;
