import { styled, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type { RatingLevel } from './PerformanceDashboard.types';

export const DashboardRoot = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  zIndex: theme.zIndex.tooltip,
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  fontFamily: 'monospace',
}));

export const ToggleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
}));

export const Panel = styled(Box)(({ theme }) => ({
  width: 320,
  maxHeight: 420,
  overflowY: 'auto',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[6],
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.overline,
  color: theme.palette.text.secondary,
  display: 'block',
  marginTop: theme.spacing(1),
  '&:first-of-type': {
    marginTop: 0,
  },
}));

export const MetricRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0),
  fontSize: theme.typography.pxToRem(13),
}));

function ratingColor(theme: Theme, rating: RatingLevel) {
  if (rating === 'good') return theme.palette.success.main;
  if (rating === 'needs-improvement') return theme.palette.warning.main;
  return theme.palette.error.main;
}

export const RatingChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== '$rating',
})<{ $rating: RatingLevel }>(({ theme, $rating }) => ({
  height: 20,
  fontSize: theme.typography.pxToRem(11),
  fontWeight: 600,
  color: theme.palette.getContrastText(ratingColor(theme, $rating)),
  backgroundColor: ratingColor(theme, $rating),
}));

export const MarkEntryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  fontSize: theme.typography.pxToRem(12),
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.25, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none',
  },
}));

export const EmptyState = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
}));
