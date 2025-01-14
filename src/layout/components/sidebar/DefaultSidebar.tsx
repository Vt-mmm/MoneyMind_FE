import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Drawer, Stack, Typography } from '@mui/material';
// hooks
import { useResponsive } from 'hooks';
// components
// import { Logo, NavSection } from 'components';
import images from 'assets';

//icon
// import { useConfigSidebar } from './useConfigSidebar';


const NAV_WIDTH = 280;

interface SidebarProps {
  openNav: boolean;
  onCloseNav: () => void;
}

function DefaultSidebar({ openNav, onCloseNav }: SidebarProps) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

//   const combinedNavItems = [...DEFAULT_NAV_ITEMS, ...navPartner];

  const renderContent = (
    <Stack
      justifyContent="space-between"
      sx={(theme) => ({
        bgcolor: '#16ab65',
        height: '100vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': { width: 5 },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 2,
          bgcolor: 'transparent',
        },
      })}
    >

      <Stack alignItems="center" sx={{ py: 3 }}>
        <Box width={200} component="img" src={images.common.moneymind_loginlogo} alt="default" />
      </Stack>
    </Stack>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

export default DefaultSidebar;
