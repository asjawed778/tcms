import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';
import { AuthResponse, LoginFormValues } from '../../type';
export const authApi = createApi({
  reducerPath: 'authApi',
  
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/admin/register',
        method: 'POST',
        body: userData,
      }),
    }),

    loginUser: builder.mutation<AuthResponse, LoginFormValues>({
      query: (userData) => ({
        url: '/admin/login',
        method: 'POST',
        body: userData, 
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data)=> ({
        url: '/admin/send-password-reset-link',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/admin/reset-password/${data.token}`,
        method: 'POST',
        body: {newPassword: data.newPassword},
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: '/admin/update-password',
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useLogoutUserMutation,
} = authApi;