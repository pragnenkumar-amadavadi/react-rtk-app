import { styled, alpha, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Ordinal ramp (one hue, monotone intensity) for the four in-progress pipeline
// stages, plus the two terminal outcomes wearing reserved status colors — per
// this project's dataviz conventions, never a hardcoded hex.
export type FunnelTone = 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'good' | 'critical';

function toneColor(theme: Theme, tone: FunnelTone): string {
  switch (tone) {
    case 'stage1':
      return alpha(theme.palette.primary.main, 0.35);
    case 'stage2':
      return alpha(theme.palette.primary.main, 0.55);
    case 'stage3':
      return alpha(theme.palette.primary.main, 0.75);
    case 'stage4':
      return theme.palette.primary.main;
    case 'good':
      return theme.palette.success.main;
    case 'critical':
      return theme.palette.error.main;
  }
}

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const StageLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  width: 96,
  flexShrink: 0,
});

export const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Track = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 14,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  overflow: 'hidden',
}));

export const Fill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widthPercent' && prop !== 'tone',
})<{ widthPercent: number; tone: FunnelTone }>(({ theme, widthPercent, tone }) => ({
  height: '100%',
  width: `${widthPercent}%`,
  borderRadius: '0 4px 4px 0',
  backgroundColor: toneColor(theme, tone),
  transition: 'width 0.3s ease',
}));

export const CountText = styled(Typography)(({ theme }) => ({
  width: 40,
  flexShrink: 0,
  textAlign: 'right',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const outcomeIconStyles = { fontSize: 16, flexShrink: 0 } as const;

export const HiredIcon = styled(CheckCircleOutlinedIcon)(({ theme }) => ({
  ...outcomeIconStyles,
  color: theme.palette.success.main,
}));

export const RejectedIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  ...outcomeIconStyles,
  color: theme.palette.error.main,
}));

export const StyledTooltip = styled(Tooltip)({});
