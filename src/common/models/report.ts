export interface Report {
    totalTransactions: number;
    totalUsers: number;
    expensesByCategory?: Record<string, number>; // Optional, vì bạn không cần trường này
  }