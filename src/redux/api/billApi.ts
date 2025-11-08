import { baseApi } from "./baseApi";


export const billApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBill: builder.query({
      query: ({ month, year }) => ({
        url: `/bills`,
        params: { month, year },
      }),
      providesTags: ["Bill"],
    }),

    setBill: builder.mutation({
      query: (data) => ({
        url: `/bills`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bill"],
    }),
  }),
});

export const { useGetBillQuery, useSetBillMutation } = billApi;
