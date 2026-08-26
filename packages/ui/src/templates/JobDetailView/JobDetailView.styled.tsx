import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

export const PageContainer = styled('div')(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  padding: theme.spacing(4, 2),
}));

export const BackLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  marginBottom: theme.spacing(3),
  '&:hover': { color: theme.palette.text.primary },
}));

export const DetailTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const CompanyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const MetaRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const SalaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

export const TypeChip = styled(Chip)({
  height: 26,
});

export const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.75,
}));

export const RequirementList = styled('ul')(({ theme }) => ({
  paddingLeft: theme.spacing(2.5),
  margin: 0,
  color: theme.palette.text.secondary,
  lineHeight: 2,
}));

export const ApplyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}));

export const LoadingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(10),
}));

export const DetailSpinner = styled(CircularProgress)({});

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const SuccessAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
