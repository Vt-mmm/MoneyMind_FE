// ví dụ file: src/redux/user/userThunk.ts
import { axiosClient } from "axiosClient/axiosClient";
import { ROUTES_API_USERS } from "constants/routesApiKeys";

// Import các hàm setMessageSuccess, setMessageError nếu bạn muốn hiển thị thông báo
import { setMessageError, setMessageSuccess } from "redux/auth/authSlice";

import { getErrorMessage, handleResponseMessage } from "utils";
import { getAllUsers } from "./manageAccountSlice";

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
    const msg = handleResponseMessage(errorResponse?.errorMessage || "");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};

// 4) Cập nhật user
export const updateUserThunk = async (params: any, thunkAPI: any) => {
  const { data, accountId, optionParams, navigate } = params;

  try {
    // Gửi dữ liệu JSON trực tiếp, không cần chuyển sang FormData
    const response = await axiosClient.put(
      ROUTES_API_USERS.UPDATE_USER(accountId),
      data
    );

    if (response) {
      await thunkAPI.dispatch(
        getAllUsers({
          optionParams: optionParams || {
            itemsPerPage: 10,
            currentPage: 1,
            searchValue: "",
            sortBy: "",
          },
          navigate,
        })
      );
      const msg = handleResponseMessage(
        response?.data?.message || "Updated user successfully!"
      );
      thunkAPI.dispatch(setMessageSuccess(msg));
    }
    return response;
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || "");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};

// 5) Xoá user
export const deleteUserThunk = async (params: any, thunkAPI: any) => {
  const { accountId, optionParams, navigate } = params;
  try {
    const response = await axiosClient.delete(
      ROUTES_API_USERS.DELETE_USER(accountId)
    );

    // Thay vì response?.message:
    if (response) {
      await thunkAPI.dispatch(getAllUsers({ optionParams, navigate }));
      const msg = handleResponseMessage(
        response?.data?.message || "Deleted user successfully!"
      );
      thunkAPI.dispatch(setMessageSuccess(msg));
    }
    return response;
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(errorResponse?.errorMessage || "");
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};
