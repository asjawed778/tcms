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
    addStudent: builder.mutation({
      query: (payload) => ({
        url: "/student/add/step-1/personal-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/student/${studentId}/step-2/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateParentDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/student/${studentId}/step-3/parent-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAdmissionDetails: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/student/${studentId}/step-4/admission-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation({
      query: ({payload, studentId}) => ({
        url: `/student/${studentId}/step-5/documents`,
        method: "PUT",
        body: payload,
      }),
    }),
    uploadBulkStudents: builder.mutation({
      query: (payload) => ({
        url: "/student/bulk-upload",
        method: "POST",
        body: payload,
      }),
    }),
    useGetStudentDetails: builder.query({
      query: ({studentId}) => ({
        url: `/student/details/${studentId}`,
        method: "GET",
      })
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
  useUpdateAdmissionDetailsMutation,
  useUpdateAddressMutation,
  useUpdateParentDetailsMutation,
  useUpdateDocumentsMutation,
  useUseGetStudentDetailsQuery,
  useAddRemarkMutation,
  useUploadBulkStudentsMutation,
} = studentApi;
