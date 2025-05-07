import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';
import { AuthResponse, LoginFormValues } from '../../type';
export const authApi = createApi({
  reducerPath: 'authApi',
  
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),

    loginUser: builder.mutation<AuthResponse, LoginFormValues>({
      query: (userData) => ({
        url: '/user/login',
        method: 'POST',
        body: userData, 
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data)=> ({
        url: '/user/send-password-reset-link',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/user/reset-password/${data.token}`,
        method: 'POST',
        body: {newPassword: data.newPassword},
      }),
    })
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;