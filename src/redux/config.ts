import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./auth/authSlice";
import userReducer from "./userAccount/manageAccountSlice"
import dataDefaultReducer from "./dataDefault/dataDefaultSlice"
import dashboardReducer from "./dashboard/dashboardSlice"
import tagReducer from "./tag/manageTagSlice"
import walletTypeReducer from "./wallettype/manageWalletTypeSlice";
import transactionReducer from "./transaction/transactionSlice";
import reportReducer from "./report/reportSlice";
export const moneymind = configureStore({
  reducer: {
    auth: authReducer,
    userAccount: userReducer,
    dataDefault: dataDefaultReducer,
    tag: tagReducer,
    wallet: walletTypeReducer,
    dashboard: dashboardReducer,
    transaction: transactionReducer,
    report: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof moneymind.getState>;

export const useAppDispatch: () => typeof moneymind.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
