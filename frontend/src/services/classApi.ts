import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, ClassApiResponse, ClassFormData, TimeTableApiResponse, TimeTableFormData,  } from "../../type";
import { baseQueryWithReauth } from "./api";

export const classApi = createApi({
  reducerPath: "classApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllClass: builder.query< ClassApiResponse , { page?: number, limit?: number, query?: string, active?: string, sessionId: string }>({
      query: ({  sessionId}) => {
              // let url = `/class/all/${sessionId}?pageNo=${page}&limit=${limit}`;
              
              let url = `/class/all/${sessionId}`;
              // if (query.trim() !== '') {
              //   url += `&search=${encodeURIComponent(query.trim())}`;
              // }
              // if (typeof active === 'boolean') {
              //   url += `&active=${active}`; 
              // }
              return { url };
            },
    }),
    getClass: builder.query({
      query:(classId) => ({
        url: `/class/${classId}`,
        method: "GET"
      })
    }),
    createClass: builder.mutation<ApiResponse, ClassFormData>({
      query: (data) => ({
        url: "/class",
        method: "POST",
        body: data,
      }),
    }),
    createTimeTable: builder.mutation<ApiResponse, TimeTableFormData>({
      query:({sessionId, classId, sectionId, ...data}) => ({
        url: `/class/timetable/${sessionId}/${classId}/${sectionId}`,
        method: "POST",
        body: data
      })
    }),
    getTimeTable: builder.query<TimeTableApiResponse, {sessionId: string, classId: string, sectionId: string}>({
      query:({sessionId, classId, sectionId}) => ({
        url: `/class/timetable/${sessionId}/${classId}/${sectionId}`,
        method: "GET"
      })
    }),
    assignClassTeacher: builder.mutation<ApiResponse, {sessionId: string, classId: string, sectionId: string, facultyId: string}>({
      query:({sessionId, ...body}) => ({
        url: `/class/assign-faculty/${sessionId}`,
        method: "PATCH",
        body
      })
    }), 
  }),
});

export const {
  useGetAllClassQuery, 
  useCreateClassMutation, 
  useCreateTimeTableMutation,
  useGetTimeTableQuery,
  useGetClassQuery, 
  useAssignClassTeacherMutation,
} = classApi;

