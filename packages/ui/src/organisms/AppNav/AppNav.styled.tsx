import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid var(--mui-palette-divider)`,
  boxShadow: 'none',
  color: 'inherit',
}));

export const StyledToolbar = styled(Toolbar)({
  minHeight: 48,
  gap: 4,
});

export const NavLinks = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flex: 1,
});

export const NavItem = styled(NavLink)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  padding: '4px 12px',
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.active': {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.selected,
  },
}));
