// @mui
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "components";
import { StyledContent } from "./styles";

// ----------------------------------------------------------------------

function Page403() {
  const handleNavigateLogin = () => {
    window.location.href = "/auth/login"; // Điều hướng đến trang login
  };

  return (
    <>
      <Helmet title="403 - Không có quyền truy cập" />

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
          <Box component="img" src="https://bizflyportal.mediacdn.vn/thumb_wm/1000,100/bizflyportal/images/loi16045468899996.jpg" alt="403" sx={{ width: 300, mb: 2, borderRadius: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
          
          <Typography
            variant="h3"
            paragraph
            sx={{
              color: "#16ab65",
              fontWeight: "bold",
            }}
          >
            Bạn không có quyền truy cập
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập lại để tiếp tục.
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{
              bgcolor: "#16ab65",
              color: "#fff",
              "&:hover": { bgcolor: "#138a52" },
            }}
            onClick={handleNavigateLogin}
          >
            Đăng nhập lại
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page403;
