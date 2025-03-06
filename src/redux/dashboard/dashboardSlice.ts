import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDashboardUserThunk } from './dashboardThunk';
import { AdminDashboardUserResponse } from 'common/models';

interface DashboardState {
  users: AdminDashboardUserResponse | null;
  isLoadingUser: boolean;
  isErrorUser: boolean;
}

const initialState: DashboardState = {
  users: null,
  isLoadingUser: false,
  isErrorUser: false,
};

export const fetchUsers = createAsyncThunk(
  'dashboard/fetch-users',
  async (params: any, thunkAPI) => await getDashboardUserThunk(params, thunkAPI)
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUser = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.isErrorUser = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isLoadingUser = false;
        state.isErrorUser = true;
      });
  },
});
const dashboardReducer = dashboardSlice.reducer;


export default dashboardSlice.reducer;
