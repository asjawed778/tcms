import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AddRemarkRequest,
  ApiResponse,
  RemarkResponse,
  StudentApiResponse,
} from "../../type";
import { baseQueryWithReauth } from "./api";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllStudent: builder.query<StudentApiResponse, { page?: number;        limit?: number; searchQuery?: string; active?: string; sessionId: string; }>({
      query: ({page = 1, limit = 10, searchQuery = "", active, sessionId, })  => ({
        url: `/admin/student/all`,
        params: {
          page,
          limit,
          ...(sessionId && { sessionId }),
          ...(searchQuery && { searchQuery }),
          ...(active && { active }),
        },
        method: "GET"
      }),
    }),
    addStudent: builder.mutation({
      query: (payload) => ({
        url: "/admin/student/add/step-1/personal-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/step-2/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateParentDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/step-3/parent-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAdmissionDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/step-4/admission-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/step-5/documents`,
        method: "PUT",
        body: payload,
      }),
    }),
    uploadBulkStudents: builder.mutation({
      query: (payload) => ({
        url: "/admin/student/bulk-upload",
        method: "POST",
        body: payload,
      }),
    }),
    useGetStudentDetails: builder.query({
      query: ({studentId}) => ({
        url: `/admin/student/details/${studentId}`,
        method: "GET",
      })
    }),
    addRemark: builder.mutation<
      ApiResponse<RemarkResponse>,
      { sessionId: string; studentId: string; body: AddRemarkRequest }
    >({
      query: ({ sessionId, studentId, body }) => ({
        url: `/admin/student/remark/${sessionId}/${studentId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllStudentQuery,
  useAddStudentMutation,
  useUpdateAdmissionDetailsMutation,
  useUpdateAddressMutation,
  useUpdateParentDetailsMutation,
  useUpdateDocumentsMutation,
  useUseGetStudentDetailsQuery,
  useAddRemarkMutation,
  useUploadBulkStudentsMutation,
} = studentApi;
