import { axiosClient, axiosFormData } from 'axiosClient/axiosClient';
import { ROUTES_API_DATADEFAULT } from 'constants/routesApiKeys';
import { setMessageError, setMessageSuccess } from 'redux/auth/authSlice';
import { getErrorMessage, handleResponseMessage, appendData } from 'utils'; 
import { getDataDefault } from './dataDefaultSlice';

export const getDataDefaultThunk = async (params: any, thunkAPI: any) => {
  try {
    const response = await axiosClient.get(
      ROUTES_API_DATADEFAULT.GET_DATADEFAULT()
    );

    return response.data; // Kiểm tra nếu response.data không chứa `data` thì có thể lỗi ở đây
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, params?.navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || "");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};

export const updateDataDefaultThunk = async (params: any, thunkAPI: any) => {
  const { data, optionParams, navigate } = params;
  
  try {
    // Gửi dữ liệu JSON trực tiếp, không cần chuyển sang FormData
    const response = await axiosClient.post(ROUTES_API_DATADEFAULT.UPDATE_DATADEFAULT(), data);

    if (response) {
      // Refresh lại dữ liệu sau khi update thành công
      await thunkAPI.dispatch(getDataDefault());
      const msg = handleResponseMessage(response?.data?.message || 'Updated data default successfully!');
      thunkAPI.dispatch(setMessageSuccess(msg));
    }
    return response;
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || '');
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};

  