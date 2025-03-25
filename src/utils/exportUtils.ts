import * as XLSX from 'xlsx';
import { Transaction } from 'common/models';
import { ChartData } from './chartUtils';

export const exportToExcel = (
  transactions: Transaction[],
  chartDataLine: ChartData[],
  chartDataBar: ChartData[]
) => {
  const workbook = XLSX.utils.book_new();

  // Prepare transactions data
  const transactionData = transactions.map(t => ({
    Date: new Date(t.transactionDate).toLocaleDateString(),
    Amount: t.amount,
    Description: t.description || '',
    Category: t.category || '',
  }));

  // Prepare chart data
  const lineChartData = chartDataLine.map(d => ({
    Period: d.name,
    'Number of Transactions': d.transactions,
  }));

  const barChartData = chartDataBar.map(d => ({
    Period: d.name,
    'Total Value': d.totalValue,
  }));

  // Create worksheets
  const transactionSheet = XLSX.utils.json_to_sheet(transactionData);
  const lineChartSheet = XLSX.utils.json_to_sheet(lineChartData);
  const barChartSheet = XLSX.utils.json_to_sheet(barChartData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(workbook, transactionSheet, 'Transactions');
  XLSX.utils.book_append_sheet(workbook, lineChartSheet, 'Transaction Distribution');
  XLSX.utils.book_append_sheet(workbook, barChartSheet, 'Transaction Values');

  // Save file
  XLSX.writeFile(workbook, 'dashboard_report.xlsx');
}; 