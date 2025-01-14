import { OptionParams } from 'common/@types';
import { path, pathRoot } from 'utils';
const ROOTS_AUTH = '/api/Authentications';
const ROOTS_ACCOUNT = '/Accounts';
const ROOTS_VERIFY = '/verifications';


export const ROUTES_API_AUTH = {
    LOGIN: path(ROOTS_AUTH, `/Login`),
    REFRESH_TOKEN: path(ROOTS_AUTH, `/regeneration-tokens`),
    RESET_PASSWORD: path(ROOTS_AUTH, `/password-resetation`),
    FORGOT_PASSWORD: path(ROOTS_VERIFY, `/email-verification`),
    VERIFY_OTP: path(ROOTS_VERIFY, `/otp-verification`),
  };

  
export const ROUTES_API_ACCOUNT = {
    ACCOUNT_INFORMATION: (accountId: number) => path(ROOTS_ACCOUNT, `/${accountId}`),
    UPDATE_PASSWORD: (accountId: number) => path(ROOTS_ACCOUNT, `/${accountId}`),
  };