import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllWalletTypesThunk } from "./manageWalletTypeThunk";
import { WalletTypeInfo } from "common/models";

// --------------------
// 1. Khai báo các createAsyncThunk
// --------------------
export const getAllWalletTypes = createAsyncThunk(
  "WalletType/getAllWalletTypes",
  getAllWalletTypesThunk
);

// --------------------
// 2. Định nghĩa interface State
// --------------------
interface WalletTypeState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  walletTypes: WalletTypeInfo[];
  walletType: WalletTypeInfo | null;
  totalRecord: number;
  totalPage: number;
  pageIndex: number;
}

// --------------------
// 3. Khởi tạo giá trị initialState
// --------------------
const initialState: WalletTypeState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  walletTypes: [],
  walletType: null,
  totalRecord: 0,
  totalPage: 0,
  pageIndex: 1,
};

// --------------------
// 4. Tạo Slice
// --------------------
const walletTypeSlice = createSlice({
  name: "WalletType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllWalletTypes
    builder
      .addCase(getAllWalletTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWalletTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.walletTypes = action.payload?.data || [];
        state.totalRecord = action.payload?.totalRecord || 0;
        state.totalPage = action.payload?.totalPage || 0;
        state.pageIndex = action.payload?.pageIndex || 1;
      })
      .addCase(getAllWalletTypes.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

// --------------------
// 5. Export reducer
// --------------------
const walletTypeReducer = walletTypeSlice.reducer;
export default walletTypeReducer;
