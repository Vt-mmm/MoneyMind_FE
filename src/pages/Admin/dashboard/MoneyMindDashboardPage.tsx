import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "redux/config";
import { fetchUsers } from "redux/dashboard/dashboardSlice";
import { Transaction } from "common/models";
import { fetchTransactions, setPageSize } from "redux/transaction/transactionSlice";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Button,
  Stack,
  alpha,
  styled,
} from "@mui/material";
import {
  LineChart,
  Line,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  PeopleAlt as PeopleIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { FinancialBackground } from "components";

// Constants
const PRIMARY_COLOR = '#1cc88a';
const SECONDARY_COLOR = '#4e73df';
const TERTIARY_COLOR = '#36b9cc';
const DANGER_COLOR = '#e74a3b';

// Styled Components
const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  height: '100%',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  '&:hover': {
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
}));

const StyledDateInput = styled('input')(({ theme }) => ({
  padding: '10px 14px',
  borderRadius: 8,
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
  fontSize: '0.875rem',
  transition: 'all 0.2s',
  background: 'rgba(255, 255, 255, 0.8)',
  '&:focus': {
    outline: 'none',
    borderColor: PRIMARY_COLOR,
    boxShadow: `0 0 0 2px ${alpha(PRIMARY_COLOR, 0.1)}`,
    background: 'rgba(255, 255, 255, 1)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  padding: '8px 16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: `0 4px 12px ${alpha(PRIMARY_COLOR, 0.2)}`,
  },
}));

// Animation keyframes
const fadeInUp = {
  "@keyframes fadeInUp": {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" }
  }
};

const AnimatedBox = styled(Box)(({ delay = 0 }: { delay?: number }) => ({
  animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
  opacity: 0,
  ...fadeInUp
}));

const MoneyMindDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chartDataLine, setChartDataLine] = useState<
    { name: string; transactions: number }[]
  >([]);
  const [chartDataBar, setChartDataBar] = useState<
    { name: string; totalValue: number }[]
  >([]);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month"
  );
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  const { users } = useAppSelector((state) => state.dashboard);
  const { transactions, isLoading, pagination } = useAppSelector((state) => state.transaction);

  // Separate function to fetch transactions with better error handling
  const loadTransactions = async () => {
    setIsDataLoading(true);
    try {
      // First set a larger page size to get more data at once
      await dispatch(setPageSize(50));
      
      // Use the getAllPages option to fetch all transactions at once
      await dispatch(fetchTransactions({ 
        navigate, 
        optionParams: {
          pageSize: 50, // Đặt pageSize cao hơn để lấy nhiều dữ liệu hơn mỗi trang
          getAllPages: true // Tùy chọn để lấy tất cả các trang
        }
      }));
      
    } catch (error) {
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    // Fetch users
    dispatch(fetchUsers({ navigate }));
    
    // Fetch transactions with improved approach
    loadTransactions();
  }, [dispatch, navigate]);

  // Process chart data when transactions change
  useEffect(() => {
    if (transactions && Array.isArray(transactions) && transactions.length > 0) {
      processLineChartData(transactions, filterType);
      processBarChartData(transactions, filterType, dateFilter);
    }
  }, [transactions, filterType, dateFilter]);

  const hasTransactions =
    Array.isArray(transactions) && transactions.length > 0;
  const hasUsers = Array.isArray(users) && users.length > 0;
  const showLoading = isLoading || isDataLoading;

  // Changed from processPieChartData to processLineChartData
  const processLineChartData = (
    transactions: Transaction[],
    type: "day" | "month" | "year"
  ) => {
    let groupedData: Record<string, number> = {};
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
    });
    
    sortedTransactions.forEach((transaction) => {
      if (!transaction.transactionDate) return;
      const date = new Date(transaction.transactionDate);
      if (isNaN(date.getTime())) return;

      let key: string;
      if (type === "day") {
        key = date.toLocaleDateString("en-US");
      } else if (type === "month") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    // Convert to array and sort by date
    const formattedData = Object.keys(groupedData)
      .map((key) => ({
        name: key,
        transactions: groupedData[key],
      }))
      .sort((a, b) => {
        // For day format
        if (type === "day") {
          return new Date(a.name).getTime() - new Date(b.name).getTime();
        }
        // For month/year format
        return a.name.localeCompare(b.name);
      });
      
    setChartDataLine(formattedData);
  };

  const processBarChartData = (
    transactions: Transaction[],
    type: "day" | "month" | "year",
    filter: { startDate: string; endDate: string }
  ) => {
    let filteredTransactions = transactions;

    if (filter.startDate && filter.endDate) {
      const start = new Date(filter.startDate);
      const end = new Date(filter.endDate);
      filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.transactionDate);
        return date >= start && date <= end;
      });
    }

    let groupedData: Record<string, number> = {};
    filteredTransactions.forEach((transaction) => {
      if (!transaction.transactionDate || !transaction.amount) return;
      const date = new Date(transaction.transactionDate);
      if (isNaN(date.getTime())) return;

      let key: string;
      if (type === "day") {
        key = date.toLocaleDateString("en-US");
      } else if (type === "month") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      groupedData[key] = (groupedData[key] || 0) + transaction.amount;
    });

    const formattedData = Object.keys(groupedData)
      .map((key) => ({
        name: key,
        totalValue: groupedData[key],
      }))
      .sort((a, b) => {
        // For day format
        if (type === "day") {
          return new Date(a.name).getTime() - new Date(b.name).getTime();
        }
        // For month/year format
        return a.name.localeCompare(b.name);
      });
      
    setChartDataBar(formattedData);
  };

  const handleFilterApply = () => {
    processLineChartData(transactions || [], filterType);
    processBarChartData(transactions || [], filterType, dateFilter);
  };

  const handleUsersCardClick = () => navigate("/admin/users");
  const handleTransactionsCardClick = () => navigate("/admin/transaction");

  const totalTransactionValue = hasTransactions
    ? transactions.reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
        0
      )
    : 0;

  // Function to reload data if needed
  const handleReloadData = () => {
    loadTransactions();
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f8f9fc 30%, #f0f3f9 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Add 3D Financial Background */}
      <FinancialBackground color={PRIMARY_COLOR} intensity={1.2} />
      
      <Container maxWidth="xl">
        <Box sx={{ py: 4, position: 'relative', zIndex: 2 }}>
          {/* Header Section */}
          <AnimatedBox delay={0}>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between" 
              mb={4}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px)',
                borderRadius: 3,
                p: 3,
                boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: alpha(PRIMARY_COLOR, 0.1),
                    color: PRIMARY_COLOR,
                    boxShadow: `0 2px 10px ${alpha(PRIMARY_COLOR, 0.2)}`,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    Spending Management Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor your financial activities and trends
                  </Typography>
                </Box>
              </Stack>

              <ActionButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReloadData}
                disabled={showLoading}
                sx={{
                  borderColor: PRIMARY_COLOR,
                  color: PRIMARY_COLOR,
                  '&:hover': {
                    borderColor: PRIMARY_COLOR,
                    bgcolor: alpha(PRIMARY_COLOR, 0.05),
                  },
                }}
              >
                Refresh Data
              </ActionButton>
            </Stack>
          </AnimatedBox>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedBox delay={0.1}>
                <DashboardCard
                  onClick={handleUsersCardClick}
                  sx={{ 
                    cursor: 'pointer',
                    borderLeft: `4px solid ${SECONDARY_COLOR}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: alpha(SECONDARY_COLOR, 0.1),
                        color: SECONDARY_COLOR,
                        boxShadow: `0 2px 10px ${alpha(SECONDARY_COLOR, 0.2)}`,
                      }}
                    >
                      <PeopleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: SECONDARY_COLOR, fontWeight: 600 }}>
                        {hasUsers ? users.length.toLocaleString() : 0}
                      </Typography>
                    </Box>
                  </Stack>
                </DashboardCard>
              </AnimatedBox>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AnimatedBox delay={0.2}>
                <DashboardCard
                  onClick={handleTransactionsCardClick}
                  sx={{ 
                    cursor: 'pointer',
                    borderLeft: `4px solid ${PRIMARY_COLOR}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: alpha(PRIMARY_COLOR, 0.1),
                        color: PRIMARY_COLOR,
                        boxShadow: `0 2px 10px ${alpha(PRIMARY_COLOR, 0.2)}`,
                      }}
                    >
                      <PaymentsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Transactions
                      </Typography>
                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography variant="h4" sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}>
                          {hasTransactions ? transactions.length.toLocaleString() : 0}
                        </Typography>
                        {pagination && pagination.totalItems > transactions.length && (
                          <Typography variant="caption" color="text.secondary">
                            of {pagination.totalItems.toLocaleString()}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </DashboardCard>
              </AnimatedBox>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AnimatedBox delay={0.3}>
                <DashboardCard
                  sx={{ borderLeft: `4px solid ${TERTIARY_COLOR}` }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: alpha(TERTIARY_COLOR, 0.1),
                        color: TERTIARY_COLOR,
                        boxShadow: `0 2px 10px ${alpha(TERTIARY_COLOR, 0.2)}`,
                      }}
                    >
                      <AccountBalanceIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Value
                      </Typography>
                      <Typography variant="h4" sx={{ color: TERTIARY_COLOR, fontWeight: 600 }}>
                        {totalTransactionValue.toLocaleString()} ₫
                      </Typography>
                    </Box>
                  </Stack>
                </DashboardCard>
              </AnimatedBox>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AnimatedBox delay={0.4}>
                <ChartContainer>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Transaction Distribution
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Number of transactions over time
                      </Typography>
                    </Box>
                    
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Time Range</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as "day" | "month" | "year")}
                        sx={{
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.8)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(PRIMARY_COLOR, 0.2),
                          },
                        }}
                      >
                        <MenuItem value="day">Daily</MenuItem>
                        <MenuItem value="month">Monthly</MenuItem>
                        <MenuItem value="year">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  <Box sx={{ width: "100%", height: 350 }}>
                    {chartDataLine.length > 0 ? (
                      <ResponsiveContainer>
                        <LineChart
                          data={chartDataLine}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: "#666", fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tick={{ fill: "#666", fontSize: 12 }}
                          />
                          <ChartTooltip
                            formatter={(value: number) => [`${value} transactions`, "Transactions"]}
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              borderRadius: "8px",
                              border: `1px solid ${PRIMARY_COLOR}`,
                              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                            labelStyle={{ color: PRIMARY_COLOR }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="transactions"
                            stroke={PRIMARY_COLOR}
                            strokeWidth={2}
                            dot={{ r: 4, fill: PRIMARY_COLOR }}
                            activeDot={{ r: 6, fill: PRIMARY_COLOR }}
                            animationDuration={1000}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Stack alignItems="center" justifyContent="center" height="100%">
                        {showLoading ? (
                          <CircularProgress size={30} sx={{ color: PRIMARY_COLOR }} />
                        ) : (
                          <Box textAlign="center">
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              No transaction data available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Start making transactions to see the distribution
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    )}
                  </Box>
                </ChartContainer>
              </AnimatedBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <AnimatedBox delay={0.5}>
                <ChartContainer>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Total Transaction Value
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transaction values by time period
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Start Date
                        </Typography>
                        <StyledDateInput
                          type="date"
                          value={dateFilter.startDate}
                          onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                        />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          End Date
                        </Typography>
                        <StyledDateInput
                          type="date"
                          value={dateFilter.endDate}
                          onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <ActionButton
                          variant="contained"
                          onClick={handleFilterApply}
                          startIcon={<FilterIcon />}
                          sx={{
                            mt: 3,
                            bgcolor: PRIMARY_COLOR,
                            '&:hover': {
                              bgcolor: alpha(PRIMARY_COLOR, 0.9),
                            },
                          }}
                        >
                          Apply Filter
                        </ActionButton>
                      </Box>
                    </Stack>

                    <Box sx={{ width: "100%", height: 350 }}>
                      {chartDataBar.length > 0 ? (
                        <ResponsiveContainer>
                          <BarChart
                            data={chartDataBar}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: "#666", fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis
                              tick={{ fill: "#666", fontSize: 12 }}
                              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            />
                            <ChartTooltip
                              formatter={(value: number) => [
                                `${value.toLocaleString()} ₫`,
                                "Total Value",
                              ]}
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "8px",
                                border: `1px solid ${TERTIARY_COLOR}`,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                              }}
                              labelStyle={{ color: TERTIARY_COLOR }}
                            />
                            <Legend />
                            <Bar
                              dataKey="totalValue"
                              fill={TERTIARY_COLOR}
                              radius={[4, 4, 0, 0]}
                              barSize={30}
                              animationDuration={1000}
                            >
                              {chartDataBar.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.totalValue > 0 ? TERTIARY_COLOR : DANGER_COLOR}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Stack alignItems="center" justifyContent="center" height="100%">
                          {showLoading ? (
                            <CircularProgress size={30} sx={{ color: TERTIARY_COLOR }} />
                          ) : (
                            <Box textAlign="center">
                              <Typography variant="body1" color="text.secondary" gutterBottom>
                                No transaction data available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Start making transactions to see the values
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                </ChartContainer>
              </AnimatedBox>
            </Grid>
          </Grid>
        </Box>

        {/* Loading Overlay */}
        {showLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha('#fff', 0.8),
              zIndex: 9999,
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
              <Typography>Loading data...</Typography>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MoneyMindDashboardPage;