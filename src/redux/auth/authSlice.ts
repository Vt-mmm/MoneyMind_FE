import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserAuth, UserInfo } from 'common/models';
import { toast } from 'react-toastify';
import {
  getAuthenticated,
  getEmailVerify,
  getUserAuth,
  getUserInfo,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setEmailVerify,
  setRefreshToken,
} from 'utils';
 import {
//   checkEmailThunk,
//   forgotPasswordThunk,
//   getUserInfoThunk,
  loginThunk,
  logoutThunk,
  // resetPasswordThunk,
  // updatePasswordThunk,
} from './authThunk';

interface AuthState {
  isLogout: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isAuthenticated: boolean;
  message: string;
  status: string;
  email: string;
  userAuth: UserAuth | null;
  userInfo: UserInfo | null;
}
const getUserInStorage = getUserAuth() ? getUserAuth() : null;
const getUserInfoInStorage = getUserInfo() ? getUserInfo() : null;
const getIsAuthenticated = getAuthenticated() ? getAuthenticated() : false;
const getEmailInStorage = getEmailVerify() ? getEmailVerify() : '';

const initialState: AuthState = {
    isLogout: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isAuthenticated: getIsAuthenticated,
    message: '',
    status: '',
    email: getEmailInStorage,
    userAuth: getUserInStorage,
    userInfo: getUserInfoInStorage,
  };
  export const login = createAsyncThunk('auth/login', loginThunk);
// export const getUserInformation = createAsyncThunk('account/user-information', getUserInfoThunk);
// export const forgotPassword = createAsyncThunk('auth/forgot-password', forgotPasswordThunk);
// export const resetPassword = createAsyncThunk('auth/reset-password', resetPasswordThunk);
// export const updatePassword = createAsyncThunk('auth/update-password', updatePasswordThunk);
// export const checkEmail = createAsyncThunk('auth/check-email', checkEmailThunk);
export const logout = createAsyncThunk('auth/logout', logoutThunk);
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setMessageSuccess: (state, action) => {
        state.message = action.payload;
        toast.success(state.message);
      },
      setMessageInfo: (state, action) => {
        state.message = action.payload?.message;
        toast.info(state.message);
      },
      setMessageError: (state, action) => {
        state.message = action.payload;
        toast.error(state.message);
      },
      setStatus: (state) => {
        state.status = '';
      },
      setEmail: (state, action) => {
        state.email = action.payload?.email;
        setEmailVerify(action.payload?.email);
      },
      setUserAuth: (state) => {
        state.userAuth = getUserAuth() ? getUserAuth() : null;
      },
      setIsLogout: (state, action) => {
        state.isLogout = action.payload;
      },
      updateLocalAccessToken: (state, action) => {
        setAccessToken(action.payload.accessToken);
        setRefreshToken(action.payload.refreshToken);
      },
      removeToken: () => {
        removeAccessToken();
        removeRefreshToken();
      },
    },
    extraReducers(builder) {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isAuthenticated = true;
          state.userAuth = action.payload;
        })
        .addCase(login.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.isAuthenticated = false;
        })
       
        .addCase(logout.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(logout.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isAuthenticated = false;
          state.userAuth = null;
          state.isLogout = true; // Cập nhật isLogout
        })
        .addCase(logout.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
        });
    },
  });
export const {
    setMessageSuccess,
    setMessageInfo,
    setMessageError,
    setEmail,
    setUserAuth,
    setIsLogout,
    updateLocalAccessToken,
    removeToken,
    setStatus,
  } = authSlice.actions;
  const authReducer = authSlice.reducer;
  
  export default authReducer;
  