import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Divider,
  CircularProgress,

} from "@mui/material";
import { Transaction } from "common/models";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { fetchTransactions } from "redux/transaction/transactionSlice";  // ✅ Import từ transactionSlice
import {
    Payments as PaymentsIcon,
    AttachMoney as MoneyIcon,
    Description as DescriptionIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
  } from "@mui/icons-material";
  
export default function TransactionManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { transactions, isLoading } = useAppSelector(
    (state) => state.transaction
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // Check if data is loaded
    const hasTransactions =
    Array.isArray(filteredTransactions) && filteredTransactions.length > 0;

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  useEffect(() => {
    dispatch(
      fetchTransactions({
        optionParams: {
          searchValue: searchTerm,
        },
        navigate,
      })
    );
  }, [searchTerm, dispatch, navigate]);
  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {
      const filtered = transactions.filter((transaction) => 
        transaction.recipientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [transactions, searchTerm]);
  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Quản lý Giao dịch</Typography>
      </Stack>

      {/* Thanh tìm kiếm */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Tìm kiếm giao dịch"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Card>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              },
            }}
          >

          </Card>
        </Grid>
        <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

            </Box>
            <Divider />
            <TableContainer component={Box} sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="recent-transactions-table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        Mã GD
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                        Số tiền
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        Mô tả
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                        Ngày GD
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        Người nhận
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 3,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : !hasTransactions ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box
                          sx={{
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            opacity: 0.7,
                          }}
                        >
                          <PaymentsIcon
                            sx={{
                              fontSize: 60,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            Không có giao dịch nào
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(
                      (transaction: Transaction, index: number) => (
                        <TableRow
                          key={transaction.id || index}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {transaction.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color:
                                  transaction.amount > 2000000
                                    ? "error.main"
                                    : "success.main",
                              }}
                            >
                              {formatCurrency(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {transaction.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarIcon
                                fontSize="small"
                                color="action"
                                sx={{ mr: 1, fontSize: 16 }}
                              />
                              <Typography variant="body2">
                                {new Date(
                                  transaction.transactionDate
                                ).toLocaleDateString("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: `${theme.palette.primary.light}`,
                                  fontSize: 14,
                                }}
                              >
                                {transaction.recipientName?.charAt(0) || "?"}
                              </Avatar>
                              <Typography variant="body2">
                                {transaction.recipientName}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {hasTransactions && (
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              ></Box>
            )}
          </Card>
        </Grid>
      </Grid>
      </Card>
    </Container>
  );
}
