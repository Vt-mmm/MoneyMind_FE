// transactionSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDashboardTransactionThunk } from './transactionThunk';
import { Transaction } from './transactionThunk';

// Thêm thông tin pagination vào state
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  isError: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  }
};

// Async Thunk để lấy dữ liệu giao dịch từ API
export const fetchTransactions = createAsyncThunk(
  'transaction/fetch-transactions',
  async (params: any, thunkAPI) => {
    // Thêm trường getAllPages để lấy tất cả dữ liệu
    const paramsWithPagination = {
      ...params,
      optionParams: {
        ...params.optionParams,
        getAllPages: true, // Đặt true để lấy tất cả các trang
      }
    };
    
    const result = await getDashboardTransactionThunk(paramsWithPagination, thunkAPI);
    return result;
  }
);

// Thêm thunk mới để hỗ trợ pagination nếu cần lấy từng trang
export const fetchTransactionPage = createAsyncThunk(
  'transaction/fetch-transaction-page',
  async (params: any, thunkAPI) => {
    const result = await getDashboardTransactionThunk(params, thunkAPI);
    return {
      transactions: result,
      pagination: {
        currentPage: params.optionParams?.page || 1,
        // Các thông tin khác sẽ được cập nhật nếu API trả về
      }
    };
  }
);

// Tạo transactionSlice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // Thêm reducer để thay đổi trang
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.transactions = action.payload || [];
        state.pagination.totalItems = action.payload?.length || 0;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Xử lý các case cho fetchTransactionPage
      .addCase(fetchTransactionPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.transactions = action.payload.transactions || [];
        // Cập nhật thông tin pagination từ kết quả trả về
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination
          };
        }
      })
      .addCase(fetchTransactionPage.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setCurrentPage, setPageSize } = transactionSlice.actions;
export default transactionSlice.reducer;