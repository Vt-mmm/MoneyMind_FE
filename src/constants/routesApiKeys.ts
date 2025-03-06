import { path, pathRoot } from "utils";
const ROOTS_AUTH = "/api/Authentications";
const ROOTS_MANAGE_USERS = "/api/admin/user";
const ROOTS_MANAGE_TAGS = "/api/tag";
const ROOTS_MANAGE_WALLETTYPES = "/api/walletType";
const ROOTS_DATADEFAULT = "/api/DefaultFile";
const ROOTS_DASHBOARDS = "/api/admin";
export const ROUTES_API_AUTH = {
  LOGIN: path(ROOTS_AUTH, `/Login`),
  REFRESH_TOKEN: path(ROOTS_AUTH, `/regeneration-tokens`),
  LOGIN_GOOGLE: "/api/Authentications/GoogleLogin",
};
export const ROUTES_API_DASHBOARD = {
  TRANSACTIONS: `${ROOTS_DASHBOARDS}/transactions`,
  USERS: `${ROOTS_DASHBOARDS}/user`,
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
      ROOTS_MANAGE_USERS,
      `?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}`
    );
  },

  GET_USER_DETAIL: (accountId: number) =>
    path(ROOTS_MANAGE_USERS, `/${accountId}`),

  CREATE_USER: pathRoot(ROOTS_MANAGE_USERS),

  UPDATE_USER: (accountId: number) => path(ROOTS_MANAGE_USERS, `/${accountId}`),

  DELETE_USER: (accountId: number) => path(ROOTS_MANAGE_USERS, `/${accountId}`),
};

export const ROUTES_API_DATADEFAULT = {
  GET_DATADEFAULT: () => path(ROOTS_DATADEFAULT, "?includeWalletCategories=true&includeMonthlyGoal=true&includeGoalItem=true"),
  UPDATE_DATADEFAULT: () => path(ROOTS_DATADEFAULT, "?includeWalletCategories=true&includeMonthlyGoal=true&includeGoalItem=true"),
};
export const ROUTES_API_TAGS = {
  GET_ALL_TAGS: ({
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
      ROOTS_MANAGE_TAGS,
      `?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}`
    );
  },
};
export const ROUTES_API_WALLET_TYPES = {
  GET_ALL_WALLET_TYPES: ({
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
      ROOTS_MANAGE_WALLETTYPES,
      `?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&sortBy=${sortBy}`
    );
  },
};