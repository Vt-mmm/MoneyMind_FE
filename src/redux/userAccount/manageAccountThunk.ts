// ví dụ file: src/redux/user/userThunk.ts
import { axiosClient, axiosFormData } from 'axiosClient/axiosClient';
import { ROUTES_API_USERS } from 'constants/routesApiKeys';

// Import các hàm setMessageSuccess, setMessageError nếu bạn muốn hiển thị thông báo
import { setMessageError, setMessageSuccess } from 'redux/auth/authSlice';

// Model UserInfo
import { UserInfo } from 'common/models'; // tuỳ vị trí file model
import { getErrorMessage, handleResponseMessage, appendData } from 'utils'; 
import { getAllUsers } from './manageAccountSlice'; 
// (Chú ý: lát nữa ở userSlice sẽ export ra getAllUsers, 
//  nên tạm thời có thể để “// @ts-ignore” nếu TS báo lỗi import chéo, 
//  hoặc thứ tự tạo file “thunk” trước “slice”)

// 1) Lấy toàn bộ danh sách User
// 1) Lấy toàn bộ danh sách User
export const getAllUsersThunk = async (params: any, thunkAPI: any) => {
    const { navigate, optionParams } = params;
    try {
      // Gọi API GET
      const response = await axiosClient.get(
        ROUTES_API_USERS.GET_ALL_USERS(optionParams)
      );
  
      // Chìa khoá: trả về "response.data" để slice nhận được dữ liệu "thật"
      // Thay vì return response
      return response.data;
  
    } catch (error: any) {
      const errorResponse = getErrorMessage(error, navigate);
      const msg = handleResponseMessage(errorResponse?.errorMessage || '');
      thunkAPI.dispatch(setMessageError(msg));
      return thunkAPI.rejectWithValue(error);
    }
  };

// 2) Lấy chi tiết 1 user
export const getUserDetailThunk = async (params: any, thunkAPI: any) => {
  const { accountId, navigate } = params;
  try {
    const response = await axiosClient.get(
      ROUTES_API_USERS.GET_USER_DETAIL(accountId)
    );
    return response; // chính là { accountId, email, roleName, status, isConfirmed }
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    if (errorResponse?.statusCode === 404) {
      // Ví dụ: user không tồn tại => chuyển về danh sách
      // navigate('/users');
    }
    const msg = handleResponseMessage(errorResponse?.errorMessage || '');
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};

// 3) Tạo user mới
export const createNewUserThunk = async (params: any, thunkAPI: any) => {
  const { data, optionParams, navigate } = params;
  const formData = appendData(data);

  try {
    const response = await axiosFormData.post(ROUTES_API_USERS.CREATE_USER, formData);

    // Thay vì response?.message:
    // => Lấy từ response.data.message
    if (response) {
      await thunkAPI.dispatch(getAllUsers({ optionParams, navigate }));
      const msg = handleResponseMessage(response?.data?.message || 'Created user successfully!');
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

// 4) Cập nhật user
export const updateUserThunk = async (params: any, thunkAPI: any) => {
  const { data, accountId, optionParams, navigate } = params;
  const formData = appendData(data);

  try {
    const response = await axiosFormData.put(ROUTES_API_USERS.UPDATE_USER(accountId), formData);

    // Thay vì response?.message:
    if (response) {
      await thunkAPI.dispatch(getAllUsers({ optionParams, navigate }));
      const msg = handleResponseMessage(response?.data?.message || 'Updated user successfully!');
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

// 5) Xoá user
export const deleteUserThunk = async (params: any, thunkAPI: any) => {
  const { accountId, optionParams, navigate } = params;
  try {
    const response = await axiosClient.delete(ROUTES_API_USERS.DELETE_USER(accountId));

    // Thay vì response?.message:
    if (response) {
      await thunkAPI.dispatch(getAllUsers({ optionParams, navigate }));
      const msg = handleResponseMessage(response?.data?.message || 'Deleted user successfully!');
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

