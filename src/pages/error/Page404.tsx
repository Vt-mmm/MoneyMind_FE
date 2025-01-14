// @mui
import { Box, Button, Container, Typography } from "@mui/material";
//
import images from "assets";
import { Helmet } from "components";
import { StyledContent } from "./styles";

// ----------------------------------------------------------------------

function Page404() {

  const handleNavigateLogin = () => {
    window.location.href = "/auth/login"; // Điều hướng đến trang login
  };

  return (
    <>
      <Helmet title="404 Page Not Found" />

      <Container>
        <StyledContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            bgcolor: "#f9f9f9",
            p: 4,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            paragraph
            sx={{
              color: "#16ab65",
              fontWeight: "bold",
            }}
          >
            Trang không tồn tại
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Rất tiếc, chúng tôi không tìm thấy trang mà bạn đang tìm kiếm. Hãy kiểm tra lại URL hoặc quay lại trang chính.
          </Typography>

          <Box
            component="img"
            alt="Not found"
            src={images.common.moneymind_loginlogo}
            sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
          />

          <Button
            size="large"
            color="inherit"
            variant="outlined"
            sx={{
              borderColor: "#16ab65",
              color: "#16ab65",
              "&:hover": {
                borderColor: "#138a52",
                color: "#138a52",
              },
            }}
            onClick={handleNavigateLogin}
          >
            Đi tới trang đăng nhập
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page404;
