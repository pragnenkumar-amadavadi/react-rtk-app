import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

export const PageIcon = styled(PeopleAltIcon)(({ theme }) => ({
  fontSize: 32,
  color: theme.palette.primary.main,
}));

export const TitleBlock = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const PageTitle = styled(Typography)({
  fontWeight: 700,
});

export const AddButton = styled(Button)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const SkeletonList = styled(Box)({});

export const SkeletonCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: `${theme.shape.borderRadius}px`,
}));

export const SkeletonHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
}));

export const SkeletonTextBlock = styled(Box)({
  flex: 1,
});

export const SkeletonAvatar = styled(Skeleton)({});

export const SkeletonText = styled(Skeleton)({});

export const SkeletonChip = styled(Skeleton)({});

export const SkeletonDividerLine = styled(Skeleton)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const SkeletonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

export const FooterCenter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export const FooterEnd = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export const ListSpinner = styled(CircularProgress)({});

export const EndMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

export const CardLink = styled(Link)({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
});
