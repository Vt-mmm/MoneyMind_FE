import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "redux/config";
import { fetchUsers } from "redux/dashboard/dashboardSlice";
import { Transaction } from "common/models";
import { fetchTransactions, fetchTransactionPage, setPageSize } from "redux/transaction/transactionSlice";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Avatar,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  Pie,
  Cell,
  Tooltip,
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
} from "@mui/icons-material";

const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

const MoneyMindDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
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
    <Container
      maxWidth="xl"
      sx={{
        py: 5,
        background:
          "linear-gradient(135deg, rgb(240, 253, 244), rgb(240, 253, 244))",
      }}
    >
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1cc88a",
            background: "#1cc88a",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Spending Management Overview
        </Typography>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleReloadData}
          disabled={showLoading}
          sx={{ borderColor: '#1cc88a', color: '#1cc88a' }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Thống kê tổng quan */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4e73df10, #ffffff)",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 7px 14px rgba(78, 115, 223, 0.3)",
              },
            }}
            onClick={handleUsersCardClick}
          >
            <Avatar sx={{ bgcolor: "#4e73df", mb: 2, width: 48, height: 48 }}>
              <PeopleIcon />
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ color: "#4e73df", fontWeight: 500 }}
              gutterBottom
            >
              Users
            </Typography>
            <Typography variant="h5" sx={{ color: "#4e73df", fontWeight: 600 }}>
              {hasUsers ? users.length : 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #1cc88a10, #ffffff)",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 7px 14px rgba(28, 200, 138, 0.3)",
              },
            }}
            onClick={handleTransactionsCardClick}
          >
            <Avatar sx={{ bgcolor: "#1cc88a", mb: 2, width: 48, height: 48 }}>
              <PaymentsIcon />
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ color: "#1cc88a", fontWeight: 500 }}
              gutterBottom
            >
              Total Transactions
            </Typography>
            <Typography variant="h5" sx={{ color: "#1cc88a", fontWeight: 600 }}>
              {hasTransactions ? transactions.length : 0}
              {pagination && pagination.totalItems > transactions.length && (
                <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>
                  (of {pagination.totalItems})
                </Typography>
              )}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #36b9cc10, #ffffff)",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 7px 14px rgba(54, 185, 204, 0.3)",
              },
            }}
          >
            <Avatar sx={{ bgcolor: "#36b9cc", mb: 2, width: 48, height: 48 }}>
              <AccountBalanceIcon />
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ color: "#36b9cc", fontWeight: 500 }}
              gutterBottom
            >
              Total Value
            </Typography>
            <Typography variant="h5" sx={{ color: "#36b9cc", fontWeight: 600 }}>
              {totalTransactionValue.toLocaleString()} VND
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "#ffffff",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#2d3748", fontWeight: 600 }}
              >
                Transaction Distribution
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: "#36b9cc" }}>Filter By</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(e.target.value as "day" | "month" | "year")
                    }
                    sx={{
                      color: "#36b9cc",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#36b9cc",
                      },
                    }}
                  >
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ width: "100%", height: 350 }}>
              {chartDataLine.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart
                    data={chartDataLine}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
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
                    <Tooltip
                      formatter={(value: number) => [`${value} transactions`, "Transactions"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #4e73df",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#4e73df" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="transactions"
                      stroke="#4e73df"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#4e73df" }}
                      activeDot={{ r: 6, fill: "#4e73df" }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {showLoading ? (
                    <CircularProgress size={30} sx={{ color: "#4e73df" }} />
                  ) : (
                    <Typography color="textSecondary">No transaction data available</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "#ffffff",
              height: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(54, 185, 204, 0.2)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#2d3748", fontWeight: 600 }}
              >
                Total Transaction Value
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}></Box>
            </Box>

            {/* Date filters */}
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #36b9cc",
                }}
              />
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, endDate: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #36b9cc",
                }}
              />
              <Button
                variant="contained"
                onClick={handleFilterApply}
                sx={{
                  bgcolor: "#36b9cc",
                  "&:hover": { bgcolor: "#2c9faf" },
                }}
              >
                Apply
              </Button>
            </Box>

            <Box sx={{ width: "100%", height: 350 }}>
              {chartDataBar.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart
                    data={chartDataBar}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#666", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: "#666", fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toLocaleString()} VND`,
                        "Total Value",
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #36b9cc",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#36b9cc" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalValue"
                      fill="#36b9cc"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                      animationDuration={1000}
                    >
                      {chartDataBar.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.totalValue > 0 ? "#36b9cc" : "#e74a3b"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {showLoading ? (
                    <CircularProgress size={30} sx={{ color: "#36b9cc" }} />
                  ) : (
                    <Typography color="textSecondary">No transaction data available</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Loading overlay */}
      {showLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: "#4e73df" }} />
        </Box>
      )}
    </Container>
  );
};

export default MoneyMindDashboardPage;