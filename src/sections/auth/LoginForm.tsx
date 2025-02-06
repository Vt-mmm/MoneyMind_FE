import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
// @mui icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// redux
import { login, setIsLogout } from "redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "redux/config";
// hooks
import { InputField } from "components";
import { useValidationForm } from "hooks";
//
import { motion } from "framer-motion";

// Define or import LoginFormType
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State thông báo lỗi

  const loginForm = useForm<LoginFormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schemaLogin),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (values: LoginFormType) => {
    const params = {
      data: { ...values },
      navigate,
    };

    dispatch(login(params))
      .unwrap()
      .then(() => {
        dispatch(setIsLogout(false));
        setErrorMessage(null); // Reset lỗi nếu đăng nhập thành công
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        width: "120%",
        margin: "0 auto",
      }}
    >
      <form onSubmit={handleSubmit(handleLogin)}>
        <FormProvider {...loginForm}>
          <Stack
            spacing={4}
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}
            >
              Đăng nhập vào MoneyMind
            </Typography>

            {/* Hiển thị thông báo lỗi */}
            {errorMessage && (
              <Typography
                variant="body2"
                color="error"
                sx={{ textAlign: "center", marginBottom: "16px" }}
              >
                {errorMessage}
              </Typography>
            )}

            {/* Email Input */}
            <InputField
              fullWidth
              size="large"
              name="email"
              label="Email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <VisibilityOffIcon sx={{ color: "#16ab65" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: "16px" }}
            />

            {/* Password Input */}
            <InputField
              fullWidth
              size="large"
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon sx={{ color: "#16ab65" }} />
                      ) : (
                        <VisibilityOffIcon sx={{ color: "#16ab65" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: "24px" }}
            />

            {/* Submit Button */}
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
                marginTop: "16px",
                width: "100%",
                "&:hover": {
                  backgroundColor: "#149b5a",
                },
              }}
            >
              {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </Stack>
        </FormProvider>
      </form>
    </Box>
  );
}

export default LoginForm;
