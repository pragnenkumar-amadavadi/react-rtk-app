import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(4),
  },
}));

export const BackLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  marginBottom: theme.spacing(3),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const BackIcon = styled(ArrowBackIcon)({
  fontSize: 18,
});

export const DetailCard = styled(Box)(({ theme }) => ({
  border: `1px solid var(--mui-palette-divider)`,
  borderRadius: `${Number(theme.shape.borderRadius) * 2}px`,
  padding: theme.spacing(3),
}));

export const DetailHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
}));

export const DetailAvatar = styled(Avatar)({
  width: 80,
  height: 80,
});

export const HeaderInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const NameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(0.5),
}));

export const DetailName = styled(Typography)({
  fontWeight: 700,
});

export const SubtitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const SectionDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

export const ContactGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(0.25),
}));

export const FieldValue = styled(Typography)({
  fontWeight: 500,
});

export const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(8),
}));

export const DetailSpinner = styled(CircularProgress)({});

export const ErrorBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const DetailErrorAlert = styled(Alert)({});
