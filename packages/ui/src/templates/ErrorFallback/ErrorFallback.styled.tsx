import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

export const PageContainer = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: '0 auto',
  padding: theme.spacing(8, 2),
  textAlign: 'center',
}));

export const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  wordBreak: 'break-word',
}));

export const RetryButton = styled(Button)({});
