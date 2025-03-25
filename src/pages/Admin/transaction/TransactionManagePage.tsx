import { useEffect, useState, } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
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
  Button,
  Chip,
  IconButton,
  Paper,
  alpha,
  Tab,
  Tabs,
  AvatarGroup,
} from "@mui/material";
import { styled } from "@mui/system";
import { Transaction } from "common/models/transaction.model";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/config";
import { fetchTransactions } from "redux/transaction/transactionSlice";
import {
  Payments as PaymentsIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";

// Định nghĩa màu sắc
const PRIMARY_GREEN = "#16ab65"; // Màu xanh chính của ứng dụng
const DANGER_COLOR = "#FF4842"; // Màu đỏ cho cảnh báo
const WARNING_COLOR = "#FFC107"; // Màu vàng cho thông báo
const SUCCESS_COLOR = "#00AB55"; // Màu xanh lá cho thành công

const fadeInAnimation = { 
  "0%": { opacity: 0, transform: "translateY(10px)" }, 
  "100%": { opacity: 1, transform: "translateY(0)" } 
};

const AnimatedBox = styled(Box)({ 
  animation: `fadeIn 0.5s ease-out forwards`, 
  "@keyframes fadeIn": fadeInAnimation 
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({ 
  padding: theme.spacing(1.5), 
  verticalAlign: "middle",
  borderColor: alpha(theme.palette.divider, 0.08),
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '200px',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: alpha(PRIMARY_GREEN, 0.2),
    },
    '&:hover fieldset': {
      borderColor: alpha(PRIMARY_GREEN, 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: PRIMARY_GREEN,
      borderWidth: '1px',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(PRIMARY_GREEN, 0.15)}`,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  boxShadow: 'none',
  fontWeight: 600,
  transition: 'all 0.2s',
  padding: '8px 16px',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)',
  },
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  height: '100%',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  minHeight: 48,
  borderRadius: 8,
  marginRight: 8,
  '&.Mui-selected': {
    backgroundColor: alpha(PRIMARY_GREEN, 0.1),
    color: PRIMARY_GREEN,
  },
}));

const TransactionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
    transform: 'translateY(-4px)',
    borderColor: alpha(PRIMARY_GREEN, 0.2),
  },
}));

export default function TransactionManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { transactions, isLoading, totalRecord } = useAppSelector((state) => state.transaction);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tabValue, setTabValue] = useState(0);

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
  }, [searchTerm, page, rowsPerPage, dispatch, navigate, refreshKey]);

  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {
      const filtered = transactions.filter((transaction) =>
        transaction.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
      );
      setFilteredTransactions(filtered);
    }
  }, [transactions, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (amount: number) => {
    if (amount > 5000000) return DANGER_COLOR; // red for high amounts
    if (amount > 2000000) return WARNING_COLOR; // orange for medium amounts
    return PRIMARY_GREEN; // green for normal amounts
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        <AnimatedBox>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledCard elevation={0} sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    mb={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: alpha(PRIMARY_GREEN, 0.1), 
                        color: PRIMARY_GREEN,
                        width: 56,
                        height: 56,
                      }}>
                        <PaymentsIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ 
                          background: `linear-gradient(90deg, ${PRIMARY_GREEN}, ${alpha(PRIMARY_GREEN, 0.7)})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 0.5,
                        }}>
                          Transaction Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Manage and monitor all financial transactions
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        color={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                        sx={{ 
                          bgcolor: viewMode === 'list' ? alpha(PRIMARY_GREEN, 0.1) : 'transparent',
                          border: viewMode === 'list' ? `1px solid ${alpha(PRIMARY_GREEN, 0.2)}` : 'none',
                          color: viewMode === 'list' ? PRIMARY_GREEN : 'inherit',
                        }}
                      >
                        <ViewListIcon />
                      </IconButton>
                      <IconButton 
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => setViewMode('grid')}
                        sx={{ 
                          bgcolor: viewMode === 'grid' ? alpha(PRIMARY_GREEN, 0.1) : 'transparent',
                          border: viewMode === 'grid' ? `1px solid ${alpha(PRIMARY_GREEN, 0.2)}` : 'none',
                          color: viewMode === 'grid' ? PRIMARY_GREEN : 'inherit',
                        }}
                      >
                        <ViewModuleIcon />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                      mb: 3,
                      '& .MuiTabs-indicator': {
                        display: 'none',
                      },
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      pb: 1,
                    }}
                  >
                    <StyledTab label="All Transactions" icon={<DashboardIcon />} iconPosition="start" />
                  </Tabs>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <SearchTextField
                      placeholder="Search transactions by recipient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: PRIMARY_GREEN, opacity: 0.7 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: '100%', sm: 400 } }}
                    />
                    
                    <Stack direction="row" spacing={1}>
                      <ActionButton
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        sx={{
                          bgcolor: PRIMARY_GREEN,
                          '&:hover': {
                            bgcolor: alpha(PRIMARY_GREEN, 0.9),
                          }
                        }}
                      >
                        Refresh
                      </ActionButton>
                    </Stack>
                  </Box>

                  {/* Transaction List View */}
                  {viewMode === 'list' && (
                    <>
                      <TableContainer sx={{ 
                        borderRadius: 3, 
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.04)}`,
                        maxHeight: 600,
                        width: '100%',
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                          height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: alpha(PRIMARY_GREEN, 0.2),
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: alpha(theme.palette.common.black, 0.05),
                        },
                      }}>
                        <Table stickyHeader aria-label="transactions-table" size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '40px',
                              }}>No.</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '180px',
                              }}>Recipient</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '320px',
                              }}>Transaction ID</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '120px',
                              }}>Amount</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '100px',
                              }}>Transaction Date</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '200px',
                              }}>Description</StyledTableCell>
                              <StyledTableCell sx={{ 
                                fontWeight: 600, 
                                bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                color: PRIMARY_GREEN,
                                width: '100px',
                              }}>Tags</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {isLoading ? (
                              <TableRow>
                                <StyledTableCell colSpan={7} align="center">
                                  <Stack alignItems="center" justifyContent="center" minHeight={300} spacing={2}>
                                    <CircularProgress size={40} sx={{ color: PRIMARY_GREEN }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Loading transactions...
                                    </Typography>
                                  </Stack>
                                </StyledTableCell>
                              </TableRow>
                            ) : !hasTransactions ? (
                              <TableRow>
                                <StyledTableCell colSpan={7} align="center">
                                  <Stack alignItems="center" justifyContent="center" minHeight={300} spacing={2}>
                                    <Box sx={{ 
                                      p: 3, 
                                      borderRadius: '50%', 
                                      bgcolor: alpha(PRIMARY_GREEN, 0.05),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                      <PaymentsIcon sx={{ fontSize: 60, color: alpha(PRIMARY_GREEN, 0.6) }} />
                                    </Box>
                                    <Typography variant="h6" color="text.primary" fontWeight={500}>
                                      No transactions found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, textAlign: 'center' }}>
                                      Try adjusting your search or filters to find what you're looking for
                                    </Typography>
                                    <Button 
                                      variant="outlined" 
                                      onClick={() => setSearchTerm('')}
                                      sx={{ 
                                        mt: 1, 
                                        borderRadius: '10px', 
                                        textTransform: 'none',
                                        borderColor: PRIMARY_GREEN,
                                        color: PRIMARY_GREEN,
                                        '&:hover': {
                                          borderColor: PRIMARY_GREEN,
                                          bgcolor: alpha(PRIMARY_GREEN, 0.1),
                                        }
                                      }}
                                    >
                                      Clear search
                                    </Button>
                                  </Stack>
                                </StyledTableCell>
                              </TableRow>
                            ) : (
                              filteredTransactions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((transaction: Transaction, index: number) => (
                                  <TableRow
                                    key={transaction.id || index}
                                    sx={{
                                      '&:hover': {
                                        bgcolor: alpha(PRIMARY_GREEN, 0.03),
                                      },
                                      transition: 'background-color 0.2s',
                                    }}
                                  >
                                    <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar 
                                          sx={{ 
                                            width: 24, 
                                            height: 24, 
                                            bgcolor: alpha(PRIMARY_GREEN, 0.8),
                                            fontSize: 12,
                                          }}
                                        >
                                          {transaction.recipientName?.charAt(0) || "?"}
                                        </Avatar>
                                        <Typography variant="body2">
                                          {transaction.recipientName}
                                        </Typography>
                                      </Stack>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: PRIMARY_GREEN,
                                          fontFamily: 'monospace',
                                        }}
                                      >
                                        {transaction.id}
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Typography variant="body2">
                                        {formatCurrency(transaction.amount)}
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Typography variant="body2">
                                        {new Date(transaction.transactionDate).toLocaleDateString("vi-VN", { 
                                          year: "numeric", 
                                          month: "2-digit", 
                                          day: "2-digit" 
                                        })}
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Typography variant="body2">
                                        {transaction.description || 
                                          <span style={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                            No description
                                          </span>
                                        }
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {transaction.tags && transaction.tags.length > 0 && (
                                        <Chip
                                          size="small"
                                          label={transaction.tags[0].name}
                                          sx={{ 
                                            bgcolor: alpha(transaction.tags[0].color || '#e0e0e0', 0.8),
                                            color: '#fff',
                                            fontSize: '0.75rem',
                                            height: 24,
                                            borderRadius: '12px',
                                          }}
                                        />
                                      )}
                                    </StyledTableCell>
                                  </TableRow>
                                ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}

                  {/* Transaction Grid View */}
                  {viewMode === 'grid' && (
                    <Box sx={{ mt: 2 }}>
                      {isLoading ? (
                        <Stack alignItems="center" justifyContent="center" minHeight={300} spacing={2}>
                          <CircularProgress size={40} sx={{ color: PRIMARY_GREEN }} />
                          <Typography variant="body2" color="text.secondary">
                            Loading transactions...
                          </Typography>
                        </Stack>
                      ) : !hasTransactions ? (
                        <Stack alignItems="center" justifyContent="center" minHeight={300} spacing={2}>
                          <Box sx={{ 
                            p: 3, 
                            borderRadius: '50%', 
                            bgcolor: alpha(PRIMARY_GREEN, 0.05),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <PaymentsIcon sx={{ fontSize: 60, color: alpha(PRIMARY_GREEN, 0.6) }} />
                          </Box>
                          <Typography variant="h6" color="text.primary" fontWeight={500}>
                            No transactions found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, textAlign: 'center' }}>
                            Try adjusting your search or filters to find what you're looking for
                          </Typography>
                          <Button 
                            variant="outlined"
                            onClick={() => setSearchTerm('')}
                            sx={{ 
                              mt: 1, 
                              borderRadius: '10px', 
                              textTransform: 'none',
                              borderColor: PRIMARY_GREEN,
                              color: PRIMARY_GREEN,
                              '&:hover': {
                                borderColor: PRIMARY_GREEN,
                                bgcolor: alpha(PRIMARY_GREEN, 0.1),
                              }
                            }}
                          >
                            Clear search
                          </Button>
                        </Stack>
                      ) : (
                        <Grid container spacing={2}>
                          {filteredTransactions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((transaction: Transaction, index: number) => (
                              <Grid item xs={12} sm={6} md={4} key={transaction.id || index}>
                                <TransactionCard elevation={0} sx={{ 
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '4px',
                                    bgcolor: getStatusColor(transaction.amount),
                                  },
                                  animation: `fadeIn 0.3s ease-out forwards`,
                                  animationDelay: `${index * 0.05}s`,
                                }}>
                                  <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar 
                                          sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            bgcolor: alpha(PRIMARY_GREEN, 0.8),
                                            fontSize: 16,
                                            boxShadow: `0 2px 8px ${alpha(PRIMARY_GREEN, 0.3)}`,
                                          }}
                                        >
                                          {transaction.recipientName?.charAt(0) || "?"}
                                        </Avatar>
                                        <Box>
                                          <Typography variant="subtitle1" fontWeight={600}>
                                            {transaction.recipientName}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            ID: {transaction.id}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                      <Chip
                                        label={formatCurrency(transaction.amount)}
                                        size="small"
                                        sx={{
                                          fontWeight: 'bold',
                                          bgcolor: alpha(getStatusColor(transaction.amount), 0.1),
                                          color: getStatusColor(transaction.amount),
                                          borderRadius: '8px',
                                          py: 0.5,
                                        }}
                                      />
                                    </Box>
                                    
                                    <Divider sx={{ opacity: 0.6 }} />
                                    
                                    <Box>
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Description
                                      </Typography>
                                      <Typography variant="body2" fontWeight={500} sx={{ 
                                        minHeight: '40px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                      }}>
                                        {transaction.description || 
                                          <span style={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                            No description
                                          </span>
                                        }
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: alpha(PRIMARY_GREEN, 0.7) }} />
                                        <Typography variant="body2">
                                          {new Date(transaction.transactionDate).toLocaleDateString("vi-VN", { 
                                            year: "numeric", 
                                            month: "2-digit", 
                                            day: "2-digit" 
                                          })}
                                        </Typography>
                                      </Box>
                                      
                                      {transaction.tags && transaction.tags.length > 0 ? (
                                        <AvatarGroup max={3} sx={{ 
                                          '& .MuiAvatar-root': { 
                                            width: 24, 
                                            height: 24
                                          }
                                        }}>
                                          {transaction.tags.map((tag, idx) => (
                                            <Avatar
                                              key={idx}
                                              sx={{ 
                                                width: 24, 
                                                height: 24, 
                                                bgcolor: tag.color || '#e0e0e0',
                                                fontSize: 12,
                                              }}
                                            >
                                              {tag.name.charAt(0)}
                                            </Avatar>
                                          ))}
                                        </AvatarGroup>
                                      ) : (
                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                          No tags
                                        </Typography>
                                      )}
                                    </Box>
                                  </Stack>
                                </TransactionCard>
                              </Grid>
                            ))
                          }
                        </Grid>
                      )}
                    </Box>
                  )}

                  {/* Pagination */}
                  {hasTransactions && (
                    <TablePagination
                      component="div"
                      count={totalRecord || 0}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[10, 20, 50]}
                      sx={{ 
                        mt: 2,
                        '.MuiTablePagination-select': {
                          '&:focus': {
                            bgcolor: alpha(PRIMARY_GREEN, 0.1),
                          },
                        },
                      }}
                    />
                  )}
                </StyledCard>
              </Grid>
            </Grid>
          </Box>
        </AnimatedBox>
      </Box>
    </Container>
  );
}
