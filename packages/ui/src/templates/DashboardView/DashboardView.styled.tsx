import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

export const StatGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const ChartCard = styled(Card)({});

export const ChartCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const ChartTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2.5),
}));

export const ErrorAlert = styled(Alert)({});

export const EmptyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
