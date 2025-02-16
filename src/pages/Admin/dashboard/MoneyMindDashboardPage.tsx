// MoneyMindDashboardPage.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// MUI Components
import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';

// MUI Icons
import BusinessIcon from '@mui/icons-material/Business';
import BrandingWatermarkOutlinedIcon from '@mui/icons-material/BrandingWatermarkOutlined';
import StoreIcon from '@mui/icons-material/Store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WarningIcon from '@mui/icons-material/Warning';
import { SelectChangeEvent } from '@mui/material';
// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ----------------- KHAI BÁO KIỂU DỮ LIỆU -----------------

// Giao diện (interface) cho một giao dịch
interface Transaction {
  id: string;
  user: string;
  category: string;
  amount: number;
  date: string; // dạng 'YYYY-MM-DD'
}

// Giao diện cho toàn bộ dữ liệu dashboard
interface DashboardData {
  totalUsers: number;
  transactionsToday: number;
  transactionsThisMonth: number;
  totalSpentThisMonth: number;
  recentTransactions: Transaction[];
}

// Giao diện cho props của AppWidgetSummaryOutline
interface AppWidgetSummaryOutlineProps {
  title: string;
  total: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'warning' | 'success';
}

// ----------------- COMPONENT WIDGET THỐNG KÊ -----------------

