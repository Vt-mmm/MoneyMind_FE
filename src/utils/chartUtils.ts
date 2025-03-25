import { Transaction } from 'common/models';

export interface ChartData {
  name: string;
  transactions?: number;
  totalValue: number;
}

export const processLineChartData = (
  transactions: Transaction[],
  type: "day" | "month" | "year"
): ChartData[] => {
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
  return Object.keys(groupedData)
    .map((key) => ({
      name: key,
      transactions: groupedData[key],
      totalValue: 0,
    }))
    .sort((a, b) => {
      // For day format
      if (type === "day") {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
      }
      // For month/year format
      return a.name.localeCompare(b.name);
    });
};

export const processBarChartData = (
  transactions: Transaction[],
  type: "day" | "month" | "year",
  filter: { startDate: string; endDate: string }
): ChartData[] => {
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

  return Object.keys(groupedData)
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
}; 