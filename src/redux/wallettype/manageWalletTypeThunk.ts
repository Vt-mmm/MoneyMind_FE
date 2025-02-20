import { axiosClient } from "axiosClient/axiosClient";
import { ROUTES_API_WALLET_TYPES } from "constants/routesApiKeys";
import { setMessageError, setMessageSuccess } from "redux/auth/authSlice";
import { getErrorMessage, handleResponseMessage } from "utils";

// 1) Lấy danh sách wallet types
export const getAllWalletTypesThunk = async (params: any, thunkAPI: any) => {
    const { navigate, optionParams } = params;
    try {
        const response = await axiosClient.get(
            ROUTES_API_WALLET_TYPES.GET_ALL_WALLET_TYPES(optionParams)
        );
        return response.data;
    } catch (error: any) {
        const errorResponse = getErrorMessage(error, navigate);
        const msg = handleResponseMessage(errorResponse?.errorMessage || "");
        thunkAPI.dispatch(setMessageError(msg));
        return thunkAPI.rejectWithValue(error);
    }



};
