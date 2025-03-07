import apiSlice from ".";

export const faqApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Create Faq
    createFaq: builder.mutation({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
    }),
    // Update Faq
    updateFaq: builder.mutation({
      query: (body) => ({
        url: `/faq`,
        method: "PATCH",
        body,
      }),
    }),
    // Delete Faq
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
    }),
    // Get Faq by ID
    getFaqById: builder.query({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "GET",
      }),
    }),
    // Get All Faq
    getAllFaqs: builder.query({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqByIdQuery,
  useGetAllFaqsQuery,
} = faqApiSlice;
