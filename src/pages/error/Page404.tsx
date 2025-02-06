// @mui
import { Box, Button, Container, Typography } from "@mui/material";
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
      <Helmet title="404 - Trang không tồn tại" />

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
          <Box component="img" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCEvzt9ilh8D0TPZRvKwD-UQhX135oYFE1PA&s"} alt="404" sx={{ width: 300, mb: 2 }} />
          
          <Typography
            variant="h3"
            paragraph
            sx={{
              color: "#16ab65",
              fontWeight: "bold",
            }}
          >
            Oops! Trang không tồn tại
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Chúng tôi không thể tìm thấy trang bạn yêu cầu. Hãy kiểm tra lại địa chỉ hoặc quay lại trang chính.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>


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
          </Box>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page404;