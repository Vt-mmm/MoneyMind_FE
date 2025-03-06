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
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import { Transaction } from "common/models";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { fetchTransactions } from "redux/transaction/transactionSlice";
import {
  Payments as PaymentsIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Định nghĩa màu sắc
const PRIMARY_GREEN = "#16ab65"; // Giữ màu xanh lá làm điểm nhấn
const NEUTRAL_GREY = "#616161"; // Màu xám trung tính cho text
const LIGHT_GREY_BG = "#fafafa"; // Nền nhạt cho header và hover

const fadeInSlideUp = { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } };
const AnimatedTableRow = styled(TableRow)({ animation: `fadeInSlideUp 0.4s ease-out forwards`, "@keyframes fadeInSlideUp": fadeInSlideUp });
const StyledTableCell = styled(TableCell)(({ theme }) => ({ padding: theme.spacing(1.5), verticalAlign: "middle" }));

export default function TransactionManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { transactions, isLoading } = useAppSelector((state) => state.transaction);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasTransactions = filteredTransactions.length > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
  };

  useEffect(() => {
    dispatch(
      fetchTransactions({
        optionParams: { searchValue: searchTerm, itemsPerPage: rowsPerPage, currentPage: page + 1 },
        navigate,
      })
    );
  }, [searchTerm, page, rowsPerPage, dispatch, navigate]);

  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {
      const filtered = transactions.filter((transaction) =>
        transaction.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [transactions, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: PRIMARY_GREEN }}>
          Transaction Management
        </Typography>
      </Stack>

      {/* Thanh tìm kiếm */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search transactions by recipient"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: NEUTRAL_GREY }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: NEUTRAL_GREY },
              "&:hover fieldset": { borderColor: PRIMARY_GREEN },
              "&.Mui-focused fieldset": { borderColor: PRIMARY_GREEN },
            },
            "& .MuiInputLabel-root": { color: NEUTRAL_GREY },
            "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY_GREEN },
          }}
        />
      </Stack>

      <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#fff" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ p: 3 }}>
              <TableContainer component={Box} sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="recent-transactions-table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: LIGHT_GREY_BG }}>
                      <StyledTableCell sx={{ fontWeight: "bold", color: NEUTRAL_GREY }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <DescriptionIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                          Transaction ID
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold", color: NEUTRAL_GREY }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MoneyIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                          Amount
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold", color: NEUTRAL_GREY }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <DescriptionIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                          Description
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold", color: NEUTRAL_GREY }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                          Transaction Date
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold", color: NEUTRAL_GREY }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                          Recipient
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <StyledTableCell colSpan={5} align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                            <CircularProgress sx={{ color: PRIMARY_GREEN }} size={40} />
                            <Typography variant="body2" color={NEUTRAL_GREY} ml={2}>
                              Loading data...
                            </Typography>
                          </Box>
                        </StyledTableCell>
                      </TableRow>
                    ) : !hasTransactions ? (
                      <TableRow>
                        <StyledTableCell colSpan={5} align="center">
                          <Box
                            sx={{
                              p: 4,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              bgcolor: LIGHT_GREY_BG,
                              borderRadius: 2,
                            }}
                          >
                            <PaymentsIcon sx={{ fontSize: 60, color: NEUTRAL_GREY, mb: 2 }} />
                            <Typography variant="subtitle1" sx={{ color: NEUTRAL_GREY }}>
                              No transactions found
                            </Typography>
                          </Box>
                        </StyledTableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((transaction: Transaction, index: number) => (
                          <AnimatedTableRow
                            key={transaction.id || index}
                            sx={{ "&:hover": { bgcolor: LIGHT_GREY_BG }, transition: "background-color 0.2s" }}
                          >
                            <StyledTableCell>
                              <Typography variant="body2" sx={{ fontWeight: "medium", color: NEUTRAL_GREY }}>
                                {transaction.id}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "bold",
                                  color: transaction.amount > 2000000 ? "#d32f2f" : PRIMARY_GREEN,
                                }}
                              >
                                {formatCurrency(transaction.amount)}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Typography
                                variant="body2"
                                sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: NEUTRAL_GREY }}
                              >
                                {transaction.description}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CalendarIcon fontSize="small" sx={{ mr: 1, color: NEUTRAL_GREY }} />
                                <Typography variant="body2" sx={{ color: NEUTRAL_GREY }}>
                                  {new Date(transaction.transactionDate).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" })}
                                </Typography>
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar sx={{ width: 28, height: 28, bgcolor: PRIMARY_GREEN, fontSize: 14 }}>
                                  {transaction.recipientName?.charAt(0) || "?"}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: NEUTRAL_GREY }}>{transaction.recipientName}</Typography>
                              </Stack>
                            </StyledTableCell>
                          </AnimatedTableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {hasTransactions && (
                <TablePagination
                  component="div"
                  count={filteredTransactions.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50]}
                  sx={{ mt: 2, "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { color: NEUTRAL_GREY } }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}