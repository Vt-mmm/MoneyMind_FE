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
import { styled } from "@mui/system";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { loginbygoogle, login, setIsLogout } from "redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "redux/config";
import { InputField } from "components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useValidationForm } from "hooks";
import images from "assets";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";

const fadeIn = { "0%": { opacity: 0 }, "100%": { opacity: 1 } };
const slideUp = {
  "0%": { opacity: 0, transform: "translateY(15px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
};

const AnimatedLogo = styled(Box)({
  animation: `fadeIn 0.5s ease-out forwards`,
  "@keyframes fadeIn": fadeIn,
});
const AnimatedTypography = styled(Typography)({
  animation: `slideUp 0.5s ease-out forwards 0.2s`,
  opacity: 0,
  "@keyframes slideUp": slideUp,
});
const AnimatedStack = styled(Stack)({
  animation: `slideUp 0.5s ease-out forwards 0.4s`,
  opacity: 0,
  "@keyframes slideUp": slideUp,
});

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
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schemaLogin),
  });

  const { handleSubmit } = loginForm;

  const handleLogin = async (values: LoginFormType) => {
    const params = { data: { ...values }, navigate };
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

  const handleGoogleLogin = (response: CredentialResponse) => {
    if (!response.credential) {
      console.error("❌ No ID Token received.");
      setErrorMessage("Google authentication error. Please try again.");
      return;
    }
    dispatch(loginbygoogle(response.credential))
      .unwrap()
      .then((user) => {
        if (!user || !user.roles)
          throw new Error("Unable to determine access rights.");
        if (user.roles.includes("Admin")) navigate("/admin/dashboard");
        else if (user.roles.includes("Manager")) navigate("/manager/report");
        else navigate("/user/home");
      })
      .catch((error) => {
        console.error("Google Login Error:", error);
        setErrorMessage(error || "Google login failed.");
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
        <AnimatedLogo sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={images.logo.logo_moneymind_no_bg}
            alt="MoneyMind Logo"
            style={{ width: "120px", height: "auto" }}
          />
        </AnimatedLogo>

        <AnimatedTypography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: "24px", mb: 1 }}
        >
          Sign in to MoneyMind
        </AnimatedTypography>

        <FormProvider {...loginForm}>
          <form onSubmit={handleSubmit(handleLogin)}>
            <AnimatedStack spacing={3} sx={{ mt: 3 }}>
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
              <InputField
                fullWidth
                size="large"
                name="password"
                label="Password"
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
                  "&:hover": { backgroundColor: "#149b5a" },
                }}
              >
                {isLoading ? "Processing..." : "Sign In"}
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                Or sign in with
              </Typography>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrorMessage("Google sign-in failed.")}
                useOneTap
                containerProps={{ style: { display: "none" } }}
              />
              <Button
                fullWidth
                size="large"
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  color: "#149b5a",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  mt: 1,
                  padding: "12px",
                  fontSize: "16px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                }}
                onClick={() => {
                  const googleButton =
                    document.querySelector("div[role=button]");
                  if (googleButton) (googleButton as HTMLElement).click();
                }}
              >
                Sign in with Google
              </Button>
            </AnimatedStack>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default LoginForm;
