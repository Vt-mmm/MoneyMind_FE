import { LinearProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";

// components
import { LoginForm } from "sections/auth";
// redux
import { useAppSelector } from "redux/config";
export default function LoginPage() {
  const { isLoading } = useAppSelector((state) => state.auth);

  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 500);
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

      <Box sx={{ width: "100%", maxWidth: "500px" }}>
        <LoginForm />
      </Box>
    </Box>
  );
}
