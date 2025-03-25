export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description?: string;
  transactionDate: string;
  category?: string;
  recipientName?: string;
  tags?: { id: string; name: string; color: string; }[];
  createdAt?: string;
  updatedAt?: string;
} 