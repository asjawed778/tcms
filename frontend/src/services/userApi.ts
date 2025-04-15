import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (data) => ({
        url: '/user/update-password',
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useUpdatePasswordMutation, 
  useLogoutUserMutation 
} = userApi;