import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from "@reduxjs/toolkit/query";
  import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
  import { RootState } from "../store/store";
  import { logout, resetTokens, setTokens } from "../store/reducers/authReducer";
  
  const baseURL = import.meta.env.VITE_API_URL;
  
    interface RefreshTokenResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
  
  const refreshTokenBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        headers.set("Authorization", `Bearer ${refreshToken}`);
      }
      return headers;
    },
    credentials: "include",
  });
  
  // Public base query (no auth)
  export const publicBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
  });
  
  // Main base query (with access token)
  export const baseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
    credentials: 'include', 
  });
  
  // Auth wrapper with automatic token refreshing
  export const baseQueryWithReauth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
  ) => {
    let result = await baseQuery(args, api, extraOptions);
  
    if (result.error && result.error?.status === 401) {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;
  
      if (refreshToken) {
        try {
          const refreshResult = await refreshTokenBaseQuery(
            {
              url: "/users/update-access-token",
              method: "POST",
            },
            api,
            extraOptions
          );
  
          if (refreshResult.data) {
            const { accessToken, refreshToken } = refreshResult.data as RefreshTokenResponse;
  
            api.dispatch(setTokens({ accessToken, refreshToken }));
  
            // Retry original query with new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed
            api.dispatch(resetTokens());
            api.dispatch(logout());
          }
        } catch (error) {
          api.dispatch(resetTokens());
          api.dispatch(logout());
        }
      } else {
        // No refresh token
        api.dispatch(resetTokens());
        api.dispatch(logout());
      }
    }
    return result;
  };
  



