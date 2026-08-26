import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorScheme } from '@mui/material/styles';
import { StyledIconButton } from './ColorSchemeToggle.styled';

export default function ColorSchemeToggle() {
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
