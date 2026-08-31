import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const SectionRoot = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
}));

export const HistoryList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const HistoryItem = styled('li')(({ theme }) => ({
  borderLeft: `2px solid var(--mui-palette-divider)`,
  paddingLeft: theme.spacing(1.5),
}));

export const TransitionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

export const ArrowIcon = styled(ArrowForwardIcon)({
  fontSize: 16,
  color: 'var(--mui-palette-text-secondary)',
});

export const HistoryTimestamp = styled(Typography)(({ theme }) => ({
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

export const HistorySpinner = styled(CircularProgress)({});
