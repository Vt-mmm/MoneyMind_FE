import { OptionParams } from "common/@types";
import { path, pathRoot } from "utils";
const ROOTS_AUTH = "/api/Authentications";
const ROOTS_ACCOUNT = "/accounts";
const ROOTS_VERIFY = "/verifications";
const ROOTS_USERS = "/api/admin/user";

export const ROUTES_API_AUTH = {
  LOGIN: path(ROOTS_AUTH, `/Login`),
  REFRESH_TOKEN: path(ROOTS_AUTH, `/regeneration-tokens`),
  RESET_PASSWORD: path(ROOTS_AUTH, `/password-resetation`),
  FORGOT_PASSWORD: path(ROOTS_VERIFY, `/email-verification`),
  VERIFY_OTP: path(ROOTS_VERIFY, `/otp-verification`),
};

export const ROUTES_API_ACCOUNT = {
  ACCOUNT_INFORMATION: (accountId: number) =>
    path(ROOTS_ACCOUNT, `/${accountId}`),
  UPDATE_PASSWORD: (accountId: number) => path(ROOTS_ACCOUNT, `/${accountId}`),
};
export const ROUTES_API_USERS = {
  GET_ALL_USERS: ({
    itemsPerPage = "",
    currentPage = "",
    searchValue = "",
    sortBy = "",
  }: {
    itemsPerPage?: string | number;
    currentPage?: string | number;
    searchValue?: string;
    sortBy?: string;
  }) => {
    // path() là hàm tiện ích bạn đã có sẵn để nối đường dẫn, ví dụ path('/users', '?searchValue=...')
    // Nếu không có path(), bạn có thể nối thủ công: return `/users?searchValue=...`
    return path(
      ROOTS_USERS,
      `?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}`
    );
  },

  GET_USER_DETAIL: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),

  CREATE_USER: pathRoot(ROOTS_USERS), // POST /users

  UPDATE_USER: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),

  DELETE_USER: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),

  // Nếu bạn muốn cập nhật trạng thái hoặc một hành động khác cho user, bạn có thể thêm
  // UPDATE_STATUS_USER: (accountId: number) => path(ROOTS_USERS, `/${accountId}/updating-status`),
};
