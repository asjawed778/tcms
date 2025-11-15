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
    getAllStudent: builder.query({
      query: ({page = 1, limit = 10, searchQuery = "", sessionId, studentStatus })  => ({
        url: `/admin/student/all`,
        params: {
          page,
          limit,
          ...(sessionId && { sessionId }),
          ...(searchQuery && { searchQuery }),
          ...(studentStatus && { studentStatus }),
        },
        method: "GET"
      }),
    }),
    addStudentBasicDetails: builder.mutation({
      query: ({ payload }) => ({
        url: "/admin/student/add/personal-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateStudentBasicDetails: builder.mutation({
      query: ({ studentId, payload }) => ({
        url: `/admin/student/${studentId}/personal-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateParentDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/parent-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAdmissionDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/admission-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/admin/student/${studentId}/documents`,
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
    getStudentDetails: builder.query({
      query: ({ studentId }) => ({
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
  useAddStudentBasicDetailsMutation,
  useUpdateStudentBasicDetailsMutation,
  useUpdateAdmissionDetailsMutation,
  useUpdateAddressMutation,
  useUpdateParentDetailsMutation,
  useUpdateDocumentsMutation,
  useGetStudentDetailsQuery,
  useAddRemarkMutation,
  useUploadBulkStudentsMutation,
} = studentApi;
