import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export const SectionRoot = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
}));

export const NoteForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

export const NoteInput = styled(TextField)({});

export const SubmitButton = styled(Button)({
  alignSelf: 'flex-end',
});

export const NoteList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const NoteItem = styled('li')(({ theme }) => ({
  borderLeft: `2px solid var(--mui-palette-divider)`,
  paddingLeft: theme.spacing(1.5),
}));

export const NoteBody = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  marginBottom: theme.spacing(0.5),
}));

export const NoteTimestamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const EmptyState = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
}));

export const NotesSpinner = styled(CircularProgress)({});
