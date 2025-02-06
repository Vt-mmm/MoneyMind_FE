import { ActionPayloadErrorData, ErrorResponse } from 'common/@types';
import { Error } from 'common/enums';
import { UserAuth, UserInfo } from "common/models";
import { StorageKeys } from "constants/storageKeys";
import Cookie from "js-cookie";
import { PATH_ERROR } from "routes/paths";
import { Md5 } from "ts-md5";

// localstorage
export const setLocalStorage = (name: string, value: any) => {
  localStorage.setItem(name, value);
};
export const getLocalStorage = (name: string) => localStorage.getItem(name);
export const removeLocalStorage = (key: any) => localStorage.removeItem(key);

export const setUserAuth = (userAuth: UserAuth) =>
  setLocalStorage(StorageKeys.USER_AUTH, JSON.stringify(userAuth));
export const getUserAuth = () => {
  const userAuth = getLocalStorage(StorageKeys.USER_AUTH);
  if (
    userAuth === null ||
    userAuth === undefined ||
    userAuth.toString() === "undefined"
  ) {
    return;
  } else {
    const userRaw = JSON.parse(userAuth);
    return userRaw;
  }
};
export const removeUserAuth = () => removeLocalStorage(StorageKeys.USER_AUTH);

export const setUserInfo = (userInfo: UserInfo) =>
  setLocalStorage(StorageKeys.USER_INFO, JSON.stringify(userInfo));
export const getUserInfo = () => {
  const userAuth = getLocalStorage(StorageKeys.USER_INFO);
  if (
    userAuth === null ||
    userAuth === undefined ||
    userAuth.toString() === "undefined"
  ) {
    return;
  } else {
    const userRaw = JSON.parse(userAuth);
    return userRaw;
  }
};
// cookie
export const setAccessToken = (accessToken: string) =>
  Cookie.set(StorageKeys.ACCESS_TOKEN, accessToken);
export const getAccessToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(StorageKeys.ACCESS_TOKEN))
    ?.split("=")[1];

export const removeAccessToken = () => Cookie.remove(StorageKeys.ACCESS_TOKEN);

export const setRefreshToken = (refreshToken: string) =>
  Cookie.set(StorageKeys.REFRESH_TOKEN, refreshToken);
export const getRefreshToken = () => {
  const refreshToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith(StorageKeys.REFRESH_TOKEN));
  const equalIndex = refreshToken?.indexOf("=");
  if (equalIndex !== -1) {
    var result = refreshToken?.substring(equalIndex ? equalIndex : 0 + 1);
    return result?.replace(/^=/, "");
  }
};
export const removeRefreshToken = () =>
  Cookie.remove(StorageKeys.REFRESH_TOKEN);

// hash password
export const hashPasswordMD5 = (password: string) => Md5.hashStr(password);
export const setAuthenticated = () => setLocalStorage(StorageKeys.AUTHENTICATE, true);
export const getAuthenticated = () => {
  const isAuthenticated = getLocalStorage(StorageKeys.AUTHENTICATE);
  if (isAuthenticated === null || isAuthenticated === undefined) {
    return false;
  }
  return Boolean(isAuthenticated);
};
export const removeAuthenticated = () => removeLocalStorage(StorageKeys.AUTHENTICATE);

export const setEmailVerify = (email: string) => setLocalStorage(StorageKeys.EMAIL_VERIFY, email);
export const getEmailVerify = () => {
  const emailStorage = getLocalStorage(StorageKeys.EMAIL_VERIFY);
  if (emailStorage === null || emailStorage === undefined) {
    return '';
  }
  return emailStorage;
};
export const removeEmailVerify = () => removeLocalStorage(StorageKeys.EMAIL_VERIFY);
export const setLanguage = (language: string) => setLocalStorage(StorageKeys.I18_LANGUAGE, language);
export const getLanguage = () => getLocalStorage(StorageKeys.I18_LANGUAGE);
export const getErrorMessage = (error: any, navigate: any) => {
  console.log('API_ERROR:', error);

  if (error?.code === Error.SERVER_ERROR) {
    console.log(error);
    navigate(PATH_ERROR.serverError);
    return;
  }

  if (error.data.StatusCode === 403 || error.status === 403) {
    navigate(PATH_ERROR.noPermission);
  }

  console.log('status', error.status);

  const errorData: ActionPayloadErrorData = error?.data;
  const errorMessage = errorData.Message[0].DescriptionError[0];
  const fieldNameError = errorData.Message[0].FieldNameError;
  const statusCode = errorData.StatusCode;

  const errorResponse: ErrorResponse = {
    errorMessage: errorMessage,
    fieldNameError: fieldNameError,
    statusCode: statusCode,
  };
  return errorResponse;
};
// appendData
export const appendData = (data: any) => {
  const formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};