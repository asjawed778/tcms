import { createApi } from "@reduxjs/toolkit/query/react";
import { FacultyApiResponse, FacultyFormData } from "../../type";
import { baseQueryWithReauth } from "./api";

export const facultyApi = createApi({
  reducerPath: "facultyApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllFaculty: builder.query<FacultyApiResponse, { page?: number, limit?: number }>({
      query: ({ page =1, limit = 10 }) => ({
        url: `/faculty/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    // getAllFaculty: builder.query<FacultyApiResponse, void>({
    //   query: () => ({
    //     url: `/faculty/all`,
    //     method: "GET",
    //   }),
    // }),
  
    addFaculty: builder.mutation<FacultyApiResponse, FacultyFormData>({
      query: (body) => ({
        url: "/faculty",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllFacultyQuery, useAddFacultyMutation
} = facultyApi;

