import axios, { AxiosResponse } from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.delete['Access-Control-Allow-Origin'] = '*';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'https://app-moneymind-swd392-g4h7dhhvh0hsfub4.southeastasia-01.azurewebsites.net/', 
});

const axiosServiceAddress = axios.create({
  baseURL: 'https://vapi.vnappmob.com',
  headers: {
    'Content-Type': ' application/json',
  },
});

const axiosFormData = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'https://app-moneymind-swd392-g4h7dhhvh0hsfub4.southeastasia-01.azurewebsites.net/', 
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const setHeaderAuth = (accessToken: string) => {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  axiosFormData.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

axiosServiceAddress.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosServiceAddress.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { axiosClient, axiosFormData, axiosServiceAddress, setHeaderAuth };
