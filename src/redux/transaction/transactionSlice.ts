import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDashboardTransactionThunk } from './transactionThunk';

// ✅ Interface Transaction (Dựa trên yêu cầu của bạn)
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  transactionDate: string;
  recipientName: string;
}

// ✅ Interface State
interface TransactionState {
  transactions: Transaction[]; // Danh sách giao dịch
  isLoading: boolean;
  isError: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  isError: false,
};

// ✅ Async Thunk để lấy dữ liệu giao dịch từ API
export const fetchTransactions = createAsyncThunk(
  'transaction/fetch-transactions',
  async (params: any, thunkAPI) => await getDashboardTransactionThunk(params, thunkAPI)
);

// ✅ Tạo transactionSlice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.transactions = action.payload || []; // Đảm bảo dữ liệu không bị undefined
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
const transactionReducer = transactionSlice.reducer;

export default transactionSlice.reducer;
