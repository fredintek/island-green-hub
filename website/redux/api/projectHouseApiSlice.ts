import { apiSlice } from "./apiSlice";

const projectHouseApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get project house by ID
    getProjectHouseById: builder.query({
      query: (id: string) => `/project-house/${id}`,
    }),
  }),
});

export const { useGetProjectHouseByIdQuery } = projectHouseApiSlice;
