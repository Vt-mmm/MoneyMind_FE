import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import { useAppSelector } from "redux/config";
import { getAllWalletTypes } from "redux/wallettype/manageWalletTypeSlice";
import { AccountBalanceWallet, Savings, School, Favorite, LocalAtm, CardGiftcard } from "@mui/icons-material";

// Map loại Wallet Type với biểu tượng phù hợp
const walletIcons: Record<string, JSX.Element> = {
  Charity: <Favorite fontSize="large" />,
  Necessities: <LocalAtm fontSize="large" />,
  Leisure: <CardGiftcard fontSize="large" />,
  "Financial Freedom": <AccountBalanceWallet fontSize="large" />,
  Education: <School fontSize="large" />,
  Savings: <Savings fontSize="large" />,
};

const ManageWalletTypePage = () => {
  const dispatch = useDispatch();
  const { walletTypes, isLoading } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(getAllWalletTypes({ optionParams: { itemsPerPage: 100, currentPage: 1, searchValue: "", sortBy: "name" } }));
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Quản lý Loại Ví
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {walletTypes.map((wallet) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={wallet.id}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  padding: 2,
                  transition: "0.3s",
                  minHeight: 140, // Cố định chiều cao
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center", // Căn giữa nội dung
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box mb={1}>{walletIcons[wallet.name] || <AccountBalanceWallet fontSize="large" />}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {wallet.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2, // Giới hạn mô tả trong 2 dòng
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    {wallet.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ManageWalletTypePage;
