import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "redux/config";
import { fetchUsers } from "redux/dashboard/dashboardSlice";
import { Transaction } from "common/models";
import { fetchTransactions } from "redux/transaction/transactionSlice";
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
  PieChart,
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
  const [chartDataPie, setChartDataPie] = useState<
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

  const { users } = useAppSelector((state) => state.dashboard);
  const { transactions } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchTransactions({ navigate }));
    dispatch(fetchUsers({ navigate }));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {
      processPieChartData(transactions, filterType);
      processBarChartData(transactions, filterType, dateFilter);
    }
  }, [transactions, filterType, dateFilter]);

  const hasTransactions =
    Array.isArray(transactions) && transactions.length > 0;
  const hasUsers = Array.isArray(users) && users.length > 0;
  const isLoading = transactions === null || users === null;

  const processPieChartData = (
    transactions: Transaction[],
    type: "day" | "month" | "year"
  ) => {
    let groupedData: Record<string, number> = {};
    transactions.forEach((transaction) => {
      if (!transaction.transactionDate) return;
      const date = new Date(transaction.transactionDate);
      if (isNaN(date.getTime())) return;

      let key: string;
      if (type === "day") {
        key = date.toLocaleDateString("vi-VN");
      } else if (type === "month") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    const formattedData = Object.keys(groupedData).map((key) => ({
      name: key,
      transactions: groupedData[key],
    }));
    setChartDataPie(formattedData);
  };

  const processBarChartData = (
    transactions: Transaction[],
    type: "day" | "month" | "year",
    filter: { startDate: string; endDate: string }
  ) => {
    let filteredTransactions = transactions;

    // Apply date range filter if provided
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
        key = date.toLocaleDateString("vi-VN");
      } else if (type === "month") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      groupedData[key] = (groupedData[key] || 0) + transaction.amount;
    });

    const formattedData = Object.keys(groupedData).map((key) => ({
      name: key,
      totalValue: groupedData[key],
    }));
    setChartDataBar(formattedData);
  };

  const handleFilterApply = () => {
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

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 5,
        background:
          "linear-gradient(135deg, rgb(240, 253, 244), rgb(240, 253, 244))",
      }}
    >
<Box sx={{ mb: 5 }}>
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
          Tổng Quan Quản Lý Chi Tiêu
        </Typography>

      </Box>
      {/* Thống kê tổng quan */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4e73df10, #ffffff)", // Gradient nhẹ từ xanh dương
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
              sx={{ color: "#4e73df", fontWeight: 500 }} // Màu tiêu đề đồng bộ với thẻ
              gutterBottom
            >
              Người dùng
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
              background: "linear-gradient(135deg, #1cc88a10, #ffffff)", // Gradient nhẹ từ xanh lá
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
              sx={{ color: "#1cc88a", fontWeight: 500 }} // Màu tiêu đề đồng bộ với thẻ
              gutterBottom
            >
              Tổng giao dịch
            </Typography>
            <Typography variant="h5" sx={{ color: "#1cc88a", fontWeight: 600 }}>
              {hasTransactions ? transactions.length : 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #36b9cc10, #ffffff)", // Gradient nhẹ từ xanh ngọc
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
              sx={{ color: "#36b9cc", fontWeight: 500 }} // Màu tiêu đề đồng bộ với thẻ
              gutterBottom
            >
              Tổng giá trị
            </Typography>
            <Typography variant="h5" sx={{ color: "#36b9cc", fontWeight: 600 }}>
              {totalTransactionValue.toLocaleString()} đ
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Biểu đồ và chi tiết */}
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
                Phân Phối Giao Dịch
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "#36b9cc" }}>Lọc theo</InputLabel>
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
              <MenuItem value="day">Ngày</MenuItem>
              <MenuItem value="month">Tháng</MenuItem>
              <MenuItem value="year">Năm</MenuItem>
            </Select>
          </FormControl>
        </Box>
            </Box>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartDataPie}
                    dataKey="transactions"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={true}
                  >
                    {chartDataPie.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} giao dịch`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
                Tổng Giá Trị Giao Dịch
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}></Box>
            </Box>

            {/* Bộ lọc ngày tháng */}
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
                Áp dụng
              </Button>
            </Box>

            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartDataBar}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                      `${value.toLocaleString()} đ`,
                      "Tổng giá trị",
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
                          entry.totalValue > 0 ? "#36b9cc" : "#e74a3b" // Màu đỏ cho giá trị âm nếu có
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {isLoading && (
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
