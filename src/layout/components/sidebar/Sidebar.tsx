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
        background: "rgb(240, 253, 244)", // Sidebar màu trắng
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <Logo />
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
                    color: "#16AB64", // Tiêu đề màu xanh
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
                      color: "#16AB64", // Mục mặc định màu xanh
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "#E8F5E9", // Màu nền khi hover
                      color: "#0E804A", // Màu chữ khi hover
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#16AB64", // Màu nền khi được chọn
                      color: "#FFFFFF", // Màu chữ khi được chọn
                    },
                    "& .Mui-selected:hover": {
                      backgroundColor: "#139E5B", // Màu nền khi hover trong trạng thái chọn
                      color: "#FFFFFF",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "inherit", // Giữ màu chữ rõ ràng
                    },
                  }}
                >
                  <NavSection data={navItem.listNav} />
                </Box>
                {index < navAdmin.length - 1 && <Divider sx={{ mt: 2, opacity: 0.4, borderColor: "#16AB64" }} />}
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
              background: "#FFFFFF", // Sidebar màu trắng
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
              background: "#FFFFFF", // Sidebar màu trắng
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