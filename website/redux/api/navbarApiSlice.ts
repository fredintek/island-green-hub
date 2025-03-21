import { apiSlice } from "./apiSlice";

const navbarApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPages: builder.query({
      query: (query: { isProjectHomePage?: boolean; onlyParent?: boolean }) => {
        return `/page/?isProjectHomePage=${query.isProjectHomePage}&onlyParent=${query.onlyParent}`;
      },
    }),
  }),
});

export const { useGetAllPagesQuery } = navbarApiSlice;
