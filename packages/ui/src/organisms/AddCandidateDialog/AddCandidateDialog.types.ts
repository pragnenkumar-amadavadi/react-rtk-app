import type { CandidateFormValues } from './AddCandidateDialog.schema';

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CandidateFormValues) => void;
}
