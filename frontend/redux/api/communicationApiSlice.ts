import apiSlice from ".";

export const communicationApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get All Communication
    getAllCommunication: builder.query({
      query: () => "/communication",
    }),

    // Get Communication by ID
    getCommunicationById: builder.query({
      query: (id: number) => `/communication/${id}`,
    }),

    // Create a new Communication
    createCommunication: builder.mutation({
      query: (communication) => ({
        url: "/communication",
        method: "POST",
        body: communication,
      }),
    }),

    // Update a Communication
    updateCommunication: builder.mutation({
      query: (communication) => ({
        url: `/communication`,
        method: "PATCH",
        body: communication,
      }),
    }),

    // Delete a Communication
    deleteCommunication: builder.mutation({
      query: (id: number) => ({
        url: `/communication/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCommunicationMutation,
  useGetAllCommunicationQuery,
  useGetCommunicationByIdQuery,
  useUpdateCommunicationMutation,
  useDeleteCommunicationMutation,
} = communicationApiSlice;
