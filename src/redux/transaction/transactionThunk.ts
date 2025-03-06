import { axiosClient } from "axiosClient/axiosClient";
import { ROUTES_API_DASHBOARD } from "constants/routesApiKeys";
import { setMessageError } from "redux/auth/authSlice";
import { getErrorMessage, handleResponseMessage } from "utils";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  transactionDate: string;
  recipientName: string;
}

export const getDashboardTransactionThunk = async (
  params: any,
  thunkAPI: any
) => {
  const { navigate, optionParams } = params;
  try {
    const response = await axiosClient.get(ROUTES_API_DASHBOARD.TRANSACTIONS, {
      params: optionParams,
    });

    // Map the response.data array to transactions
    const transactions: Transaction[] =
      response.data.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        description: item.description,
        transactionDate: item.transactionDate,
        recipientName: item.recipientName,
      })) || [];

    return transactions;
  } catch (error: any) {
    console.error("Transaction API Error:", error);
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(
      errorResponse?.errorMessage || "Lỗi khi lấy dữ liệu giao dịch!"
    );
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};
