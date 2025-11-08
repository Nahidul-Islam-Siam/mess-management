import { baseApi } from "./baseApi";


export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ month, year }) => ({
        url: `/payments`,
        params: { month, year },
      }),
      providesTags: ["Payment"],
    }),

    addPayment: builder.mutation({
      query: (data) => ({
        url: `/payments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const { useGetPaymentsQuery, useAddPaymentMutation } = paymentApi;
