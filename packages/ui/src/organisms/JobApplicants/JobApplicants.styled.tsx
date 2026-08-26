import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

export const SectionRoot = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
}));

export const ApplicantGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const CardLink = styled(Link)({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
});

export const EmptyState = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
}));

export const ApplicantsSpinner = styled(CircularProgress)({});

export const ErrorAlert = styled(Alert)({});
