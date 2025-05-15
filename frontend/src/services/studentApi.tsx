import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, FacultyApiResponse, FacultyFormData, StudentFormData } from "../../type";
import { baseQueryWithReauth } from "./api";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllStudent: builder.query< FacultyApiResponse , { page?: number, limit?: number, query?: string, active?: string }>({
      query: ({ page = 1, limit = 10, query = "", active} = {}) => {
              let url = `/student/all?pageNo=${page}&limit=${limit}`;
              if (query.trim() !== '') {
                url += `&search=${encodeURIComponent(query.trim())}`;
              }
              if (typeof active === 'boolean') {
                url += `&active=${active}`; 
              }
              return { url };
            },
    }),
  
    addStudent: builder.mutation<ApiResponse, StudentFormData>({
      query: (body) => ({
        url: "/student/add",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllStudentQuery, useAddStudentMutation
} = studentApi;

