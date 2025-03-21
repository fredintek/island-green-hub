import { apiSlice } from "./apiSlice";

const pageApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get page by slug
    getPageBySlug: builder.query({
      query: (slug: string) => `/page/name/${slug}`,
    }),

    // get section by it's type and parent page ID
    getSectionByType: builder.query({
      query: (params: { sectionType: string; parentPageId?: string }) =>
        params?.parentPageId
          ? `/section/type/${params?.sectionType}/?pageId=${params?.parentPageId}`
          : `/section/type/${params?.sectionType}`,
    }),

    // get all faq
    getAllFaq: builder.query({
      query: () => `/faq`,
    }),

    // get all communication
    getAllCommunication: builder.query({
      query: () => `/communication`,
    }),
  }),
});

export const {
  useGetPageBySlugQuery,
  useGetSectionByTypeQuery,
  useGetAllFaqQuery,
  useGetAllCommunicationQuery,
} = pageApiSlice;
