import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  Stack,
  Typography,
  Divider,
  alpha,
  IconButton,
  useTheme,
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

// Animation keyframes
const slideInLeft = {
  "@keyframes slideInLeft": {
    "0%": { transform: "translateX(-20px)", opacity: 0 },
    "100%": { transform: "translateX(0)", opacity: 1 }
  }
};

const floatAnimation = {
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-8px)" },
    "100%": { transform: "translateY(0px)" }
  }
};

function Sidebar({ openNav, onCloseNav }: SidebarProps) {
  const { pathname } = useLocation();
  const { navAdmin, navManager } = useConfigSidebar();
  const { userAuth } = useAppSelector((state) => state.auth);
  const isDesktop = useResponsive("up", "lg");
  const theme = useTheme();
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  
  // Để track vị trí chuột cho hiệu ứng 3D
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Xử lý di chuyển chuột để tạo hiệu ứng 3D
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    
    const rect = sidebarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    
    setMousePosition({ x, y });
  };
  
  // Reset vị trí khi chuột ra khỏi sidebar
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (openNav) onCloseNav();
  }, [pathname]);

  const renderContent = (
    <Stack
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={(theme) => ({
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "linear-gradient(180deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 248, 234, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        p: 2,
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
        transition: "transform 0.2s ease-out",
        transformStyle: "preserve-3d",
        maxWidth: NAV_WIDTH - 2, // Đảm bảo không vượt quá width của Drawer (trừ đi padding)
        "&::-webkit-scrollbar": {
          width: "6px",
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha("#16AB64", 0.0),
          borderRadius: "10px",
          transition: "background-color 0.3s ease",
        },
        "&:hover::-webkit-scrollbar-thumb": {
          backgroundColor: alpha("#16AB64", 0.2),
        },
        "& > *": {
          maxWidth: "100%", // Đảm bảo các phần tử con không vượt quá width
        }
      })}
    >
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          mb: 3,
          transform: "perspective(1000px) rotateY(5deg) translateZ(20px)",
          transition: "transform 0.3s ease",
          animation: `float 6s ease-in-out infinite`,
          ...floatAnimation,
          maxWidth: "100%", // Đảm bảo logo không vượt quá
          "&:hover": {
            transform: "perspective(1000px) rotateY(0deg) scale(1.03) translateZ(30px)",
          }
        }}
      >
        <Logo />
      </Box>

      {userAuth?.roles?.includes(Role.MONEYMIND_ADMIN) && (
        <Box sx={{ maxWidth: "100%" }}>
          {navAdmin.map((navItem, index) =>
            navItem.missions && navItem.listNav ? (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  animation: `slideInLeft 0.3s ease forwards ${index * 0.1}s`,
                  opacity: 0,
                  ...slideInLeft,
                  transform: hoveredSection === index 
                    ? "perspective(1000px) translateZ(15px)" 
                    : "perspective(1000px) translateZ(0px)",
                  transition: "transform 0.3s ease",
                  maxWidth: "100%", // Đảm bảo không vượt quá
                }}
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    ml: 1,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #16AB64 0%, #0d9253 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: 1.2,
                    mb: 1,
                    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    display: "block", // Đảm bảo đúng width
                    whiteSpace: "nowrap", // Ngăn wrap text
                  })}
                >
                  {navItem.missions}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: "100%", // Đảm bảo không vượt quá
                    "& .MuiListItemButton-root": {
                      transition: "all 0.3s",
                      borderRadius: "12px",
                      mb: 1,
                      color: "#16AB64",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(45deg, rgba(22, 171, 100, 0.02), rgba(22, 171, 100, 0.05))",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: -1,
                      }
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "rgba(232, 245, 233, 0.8)",
                      color: "#0E804A",
                      boxShadow: "0 4px 20px rgba(22, 171, 100, 0.15)",
                      transform: "translateY(-2px) translateZ(10px)",
                      "&::before": {
                        opacity: 1,
                      }
                    },
                    "& .Mui-selected": {
                      background: "linear-gradient(45deg, #16AB64, #0d9253)",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 15px rgba(22, 171, 100, 0.25)",
                    },
                    "& .Mui-selected:hover": {
                      background: "linear-gradient(45deg, #139E5B, #0c844b)",
                      color: "#FFFFFF",
                      transform: "translateY(-2px) translateZ(10px)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                      minWidth: 40,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      color: "inherit",
                      whiteSpace: "nowrap", // Đảm bảo text không wrap
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Cắt text nếu dài
                    },
                    "& .MuiListItemButton-root .MuiListItemIcon-root": {
                      transition: "transform 0.2s ease",
                    },
                    "& .MuiListItemButton-root:hover .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    }
                  }}
                >
                  <NavSection data={navItem.listNav} />
                </Box>
                {index < navAdmin.length - 1 && (
                  <Divider 
                    sx={{ 
                      mt: 2, 
                      opacity: 0.4, 
                      borderColor: "transparent",
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(22,171,100,0.2) 0%, rgba(22,171,100,0.5) 50%, rgba(22,171,100,0.2) 100%)",
                    }} 
                  />
                )}
              </Box>
            ) : null
          )}
        </Box>
      )}
      
      {userAuth?.roles?.includes(Role.MONEYMIND_MANAGER) && (
        <Box sx={{ maxWidth: "100%" }}>
          {navManager.map((navItem, index) =>
            navItem.missions && navItem.listNav ? (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  animation: `slideInLeft 0.3s ease forwards ${index * 0.1}s`,
                  opacity: 0,
                  ...slideInLeft,
                  transform: hoveredSection === (index + 100) 
                    ? "perspective(1000px) translateZ(15px)" 
                    : "perspective(1000px) translateZ(0px)",
                  transition: "transform 0.3s ease",
                  maxWidth: "100%", // Đảm bảo không vượt quá
                }}
                onMouseEnter={() => setHoveredSection(index + 100)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    ml: 1,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #16AB64 0%, #0d9253 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: 1.2,
                    mb: 1,
                    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    display: "block", // Đảm bảo đúng width
                    whiteSpace: "nowrap", // Ngăn wrap text
                  })}
                >
                  {navItem.missions}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: "100%", // Đảm bảo không vượt quá width
                    "& .MuiListItemButton-root": {
                      transition: "all 0.3s",
                      borderRadius: "12px",
                      mb: 1,
                      color: "#16AB64",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(45deg, rgba(22, 171, 100, 0.02), rgba(22, 171, 100, 0.05))",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: -1,
                      }
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "rgba(232, 245, 233, 0.8)",
                      color: "#0E804A",
                      boxShadow: "0 4px 20px rgba(22, 171, 100, 0.15)",
                      transform: "translateY(-2px) translateZ(10px)",
                      "&::before": {
                        opacity: 1,
                      }
                    },
                    "& .Mui-selected": {
                      background: "linear-gradient(45deg, #16AB64, #0d9253)",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 15px rgba(22, 171, 100, 0.25)",
                    },
                    "& .Mui-selected:hover": {
                      background: "linear-gradient(45deg, #139E5B, #0c844b)",
                      color: "#FFFFFF",
                      transform: "translateY(-2px) translateZ(10px)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                      minWidth: 40,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      color: "inherit",
                      whiteSpace: "nowrap", // Đảm bảo text không wrap
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Cắt text nếu dài
                    },
                    "& .MuiListItemButton-root .MuiListItemIcon-root": {
                      transition: "transform 0.2s ease",
                    },
                    "& .MuiListItemButton-root:hover .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    }
                  }}
                >
                  <NavSection data={navItem.listNav} />
                </Box>
                {index < navManager.length - 1 && (
                  <Divider 
                    sx={{ 
                      mt: 2, 
                      opacity: 0.4, 
                      borderColor: "transparent",
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(22,171,100,0.2) 0%, rgba(22,171,100,0.5) 50%, rgba(22,171,100,0.2) 100%)",
                    }} 
                  />
                )}
              </Box>
            ) : null
          )}
        </Box>
      )}
      
      {/* Version badge */}
      <Box 
        sx={{ 
          mt: 'auto', 
          pt: 2, 
          textAlign: 'center',
          opacity: 0.7,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          transform: 'translateZ(5px)',
          maxWidth: "100%", // Đảm bảo không vượt quá width
          '&:hover': {
            opacity: 1,
            transform: 'translateZ(15px) scale(1.05)',
          }
        }}
      >
        <Typography 
          variant="caption" 
          display="block" 
          sx={{ 
            color: '#16AB64',
            background: 'rgba(22, 171, 100, 0.05)',
            borderRadius: '8px',
            padding: '6px 10px',
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(22, 171, 100, 0.1)',
          }}
        >
          MoneyMind v1.0
        </Typography>
      </Box>
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
              borderRight: 'none',
              boxShadow: "10px 0 25px -5px rgba(0, 0, 0, 0.05)",
              background: 'transparent',
              overflow: 'hidden', // Ngăn scroll ngang
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                bottom: '-10px',
                left: '-10px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                filter: 'blur(5px)',
                zIndex: -1,
              }
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
              boxShadow: "10px 0 25px -5px rgba(0, 0, 0, 0.1)",
              background: 'transparent',
              border: 'none',
              overflow: 'hidden', // Ngăn scroll ngang
            }),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ p: 1 }}>
            <IconButton onClick={onCloseNav} 
              sx={{ 
                color: '#16AB64',
                '&:hover': {
                  backgroundColor: 'rgba(22, 171, 100, 0.1)',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Close />
            </IconButton>
          </Stack>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

export default Sidebar;