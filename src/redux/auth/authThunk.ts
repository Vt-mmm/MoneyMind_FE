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

    // Tạo đối tượng userStorage
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
      const message = handleResponseMessage('Login Successfully.');
      thunkAPI.dispatch(setMessageSuccess(message));
      return userStorage;
    } else {
      const message = handleResponseMessage('You do not have access to the system');
      thunkAPI.dispatch(setMessageError(message));
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
};

// export const updatePasswordThunk = async (
//   params: Params<Omit<UpdatePasswordForm, "confirmPassword">>,
//   thunkAPI: any
// ) => {
//   const { data, idParams, navigate } = params;

//   try {
//     const response: MessageResponse = await axiosClient.put(
//       ROUTES_API_ACCOUNT.UPDATE_PASSWORD(
//         idParams?.accountId ? idParams?.accountId : 0
//       ),
//       data
//     );
//     if (response) {
//       const message = handleResponseMessage(response.message);
//       thunkAPI.dispatch(setMessageSuccess(message));
//       thunkAPI.dispatch(
//         getUserInformation({ accountId: idParams?.accountId, navigate })
//       );
//     }
//   } catch (error: any) {
//     const errorResponse = getErrorMessage(error, navigate);
//     const messageMultiLang = handleResponseMessage(
//       errorResponse ? errorResponse?.errorMessage : ""
//     );
//     thunkAPI.dispatch(setMessageError(messageMultiLang));
//     return thunkAPI.rejectWithValue(error);
//   }
// };

// export const getUserInfoThunk = async (params: any, thunkAPI: any) => {
//   const { accountId, navigate } = params;

//   try {
//     const response: UserInfo = await axiosClient.get(
//       ROUTES_API_ACCOUNT.ACCOUNT_INFORMATION(accountId)
//     );
//     if (response) {
//       const userStorage: UserAuth = {
//         accountId: response?.accountId,
//         email: response?.email,
//         roleName: response?.roleName,
//         isConfirmed: response?.isConfirmed,
//       };
//       setUserAuth(userStorage);
//       return { response, userStorage };
//     }
//   } catch (error: any) {
//     const errorResponse = getErrorMessage(error, navigate);
//     const messageMultiLang = handleResponseMessage(
//       errorResponse ? errorResponse?.errorMessage : ""
//     );
//     thunkAPI.dispatch(setMessageError(messageMultiLang));
//     return thunkAPI.rejectWithValue(error);
//   }
// };

// export const forgotPasswordThunk = async (
//   params: Params<EmailForm>,
//   thunkAPI: any
// ) => {
//   const { data, navigate } = params;
//   try {
//     const response: MessageResponse = await axiosClient.post(
//       ROUTES_API_AUTH.FORGOT_PASSWORD,
//       data
//     );
//     if (response) {
//       navigate(PATH_AUTH.verificationOTP);
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
