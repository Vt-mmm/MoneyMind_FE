import { OutlinedInput, Toolbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { customShadows } from 'theme/customShadows';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 280,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export { StyledRoot, StyledSearch };
