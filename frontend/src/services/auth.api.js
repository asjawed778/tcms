import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "./api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: publicBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "user/login",
        method: "POST",
        body: data,
      }),
    }),
  
  }),
});

export const { useLoginMutation } = authApi;