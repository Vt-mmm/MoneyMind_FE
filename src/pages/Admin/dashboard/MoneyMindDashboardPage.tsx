import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = styled(Box)({
  width: '250px',
  backgroundColor: '#16ab65',
  height: '100vh',
  padding: '20px 0',
  boxSizing: 'border-box',
});

const SidebarHeader = styled(Typography)({
  color: 'white',
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '1.2rem',
});

const StatCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

const Header = styled(Typography)({
  marginBottom: '20px',
  fontWeight: 'bold',
});

const transactions = [
  {
    id: 1,
    category: 'Income',
    amount: '+$5000',
    date: '2025-01-10',
    status: 'Completed',
  },
  {
    id: 2,
    category: 'Expense',
    amount: '-$2000',
    date: '2025-01-11',
    status: 'Pending',
  },
];

const Dashboard: React.FC = () => {
  return (
    <Box display="flex">


    </Box>
  );
};

export default Dashboard;