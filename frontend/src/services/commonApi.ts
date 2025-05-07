import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';

export const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ data: {url: string} }, FormData>({
      query: (formData) => ({
        url: '/common/image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } =  commonApi;