// transactionThunk.ts
import { axiosClient } from "axiosClient/axiosClient";
import { ROUTES_API_DASHBOARD } from "constants/routesApiKeys";
import { setMessageError } from "redux/auth/authSlice";
import { getErrorMessage, handleResponseMessage } from "utils";
import { Transaction } from 'common/models';

export const getDashboardTransactionThunk = async (
  params: any,
  thunkAPI: any
) => {
  const { navigate, optionParams } = params;
  try {
    const pageSize = optionParams?.pageSize || 10;
    const maxPages = optionParams?.maxPages || 10; // Số trang tối đa để lấy
    const getAllPages = optionParams?.getAllPages || false;

    if (getAllPages) {
      let allTransactions: Transaction[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      let consecutiveEmptyPages = 0; // Đếm số trang trống liên tiếp

      // Lấy tuần tự từng trang cho đến khi không còn dữ liệu
      while (hasMorePages && currentPage <= maxPages) {
        const response = await axiosClient.get(
          ROUTES_API_DASHBOARD.TRANSACTIONS,
          {
            params: {
              ...optionParams,
              page: currentPage,
              pageSize: pageSize,
            },
          }
        );

        // Xử lý dữ liệu nhận được
        let pageData: any[] = [];
        if (Array.isArray(response.data)) {
          pageData = response.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "items" in response.data
        ) {
          pageData = response.data.items || [];
        }

        // Kiểm tra nếu trang trống
        if (pageData.length === 0) {
          consecutiveEmptyPages++;

          // Nếu đã gặp 2 trang trống liên tiếp, chắc chắn là đã hết dữ liệu
          if (consecutiveEmptyPages >= 2) {
            hasMorePages = false;
            break;
          }
        } else {
          // Reset bộ đếm trang trống nếu tìm thấy dữ liệu
          consecutiveEmptyPages = 0;

          // Xử lý dữ liệu
          const transactions: Transaction[] = pageData.map((item: any) => ({
            id: item.id,
            amount: item.amount,
            description: item.description,
            transactionDate: item.transactionDate,
            recipientName: item.recipientName,
            tags: item.tags,
            userId: item.userId || 0
          }));

          allTransactions = [...allTransactions, ...transactions];

          // Kiểm tra xem đã hết dữ liệu chưa
          if (pageData.length < pageSize) {
            hasMorePages = false;
          }
        }

        currentPage++;
      }

      return allTransactions;
    } else {
      // Lấy một trang duy nhất
      const page = optionParams?.page || 1;
      const response = await axiosClient.get(
        ROUTES_API_DASHBOARD.TRANSACTIONS,
        {
          params: {
            ...optionParams,
            page: page,
            pageSize: pageSize,
          },
        }
      );

      // Xử lý dữ liệu
      let responseData: any[] = [];
      if (Array.isArray(response.data)) {
        responseData = response.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "items" in response.data
      ) {
        responseData = response.data.items || [];
      }

      // Map dữ liệu
      const transactions: Transaction[] = responseData.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        description: item.description,
        transactionDate: item.transactionDate,
        recipientName: item.recipientName,
        tags: item.tags,
        userId: item.userId || 0
      }));

      return transactions;
    }
  } catch (error: any) {
    const errorResponse = getErrorMessage(error, navigate);
    const msg = handleResponseMessage(
      errorResponse?.errorMessage || "Lỗi khi lấy dữ liệu giao dịch!"
    );
    thunkAPI.dispatch(setMessageError(msg));
    return thunkAPI.rejectWithValue(error);
  }
};
