import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const FormRoot = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const StepField = styled(TextField)({
  width: '100%',
});

export const SubmitButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-end',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
}));
