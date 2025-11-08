import { baseApi } from "./baseApi";


export const bazarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBazars: builder.query({
      query: ({ month, year }) => ({
        url: `/bazar`,
        params: { month, year },
      }),
      providesTags: ["Bazar"],
    }),

    addBazar: builder.mutation({
      query: (data) => ({
        url: `/bazar`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bazar"],
    }),
  }),
});

export const { useGetBazarsQuery, useAddBazarMutation } = bazarApi;

