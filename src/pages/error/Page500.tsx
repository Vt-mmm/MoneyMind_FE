import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "components";
import { StyledContent } from "./styles";

function Page500() {
  const handleNavigateLogin = () => {
    window.location.href = "/auth/login"; // Điều hướng đến trang login
  };
// ----------------------------------------------------------------------

  return (
    <>
      <Helmet title="500 - Lỗi máy chủ" />

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
          {/* <Box component="img" src="https://example.com/server-error.png" alt="500" sx={{ width: 300, mb: 2, borderRadius: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} /> */}
          
          <Typography
            variant="h3"
            paragraph
            sx={{
              color: "#d32f2f",
              fontWeight: "bold",
            }}
          >
            Lỗi máy chủ nội bộ
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Máy chủ đang gặp sự cố. Vui lòng thử lại sau hoặc quay về trang chủ.
          </Typography>

          <Button
            size="large"
            variant="contained"
            component={RouterLink}
            to="/"
            sx={{
              bgcolor: "#d32f2f",
              color: "#fff",
              "&:hover": { bgcolor: "#b71c1c" },
            }}
            onClick={handleNavigateLogin}
          >
            Quay về trang chủ
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page500;
