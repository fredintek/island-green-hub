import apiSlice from ".";

export const cloudinaryApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // delete image
    deleteFileFromCloudinary: builder.mutation({
      query: (body) => ({
        url: `/cloudinary/remove-file`,
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const { useDeleteFileFromCloudinaryMutation } = cloudinaryApiSlice;