const AppWidgetSummaryOutline: React.FC<AppWidgetSummaryOutlineProps> = ({
  title,
  total,
  icon,
  color = 'primary',
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5">{total}</Typography>
          </Box>
          <Box color={`${color}.main`}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ----------------- MOCK DATA -----------------

const mockDashboardData: DashboardData = {
  totalUsers: 320,
  transactionsToday: 45,
  transactionsThisMonth: 280,
  totalSpentThisMonth: 1500000,
  recentTransactions: [
    { id: 'T001', user: 'Alice',   category: 'Ăn uống',   amount: 150000,  date: '2025-02-01' },
    { id: 'T002', user: 'Bob',     category: 'Di chuyển', amount: 50000,   date: '2025-02-01' },
    { id: 'T003', user: 'Charlie', category: 'Mua sắm',   amount: 300000,  date: '2025-02-02' },
    { id: 'T004', user: 'Daisy',   category: 'Tiền nhà',  amount: 2500000, date: '2025-02-03' },
    // Thêm bớt dữ liệu tuỳ ý...
  ],
};

// ----------------- TRANG DASHBOARD CHÍNH -----------------

const MoneyMindDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Tạm dùng state cục bộ thay thế cho dữ liệu từ API
  const [dashboardData] = useState<DashboardData>(mockDashboardData);

  // ----------------- BIỂU ĐỒ TRÒN (PieChart) -----------------
  // Gom nhóm "Tổng amount" theo danh mục (category)
  const pieChartData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    dashboardData.recentTransactions.forEach((trx) => {
      if (!categoryMap[trx.category]) {
        categoryMap[trx.category] = 0;
      }
      categoryMap[trx.category] += trx.amount;
    });

    // Chuyển về dạng mảng: { name, value }
    return Object.entries(categoryMap).map(([cat, total]) => ({
      name: cat,
      value: total,
    }));
  }, [dashboardData]);
  // ----------------- BIỂU ĐỒ XU HƯỚNG (LineChart) -----------------
  const lineChartData = useMemo(() => {
    return dashboardData.recentTransactions.map((trx) => ({
      date: trx.date,
      totalAmount: trx.amount,
    }));
  }, [dashboardData]);

  // ----------------- BIỂU ĐỒ HEATMAP -----------------
  // Chuyển đổi dữ liệu sang định dạng Heatmap
  const heatmapData = useMemo(() => {
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23 giờ
    const gridData: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));

    dashboardData.recentTransactions.forEach((trx) => {
      const date = new Date(trx.date);
      const day = date.getDay(); // 0 - Chủ nhật, 6 - Thứ bảy
      const hour = date.getHours(); // Giả sử mỗi giao dịch có giờ ngẫu nhiên

      gridData[day][hour] += trx.amount;
    });

    return { labelsX: hours.map(String), labelsY: weekDays, data: gridData };
  }, [dashboardData]);

  // ----------------- CẢNH BÁO CHI TIÊU BẤT THƯỜNG -----------------
  const averageSpending = useMemo(() => {
    const total = dashboardData.recentTransactions.reduce((sum, trx) => sum + trx.amount, 0);
    return total / dashboardData.recentTransactions.length;
  }, [dashboardData]);

  const isSpendingTooHigh = dashboardData.totalSpentThisMonth > averageSpending * 3;


  // Màu sắc cho các lát (slice) trong PieChart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ad19c2'];

  // ----------------- BIỂU ĐỒ CỘT (BarChart) + LỌC -----------------
  // Filter có 3 mode: day, month, year (theo ngày, tháng, năm)
  const [filterMode, setFilterMode] = useState<'day' | 'month' | 'year'>('day');

  // Hàm xử lý khi thay đổi filter
  const handleChangeFilterMode = (event: SelectChangeEvent<"day" | "month" | "year">) => {
    setFilterMode(event.target.value as 'day' | 'month' | 'year');
  };
  // Hàm giúp cắt chuỗi date '2025-02-03' -> theo format
  // day => '2025-02-03'
  // month => '2025-02'
  // year => '2025'
  const formatDate = (dateStr: string, mode: 'day' | 'month' | 'year') => {
    const [yyyy, mm, dd] = dateStr.split('-');
    switch (mode) {
      case 'year':
        return yyyy;
      case 'month':
        return `${yyyy}-${mm}`;
      default:
        // 'day'
        return dateStr;
    }
  };

  // Tính toán dữ liệu cho BarChart dựa theo filterMode
  const barChartData = useMemo(() => {
    const mapDateToTotal: Record<string, number> = {};

    dashboardData.recentTransactions.forEach((trx) => {
      const key = formatDate(trx.date, filterMode);
      if (!mapDateToTotal[key]) {
        mapDateToTotal[key] = 0;
      }
      mapDateToTotal[key] += trx.amount;
    });

    // Convert sang mảng { date, totalAmount }
    return Object.entries(mapDateToTotal).map(([dateKey, total]) => ({
      dateKey,
      totalAmount: total,
    }));
  }, [dashboardData, filterMode]);

  return (
    <Container maxWidth="xl">
      {/* Tiêu đề trang */}
      <Typography variant="h4" sx={{ mb: 5 }}>
        Quản lý chi tiêu - Dashboard
      </Typography>
      {isSpendingTooHigh && (
        <Alert severity="warning" icon={<WarningIcon />}>
          Cảnh báo! Chi tiêu tháng này cao hơn mức trung bình! Hãy kiểm tra lại các khoản chi.
        </Alert>
      )}


      {/* Các ô thống kê nhanh */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummaryOutline
            title="Tổng số người dùng"
            total={dashboardData.totalUsers}
            icon={<BusinessIcon fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummaryOutline
            title="Giao dịch hôm nay"
            total={dashboardData.transactionsToday}
            icon={<BrandingWatermarkOutlinedIcon fontSize="large" />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummaryOutline
            title="Giao dịch trong tháng"
            total={dashboardData.transactionsThisMonth}
            icon={<StoreIcon fontSize="large" />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummaryOutline
            title="Tổng chi tiêu tháng"
            total={dashboardData.totalSpentThisMonth.toLocaleString('vi-VN') + ' đ'}
            icon={<StoreIcon fontSize="large" />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Bảng "Giao dịch gần đây" */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Giao dịch mới nhất" />
            <TableContainer component={Paper}>
              <Table aria-label="recent-transactions-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Mã GD</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Danh mục</TableCell>
                    <TableCell>Số tiền (VNĐ)</TableCell>
                    <TableCell>Ngày</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentTransactions.map((trx) => (
                    <TableRow
                      key={trx.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/transactions/${trx.id}`)}
                    >
                      <TableCell>{trx.id}</TableCell>
                      <TableCell>{trx.user}</TableCell>
                      <TableCell>{trx.category}</TableCell>
                      <TableCell>{trx.amount.toLocaleString('vi-VN')}</TableCell>
                      <TableCell>{trx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Typography
                  variant="body2"
                  mr={0.5}
                  component={Link}
                  to="/transactions"
                  style={{ textDecoration: 'none' }}
                >
                  Xem tất cả
                </Typography>
                <KeyboardArrowRightIcon fontSize="small" />
              </Box>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* BarChart + PieChart */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Thống kê giao dịch"
              subheader="Theo ngày / tháng / năm"
              action={
                <Box mr={2} mt={1}>
                  <FormControl size="small" variant="outlined">
                    <InputLabel id="filter-mode-label">Chế độ</InputLabel>
                    <Select
                      labelId="filter-mode-label"
                      value={filterMode}
                      label="Chế độ"
                      onChange={(e) => setFilterMode(e.target.value as 'day' | 'month' | 'year')}
                      sx={{ width: 120 }}
                    >
                      <MenuItem value="day">Ngày</MenuItem>
                      <MenuItem value="month">Tháng</MenuItem>
                      <MenuItem value="year">Năm</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                    <YAxis tickFormatter={(value) => value.toLocaleString('vi-VN') + ' đ'} />
                    <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' đ'} />
                    <Legend />
                    <Bar dataKey="totalAmount" name="Tổng chi tiêu" fill="#4caf50" barSize={50} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Tỷ lệ chi tiêu theo danh mục" />
            <CardContent>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' đ'} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MoneyMindDashboardPage;
