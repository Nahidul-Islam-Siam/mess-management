import { baseApi } from "./baseApi";


export const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query({
      query: ({ month, year }) => ({
        url: `/meals`,
        params: { month, year },
      }),
      providesTags: ["Meals"],
    }),

    addMeal: builder.mutation({
      query: (data) => ({
        url: `/meals`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Meals"],
    }),
  }),
});

export const { useGetMealsQuery, useAddMealMutation } = mealApi;
