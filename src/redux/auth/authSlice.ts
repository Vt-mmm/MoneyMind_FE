import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserAuth, UserInfo } from "common/models";
import { toast } from "react-toastify";
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
} from "utils";
import { googleLoginThunk, loginThunk, logoutThunk } from "./authThunk";

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
  errorMessage: string | null;
}

const getUserInStorage = getUserAuth() || null;
const getUserInfoInStorage = getUserInfo() || null;
const getIsAuthenticated = getAuthenticated() || false;
const getEmailInStorage = getEmailVerify() || "";

const initialState: AuthState = {
  isLogout: false,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isAuthenticated: getIsAuthenticated,
  message: "",
  status: "",
  email: getEmailInStorage,
  userAuth: getUserInStorage,
  userInfo: getUserInfoInStorage,
  errorMessage: null,
};

export const loginbygoogle = createAsyncThunk<
  UserAuth,
  string,
  { rejectValue: string }
>("auth/loginbygoogle", googleLoginThunk);

export const login = createAsyncThunk("auth/login", loginThunk);
export const logout = createAsyncThunk("auth/logout", logoutThunk);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMessageSuccess: (state, action) => {
      state.message = action.payload;
      toast.success(state.message);
    },
    setMessageError: (state, action) => {
      state.message = action.payload;
      toast.error(state.message);
    },
    setStatus: (state) => {
      state.status = "";
    },
    setEmail: (state, action) => {
      state.email = action.payload?.email;
      setEmailVerify(action.payload?.email);
    },
    setUserAuth: (state) => {
      state.userAuth = getUserAuth() || null;
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
  extraReducers: (builder) => {
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

      .addCase(loginbygoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginbygoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.userAuth = action.payload;
      })
      .addCase(loginbygoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.userAuth = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isAuthenticated = false;
        state.userAuth = null;
        state.isLogout = true;
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
