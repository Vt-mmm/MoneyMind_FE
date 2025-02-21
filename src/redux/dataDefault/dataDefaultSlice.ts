import { DataDefaultResponse } from './../../common/models/datadefault';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataDefaultThunk, updateDataDefaultThunk } from './dataDefaultThunk';
import { FormDataDefault } from '../../pages/Admin/datadefault/ManageDataDefaultPage';

export const getDataDefault = createAsyncThunk(
  'DataDefault/getDataDefault',
  async (params, thunkAPI) => await getDataDefaultThunk(params, thunkAPI)
);

export const updateDataDefault = createAsyncThunk<
  any, // kiểu trả về, bạn có thể thay đổi theo nhu cầu
  { data: FormDataDefault; optionParams?: any; navigate?: any } // kiểu của tham số nhận vào
>(
  'DataDefault/updateDataDefault',
  async (params, thunkAPI) => await updateDataDefaultThunk(params, thunkAPI)
);


export interface DataDefaultState {
  dataDefault: DataDefaultResponse;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  errorMessage: string;
}

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

const dataDefaultSlice = createSlice({
  name: 'DataDefault',
  initialState,
  reducers: {
    // Nếu cần thêm reducer sync thì khai báo tại đây.
  },
  extraReducers: (builder) => {
    builder
      // --- getDataDefault cases ---
      .addCase(getDataDefault.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataDefault.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataDefault = action.payload;
        state.message = action.payload.message || "Dữ liệu đã tải thành công!";
      })
      .addCase(getDataDefault.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message || 'Failed to load data default';
      })
      // --- updateDataDefault cases ---
      .addCase(updateDataDefault.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDataDefault.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // Nếu muốn cập nhật trực tiếp state.dataDefault, có thể làm ở đây.
        // Trong trường hợp này, bạn đã dispatch getDataDefault từ thunk để refresh dữ liệu.
        state.message = action.payload?.data?.message || "Cập nhật dữ liệu thành công!";
      })
      .addCase(updateDataDefault.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message || 'Failed to update data default';
      });
  },
});

export default dataDefaultSlice.reducer;
