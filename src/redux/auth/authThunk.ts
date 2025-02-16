import { axiosClient } from "axiosClient/axiosClient";
import { LoginForm, LoginResponse, Params } from "common/@types";
import { Role } from "common/enums";
import { UserAuth } from "common/models";
import { ROUTES_API_AUTH } from "constants/routesApiKeys";
import {
  handleResponseMessage,
  removeAuthenticated,
  removeSession,
  setAccessToken,
  setAuthenticated,
  setRefreshToken,
  setUserAuth,
} from "utils";
import { setMessageError, setMessageSuccess, setStatus } from "./authSlice";

export const loginThunk = async (params: Params<LoginForm>, thunkAPI: any) => {
  const { data } = params;
  try {
    const response = await axiosClient.post<LoginResponse>(
      ROUTES_API_AUTH.LOGIN,
      data
    );

    const userStorage: UserAuth = {
      userId: response.data.userId,
      username: response.data.username,
      email: response.data.email,
      roles: response.data.roles,
    };

    if (
      response?.data.roles.includes(Role.MONEYMIND_ADMIN) ||
      response?.data.roles.includes(Role.MONEYMIND_MANAGER)
    ) {
      setAccessToken(response.data.tokens.accessToken);
      setRefreshToken(response.data.tokens.refreshToken);
      setUserAuth(userStorage);
      setAuthenticated();
      const message = handleResponseMessage("Đăng nhập thành công.");
      thunkAPI.dispatch(setMessageSuccess(message));
      return userStorage;
    } else {
      const message = handleResponseMessage(
        "Bạn không có quyền truy cập vào hệ thống"
      );
      thunkAPI.dispatch(setMessageError(message));
      return thunkAPI.rejectWithValue(message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      handleResponseMessage("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!");
    thunkAPI.dispatch(setMessageError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
};
export const googleLoginThunk = async (
  googleToken: string,
  thunkAPI: any
): Promise<UserAuth> => {
  try {
    const response = await axiosClient.post<{
      userId: string;
      email: string;
      fullName?: string;
      roles: string[];
      tokens: { accessToken: string; refreshToken: string };
    }>(`${ROUTES_API_AUTH.LOGIN_GOOGLE}`, { token: googleToken });

    if (!response.data || !response.data.userId) {
      const message = handleResponseMessage(
        "Lỗi: Backend không trả về thông tin người dùng."
      );
      thunkAPI.dispatch(setMessageError(message));
      return thunkAPI.rejectWithValue(message);
    }

    const user: UserAuth = {
      userId: response.data.userId,
      email: response.data.email,
      username: response.data.fullName || "",
      roles: response.data.roles || [],
    };

    if (user.roles.includes("Admin") || user.roles.includes("Manager")) {
      setAccessToken(response.data.tokens.accessToken);
      setRefreshToken(response.data.tokens.refreshToken);
      setUserAuth(user);
      setAuthenticated();
      const message = handleResponseMessage(
        "Đăng nhập bằng Google thành công."
      );
      thunkAPI.dispatch(setMessageSuccess(message));
      return user;
    } else {
      const message = handleResponseMessage(
        "Bạn không có quyền truy cập vào hệ thống. Hãy đợi tới khi được cấp quyền"
      );
      thunkAPI.dispatch(setMessageError(message));
      return thunkAPI.rejectWithValue(message);
    }
  } catch (error: any) {
    console.error(" Lỗi từ Backend:", error.response?.data || error);

    const errorMessage =
      error.response?.data?.message ||
      handleResponseMessage("Đăng nhập Google thất bại. Vui lòng thử lại!");

    thunkAPI.dispatch(setMessageError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
};

export const logoutThunk = async (_: any, thunkAPI: any) => {
  try {
    removeAuthenticated();
    removeSession();
    localStorage.clear();
    thunkAPI.dispatch(setStatus());
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
};
