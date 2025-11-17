import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
import { AddressRequest, ApiResponse, DocumentRequest } from "@/types";
import { AddRemarkRequest, AdmissionDetailsRequest, BasicDetailsRequest, ParentDetailsRequest, RemarkResponse, StudentDetailsResponse, StudentResponse, StudentResponseList } from "@/types/student";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllStudent: builder.query<ApiResponse<StudentResponseList>, {page?: number; limit?: number; search?: string; sessionId?: string; studentStatus?: string; classId?: string; sectionId?: string; gender?: string; admissionStatus?: string; bloodGroup?: string;}>({
      query: ({ page = 1, limit = 10, search = "", sessionId, studentStatus, classId, sectionId, gender, admissionStatus, bloodGroup}) => ({
        url: `/admin/student/all`,
        params: {
          page,
          limit,
          ...(sessionId && { sessionId }),
          ...(search && { search }),
          ...(classId && { classId }),
          ...(sectionId && { sectionId }),
          ...(gender && { gender }),
          ...(studentStatus && { studentStatus }),
          ...(admissionStatus && { admissionStatus }),
          ...(bloodGroup && { bloodGroup }),
        },
        method: "GET"
      }),
    }),
    addStudentBasicDetails: builder.mutation<ApiResponse<StudentResponse>, {payload: BasicDetailsRequest}>({
      query: ({ payload }) => ({
        url: "/admin/student/add/personal-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateStudentBasicDetails: builder.mutation<ApiResponse<StudentResponse>, {studentId: string; payload: BasicDetailsRequest}>({
      query: ({ studentId, payload }) => ({
        url: `/admin/student/${studentId}/personal-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation<ApiResponse<StudentResponse>, {studentId: string; payload: AddressRequest}>({
      query: ({ payload, studentId }) => ({
        url: `/admin/student/${studentId}/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateParentDetails: builder.mutation<ApiResponse<StudentResponse>, {studentId: string; payload: ParentDetailsRequest}>({
      query: ({ payload, studentId }) => ({
        url: `/admin/student/${studentId}/parent-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAdmissionDetails: builder.mutation<ApiResponse<StudentResponse>, {studentId: string; payload: AdmissionDetailsRequest}>({
      query: ({ payload, studentId }) => ({
        url: `/admin/student/${studentId}/admission-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation<ApiResponse<StudentResponse>, {studentId: string; payload: DocumentRequest}>({
      query: ({ payload, studentId }) => ({
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
    getStudentDetails: builder.query<ApiResponse<StudentDetailsResponse>, {studentId: string;}>({
      query: ({ studentId }) => ({
        url: `/admin/student/${studentId}/details`,
        method: "GET",
      })
    }),
    deleteStudent: builder.mutation<ApiResponse<null>, {studentId: string;}>({
      query: ({ studentId }) => ({
        url: `/admin/student/${studentId}/delete-draft`,
        method: "DELETE",
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
  useDeleteStudentMutation,
  useUploadBulkStudentsMutation,
} = studentApi;
