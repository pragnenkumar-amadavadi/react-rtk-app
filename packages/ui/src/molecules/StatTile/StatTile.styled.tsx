import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const StyledCard = styled(Card)({
  height: '100%',
});

export const StyledContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const IconBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  flexShrink: 0,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 24,
  },
}));

export const TextBlock = styled(Box)({
  minWidth: 0,
});

export const ValueText = styled(Typography)({
  fontWeight: 700,
});

export const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
