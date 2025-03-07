import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { logoutUser, setAccessToken } from "../slices/authSlice";

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // create a fetch base query instance with credentials included
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include", // include cookies when making requests
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const accessToken = state.auth.token;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  // Make the initial API request
  let result = await baseQuery(args, api, extraOptions);

  // If forbidden (401), attempt to refresh the token
  if (result.error && result.error.status === 401) {
    // console.log("RESULT", result);
    // console.warn("Access token expired, attempting refresh...");

    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" }, // Refresh token endpoint
      api,
      extraOptions
    );

    // console.log("refreshResult", refreshResult);

    if (refreshResult.error) {
      const refreshResultError = refreshResult.error as {
        data: { message: string };
        status: number;
      };
      // Call the logout mutation
      await api
        .dispatch(apiSlice.endpoints.logout.initiate(undefined))
        .unwrap();

      // Clear user state
      api.dispatch(logoutUser(undefined));

      toast.error(refreshResultError.data.message);
    }

    if (refreshResult.data) {
      const newAccessToken = (
        refreshResult.data as {
          message: string;
          accessToken: string;
        }
      ).accessToken;

      // Store the new access token in Redux
      api.dispatch(setAccessToken(newAccessToken));

      // Retry the original request with the new access token
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Define a base URL for your API
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // login admin
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: { email, password },
      }),
    }),

    // logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "PATCH",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, email, password }) => ({
        url: `/auth/reset-password/`,
        method: "PATCH",
        body: { token, email, password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useResetPasswordMutation,
} = apiSlice;

export default apiSlice;
