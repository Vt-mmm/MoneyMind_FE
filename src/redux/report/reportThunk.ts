import { axiosClient } from 'axiosClient/axiosClient';
import { ROUTES_API_DASHBOARD } from 'constants/routesApiKeys';
import { setMessageError } from 'redux/auth/authSlice';
import { getErrorMessage, handleResponseMessage } from 'utils';

export const getReportsThunk = async (params: any, thunkAPI: any) => {
  const { navigate } = params;
  try {
    const response = await axiosClient.get(`${ROUTES_API_DASHBOARD.REPORTS}`);
    return response; // Đảm bảo response.data có cấu trúc { totalUsers, totalTransactions, expensesByCategory }
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || "Lỗi khi lấy dữ liệu báo cáo!");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};
