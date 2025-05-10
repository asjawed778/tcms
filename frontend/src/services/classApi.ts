import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, ClassApiResponse, ClassFormData,  } from "../../type";
import { baseQueryWithReauth } from "./api";

export const classApi = createApi({
  reducerPath: "classApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllClass: builder.query< ClassApiResponse , { page?: number, limit?: number, query?: string, active?: string, sessionId: string }>({
      query: ({  sessionId}) => {
              // let url = `/class/all/${sessionId}?pageNo=${page}&limit=${limit}`;
              console.log("send session: ", sessionId);
              let url = `/class/all/${sessionId}`;
              // if (query.trim() !== '') {
              //   url += `&search=${encodeURIComponent(query.trim())}`;
              // }
              // if (typeof active === 'boolean') {
              //   url += `&active=${active}`; 
              // }
              return { url };
            },
    }),
  
    createClass: builder.mutation<ApiResponse, ClassFormData>({
      query: (data) => ({
        url: "/class",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllClassQuery, useCreateClassMutation
} = classApi;

