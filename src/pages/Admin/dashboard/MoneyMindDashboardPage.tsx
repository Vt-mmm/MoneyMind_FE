// MoneyMindDashboardPage.tsx

import React, { useState } from 'react';
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
} from '@mui/material';

// MUI Icons (thay đổi icon tuỳ ý)
import BusinessIcon from '@mui/icons-material/Business';
import BrandingWatermarkOutlinedIcon from '@mui/icons-material/BrandingWatermarkOutlined';
import StoreIcon from '@mui/icons-material/Store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// ----------------- KHAI BÁO KIỂU DỮ LIỆU -----------------

// Giao diện (interface) cho một giao dịch
interface Transaction {
  id: string;
  user: string;
  category: string;
  amount: number;
  date: string;
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
          {/* Sử dụng color của theme MUI, ví dụ primary.main, secondary.main, ... */}
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
    { id: 'T001', user: 'Alice', category: 'Ăn uống', amount: 150000, date: '2025-02-01' },
    { id: 'T002', user: 'Bob', category: 'Di chuyển', amount: 50000, date: '2025-02-01' },
    { id: 'T003', user: 'Charlie', category: 'Mua sắm', amount: 300000, date: '2025-02-02' },
    { id: 'T004', user: 'Daisy', category: 'Tiền nhà', amount: 2500000, date: '2025-02-03' },
  ],
};

// ----------------- TRANG DASHBOARD CHÍNH -----------------

const MoneyMindDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Tạm dùng state cục bộ thay thế cho dữ liệu từ API
  const [dashboardData] = useState<DashboardData>(mockDashboardData);

  return (
    <Container maxWidth="xl">
      {/* Tiêu đề trang */}
      <Typography variant="h4" sx={{ mb: 5 }}>
        Quản lý chi tiêu - Dashboard
      </Typography>

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
      <Box mt={5}>
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
              <Link
                to="/transactions"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <Typography variant="body2" mr={0.5}>
                  Xem tất cả
                </Typography>
                <KeyboardArrowRightIcon fontSize="small" />
              </Link>
            </Box>
          </TableContainer>
        </Card>
      </Box>
    </Container>
  );
};

export default MoneyMindDashboardPage;
