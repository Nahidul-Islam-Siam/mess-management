import { baseApi } from "./baseApi";

export interface Member {
  _id: string;
  name: string;
  phone?: string;
  active: boolean;
  khalakhaFee: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddMemberRequest {
  name: string;
  phone?: string;
  khalakhaFee?: number;
  active?: boolean;
}

export interface UpdateMemberRequest {
  id: string;
  name?: string;
  phone?: string;
  khalakhaFee?: number;
  active?: boolean;
}

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<Member[], void>({
      query: () => ({
        url: `/members`,
      }),
      providesTags: ["Member"],
    }),

    addMember: builder.mutation<{ success: boolean; data: Member; message?: string }, AddMemberRequest>({
      query: (data) => ({
        url: `/members`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Member"],
    }),

    updateMember: builder.mutation<{ success: boolean; data: Member; message?: string }, UpdateMemberRequest>({
      query: ({ id, ...data }) => ({
        url: `/members/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Member"],
    }),

    deleteMember: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Member"],
    }),
  }),
});

export const { 
  useGetMembersQuery, 
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation 
} = memberApi;

