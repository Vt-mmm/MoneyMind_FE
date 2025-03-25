import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from 'common/models/transaction.model';
import { ChartData } from './chartUtils';

export const exportToPDF = (
  transactions: Transaction[],
  chartDataLine: ChartData[],
  chartDataBar: ChartData[]
) => {
  // Initialize in landscape mode for wider content
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Add title
  doc.setFontSize(20);
  doc.text('Transaction Report', margin, 15);
  doc.setFontSize(12);

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' VND';
  };

  // Format short currency (for axis labels)
  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + 'B';
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toString();
  };

  // Add transactions table
  const tableData = transactions.map((transaction, index) => [
    (index + 1).toString(),
    transaction.recipientName || '',
    transaction.id,
    formatCurrency(transaction.amount),
    new Date(transaction.transactionDate).toLocaleDateString('vi-VN'),
    transaction.description || '',
    transaction.tags?.map(tag => tag.name).join(', ') || ''
  ]);

  // Calculate available width for table (subtracting margins)
  const availableWidth = pageWidth - (2 * margin);

  let pageNumber = 1;
  autoTable(doc, {
    startY: 25,
    margin: { left: margin, right: margin },
    head: [['No.', 'Recipient', 'ID', 'Amount', 'Date', 'Description', 'Tags']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [22, 171, 101],
      fontSize: 10,
      cellPadding: 3,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.5,
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      cellWidth: 'wrap',
      halign: 'left',
      valign: 'middle',
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: availableWidth * 0.05 },
      1: { cellWidth: availableWidth * 0.15 },
      2: { cellWidth: availableWidth * 0.18 },
      3: { cellWidth: availableWidth * 0.15 },
      4: { cellWidth: availableWidth * 0.12 },
      5: { cellWidth: availableWidth * 0.25 },
      6: { cellWidth: availableWidth * 0.10 }
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.text(
        `Page ${pageNumber}`,
        pageWidth - 20,
        pageHeight - 10
      );
      pageNumber++;
    }
  });

  // Add Transaction Distribution chart on page 2
  doc.addPage('landscape');
  doc.setFontSize(16);
  doc.text('Transaction Analytics', margin, 20);

  // Add Line Chart
  doc.setFontSize(14);
  doc.text('Transaction Distribution', margin, 35);
  
  // Draw line chart with full height
  const chartStartY = 45;
  const chartHeight = 150; // Increased height for better visibility
  const chartWidth = availableWidth * 0.9;
  
  // Draw line chart axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);

  // Draw X axis
  doc.line(margin, chartStartY + chartHeight, margin + chartWidth, chartStartY + chartHeight);
  
  // Draw Y axis
  doc.line(margin, chartStartY, margin, chartStartY + chartHeight);

  // Draw line chart data
  if (chartDataLine.length > 0) {
    const transactions = chartDataLine.map(d => d.transactions || 0);
    const maxTransactions = Math.max(...transactions);
    const xStep = chartWidth / (chartDataLine.length - 1);
    const yScale = chartHeight / maxTransactions;

    // Draw Y-axis grid lines and labels
    const yGridLines = 5;
    doc.setDrawColor(220, 220, 220);
    doc.setFontSize(8);
    for (let i = 0; i <= yGridLines; i++) {
      const y = chartStartY + chartHeight - (i * chartHeight / yGridLines);
      const value = Math.round((i * maxTransactions / yGridLines));
      
      // Draw grid line
      doc.setLineDashPattern([2, 2], 0);
      doc.line(margin, y, margin + chartWidth, y);
      doc.setLineDashPattern([], 0);
      
      // Draw label
      doc.text(value.toString(), margin - 15, y, { align: 'right' });
    }

    // Add Y-axis title
    doc.setFontSize(10);
    doc.text('Number of Transactions', margin - 25, chartStartY + chartHeight/2, { 
      align: 'center',
      angle: 90 
    });

    // Draw smooth curve
    doc.setDrawColor(22, 171, 101);
    doc.setLineWidth(0.5);

    // Draw curved lines using bezier curves
    chartDataLine.forEach((point, i) => {
      if (i < chartDataLine.length - 1) {
        const x1 = margin + (i * xStep);
        const y1 = chartStartY + chartHeight - ((point.transactions || 0) * yScale);
        const x2 = margin + ((i + 1) * xStep);
        const nextPoint = chartDataLine[i + 1];
        const y2 = chartStartY + chartHeight - ((nextPoint?.transactions || 0) * yScale);
        
        // Control points for bezier curve
        const cp1x = x1 + (x2 - x1) / 2;
        const cp1y = y1;
        const cp2x = x1 + (x2 - x1) / 2;
        const cp2y = y2;
        
        doc.setLineDashPattern([], 0);
        doc.moveTo(x1, y1);
        doc.curveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        doc.stroke();
      }
    });

    // Draw points and value labels
    doc.setFillColor(22, 171, 101);
    chartDataLine.forEach((point, i) => {
      const x = margin + (i * xStep);
      const y = chartStartY + chartHeight - ((point.transactions || 0) * yScale);
      
      // Draw point
      doc.circle(x, y, 2, 'F');
      
      // Draw value label
      doc.setFontSize(8);
      doc.text((point.transactions || 0).toString(), x, y - 5, { align: 'center' });
    });

    // Add X-axis labels
    doc.setFontSize(8);
    chartDataLine.forEach((point, i) => {
      const x = margin + (i * xStep);
      const y = chartStartY + chartHeight + 10;
      doc.text(point.name || '', x, y, { align: 'center' });
    });

    // Add legend
    const legendY = chartStartY + chartHeight + 25;
    doc.setFillColor(22, 171, 101);
    doc.circle(margin, legendY, 2, 'F');
    doc.setFontSize(8);
    doc.text('Number of transactions per period', margin + 10, legendY + 2);
  }

  // Add Transaction Values chart on page 3
  doc.addPage('landscape');
  doc.setFontSize(16);

  // Add Bar Chart with full height
  doc.setFontSize(14);
  doc.text('Transaction Values', margin, 35);
  
  // Draw bar chart with adjusted height and margins
  const barChartStartY = 45;
  const barChartHeight = 100; // Reduced height from 120 to 100
  const bottomMargin = 40;
  
  if (chartDataBar.length > 0) {
    const values = chartDataBar.map(d => d.totalValue || 0);
    const maxValue = Math.max(...values);
    const barWidth = Math.min((chartWidth * 0.5) / chartDataBar.length, 25); // Reduced width ratio and max width
    const totalBarsWidth = barWidth * chartDataBar.length;
    const startX = margin + (chartWidth - totalBarsWidth) / 2;

    // Increase left margin for Y-axis labels
    const yAxisMargin = 40; // Slightly increased margin

    // Draw axes
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    
    // X axis with more space at bottom
    doc.line(yAxisMargin, barChartStartY + barChartHeight, margin + chartWidth, barChartStartY + barChartHeight);
    
    // Y axis
    doc.line(yAxisMargin, barChartStartY, yAxisMargin, barChartStartY + barChartHeight);

    // Draw Y-axis grid lines and labels with adjusted scale
    const yGridLines = 8;
    doc.setDrawColor(220, 220, 220);
    doc.setFontSize(8);
    for (let i = 0; i <= yGridLines; i++) {
      const y = barChartStartY + barChartHeight - (i * barChartHeight / yGridLines);
      const value = Math.round((i * maxValue / yGridLines));
      
      // Draw grid line
      doc.setLineDashPattern([2, 2], 0);
      doc.line(yAxisMargin, y, margin + chartWidth, y);
      doc.setLineDashPattern([], 0);
      
      // Draw label with currency format and more space
      doc.text(formatShortCurrency(value), yAxisMargin - 5, y, { align: 'right' });
    }

    // Add Y-axis title with adjusted position
    doc.setFontSize(10);
    doc.text('Total Value (VND)', yAxisMargin - 30, barChartStartY + barChartHeight/2, { 
      align: 'center',
      angle: 90 
    });

    // Define gradient colors (using blue color scheme)
    const primaryColor = {r: 77, g: 115, b: 223}; // Blue color (#4e73df)
    const gradientAlpha = {start: 0.3, end: 1}; // Increased alpha for better visibility

    // Draw bars with adjusted spacing and improved colors
    chartDataBar.forEach((bar, i) => {
      const barHeight = ((bar.totalValue || 0) / maxValue) * barChartHeight;
      const x = startX + (i * barWidth);
      const y = barChartStartY + barChartHeight - barHeight;
      
      // Draw bar background with blue color
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.1);
      doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.1); // Set border color
      doc.rect(x, y, barWidth * 0.7, barHeight, 'F'); // Fill only
      
      // Draw bar with improved gradient
      const gradientSteps = 15;
      const stepHeight = barHeight / gradientSteps;
      
      // Draw gradient from bottom to top
      for (let step = 0; step < gradientSteps; step++) {
        const alpha = gradientAlpha.start + ((gradientAlpha.end - gradientAlpha.start) * step / gradientSteps);
        doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, alpha);
        doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b, alpha); // Set border color same as fill
        const currentY = y + (barHeight - (step + 1) * stepHeight); // Start from bottom
        doc.rect(x, currentY, barWidth * 0.7, stepHeight, 'F'); // Fill only
      }

      // Add final solid color at the top for better appearance
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, gradientAlpha.end);
      doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b, gradientAlpha.end);
      doc.rect(x, y, barWidth * 0.7, stepHeight, 'F');

      // Add value label above the bar
      doc.setFontSize(7);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      const formattedValue = formatShortCurrency(bar.totalValue || 0);
      doc.text(
        formattedValue,
        x + (barWidth * 0.35),
        y - 3,
        { align: 'center' }
      );

      // Add date label below the bar with increased spacing and smaller angle
      doc.setTextColor(80, 80, 80);
      const dateLabel = bar.name || '';
      doc.text(
        dateLabel,
        x + (barWidth * 0.35),
        barChartStartY + barChartHeight + 15,
        { 
          align: 'center',
          angle: -30
        }
      );
      
      // Add horizontal guide line from Y-axis with lighter color
      doc.setDrawColor(220, 220, 220);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(yAxisMargin, y, x, y);
      doc.setLineDashPattern([], 0);
    });

    // Add legend with total value using blue color
    const legendY = barChartStartY + barChartHeight + 35;
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.8);
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.8);
    doc.rect(yAxisMargin, legendY - 5, 10, 5, 'F');
    
    // Calculate and display total value
    const totalValue = values.reduce((sum, value) => sum + value, 0);
    doc.text(
      `Total transaction value: ${formatCurrency(totalValue)}`,
      yAxisMargin + 15,
      legendY
    );
  }

  // Save the PDF
  doc.save('transaction-report.pdf');
}; 