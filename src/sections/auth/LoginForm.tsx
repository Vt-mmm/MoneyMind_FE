import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

import { loginbygoogle, login, setIsLogout } from "redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "redux/config";
import { InputField } from "components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useValidationForm } from "hooks";
import images from "assets";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface LoginFormType {
  email: string;
  password: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { schemaLogin } = useValidationForm();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginFormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schemaLogin),
  });

  const { handleSubmit } = loginForm;

  // Xử lý đăng nhập thường
  const handleLogin = async (values: LoginFormType) => {
    const params = {
      data: { ...values },
      navigate,
    };

    dispatch(login(params))
      .unwrap()
      .then(() => {
        dispatch(setIsLogout(false));
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  // Xử lý đăng nhập bằng Google OAuth2
  const handleGoogleLogin = (response: CredentialResponse) => {
    if (!response.credential) {
      console.error(
        "❌ Không nhận được ID Token, hãy kiểm tra Google OAuth setup."
      );
      setErrorMessage("Lỗi xác thực Google. Vui lòng thử lại.");
      return;
    }

    dispatch(loginbygoogle(response.credential))
      .unwrap()
      .then((user) => {
        if (!user || !user.roles) {
          throw new Error("Không thể xác định quyền truy cập.");
        }

        if (user.roles.includes("Admin")) {
          navigate("/admin/dashboard");
        } else if (user.roles.includes("Manager")) {
          navigate("/manager/report");
        } else {
          navigate("/user/home");
        }
      })
      .catch((error) => {
        console.error(" Google Login Error:", error);
        setErrorMessage(error || "Đăng nhập Google thất bại.");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0fdf4",
      }}
    >
      <Box
        sx={{
          background: "white",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
          maxWidth: "550px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logo MoneyMind */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={images.logo.logo_moneymind_no_bg}
            alt="MoneyMind Logo"
            style={{
              width: "120px",
              height: "auto",
            }}
          />
        </Box>

        {/* Tiêu đề */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: "24px", marginBottom: "10px" }}
        >
          Đăng nhập vào MoneyMind
        </Typography>

        <FormProvider {...loginForm}>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack spacing={3} sx={{ mt: 3 }}>
              {/* Email */}
              <InputField
                fullWidth
                size="large"
                name="email"
                label="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#16ab65" }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Mật khẩu */}
              <InputField
                fullWidth
                size="large"
                name="password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#16ab65" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Nút đăng nhập */}
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  backgroundColor: "#16ab65",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  mt: 1,
                  padding: "12px",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#149b5a",
                  },
                }}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </Button>

              {/* Hoặc đăng nhập bằng Google */}
              <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                Hoặc đăng nhập bằng
              </Typography>

              {/* Nút Google Login */}
              <GoogleLogin
                onSuccess={handleGoogleLogin} 
                onError={() => setErrorMessage("Đăng nhập Google thất bại.")}
              />
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default LoginForm;
