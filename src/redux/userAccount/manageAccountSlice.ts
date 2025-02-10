// src/redux/user/userSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllUsersThunk,
  getUserDetailThunk,
  createNewUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from './manageAccountThunk';
import { UserInfo } from 'common/models';

// --------------------
// 1. Khai báo các createAsyncThunk
// --------------------
export const getAllUsers = createAsyncThunk('User/getAllUsers', getAllUsersThunk);
export const getUserDetails = createAsyncThunk('User/getUserDetails', getUserDetailThunk);
export const createNewUser = createAsyncThunk('User/createNewUser', createNewUserThunk);
export const updateUser = createAsyncThunk('User/updateUser', updateUserThunk);
export const deleteUser = createAsyncThunk('User/deleteUser', deleteUserThunk);

// --------------------
// 2. Định nghĩa interface State
// --------------------
interface UserState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  users: UserInfo[];
  user: UserInfo | null;
  numberItems: number;
  totalCount: number;
}

// --------------------
// 3. Khởi tạo giá trị initialState
// --------------------
const initialState: UserState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  users: [],
  user: null,
  numberItems: 0,
  totalCount: 0, // Khởi tạo mặc định
};

// --------------------
// 4. Tạo Slice
// --------------------
const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    // Nếu cần reducer sync, bạn có thể thêm vào đây.
    // ví dụ: setUserLocal: (state, action) => { ... }
  },
  // Viết extraReducers theo dạng builder callback để đồng nhất với authSlice
  extraReducers: (builder) => {
    // getAllUsers
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // Giả sử action.payload là mảng UserInfo[]
        const users = action.payload || [];
        // Sắp xếp theo thứ tự bảng chữ cái của userName
        state.users = [...users].sort((a, b) => a.userName.localeCompare(b.userName));
        state.numberItems = state.users.length;
        // Nếu backend trả về totalCount thì cập nhật thêm
        // state.totalCount = action.payload.totalCount || state.users.length;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })

      // getUserDetails
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload; // payload = {accountId, email, ...}
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })

      // createNewUser
      .addCase(createNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createNewUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // Giả sử action.payload chứa accountId của user đã bị xóa:
        state.users = state.users.filter(user => user.accountId !== action.payload.accountId);
      })
      .addCase(deleteUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

// --------------------
// 5. Export actions (nếu có reducer sync)
// --------------------
// Nếu bạn có tạo reducer sync ở phần reducers, hãy export ra ở đây:
// export const { setUserLocal } = userSlice.actions;

// --------------------
// 6. Export reducer mặc định
// --------------------
const userReducer = userSlice.reducer;
export default userReducer;
