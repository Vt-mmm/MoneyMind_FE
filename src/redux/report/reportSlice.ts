import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getReportsThunk } from './reportThunk';

export interface Report {
    totalTransactions: number;
    totalUsers: number;
    expensesByCategory?: Record<string, number>; // Optional, vì bạn không cần trường này
  }
interface ReportState {
  reports: Report | null;
  isLoadingReports: boolean;
  isErrorReports: boolean;
}

const initialState: ReportState = {
  reports: null,
  isLoadingReports: false,
  isErrorReports: false,
};

export const fetchReports = createAsyncThunk(
  'reports/fetch-reports',
  async (params: any, thunkAPI) => await getReportsThunk(params, thunkAPI)
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoadingReports = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoadingReports = false;
        state.isErrorReports = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state) => {
        state.isLoadingReports = false;
        state.isErrorReports = true;
      });
  },
});
export const reportReducer = reportSlice.reducer;

export default reportSlice.reducer;