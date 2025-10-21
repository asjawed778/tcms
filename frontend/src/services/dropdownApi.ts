import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";

export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDropdownOptions: builder.query<any[], string | void>({
      query: (search = "") => ({
        url: `/admin/dropdown-options`,  
        params: { search },        
      }),
    }),
  }),
});

export const { useLazyGetDropdownOptionsQuery } = dropdownApi;
