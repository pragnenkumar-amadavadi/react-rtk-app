import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';

export const ToolbarRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const SelectionText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const MoveButton = styled(Button)({});

export const StyledMenu = styled(Menu)({});

export const ClearButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
