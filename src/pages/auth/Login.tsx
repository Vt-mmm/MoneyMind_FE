import { LinearProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { LoginForm } from "sections/auth";
import { useAppSelector } from "redux/config";

const fadeInSlideUp = {
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
};

const AnimatedBox = styled(Box)({
  animation: `fadeInSlideUp 0.6s ease-out forwards`,
  "@keyframes fadeInSlideUp": fadeInSlideUp,
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
        backgroundColor: "#f0fdf4",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {isLoading && (
        <LinearProgress sx={{ width: "100%", position: "absolute", top: 0 }} />
      )}

      {isContentVisible && (
        <AnimatedBox sx={{ width: "100%", maxWidth: "500px" }}>
          <LoginForm />
        </AnimatedBox>
      )}
    </Box>
  );
}