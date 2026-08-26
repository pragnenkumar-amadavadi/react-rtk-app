import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  transition: 'box-shadow 0.2s, border-color 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[3],
    borderColor: theme.palette.primary.main,
  },
}));

export const StyledCardContent = styled(CardContent)({});

export const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const CandidateAvatar = styled(Avatar)({
  width: 56,
  height: 56,
});

export const CandidateInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const NameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const CandidateName = styled(Typography)({
  fontWeight: 600,
});

export const PositionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

export const PositionText = styled(Typography)({});

export const CardDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const ContactRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  minWidth: 0,
}));

export const ContactText = styled(Typography)({});

export const AppliedDate = styled(Box)({
  marginLeft: 'auto',
});

export const AppliedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const iconStyles = { fontSize: 14, flexShrink: 0 } as const;
export const WorkSmallIcon = styled(WorkIcon)(iconStyles);
export const EmailSmallIcon = styled(EmailIcon)(iconStyles);
export const PhoneSmallIcon = styled(PhoneIcon)(iconStyles);
export const LocationSmallIcon = styled(LocationOnIcon)(iconStyles);
