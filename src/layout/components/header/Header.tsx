// @mui icon
import ListRoundedIcon from '@mui/icons-material/ListRounded';
// @mui
import { Box, IconButton, Stack } from '@mui/material';
//
import AccountPopover from './AccountPopover';
import { StyledRoot, StyledToolbar } from './styles';

// ----------------------------------------------------------------------

export interface HeaderProps {
  onOpenNav: () => void;
}

function Header({ onOpenNav }: HeaderProps) {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <ListRoundedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 3.5,
            }}
          >
            {/* <NotificationsPopover /> */}
            <AccountPopover />
          </Stack>
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}

export default Header;
