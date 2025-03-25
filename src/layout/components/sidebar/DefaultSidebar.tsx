import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Drawer, Stack, Typography, alpha, Button } from '@mui/material';
// hooks
import { useResponsive } from 'hooks';
// components
// import { Logo, NavSection } from 'components';
import images from 'assets';

//icon
// import { useConfigSidebar } from './useConfigSidebar';


const NAV_WIDTH = 280;

// Animation keyframes
const pulseAnimation = {
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" }
  }
};

const floatAnimation = {
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" }
  }
};

const glowAnimation = {
  "@keyframes glow": {
    "0%": { boxShadow: "0 0 5px rgba(22, 171, 101, 0.3)" },
    "50%": { boxShadow: "0 0 20px rgba(22, 171, 101, 0.6)" },
    "100%": { boxShadow: "0 0 5px rgba(22, 171, 101, 0.3)" }
  }
};

interface SidebarProps {
  openNav: boolean;
  onCloseNav: () => void;
}

function DefaultSidebar({ openNav, onCloseNav }: SidebarProps) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const [isHovered, setIsHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  
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
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

//   const combinedNavItems = [...DEFAULT_NAV_ITEMS, ...navPartner];

  const renderContent = (
    <Stack
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      justifyContent="space-between"
      sx={(theme) => ({
        background: "linear-gradient(135deg, rgba(22, 171, 101, 0.95) 0%, rgba(19, 143, 85, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        maxWidth: NAV_WIDTH - 2,
        '&::-webkit-scrollbar': { 
          width: "5px",
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 10,
          bgcolor: 'rgba(255, 255, 255, 0.0)',
          transition: 'background-color 0.3s ease',
        },
        '&:hover::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(255, 255, 255, 0.2)',
        },
        transition: "transform 0.2s ease-out",
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
        position: "relative",
        "& > *": {
          maxWidth: "100%",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 70%)",
          opacity: 0.8,
          zIndex: 0,
        }
      })}
    >
      <Stack 
        alignItems="center" 
        sx={{ 
          py: 5, 
          position: "relative", 
          zIndex: 1,
          animation: `float 6s ease-in-out infinite`,
          ...floatAnimation,
          transform: "translateZ(25px)",
          maxWidth: "100%",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box 
          width={180}
          component="img" 
          src={images.common.moneymind_loginlogo} 
          alt="MoneyMind Logo" 
          sx={{
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
            transform: isHovered ? "perspective(1000px) rotateY(10deg) scale(1.05) translateZ(10px)" : "perspective(1000px) rotateY(0deg) translateZ(0px)",
            transition: "transform 0.5s ease",
            animation: isHovered ? `pulse 2s infinite` : "none",
            ...pulseAnimation,
            maxWidth: "100%",
          }}
        />
      </Stack>

      {/* Call to action section */}
      <Stack 
        spacing={3} 
        alignItems="center" 
        sx={{ 
          p: 3, 
          mt: 'auto',
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(5px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          transform: "translateZ(15px)",
          maxWidth: "100%",
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: "#ffffff", 
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "500",
            transform: "translateZ(10px)",
            maxWidth: "100%",
            whiteSpace: "normal",
          }}
        >
          Welcome to MoneyMind
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "rgba(255,255,255,0.8)", 
            textAlign: "center",
            mb: 1,
            transform: "translateZ(5px)",
            maxWidth: "100%",
            whiteSpace: "normal",
            px: 1,
          }}
        >
          Your personal finance management solution
        </Typography>
        <Button
          variant="contained"
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "500",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            transform: buttonHovered ? "translateZ(25px) scale(1.05)" : "translateZ(20px)",
            animation: buttonHovered ? `glow 1.5s infinite` : "none",
            ...glowAnimation,
            maxWidth: "90%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-2px) translateZ(25px) scale(1.05)",
              boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            }
          }}
        >
          Get Started
        </Button>

        {/* Version information */}
        <Typography 
          variant="caption" 
          sx={{ 
            color: "rgba(255,255,255,0.6)", 
            display: "block",
            mt: 2,
            transform: "translateZ(5px)",
            maxWidth: "100%",
          }}
        >
          Version 1.0.0
        </Typography>
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
              bgcolor: 'transparent',
              borderRightStyle: 'none',
              boxShadow: "10px 0 25px -5px rgba(0, 0, 0, 0.1)",
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                bottom: '-10px',
                left: '-10px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(5px)',
                filter: 'blur(5px)',
                zIndex: -1,
              }
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
            sx: { 
              width: NAV_WIDTH,
              bgcolor: 'transparent',
              borderRight: 'none',
              boxShadow: "10px 0 25px -5px rgba(0, 0, 0, 0.15)",
              overflow: 'hidden',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

export default DefaultSidebar;
