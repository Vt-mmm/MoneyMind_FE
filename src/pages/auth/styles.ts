import { styled } from '@mui/material';
import { customShadows } from 'theme/customShadows';

export const StyledRootLogin = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const StyledSection = styled('div')(({ theme }: { theme: any }) => ({
  width: '100%',
  margin: 20,
  maxWidth: 550,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: 15,
  boxShadow: customShadows.z16,
  backgroundColor: '#16ab65',
}));

export const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export const StyledRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));
