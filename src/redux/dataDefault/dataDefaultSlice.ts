import { DataDefaultResponse } from './../../common/models/datadefault';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataDefaultThunk } from './dataDefaultThunk';

// --------------------
// 1. Khai báo createAsyncThunk
// --------------------
export const getDataDefault = createAsyncThunk(
  'DataDefault/getDataDefault',
  async (params, thunkAPI) => await getDataDefaultThunk(params, thunkAPI)
);

// --------------------
// 2. Định nghĩa interface State
// --------------------
export interface DataDefaultState {
  dataDefault: DataDefaultResponse;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  errorMessage: string;
}

// --------------------
// 3. Khởi tạo giá trị initialState
// --------------------
const initialState: DataDefaultState = {
  dataDefault: {
    walletCategories: [],
    monthlyGoal: { totalAmount: 0 },
    goalItem: {
      description: '',
      minTargetPercentage: 0,
      maxTargetPercentage: 0,
      minAmount: 0,
      maxAmount: 0,
    },
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  errorMessage: '',
};

// --------------------
// 4. Tạo Slice
// --------------------
const dataDefaultSlice = createSlice({
  name: 'DataDefault',
  initialState,
  reducers: {
    // Nếu cần reducer sync, bạn có thể thêm vào đây.
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataDefault.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getDataDefault.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // Nếu response không có `.data`, chỉ cần nhận trực tiếp `action.payload`
        state.dataDefault = action.payload;
        state.message = action.payload.message || "Dữ liệu đã tải thành công!";
      })
      .addCase(getDataDefault.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message || 'Failed to load data default';
      });
  },
});

// --------------------
// 5. Export reducer mặc định
// --------------------
const dataDefaultReducer = dataDefaultSlice.reducer;
export default dataDefaultReducer;
