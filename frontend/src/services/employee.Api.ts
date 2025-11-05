import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  EmployeeAddress,
  EmployeeBasicDetailsRequest,
  EmployeeDocuments,
  EmployeeResponse,
  EmployeeResponseList,
  ProfessionalDetailsRequest,
  SalaryStructureRequest,
  UnAssignFacultyFormData,
  UnAssingFacultyApiResponse,
} from "../../type";
import { baseQueryWithReauth } from "./api";

export const facultyApi = createApi({
  reducerPath: "facultyApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllEmployee: builder.query<ApiResponse<EmployeeResponseList>, {page?: number; limit?: number; search?: string, status?: string}>({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
        url: `/admin/employee/all`,
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(search && { search }),
        },
        method: "GET",
      }),
    }),
    getEmployeeDetails: builder.query<ApiResponse<EmployeeResponse>, {employeeId: string}>({
      query: ({ employeeId }) => ({
        url: `/admin/employeeId/${employeeId}`,
        method: "GET",
      }),
    }),
    getSalaryStructure: builder.query({
      query: ({ employeeId }) => ({
        url: `/admin/employeeId/${employeeId}/salary-structure`,
        method: "GET",
      }),
    }),
    addBasicDetails: builder.mutation<ApiResponse<EmployeeResponse>, {payload: EmployeeBasicDetailsRequest}>({
      query: ({ payload }) => ({
        url: "/admin/employee/basic-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateBasicDetails: builder.mutation<ApiResponse<EmployeeResponse>, {employeeId: string; payload: EmployeeBasicDetailsRequest}>({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/basic-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation<ApiResponse<EmployeeResponse>, {employeeId: string; payload: EmployeeAddress}>({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateProfessionalDetails: builder.mutation<ApiResponse<EmployeeResponse>, {employeeId: string; payload: ProfessionalDetailsRequest}>({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/professional-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateSalaryStructure: builder.mutation<ApiResponse<EmployeeResponse>, {employeeId: string; payload: SalaryStructureRequest}>({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/salary-structure`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation<ApiResponse<EmployeeResponse>, {employeeId: string; payload: EmployeeDocuments}>({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/documents`,
        method: "PUT",
        body: payload,
      }),
    }),
    unAssignFaculty: builder.mutation<
      UnAssingFacultyApiResponse,
      UnAssignFacultyFormData
    >({
      query: ({ sessionId, ...rest }) => ({
        url: `/admin/faculty/unassigned/${sessionId}`,
        method: "POST",
        body: rest,
      }),
    }),
  }),
});

export const {
  useGetAllEmployeeQuery,
  useGetEmployeeDetailsQuery,
  useGetSalaryStructureQuery,
  useAddBasicDetailsMutation,
  useUpdateBasicDetailsMutation,
  useUpdateAddressMutation,
  useUpdateProfessionalDetailsMutation,
  useUpdateSalaryStructureMutation,
  useUpdateDocumentsMutation,
  useUnAssignFacultyMutation,
} = facultyApi;
