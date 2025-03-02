import { axiosClient } from "axiosClient/axiosClient";
import { ROUTES_API_TAGS } from "constants/routesApiKeys";
import { setMessageError, setMessageSuccess } from "redux/auth/authSlice";
import { getErrorMessage, handleResponseMessage } from "utils";
import { getAllTags } from "./manageTagSlice";

// 1) Lấy danh sách tags
export const getAllTagsThunk = async (params: any, thunkAPI: any) => {
    const { navigate, optionParams } = params;
    try {
        const response = await axiosClient.get(
            ROUTES_API_TAGS.GET_ALL_TAGS(optionParams)
        );
        return response.data;
    } catch (error: any) {
        const errorResponse = getErrorMessage(error, navigate);
        const msg = handleResponseMessage(errorResponse?.errorMessage || "");
        thunkAPI.dispatch(setMessageError(msg));
        return thunkAPI.rejectWithValue(error);
    }

};
