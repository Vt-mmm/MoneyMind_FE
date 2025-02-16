import { path, pathRoot } from "utils";
const ROOTS_AUTH = "/api/Authentications";
const ROOTS_ACCOUNT = "/accounts";
const ROOTS_USERS = "/api/admin/user";

export const ROUTES_API_AUTH = {
  LOGIN: path(ROOTS_AUTH, `/Login`),
  REFRESH_TOKEN: path(ROOTS_AUTH, `/regeneration-tokens`),
  LOGIN_GOOGLE: "/api/Authentications/GoogleLogin",
};

export const ROUTES_API_ACCOUNT = {
  ACCOUNT_INFORMATION: (accountId: number) =>
    path(ROOTS_ACCOUNT, `/${accountId}`),
  UPDATE_PASSWORD: (accountId: number) => path(ROOTS_ACCOUNT, `/${accountId}`),
};
export const ROUTES_API_USERS = {
  GET_ALL_USERS: ({
    itemsPerPage = 10,
    currentPage = 1,
    searchValue = "",
    sortBy = "",
  }: {
    itemsPerPage?: string | number;
    currentPage?: string | number;
    searchValue?: string;
    sortBy?: string;
  }) => {
    return path(
      ROOTS_USERS,
      `?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}`
    );
  },

  GET_USER_DETAIL: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),

  CREATE_USER: pathRoot(ROOTS_USERS),

  UPDATE_USER: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),

  DELETE_USER: (accountId: number) => path(ROOTS_USERS, `/${accountId}`),
};
