import { baseApi } from "./baseApi";


export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyReport: builder.query({
      query: ({ month, year }) => ({
        url: `/report`,
        params: { month, year },
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const { useGetMonthlyReportQuery } = reportApi;
