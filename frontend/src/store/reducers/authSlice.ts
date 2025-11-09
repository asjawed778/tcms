import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Permission, User } from "../../../type";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  permissions: Permission[];
}

const storedUser = localStorage.getItem("user");
const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  user: initialUser,
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true" || false,
  loading: false,
  permissions: initialUser?.role?.permissions || [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("isAuthenticated", "true");
    },
    login: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.permissions = user.role?.permissions || [];

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isAuthenticated", "true");
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
      state.permissions = [];

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
    },
    resetTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.setItem("isAuthenticated", "false");
    },
  },
});

export const { setLoading, setTokens, resetTokens, login, logout } = authSlice.actions;
export default authSlice.reducer;
