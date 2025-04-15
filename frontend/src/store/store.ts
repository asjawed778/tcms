import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi"; 
import sidebarReducer from "./reducers/sidebarReducer"; 
import { sessionApi } from "@/services/sessionApi";
import { facultyApi } from "@/services/facultyApi";
import { dropdownApi } from "@/services/dropdownApi";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer, 
    [sessionApi.reducerPath]: sessionApi.reducer,
    [facultyApi.reducerPath]: facultyApi.reducer,
    [dropdownApi.reducerPath]: dropdownApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, sessionApi.middleware, facultyApi.middleware, dropdownApi.middleware, ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();