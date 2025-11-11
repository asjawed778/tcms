import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, query = '', active }) => {
        let url = `/admin/user/all?pageNo=${page}&limit=${limit}`;
        if (query.trim() !== '') {
          url += `&search=${encodeURIComponent(query.trim())}`;
        }
        if (typeof active === 'boolean') {
          url += `&active=${active}`;
        }
        return { url };
      },
    }),
    updateStatus: builder.mutation({
      query: ({userId}) =>({
        url: `/admin/user/${userId}`,
        method: "PATCH"
      })
    }),
    assignCourse: builder.mutation({
      query: ({courseId, userId}) =>({
        url: `/admin/user/assign-course`,
        body: {
          courseId,
          userId
        },
        method: "POST"
      }),
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: `/admin/create-user`,
        body: data,
        method: "POST"
      })
    }),
    updateUserDetails: builder.mutation({
      query: ({userId, updatedData}) => ({
        url: `/admin/user/${userId}`,
        body: updatedData,
        method: "PUT"
      }),
    }),

    // Role and Permission...................................
    getAllRoles: builder.query({
      query: ({ page=1, limit= 10, search=""}) => ({
        url: `/admin/role/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
      }),
    }),
    createRole: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/role`,
        method: "POST",
        body: payload,
      }),
    }),
    updateRolePermissions: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/role/${id}/permission`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteRole: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/role/${id}`,
        method: "DELETE",
      }),
    }),
    getRoleDetails: builder.query({
      query: ({ id }) => ({
        url: `/admin/role/${id}`,
        method: "GET",
      }),
    }),
  }),
});


export const { 
  useGetAllUsersQuery, 
  useUpdateStatusMutation,
  useAssignCourseMutation,
  useAddNewUserMutation,
  useUpdateUserDetailsMutation,
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRolePermissionsMutation,
  useDeleteRoleMutation,
  useGetRoleDetailsQuery,
} = userApi;