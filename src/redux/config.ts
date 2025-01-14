import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './auth/authSlice';
export const moneymind = configureStore({
    reducer: {
      auth: authReducer,    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export type RootState = ReturnType<typeof moneymind.getState>;
  
  export const useAppDispatch: () => typeof moneymind.dispatch = useDispatch;
  export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  