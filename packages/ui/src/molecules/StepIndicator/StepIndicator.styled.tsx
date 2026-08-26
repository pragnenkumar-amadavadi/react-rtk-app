import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const StepRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StepItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
});

export const StepCircle = styled('div')<{ state: 'completed' | 'current' | 'future' }>(
  ({ theme, state }) => ({
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    ...(state === 'completed' && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }),
    ...(state === 'current' && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      outline: `3px solid`,
      outlineColor: 'var(--mui-palette-primary-main)',
      outlineOffset: 2,
    }),
    ...(state === 'future' && {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.text.disabled,
    }),
  }),
);

export const StepLabel = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: 80,
}));

export const Connector = styled('div')<{ completed: boolean }>(({ theme, completed }) => ({
  flex: 1,
  height: 2,
  marginBottom: 22,
  backgroundColor: completed ? theme.palette.primary.main : theme.palette.divider,
}));
