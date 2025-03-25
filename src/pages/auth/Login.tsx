import { LinearProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { LoginForm } from "sections/auth";
import { useAppSelector } from "redux/config";
import { ThreeBackground } from "components";

const fadeInSlideUp = {
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
};

const floatAnimation = {
  "0%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-10px)" },
  "100%": { transform: "translateY(0px)" },
};

const AnimatedBox = styled(Box)({
  animation: `fadeInSlideUp 0.6s ease-out forwards, float 5s ease-in-out infinite`,
  "@keyframes fadeInSlideUp": fadeInSlideUp,
  "@keyframes float": floatAnimation,
});

export default function LoginPage() {
  const { isLoading } = useAppSelector((state) => state.auth);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7f0 100%)',
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'radial-gradient(circle at top right, rgba(22, 171, 101, 0.05), transparent 70%)',
          opacity: 0.8,
        }}
      />
      
      {/* 3D Background */}
      <ThreeBackground color="#16ab65" particleCount={4000} />
      
      {/* Loading progress */}
      {isLoading && (
        <LinearProgress 
          sx={{ 
            width: "100%", 
            position: "absolute", 
            top: 0, 
            zIndex: 10,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #16ab65, #0d8a4e)',
            },
            height: '3px',
          }}
        />
      )}

      {/* Login Form */}
      {isContentVisible && (
        <AnimatedBox 
          sx={{ 
            width: "100%", 
            maxWidth: "500px", 
            position: "relative", 
            zIndex: 1, 
            filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
          }}
        >
          <LoginForm />
        </AnimatedBox>
      )}
      
      {/* Footer area */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: '13px',
          zIndex: 2,
        }}
      >
        © {new Date().getFullYear()} MoneyMind. All rights reserved.
      </Box>
    </Box>
  );
}