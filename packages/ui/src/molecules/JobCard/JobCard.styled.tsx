import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';

export const CardLink = styled(Link)({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
});

export const JobCardRoot = styled(Card)(({ theme }) => ({
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const JobCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const JobTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const CompanyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const MetaRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  alignItems: 'center',
}));

export const SalaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginTop: theme.spacing(0.5),
}));

export const JobTypeChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: theme.typography.caption.fontSize,
}));
