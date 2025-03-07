import {
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Paper,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchReports } from 'redux/report/reportSlice';
import { useAppSelector } from 'redux/config';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Colors for each chart
const TRANSACTION_COLORS = ['#1976d2']; // Blue for Total Transactions
const USER_COLORS = ['#2e7d32']; // Green for Total Users

const ManagerReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reports, isLoadingReports, isErrorReports } = useAppSelector((state) => state.report);
  const chartTransactionRef = useRef(null); // Ref for transaction chart
  const chartUserRef = useRef(null); // Ref for user chart

  // Automatically fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchReports({ navigate }));
  }, [dispatch, navigate]);

  // Refresh data function
  const handleRefresh = () => {
    dispatch(fetchReports({ navigate }));
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (!reports) return;

    const worksheetData = [
      ['Manager Report For MoneyMind'],
      [],
      ['Total Transactions', reports.totalTransactions],
      ['Total Users', reports.totalUsers],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'ManagerReport.xlsx');
  };

  // Export to PDF function with charts
  const exportToPDF = async () => {
    if (!reports) return;

    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size in portrait
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add title (centered)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const title = 'Manager Report For MoneyMind';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);

    // Add text data (left-aligned with margin)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const marginLeft = 20;
    doc.text(`Total Transactions: ${reports.totalTransactions.toLocaleString()}`, marginLeft, 40);
    doc.text(`Total Users: ${reports.totalUsers.toLocaleString()}`, marginLeft, 50);

    // Capture and add Transaction Pie Chart
    if (chartTransactionRef.current) {
      const transactionCanvas = await html2canvas(chartTransactionRef.current);
      const transactionImgData = transactionCanvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(transactionImgData);
      const imgWidth = 80; // Width in mm
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const chartX = marginLeft; // Left-aligned with text
      const chartY = 60; // Positioned below text
      doc.text('Transactions Chart', chartX, chartY - 5); // Chart title
      doc.addImage(transactionImgData, 'PNG', chartX, chartY, imgWidth, imgHeight);
    }

    // Capture and add User Pie Chart
    if (chartUserRef.current) {
      const userCanvas = await html2canvas(chartUserRef.current);
      const userImgData = userCanvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(userImgData);
      const imgWidth = 80; // Width in mm
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const chartX = pageWidth - imgWidth - marginLeft; // Right-aligned
      const chartY = 60; // Positioned below text, aligned with Transaction chart
      doc.text('Users Chart', chartX, chartY - 5); // Chart title
      doc.addImage(userImgData, 'PNG', chartX, chartY, imgWidth, imgHeight);
    }

    // Add footer (centered)
    doc.setFontSize(10);
    const footer = `Generated on: ${new Date().toLocaleDateString()}`;
    const footerWidth = doc.getTextWidth(footer);
    doc.text(footer, (pageWidth - footerWidth) / 2, pageHeight - 10);

    // Save the PDF
    doc.save('ManagerReport.pdf');
  };

  // Prepare data for pie chart
  const prepareChartData = (value: number, label: string) => {
    return [{ name: label, value: value || 0 }];
  };

  // Loading state
  if (isLoadingReports) {
    return (
      <Grid container justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Grid>
    );
  }

  // Error state
  if (isErrorReports) {
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Alert
            severity="error"
            action={
              <IconButton color="inherit" onClick={handleRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            }
            sx={{ backgroundColor: '#ffebee', color: '#c62828' }}
          >
            Error loading reports! Please check your connection or try refreshing.
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f1f8e9', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
              color: 'white',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" fontWeight="bold">
                Manager Report
              </Typography>
              <Box>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export to Excel">
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportToExcel}
                    disabled={!reports}
                    sx={{
                      ml: 2,
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' },
                    }}
                  >
                    Export Excel
                  </Button>
                </Tooltip>
                <Tooltip title="Export to PDF with Charts">
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={exportToPDF}
                    disabled={!reports}
                    sx={{
                      ml: 2,
                      backgroundColor: '#d32f2f',
                      '&:hover': { backgroundColor: '#b71c1c' },
                    }}
                  >
                    Export PDF
                  </Button>
                </Tooltip>
              </Box>
            </Box>
            <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Overview statistics of transactions and users in the system.
            </Typography>
          </Paper>
        </Grid>

        {/* Display report data */}
        <Grid item xs={12}>
          {reports ? (
            <Grid container spacing={3}>
              {/* Total Transactions Card */}
              <Grid item xs={12} sm={6}>
                <Card
                  variant="elevation"
                  elevation={6}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: '#e3f2fd',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <MonetizationOnIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        Total Transactions
                      </Typography>
                    </Box>
                    <Typography variant="h3" color="#1976d2" fontWeight="bold">
                      {reports.totalTransactions.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Users Card */}
              <Grid item xs={12} sm={6}>
                <Card
                  variant="elevation"
                  elevation={6}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: '#eceff1',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PeopleIcon sx={{ fontSize: 40, color: '#455a64', mr: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        Total Users
                      </Typography>
                    </Box>
                    <Typography variant="h3" color="#455a64" fontWeight="bold">
                      {reports.totalUsers.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Transactions Pie Chart */}
              <Grid item xs={12} sm={6}>
                <Paper ref={chartTransactionRef} elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Total Transactions
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(reports.totalTransactions, 'Transactions')}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareChartData(reports.totalTransactions, 'Transactions').map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TRANSACTION_COLORS[index % TRANSACTION_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Total Users Pie Chart */}
              <Grid item xs={12} sm={6}>
                <Paper ref={chartUserRef} elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(reports.totalUsers, 'Users')}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareChartData(reports.totalUsers, 'Users').map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
              <Typography variant="body1" color="textSecondary">
                No report data available to display.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerReportPage;