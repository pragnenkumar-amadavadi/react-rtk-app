import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorScheme } from '@mui/material/styles';
import { StyledIconButton } from './ColorSchemeToggle.styled';

export default function ColorSchemeToggle() {
  // NOTE: setMode only repaints the page when theme.colorSchemeSelector is
  // 'class' or 'data' — theme.ts leaves it at the MUI default ('media'), so
  // this toggle updates its own icon/label but the app's palette still
  // follows the OS preference. Fixing that requires a one-line change inside
  // theme.ts's extendTheme() call, which is out of scope for this change.
  const { mode, setMode } = useColorScheme();
  const isDark = mode === 'dark';

  return (
    <StyledIconButton
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      size="small"
    >
      {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </StyledIconButton>
  );
}
