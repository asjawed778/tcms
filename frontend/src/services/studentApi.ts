import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AddRemarkFormData,
  ApiResponse,
  StudentApiResponse,
  StudentFormData,
} from "../../type";
import { baseQueryWithReauth } from "./api";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllStudent: builder.query<StudentApiResponse, { page?: number;        limit?: number; searchQuery?: string; active?: string; sessionId: string; }>({
      query: ({
        page = 1,
        limit = 10,
        searchQuery = "",
        active,
        sessionId,
      }) => {
        let url = `/student/all/${sessionId}?page=${page}&limit=${limit}`;
        if (searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }
        if (typeof active === "boolean") {
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
    uploadBulkStudents: builder.mutation({
      query: ({students}) => ({
        url: "/student/bulk-upload",
        method: "POST",
        body: students,
      }),
    }),
    addRemark: builder.mutation<
      ApiResponse,
      { sessionId: string; studentId: string; body: AddRemarkFormData }
    >({
      query: ({ sessionId, studentId, body }) => ({
        url: `/student/remark/${sessionId}/${studentId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllStudentQuery,
  useAddStudentMutation,
  useAddRemarkMutation,
  useUploadBulkStudentsMutation,
} = studentApi;
