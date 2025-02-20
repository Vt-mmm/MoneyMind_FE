import { axiosClient, axiosFormData } from 'axiosClient/axiosClient';
import { ROUTES_API_DATADEFAULT } from 'constants/routesApiKeys';
import { setMessageError, setMessageSuccess } from 'redux/auth/authSlice';
import { getErrorMessage, handleResponseMessage, appendData } from 'utils'; 

export const getDataDefaultThunk = async (thunkAPI: any) => {
    try {
      // Gọi API GET
      console.log(ROUTES_API_DATADEFAULT.GET_DATADEFAULT());
      const response = await axiosClient.get(
        ROUTES_API_DATADEFAULT.GET_DATADEFAULT()
      );
      // Chìa khoá: trả về "response.data" để slice nhận được dữ liệu "thật"
      // Thay vì return response
      return response.data;
  
    } catch (error: any) {
      const errorResponse = getErrorMessage(error, null);
      const msg = handleResponseMessage(errorResponse?.errorMessage || '');
      thunkAPI.dispatch(setMessageError(msg));
      return thunkAPI.rejectWithValue(error);
    }
  };

  // export const updateDataDefaultThunk = async (params: any, thunkAPI: any) => {
  //   const { data, navigate } = params;
  //   const formData = appendData(data);
  //   try {
  //     const response = await axiosFormData.put(ROUTES_API_DATADEFAULT.UPDATE_DATADEFAULT(), formData);
  //     if (response) {
  //       await thunkAPI.dispatch(getDataDefault());
  //       const msg = handleResponseMessage(response?.data?.message || 'Updated data default successfully!');
  //       thunkAPI.dispatch(setMessageSuccess(msg));
  //     }
  //     return response;
  //   } catch (error: any) {
  //     const errorResponse = getErrorMessage(error, navigate);
  //     const msg = handleResponseMessage(errorResponse?.errorMessage || '');
  //     thunkAPI.dispatch(setMessageError(msg));
  //     return thunkAPI.rejectWithValue(error);
  //   }
  // };