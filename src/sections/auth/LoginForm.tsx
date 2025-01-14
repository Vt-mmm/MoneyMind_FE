import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, IconButton, InputAdornment, Link as MuiLink, Stack } from '@mui/material';
// @mui icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// redux
import { login, setIsLogout } from 'redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/config';
// hooks
import { InputField } from 'components';
import { useValidationForm } from 'hooks';
import { PATH_AUTH } from 'routes/paths';

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

  const loginForm = useForm<LoginFormType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schemaLogin),
  });
  

  const { handleSubmit } = loginForm;

  const handleLogin = (values: LoginFormType) => {
    const params = {
      data: { ...values },
      navigate,
    };
    dispatch(login(params))
      .unwrap()
      .then(() => dispatch(setIsLogout(false)))
      .catch((error) => {
        console.error("Login error:", error);
      });
  };
  

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(handleLogin)();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} onKeyDown={handleKeyDown}>
      <FormProvider {...loginForm}>
        <Stack spacing={3}>
          <InputField
            fullWidth
            size="medium"
            name="email"
            defaultValue=""
            label="Email"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityIcon sx={{ color: '#16ab65' }} /> : <VisibilityOffIcon sx={{ color: '#16ab65' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <InputField
            fullWidth
            size="medium"
            name="password"
            defaultValue=""
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityIcon sx={{ color: '#16ab65' }} /> : <VisibilityOffIcon sx={{ color: '#16ab65' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="end" sx={{ mt: 2, mb: 7 }}>
          <Box onClick={() => navigate(PATH_AUTH.forgotPassword)} sx={{ cursor: 'pointer' }}>
            <MuiLink variant="subtitle2" underline="hover" sx={{ color: '#16ab65' }}>
              Quên mật khẩu?
            </MuiLink>
          </Box>
        </Stack>

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: '#16ab65',
            color: 'white',
            '&:hover': {
              backgroundColor: '#149b5a',
            },
          }}
        >
          Đăng Nhập
        </Button>
      </FormProvider>
    </form>
  );
}

export default LoginForm;
