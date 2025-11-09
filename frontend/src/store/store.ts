import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

// reducers
import authSlice from "./reducers/authSlice";
import sessionSlice from "./reducers/sessionSlice"
import sidebarSlice from "./reducers/sidebarSlice";

// apis
import { authApi } from "@/services/authApi";
import { userApi } from "@/services/userApi";
import { sessionApi } from "@/services/sessionApi";
import { facultyApi } from "@/services/employeeApi";
import { commonApi } from "@/services/commonApi";
import { academicsApi } from "@/services/academics.Api";
import { studentApi } from "@/services/studentApi";

export const store = configureStore({
  reducer: {
    // slices
    auth: authSlice,
    sidebar: sidebarSlice,
    session: sessionSlice,

    // apis
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [facultyApi.reducerPath]: facultyApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [academicsApi.reducerPath]: academicsApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      sessionApi.middleware,
      facultyApi.middleware,
      commonApi.middleware,
      academicsApi.middleware,
      studentApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();