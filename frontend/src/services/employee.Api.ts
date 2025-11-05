import { createApi } from "@reduxjs/toolkit/query/react";
import { FacultyApiResponse, UnAssignFacultyFormData, UnAssingFacultyApiResponse } from "../../type";
import { baseQueryWithReauth } from "./api";

export const facultyApi = createApi({
  reducerPath: "facultyApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllEmployee: builder.query< FacultyApiResponse , { page?: number, limit?: number, query?: string, active?: string }>({
      query: ({ page = 1, limit = 10, query = "", active} = {}) => {
              let url = `/admin/employee/all?page=${page}&limit=${limit}`;
              if (query.trim() !== '') {
                url += `&search=${encodeURIComponent(query.trim())}`;
              }
              if (typeof active === 'boolean') {
                url += `&active=${active}`; 
              }
              return { url };
            },
    }),
    getEmployeeDetails: builder.query({
      query: ({ employeeId }) => ({
        url: `/admin/employeeId/${employeeId}`,
        method: "GET"
      }),
    }),
    getSalaryStructure: builder.query({
      query: ({ employeeId }) => ({
        url: `/admin/employeeId/${employeeId}/salary-structure`,
        method: "GET"
      }),
    }),
    addBasicDetails: builder.mutation({
      query: ({ payload }) => ({
        url: "/admin/employee/basic-details",
        method: "POST",
        body: payload,
      }),
    }),
    updateBasicDetails: builder.mutation({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/basic-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/address`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateProfessionalDetails: builder.mutation({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/professional-details`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateSalaryStructure: builder.mutation({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/salary-structure`,
        method: "PUT",
        body: payload,
      }),
    }),
    updateDocuments: builder.mutation({
      query: ({ employeeId, payload }) => ({
        url: `/admin/employee/${employeeId}/documents`,
        method: "PUT",
        body: payload,
      }),
    }),
      unAssignFaculty: builder.mutation<UnAssingFacultyApiResponse, UnAssignFacultyFormData>({
        query: ({sessionId, ...rest}) => ({
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

