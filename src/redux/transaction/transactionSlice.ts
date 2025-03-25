// transactionSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDashboardTransactionThunk } from './transactionThunk';
import { Transaction } from 'common/models/transaction.model';

// Add pagination information to state
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  totalRecord?: number;
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
  totalRecord: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  }
};

// Async Thunk to fetch transaction data from API
export const fetchTransactions = createAsyncThunk(
  'transaction/fetch-transactions',
  async (params: any, thunkAPI) => {
    // Add getAllPages field to get all data
    const paramsWithPagination = {
      ...params,
      optionParams: {
        ...params.optionParams,
        getAllPages: true, // Set to true to get all pages
      }
    };
    
    const result = await getDashboardTransactionThunk(paramsWithPagination, thunkAPI);
    return result;
  }
);

// Add new thunk to support pagination if needed to get each page
export const fetchTransactionPage = createAsyncThunk(
  'transaction/fetch-transaction-page',
  async (params: any, thunkAPI) => {
    const result = await getDashboardTransactionThunk(params, thunkAPI);
    return {
      transactions: result,
      pagination: {
        currentPage: params.optionParams?.page || 1,
        // Other information will be updated if API returns
      }
    };
  }
);

// Create transactionSlice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // Add reducer to change page
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
      // Handle cases for fetchTransactionPage
      .addCase(fetchTransactionPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.transactions = action.payload.transactions || [];
        // Update pagination information from returned result
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