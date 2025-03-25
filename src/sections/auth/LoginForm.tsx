import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
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
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
};
const slideRight = {
  "0%": { opacity: 0, transform: "translateX(-20px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
};
const pulse = {
  "0%": { transform: "scale(1)" },
  "50%": { transform: "scale(1.05)" },
  "100%": { transform: "scale(1)" },
};
const glow = {
  "0%": { boxShadow: "0 0 5px rgba(22, 171, 101, 0.3)" },
  "50%": { boxShadow: "0 0 20px rgba(22, 171, 101, 0.6)" },
  "100%": { boxShadow: "0 0 5px rgba(22, 171, 101, 0.3)" },
};

const AnimatedLogo = styled(Box)({
  animation: `fadeIn 0.8s ease-out forwards, pulse 3s ease-in-out infinite`,
  "@keyframes fadeIn": fadeIn,
  "@keyframes pulse": pulse,
});

const AnimatedTypography = styled(Typography)({
  animation: `slideRight 0.6s ease-out forwards`,
  opacity: 0,
  "@keyframes slideRight": slideRight,
});

const AnimatedDescription = styled(Typography)({
  animation: `slideUp 0.7s ease-out forwards 0.3s`,
  opacity: 0,
  "@keyframes slideUp": slideUp,
});

const AnimatedStack = styled(Stack)({
  animation: `slideUp 0.8s ease-out forwards 0.4s`,
  opacity: 0,
  "@keyframes slideUp": slideUp,
});

const GlowingButton = styled(Button)({
  animation: `glow 3s infinite`,
  "@keyframes glow": glow,
});

const FormContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  padding: "45px",
  borderRadius: "24px",
  boxShadow: "0px 15px 50px rgba(0, 0, 0, 0.15)",
  width: "100%",
  textAlign: "center",
  border: '1px solid rgba(255, 255, 255, 0.5)',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.25)",
    borderColor: 'rgba(22, 171, 101, 0.3)',
  }
}));

const StyledInputField = styled(InputField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    height: '56px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      background: 'rgba(255, 255, 255, 0.95)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(22, 171, 101, 0.15)',
      background: 'rgba(255, 255, 255, 1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#16ab65',
    borderWidth: '2px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '15px',
    transform: 'translate(14px, 16px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}));

interface LoginFormType {
  email: string;
  password: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { schemaLogin } = useValidationForm();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Add effect to show welcome message after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
        backgroundColor: "transparent",
      }}
    >
      <FormContainer maxWidth={isMobile ? '90%' : '480px'}>
        <AnimatedLogo sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <img
            src={images.logo.logo_moneymind_no_bg}
            alt="MoneyMind Logo"
            style={{ width: "140px", height: "auto" }}
          />
        </AnimatedLogo>

        {showWelcome && (
          <>
            <AnimatedTypography
              variant="h4"
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: "22px", sm: "28px" }, 
                mb: 1,
                background: `linear-gradient(90deg, #16ab65, #0d8a4e)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome to MoneyMind
            </AnimatedTypography>
            
            <AnimatedDescription 
              variant="body1" 
              sx={{ 
                opacity: 0.7, 
                mb: 4, 
                fontSize: '15px',
                maxWidth: '80%', 
                mx: 'auto' 
              }}
            >
              Smart financial management for your peace of mind
            </AnimatedDescription>
          </>
        )}

        <FormProvider {...loginForm}>
          <form onSubmit={handleSubmit(handleLogin)}>
            <AnimatedStack spacing={3}>
              <StyledInputField
                fullWidth
                name="email"
                label="Email Address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#16ab65", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledInputField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#16ab65", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: alpha('#16ab65', 0.7) }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <GlowingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  backgroundColor: "#16ab65",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "14px",
                  mt: 1,
                  padding: "14px",
                  fontSize: "16px",
                  boxShadow: '0 6px 20px rgba(22, 171, 101, 0.3)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  "&:hover": { 
                    backgroundColor: "#0d8a4e",
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(22, 171, 101, 0.4)',
                  },
                  "&:active": {
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {isLoading ? "Processing..." : "Sign In"}
              </GlowingButton>

              <Box sx={{ position: 'relative', my: 2 }}>
                <Divider sx={{ my: 2, opacity: 0.6 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    bgcolor: 'rgba(255, 255, 255, 0.9)', 
                    px: 2, 
                    borderRadius: '10px',
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '13px',
                  }}
                >
                  OR
                </Typography>
              </Box>
              
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
                  color: "#0d8a4e",
                  fontWeight: "bold",
                  borderRadius: "14px",
                  padding: "14px",
                  fontSize: "16px",
                  textTransform: "none",
                  border: '1px solid rgba(22, 171, 101, 0.3)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  "&:hover": { 
                    backgroundColor: "rgba(22, 171, 101, 0.05)",
                    borderColor: "#16ab65",
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                  },
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
        
      </FormContainer>
    </Box>
  );
}

export default LoginForm;
