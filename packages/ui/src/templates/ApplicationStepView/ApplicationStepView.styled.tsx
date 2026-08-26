import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export const PageContainer = styled('div')(({ theme }) => ({
  maxWidth: 560,
  margin: '0 auto',
  padding: theme.spacing(6, 2),
}));

export const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const StepHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const JobTitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
}));

export const IndicatorWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));
