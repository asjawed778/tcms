import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';

export const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ data: {url: string} }, FormData>({
      query: (formData) => ({
        url: '/common/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } =  commonApi;