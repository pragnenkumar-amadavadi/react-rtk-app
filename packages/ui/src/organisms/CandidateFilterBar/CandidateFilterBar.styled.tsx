import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

export const FilterBarRoot = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const SearchIconAdornment = styled(SearchIcon)(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.text.secondary,
}));

export const StatusChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const FilterChip = styled(Chip)({});

export const CountText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
