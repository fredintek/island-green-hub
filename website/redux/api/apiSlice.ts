import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a base URL for your API
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({}),
});
