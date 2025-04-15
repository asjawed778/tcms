import { createApi } from "@reduxjs/toolkit/query/react";
import { Session, SessionApiResponse, SessionFormValues } from "../../type";
import { baseQueryWithReauth } from "./api";

export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: baseQueryWithReauth, 
  tagTypes: ["Session"],
  endpoints: (builder) => ({

    getSessions: builder.query<SessionApiResponse, void>({
      query: () => ({
        url: "/session",
        method: "GET",
      }),
      providesTags: ["Session"],
    }),

    createSession: builder.mutation<SessionApiResponse, SessionFormValues>({
      query: (body) => ({
        url: "/session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session"],
    }),

    updateSession: builder.mutation<Session, Session>({
      query: ({ _id, ...body }) => ({
        url: `/session/${_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
} = sessionApi;

