import { createApi } from "@reduxjs/toolkit/query/react";
import { FacultyApiResponse, FacultyFormData } from "../../type";
import { baseQueryWithReauth } from "./api";

export const facultyApi = createApi({
  reducerPath: "facultyApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({

    getAllFaculty: builder.query< FacultyApiResponse , { page?: number, limit?: number, query?: string }>({
      query: ({ page = 1, limit = 10, query = "" } = {}) => {
              let url = `/faculty/all?pageNo=${page}&limit=${limit}`;
              if (query.trim() !== '') {
                url += `&search=${encodeURIComponent(query.trim())}`;
              }
              // if (typeof active === 'boolean') {
              //   url += `&active=${active}`;
              // }
              return { url };
            },
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

