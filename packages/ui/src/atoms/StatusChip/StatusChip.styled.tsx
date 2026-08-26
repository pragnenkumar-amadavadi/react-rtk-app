import { styled, darken } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

// MUI's outlined Chip colors text/border with palette[color].main, which falls
// short of 4.5:1 against a white background for several of these hues at chip
// text size (info, primary, and warning all measured below threshold). The
// `dark` shade of each keeps the same semantic color while meeting contrast.
export const StyledChip = styled(Chip)(({ theme }) => ({
  // MUI applies variant and color as two separate classes (.MuiChip-outlined
  // + .MuiChip-colorInfo, not a combined .MuiChip-outlinedInfo), so both must
  // be targeted together. && bumps specificity above MUI's own color rules.
  '&&.MuiChip-outlined.MuiChip-colorPrimary': {
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
  },
  '&&.MuiChip-outlined.MuiChip-colorInfo': {
    color: theme.palette.info.dark,
    borderColor: theme.palette.info.dark,
  },
  '&&.MuiChip-outlined.MuiChip-colorWarning': {
    // warning.dark alone still measures 3.78:1 against white at this text
    // size — one more darken() step clears the 4.5:1 AA threshold (~5:1).
    color: darken(theme.palette.warning.dark, 0.15),
    borderColor: darken(theme.palette.warning.dark, 0.15),
  },
  '&&.MuiChip-outlined.MuiChip-colorSuccess': {
    color: theme.palette.success.dark,
    borderColor: theme.palette.success.dark,
  },
  '&&.MuiChip-outlined.MuiChip-colorError': {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
  },
}));
