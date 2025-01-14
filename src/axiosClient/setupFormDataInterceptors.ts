import { AxiosResponse } from 'axios';
// redux
import { removeToken, setIsLogout, updateLocalAccessToken } from 'redux/auth/authSlice';
//
import { TokenResponse } from 'common/models';
import { ROUTES_API_AUTH } from 'constants/routesApiKeys';
import { getAccessToken, getRefreshToken } from 'utils';
import { axiosClient, axiosFormData } from './axiosClient';

const setupAxiosFormData = (store: any) => {
  axiosFormData.interceptors.request.use(
    async (config) => {
      const accessToken = getAccessToken();
      if (accessToken !== null) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;

  axiosFormData.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    async (err) => {
      const originalConfig = err.config;

      if (
        (originalConfig.url !== ROUTES_API_AUTH.LOGIN ||
          originalConfig.url !== ROUTES_API_AUTH.FORGOT_PASSWORD ||
          originalConfig.url !== ROUTES_API_AUTH.RESET_PASSWORD ||
          originalConfig.url !== ROUTES_API_AUTH.VERIFY_OTP) &&
        err.response
      ) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          const accessToken = getAccessToken();
          const refreshToken = getRefreshToken();

          const data = {
            accessToken,
            refreshToken,
          };

          console.log('data', data);

          try {
            const response: TokenResponse = await axiosClient.post(ROUTES_API_AUTH.REFRESH_TOKEN, data);
            console.log('response new', response);

            delete axiosFormData.defaults.headers.common.Authorization;

            await dispatch(removeToken());

            await dispatch(
              updateLocalAccessToken({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              })
            );

            axiosFormData.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`;

            return axiosFormData(originalConfig);
          } catch (_error) {
            console.log(_error);
            dispatch(setIsLogout(true));
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err.response);
    }
  );
};

export default setupAxiosFormData;
