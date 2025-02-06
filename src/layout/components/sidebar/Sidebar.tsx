import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  Stack,
  Typography,
  Divider,
  alpha,
  IconButton,
} from "@mui/material";
import { useResponsive } from "hooks";
import { Logo, NavSection } from "components";
import { Role } from "common/enums";
import { useAppSelector } from "redux/config";
import { useConfigSidebar } from "./useConfigSidebar";
import { Close } from "@mui/icons-material";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

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
    if (openNav) onCloseNav();
  }, [pathname]);

  const renderContent = (
    <Stack
      sx={(theme) => ({
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(135deg, #16AB64, #0E804A)", // Thêm hiệu ứng gradient cho background
        boxShadow: theme.shadows[3],
        p: 2,
        borderRadius: "8px",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.grey[600], 0.4),
          borderRadius: 3,
        },
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
        }}
      >
        <Logo />
        {!isDesktop && (
          <IconButton onClick={onCloseNav}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        )}
      </Box>

      {userAuth?.roles?.includes(Role.MONEYMIND_ADMIN) && (
        <Box>
          {navAdmin.map((navItem, index) =>
            navItem.missions && navItem.listNav ? (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    ml: 1,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#FFFFFF", // Tiêu đề màu trắng
                    letterSpacing: 1.2,
                    mb: 1,
                  })}
                >
                  {navItem.missions}
                </Typography>
                <Box
                  sx={{
                    "& .MuiListItemButton-root": {
                      transition: "all 0.3s",
                      borderRadius: "8px",
                      mb: 1,
                      color: "#FFFFFF", // Mục mặc định màu trắng
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "#13A671", // Màu nền khi hover
                      color: "#FFFFFF", // Màu chữ khi hover
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "inherit", // Theo màu của ListItemButton
                    },
                  }}
                >
                  <NavSection data={navItem.listNav} />
                </Box>
                {index < navAdmin.length - 1 && <Divider sx={{ mt: 2, opacity: 0.4, borderColor: "#FFFFFF" }} />}
              </Box>
            ) : null
          )}
        </Box>
      )}
    </Stack>
  );

  return (
    <Box component="nav" sx={{ flexShrink: { lg: 0 }, width: { lg: NAV_WIDTH } }}>
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: (theme) => ({
              width: NAV_WIDTH,
              borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
              boxShadow: theme.shadows[4],
              background: "linear-gradient(135deg, #16AB64, #0E804A)", // Thêm hiệu ứng gradient cho background
              borderRadius: "8px",
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: (theme) => ({
              width: NAV_WIDTH,
              boxShadow: theme.shadows[4],
              background: "linear-gradient(135deg, #16AB64, #0E804A)", // Thêm hiệu ứng gradient cho background
              borderRadius: "8px",
            }),
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

export default Sidebar;