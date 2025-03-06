import { axiosClient } from 'axiosClient/axiosClient';
import { ROUTES_API_DASHBOARD } from 'constants/routesApiKeys';
import { setMessageError } from 'redux/auth/authSlice';
import { getErrorMessage, handleResponseMessage } from 'utils';

// ✅ Hàm lấy tổng số user
export const getDashboardUserThunk = async (params: any, thunkAPI: any) => {
  const { navigate } = params;
  try {
    const response = await axiosClient.get(ROUTES_API_DASHBOARD.USERS);
    return response.data;
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || "Lỗi khi lấy dữ liệu người dùng!");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};
