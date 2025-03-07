import apiSlice from ".";

export const sectionApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Section by page ID
    getSectionByPageId: builder.query({
      query: (id) => `/section/page/${id}`,
    }),

    // Get Section By Page Name
    getSectionByPageName: builder.query({
      query: (slug) => `/section/page/name/${slug}`,
    }),

    // Get Section By Page Name
    getSectionByType: builder.query({
      query: (type) => `/section/type/${type}`,
    }),

    // Update Section
    updateSection: builder.mutation({
      query: (body) => ({
        url: `/section`,
        method: "PATCH",
        body,
      }),
    }),
    // Create Section
    createSection: builder.mutation({
      query: (body) => ({
        url: "/section",
        method: "POST",
        body,
      }),
    }),

    // Get Single Section
    getSection: builder.query({
      query: (id) => `/section/${id}`,
    }),

    // Remove Link From Section Content
    removeLinkFromSectionContent: builder.mutation({
      query: (body) => ({
        url: "/section/remove-link",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetSectionByPageIdQuery,
  useLazyGetSectionByPageIdQuery,
  useUpdateSectionMutation,
  useCreateSectionMutation,
  useGetSectionQuery,
  useRemoveLinkFromSectionContentMutation,
  useGetSectionByPageNameQuery,
  useGetSectionByTypeQuery,
} = sectionApiSlice;
