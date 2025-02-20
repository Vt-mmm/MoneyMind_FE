import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./auth/authSlice";
import userReducer from "./userAccount/manageAccountSlice"
import dataDefaultReducer from "./dataDefault/dataDefaultSlice"

import tagReducer from "./tag/manageTagSlice"
import walletTypeReducer from "./wallettype/manageWalletTypeSlice";
export const moneymind = configureStore({
  reducer: {
    auth: authReducer,
    userAccount: userReducer,
    dataDefault: dataDefaultReducer,
    tag: tagReducer,
    wallet: walletTypeReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof moneymind.getState>;

export const useAppDispatch: () => typeof moneymind.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
