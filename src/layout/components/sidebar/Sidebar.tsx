import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { Box, Drawer, Stack, Typography } from "@mui/material";
// hooks
import { useResponsive } from "hooks";
// components
import { Logo, NavSection } from "components";
// constants and enums
import { Role } from "common/enums";
import { useAppSelector } from "redux/config";
import { useConfigSidebar } from "./useConfigSidebar";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

interface NavItem {
  missions: string;
  listNav: {
    title: string;
    path: string;
    icon: JSX.Element;
  }[];
}

interface SidebarProps {
  openNav: boolean;
  onCloseNav: () => void;
}

function Sidebar({ openNav, onCloseNav }: SidebarProps) {
  const { pathname } = useLocation();
  const { navAdmin } = useConfigSidebar();

  const { userAuth } = useAppSelector((state) => state.auth);

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Stack
      justifyContent="space-between"
      sx={(theme) => ({
        bgcolor: "#16ab65",
        height: "100vh",
        overflowY: "scroll",
        "&::-webkit-scrollbar": { width: 5 },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 2,
          bgcolor: "transparent",
        },
      })}
    >
      <Box>
        <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
          <Logo />
        </Box>

        {userAuth?.roles?.includes(Role.MONEYMIND_ADMIN) && (
          <Box width="100%">
            {navAdmin.map((navItem, index) => {
              // Ensure navItem has missions and listNav before rendering
              if (navItem.missions && navItem.listNav) {
                return (
                  <Box key={index} mb={1}>
                    <Typography
                      sx={{
                        ml: 1,
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        color: "#212121",
                      }}
                    >
                      {navItem.missions}
                    </Typography>
                    <NavSection data={navItem.listNav} />
                  </Box>
                );
              }
              return null; // In case navItem does not have missions or listNav
            })}
          </Box>
        )}
      </Box>
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
              bgcolor: "background.default",
              borderRightStyle: "dashed",
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

export default Sidebar;
