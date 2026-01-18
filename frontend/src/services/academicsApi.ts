import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";

export const academicsApi = createApi({
  reducerPath: "academicsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CLASS_LIST", "SECTION_LIST", "SUBJECT_LIST"],
  endpoints: (builder) => ({
    // Class............................................................
    getAllClass: builder.query<ApiResponse<ClassResponse>, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/admin/academics/class/all`,
        params: {
          ...(sessionId && { sessionId })
        },
        method: "GET",
      }),
      providesTags: ["CLASS_LIST"],
      keepUnusedDataFor: Infinity,
    }),
    createClass: builder.mutation({
      query: ({ payload }) => ({
        url: "/admin/academics/class",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CLASS_LIST"],
    }),
    updateclass: builder.mutation({
      query: ({ classId, payload }) => ({
        url: `/admin/academics/class/${classId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CLASS_LIST"],
    }),
    getClassDetails: builder.query({
      query: ({ classId }) => ({
        url: `/admin/academics/${classId}`,
        method: "GET",
      }),
    }),
    updateFeeStructure: builder.mutation({
      query: ({ classId, payload }) => ({
        url: `/admin/academics/class/${classId}/fee-structure`,
        method: "POST",
        body: payload,
      }),
    }),
    // Section.............................................................
    getAllSection: builder.query<ApiResponse<SectionResponseList>, { sessionId?: string; classId?: string; page?: number; limit?: number; search?: string; }>({
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
      }),
      providesTags: ["SECTION_LIST"],
    }),
    addSection: builder.mutation<ApiResponse<SectionResponse>, { payload: SectionRequest }>({
      query: ({ payload }) => ({
        url: `/admin/academics/section`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SECTION_LIST", "CLASS_LIST"],
    }),
    addBulkSection: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/academics/section/bulk`,
        method: "POST",
        body: payload,
      })
    }),
    updateSection: builder.mutation<ApiResponse<SectionResponse>, { sectionId: string; payload: SectionRequest }>({
      query: ({ sectionId, payload }) => ({
        url: `/admin/academics/section/${sectionId}`,
        method: "PUT",
        body: payload,
      })
    }),
    deleteSection: builder.mutation<ApiResponse<null>, { sectionId: string; }>({
      query: ({ sectionId }) => ({
        url: `/admin/academics/section/${sectionId}`,
        method: "DELETE",
      })
    }),
    // Subject.............................................................
    getAllSubject: builder.query<ApiResponse<SubjectResponseList>, { sessionId: string; classId?: string; search?: string; page?: number; limit?: number; }>({
      query: ({ sessionId, classId, page = 1, limit = 10, search = "" }) => ({
        url: `/admin/academics/subject/all`,
        params: {
          sessionId,
          page,
          limit,
          ...(classId && { classId }),
          ...(search && { search }),
        },
        method: "GET",
      })
    }),
    addSubject: builder.mutation<SubjectResponse, { payload: SubjectRequest, classId: string }>({
      query: ({ payload }) => ({
        url: `/admin/academics/subject`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CLASS_LIST"],
    }),
    addBulkSubject: builder.mutation({
      query: ({ payload, classId }) => ({
        url: `/admin/academics/class/${classId}/upsert-subjects`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CLASS_LIST"],
    }),
    updateSubject: builder.mutation<SubjectResponse, { subjectId: string; payload: SubjectRequest, classId: string }>({
      query: ({ subjectId, payload }) => ({
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
