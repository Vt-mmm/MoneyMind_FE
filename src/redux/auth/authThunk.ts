import { axiosClient } from "axiosClient/axiosClient";
import {
  LoginForm,
  LoginResponse,
  Params,
} from "common/@types";
import { Role } from "common/enums";
import { UserAuth, } from "common/models";
import {  ROUTES_API_AUTH } from "constants/routesApiKeys";
import { PATH_ADMIN_APP,PATH_MANAGER_APP  } from "routes/paths";
import {
  handleResponseMessage,
  removeAuthenticated,
  removeSession,
  setAccessToken,
  setAuthenticated,
  setRefreshToken,
  setUserAuth,
} from "utils";
import {
  // getUserInformation,
  setMessageError,
  setMessageSuccess,
  setStatus,
} from "./authSlice";

export const loginThunk = async (params: Params<LoginForm>, thunkAPI: any) => {
  const { data, navigate } = params;
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
      handleResponseMessage("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!"); // Thông báo lỗi cụ thể
    thunkAPI.dispatch(setMessageError(errorMessage)); // Đẩy lỗi vào Redux
    return thunkAPI.rejectWithValue(errorMessage);
  }
};


// export const resetPasswordThunk = async (
//   params: Params<Omit<ResetForm, "confirmPassword">>,
//   thunkAPI: any
// ) => {
//   const { data, navigate } = params;
//   try {
//     const response: MessageResponse = await axiosClient.put(
//       ROUTES_API_AUTH.RESET_PASSWORD,
//       data
//     );
//     if (response) {
//       navigate(PATH_AUTH.login);
//       const message = handleResponseMessage(response.message);
//       thunkAPI.dispatch(setMessageSuccess(message));
//     }
//     return response;
//   } catch (error: any) {
//     const errorResponse = getErrorMessage(error, navigate);
//     const messageMultiLang = handleResponseMessage(
//       errorResponse ? errorResponse?.errorMessage : ""
//     );
//     thunkAPI.dispatch(setMessageError(messageMultiLang));
//     return thunkAPI.rejectWithValue(error);
//   }
// };

// export const checkEmailThunk = async (
//   params: Params<EmailForm>,
//   thunkAPI: any
// ) => {
//   const { data, navigate } = params;
//   const options = {
//     method: "GET",
//     url: "https://email-checker.p.rapidapi.com/verify/v1",
//     params: {
//       email: data?.email,
//     },
//     headers: {
//       "X-RapidAPI-Key": "2a2a0e08aemsh5032db86f38f4bfp190d34jsn8d129a70f2a9",
//       "X-RapidAPI-Host": "email-checker.p.rapidapi.com",
//     },
//   };
//   try {
//     const response = await axios.request(options);
//     const emailResponse: EmailValidateResponse = response.data;
//     return emailResponse;
//   } catch (error: any) {
//     console.log(error);
//     const errorResponse = getErrorMessage(error, navigate);
//     const messageMultiLang = handleResponseMessage(
//       errorResponse ? errorResponse?.errorMessage : ""
//     );
//     thunkAPI.dispatch(setMessageError(messageMultiLang));
//     return thunkAPI.rejectWithValue(error);
//   }
// };

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
