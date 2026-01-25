import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
import {
  EmployeeBasicDetailsRequest,
  EmployeeDetailsResponse,
  EmployeeDetailsResponseList,
  ProfessionalDetailsRequest,
  SalaryStructureRequest,
  UnAssignFacultyFormData,
  UnAssingFacultyApiResponse,
} from "@/types/employee";

export const facultyApi = createApi({
  reducerPath: "facultyApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllEmployee: builder.query<
      ApiResponse<EmployeeDetailsResponseList>,
      { page?: number; limit?: number; search?: string; status?: string }
    >({
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
    getEmployeeDetails: builder.query<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string }
    >({
      query: ({ employeeId }) => ({
        url: `/admin/employee/${employeeId}`,
        method: "GET",
      }),
    }),
    deleteEmployee: builder.mutation<
      ApiResponse<null>,
      { employeeId: string }
    >({
      query: ({ employeeId }) => ({
        url: `/admin/employee/${employeeId}/delete-draft`,
        method: "DELETE",
      }),
    }),
    getSalaryStructure: builder.query({
      query: ({ employeeId }) => ({
        url: `/admin/employee/${employeeId}/salary-structure`,
        method: "GET",
      }),
    }),
    addBasicDetails: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { payload: EmployeeBasicDetailsRequest }
    >({
      query: ({ payload }) => ({
        url: "/admin/employee/basic-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateBasicDetails: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string; payload: EmployeeBasicDetailsRequest }
    >({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/basic-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string; payload: AddressRequest }
    >({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateProfessionalDetails: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string; payload: ProfessionalDetailsRequest }
    >({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/professional-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateSalaryStructure: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string; payload: SalaryStructureRequest }
    >({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/salary-structure`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation<
      ApiResponse<EmployeeDetailsResponse>,
      { employeeId: string; payload: DocumentRequest }
    >({
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
  useDeleteEmployeeMutation,
  useGetSalaryStructureQuery,
  useAddBasicDetailsMutation,
  useUpdateBasicDetailsMutation,
  useUpdateAddressMutation,
  useUpdateProfessionalDetailsMutation,
  useUpdateSalaryStructureMutation,
  useUpdateDocumentsMutation,
  useUnAssignFacultyMutation,
} = facultyApi;
