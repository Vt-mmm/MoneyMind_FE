// @mui
import { Box, Button, Container, Typography } from '@mui/material';
//
import { Helmet } from 'components';
import { StyledContent } from './styles';

// ----------------------------------------------------------------------

function Page403() {
  const handleNavigateLogin = () => {
    window.location.href = "/auth/login"; // Điều hướng đến trang login
  };

  return (
    <>
      <Helmet title="403 Page No Permission" />
      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #16ab65 0%, #4caf50 100%)', // Gradient background
        }}
      >
        <StyledContent
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: 4,
            borderRadius: 2,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: 500,
            border: '1px solid #ddd',
          }}
        >
          <Typography variant="h3" paragraph sx={{ color: '#16ab65', fontWeight: 600 }}>
            Bạn không có quyền truy cập
          </Typography>

          <Typography sx={{ color: 'text.secondary', marginBottom: 4 }}>
            Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập lại để tiếp tục.
          </Typography>

          <Box
            component="img"
            alt="No permissions"
            src="https://bizflyportal.mediacdn.vn/thumb_wm/1000,100/bizflyportal/images/loi16045468899996.jpg" // Placeholder ảnh (bạn có thể thay bằng ảnh thực tế)
            sx={{
              height: 260,
              mx: 'auto',
              my: { xs: 5, sm: 10 },
              borderRadius: 2,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Thêm bóng mờ cho ảnh
            }}
          />

          <Button
            size="large"
            color="success" // Dùng màu chủ đạo là #16ab65
            variant="contained"
            onClick={handleNavigateLogin}
            sx={{
              width: '100%',
              padding: '12px 20px',
              textTransform: 'uppercase',
              fontWeight: 600,
              backgroundColor: '#16ab65',
              '&:hover': {
                backgroundColor: '#128a4d',
              },
            }}
          >
            Đăng nhập lại
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page403;
