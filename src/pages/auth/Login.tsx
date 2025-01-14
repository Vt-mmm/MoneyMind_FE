import { Box, LinearProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
// hooks
import useResponsive from "hooks/useResponsive";
// components
import { LoginForm } from "sections/auth";
// redux
import { useAppSelector } from "redux/config";
//
import images from "assets";
import { StyledRootLogin } from "./styles";

export default function LoginPage() {
  const mdUp = useResponsive("up", "md", "md");
  const { isLoading } = useAppSelector((state) => state.auth);

  // State to control visibility of elements
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 500); // Delay before starting the fade-in (optional, 0.5s)

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      {/* Apply gradient background */}
      <StyledRootLogin
        sx={{
          background: "linear-gradient(135deg, #16ab65, #e3f2fd)", // Gradient effect from green to light blue
          minHeight: "100vh", // Full screen height
          backgroundSize: "cover", // Ensure background covers the screen entirely
          display: "flex", // Flexbox for alignment
          flexDirection: "column", // Layout items vertically
          justifyContent: "center", // Center vertically
          alignItems: "center", // Center horizontally
          padding: "16px",
          position: "relative", // Required for positioning logo
        }}
      >
        {/* Logo and Welcome Section */}
        <Box
          sx={{
            position: "absolute", // Position the container absolutely
            top: "24px",
            left: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Align items to the left
            backgroundColor: "#16ab65", // Green background for logo box
            borderRadius: "16px", // Rounded corners
            padding: "24px", // Padding around content
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow
            maxWidth: "350px", // Limit the width of the box
            zIndex: 10, // Ensure it's above other elements
            opacity: isContentVisible ? 1 : 0, // Fade-in effect
            transform: isContentVisible ? "translateY(0)" : "translateY(20px)", // Slide-in effect
            transition: "opacity 1.5s ease, transform 1.5s ease", // Smooth transition
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px", // Space below the logo
            }}
          >
            <img
              src={images.logo.logo_moneymind_no_bg}
              alt="Logo"
              style={{
                width: "180px", // Adjust size for larger logo
                height: "auto",
                marginRight: "8px", // Space between logo and text
              }}
            />

          </Box>

          {/* Welcome Text */}
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff", // White text color
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Chào mừng đến với MoneyMind
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff", // White text color
            }}
          >
            Quản lý tài chính thông minh và hiệu quả
          </Typography>
        </Box>

        {/* Main Content Box */}
        <Box
          sx={{
            display: "flex", // Arrange sections side by side
            flexDirection: { xs: "column", md: "row" }, // Stack on small screens, row on medium+
            alignItems: "center", // Align items vertically
            justifyContent: "center", // Center content horizontally
            gap: 4, // Space between sections
            width: "100%", // Full width
            maxWidth: "1200px", // Maximum width of content
            opacity: isContentVisible ? 1 : 0, // Fade-in effect
            transform: isContentVisible ? "translateY(0)" : "translateY(20px)", // Slide-in effect
            transition: "opacity 1.5s ease, transform 1.5s ease", // Smooth transition
          }}
        >
          {/* Form Section */}
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
              borderRadius: "12px", // Rounded corners
              border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
              padding: "32px", // Padding inside the box
              width: "100%", // Full width
              maxWidth: "600px", // Increased max width
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow
            }}
          >
            {/* Titles Above Form */}
            <Box
              sx={{
                marginBottom: "16px", // Space between title and form
                textAlign: "center", // Center align text
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#000000", // Black color
                  fontWeight: "bold",
                }}
              >
                Đăng nhập vào MoneyMind
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#000000", // Black color
                }}
              >
                MoneyMind sẽ giúp bạn quản lý hiệu quả
              </Typography>
            </Box>
            <LoginForm />
          </Box>
        </Box>
      </StyledRootLogin>
    </>
  );
}
