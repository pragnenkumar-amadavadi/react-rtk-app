import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export const StyledDialog = styled(Dialog)({});

export const StyledDialogTitle = styled(DialogTitle)({
  fontWeight: 700,
});

export const FormDivider = styled(Divider)({});

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(2.5),
}));

export const FormGrid = styled(Grid)({});

export const FormField = styled(TextField)({});

export const StyledMenuItem = styled(MenuItem)({});

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  gap: theme.spacing(1),
}));

export const CancelButton = styled(Button)({});

export const SubmitButton = styled(Button)({});
