import {
  Box,
  LinearProgress,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

  const [isContentVisible, setIsContentVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LinearProgress sx={{ width: "100%" }} />}

      <StyledRootLogin
        sx={{
          background: "linear-gradient(135deg, #16ab65, #e3f2fd)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            backgroundColor: "#16ab65",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "350px",
            color: "white",
          }}
        >
          <img
            src={images.logo.logo_moneymind_no_bg}
            alt="Logo"
            style={{ width: "180px", height: "auto", marginBottom: "8px" }}
          />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Chào mừng đến với MoneyMind
          </Typography>
          <Typography variant="body2">Quản lý tài chính thông minh</Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "700px", // Đồng bộ chiều rộng tối đa
            margin: "0 auto", // Căn giữa toàn bộ
            padding: "40px",
            background: "rgba(255, 255, 255, 0.3)", // Nền bán trong suốt
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LoginForm />
        </motion.div>
      </StyledRootLogin>
    </>
  );
}
