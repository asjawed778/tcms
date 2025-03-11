import { createSlice } from "@reduxjs/toolkit";

// Safe function to parse localStorage JSON
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : {}; // Ensures user is `null` if undefined
  } catch (error) {
    console.error("Corrupt user data in localStorage:", error);
    localStorage.removeItem("user"); // Remove bad data
    return null;
  }
};

// Define the initial state using that type
const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: getUserFromLocalStorage()
  // user: JSON.parse(localStorage.getItem("user")) || {},  //localstorage only stores string
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, actions) => {
      state.accessToken = actions.payload.accessToken;
      state.refreshToken = actions.payload.refreshToken;
      state.user = actions.payload.user;
      localStorage.setItem("accessToken", actions.payload.accessToken);
      localStorage.setItem("refreshToken", actions.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(actions.payload.user));
    },
    logout: (state, actions) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.clear()
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
