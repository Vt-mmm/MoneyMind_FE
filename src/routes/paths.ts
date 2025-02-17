import { path } from "utils";
const ROOTS_ERROR = "/error";
export const ROOTS_ADMIN_DASHBOARD = "/admin";
export const ROOTS_MANAGER_DASHBOARD = "/manager";

const ROOTS_AUTH = "/auth";
export const PATH_ERROR = {
  noPermission: path(ROOTS_ERROR, "/403"),
  notFound: path(ROOTS_ERROR, "/404"),
  serverError: path(ROOTS_ERROR, "/500"),
};

export const PATH_AUTH = {
  login: path(ROOTS_AUTH, "/login"),
};
export const PATH_ADMIN_APP = {
  root: path(ROOTS_ADMIN_DASHBOARD, "/dashboard"),
  report: path(ROOTS_ADMIN_DASHBOARD, "/report"),
  configurations: path(ROOTS_ADMIN_DASHBOARD, "/configurations"),
  tag: path(ROOTS_ADMIN_DASHBOARD, "/tag"),
  icon: path(ROOTS_ADMIN_DASHBOARD, "/icon"),
  wallettype: path(ROOTS_ADMIN_DASHBOARD, "/wallettype"),
  userManagement: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/user"),
    list: path(ROOTS_ADMIN_DASHBOARD, "/users"),
  },
};
export const PATH_MANAGER_APP = {
  report: path(ROOTS_MANAGER_DASHBOARD, "/dashboard"),
  root: path(ROOTS_MANAGER_DASHBOARD, "/report"),
};
