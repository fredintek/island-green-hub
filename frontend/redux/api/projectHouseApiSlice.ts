import apiSlice from ".";

export const projectHouseApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get All Project House
    getAllProjectHouse: builder.query({
      query: (isHomePage) => {
        const queryParams =
          isHomePage !== undefined ? `?isHomePage=${isHomePage}` : "";
        return `/project-house/${queryParams}`;
      },
    }),
    // Get Single Project House
    getProjectHouse: builder.query({
      query: (id: string) => `/project-house/${id}`,
    }),
    // Create a New Project House
    createProjectHouse: builder.mutation({
      query: (projectHouse) => ({
        url: "/project-house",
        method: "POST",
        body: projectHouse,
      }),
    }),
    // Update a Project House
    updateProjectHouse: builder.mutation({
      query: (projectHouse) => ({
        url: `/project-house`,
        method: "PATCH",
        body: projectHouse,
      }),
    }),
    // Delete a Project House
    deleteProjectHouse: builder.mutation({
      query: (id: number) => ({
        url: `/project-house/${id}`,
        method: "DELETE",
      }),
    }),

    // Update Is Home Page
    updateIsHomePage: builder.mutation({
      query: ({ projectHouseId, isHomePage }) => ({
        url: `/project-house/is-home-page`,
        method: "PATCH",
        body: { projectHouseId, isHomePage },
      }),
    }),
  }),
});

export const {
  useGetAllProjectHouseQuery,
  useGetProjectHouseQuery,
  useCreateProjectHouseMutation,
  useUpdateProjectHouseMutation,
  useDeleteProjectHouseMutation,
  useUpdateIsHomePageMutation,
} = projectHouseApiSlice;
