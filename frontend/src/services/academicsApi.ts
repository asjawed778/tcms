import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
import { ApiResponse, SectionRequest, SectionResponse, SectionResponseList, SubjectRequest, SubjectResponse, SubjectResponseList } from "../../type";

export const academicsApi = createApi({
  reducerPath: "academicsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Class............................................................
    getAllClass: builder.query({
      query: ({ sessionId }) => ({
        url : `/admin/academics/class/all`,
        params: {
          ...( sessionId && { sessionId })
        },
        method: "GET", 
      }),
    }),
    createClass: builder.mutation({
      query: ({ payload }) => ({
        url: "/admin/academics/class",
        method: "POST",
        body: payload,
      }),
    }),
    updateclass: builder.mutation({
      query: ({classId, payload}) => ({
        url: `/admin/academics/class/${classId}`,
        method: "PUT",
        body: payload,
      }),
    }),
    getClassDetails: builder.query({
      query: ({classId}) => ({
        url: `/admin/academics/${classId}`,
        method: "GET",
      }),
    }),
    createFeeStructure: builder.mutation({
      query: ({classId, payload}) => ({
        url: `/admin/academics/class/${classId}/fee-structure`,
        method: "POST",
        body: payload,
      }),
    }),
    updateFeeStructure: builder.mutation({
      query: ({classId, payload}) => ({
        url: `/admin/academics/class/${classId}/fee-structure`,
        method: "PUT",
        body: payload,
      }),
    }),
    // Section.............................................................
    getAllSection: builder.query<ApiResponse<SectionResponseList>, {sessionId?: string; classId?: string; page?: number; limit?: number; search?: string;}>({
      query: ({ sessionId, classId, page = 1, limit = 10, search = "" }) => ({
        url: `/admin/academics/section/all`,
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(sessionId && { sessionId }),
          ...(classId && { classId })
        },
        method: "GET",
      })
    }),
    addSection: builder.mutation<ApiResponse<SectionResponse>, {payload: SectionRequest}>({
      query: ({payload}) => ({
        url: `/admin/academics/section`,
        method: "POST",
        body: payload,
      })
    }),
    addBulkSection: builder.mutation({
      query: ({payload}) => ({
        url: `/admin/academics/section/bulk`,
        method: "POST",
        body: payload,
      })
    }),
    updateSection: builder.mutation<ApiResponse<SectionResponse>, {sectionId: string; payload: SectionRequest}>({
      query: ({sectionId, payload}) => ({
        url: `/admin/academics/section/${sectionId}`,
        method: "PUT",
        body: payload,
      })
    }),
    deleteSection: builder.mutation<ApiResponse<null>, {sectionId: string;}>({
      query: ({ sectionId }) => ({
        url: `/admin/academics/section/${sectionId}`,
        method: "DELETE",
      })
    }),
    // Subject.............................................................
    getAllSubject: builder.query<ApiResponse<SubjectResponseList>, { sessionId: string; classId?: string; search?: string; page?: number; limit?: number; }>({
      query: ({ sessionId, classId, page = 1, limit = 10, search = ""}) => ({
        url: `/admin/academics/subject/all`,
        params: {
          sessionId,
          page,
          limit,
          ...(classId && { classId}),
          ...( search && { search}),
        },
        method: "GET",
      })
    }),
    addSubject: builder.mutation<SubjectResponse, {payload: SubjectRequest}>({
      query: ({payload}) => ({
        url: `/admin/academics/subject`,
        method: "POST",
        body: payload,
      })
    }),
    addBulkSubject: builder.mutation({
      query: ({payload}) => ({
        url: `/admin/academics/subject/bulk`,
        method: "POST",
        body: payload,
      })
    }),
    updateSubject: builder.mutation<SubjectResponse, {subjectId: string; payload: SubjectRequest}>({
      query: ({subjectId, payload}) => ({
        url: `/admin/academics/subject/${subjectId}`,
        method: "PUT",
        body: payload,
      })
    }),
    deleteSubject: builder.mutation({
      query: ({ subjectId }) => ({
        url: `/admin/academics/subject/${subjectId}`,
        method: "DELETE",
      })
    }),
    // Time Table ......................................................
    createTimeTable: builder.mutation({
      query: ({ sessionId, classId, sectionId, ...data }) => ({
        url: `/admin/academics/timetable/${sessionId}/${classId}/${sectionId}`,
        method: "POST",
        body: data,
      }),
    }),
    getTimeTable: builder.query({
      query: ({ sessionId, classId, sectionId }) => {
        let url = `/admin/academics/timetable/${sessionId}`;
        if (classId) url += `/${classId}`;
        if (sectionId) url += `/${sectionId}`;
        return {
          url,
          method: "GET",
        };
      },
    }),
    assignClassTeacher: builder.mutation({
      query: ({ sessionId, ...body }) => ({
        url: `/admin/academics/assign-faculty/${sessionId}`,
        method: "PATCH",
        body,
      }),
    }),
    removeClassTeacher: builder.mutation({
      query: ({ sessionId }) => ({
        url: `/admin/academics/remove-faculty/${sessionId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetAllClassQuery,
  useCreateClassMutation,
  useUpdateclassMutation,
  useGetClassDetailsQuery,
  useCreateFeeStructureMutation,
  useUpdateFeeStructureMutation,
  useCreateTimeTableMutation,
  useGetTimeTableQuery,
  useAssignClassTeacherMutation,
  useRemoveClassTeacherMutation,
  useGetAllSectionQuery,
  useAddSectionMutation,
  useAddBulkSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useAddBulkSubjectMutation,
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useGetAllSubjectQuery,
  useUpdateSubjectMutation,
} = academicsApi;
