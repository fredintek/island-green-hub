import apiSlice from "../api";
import { UserRole } from "@/constants/auth.constant";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type UserType = {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  role: UserRole;
};

interface LoginErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

interface InitialStateType {
  token: string | null;
  user: Partial<UserType> | null;
}

const initialState: InitialStateType = {
  token: null,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.token = action.payload;
    },

    logoutUser: (state, action) => {
      state.token = null;
      state.user = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        toast.success(action.payload.message);
        window.location.reload();
      })
      .addMatcher(apiSlice.endpoints.login.matchRejected, (state, action) => {
        const errData = action.payload?.data as LoginErrorResponse;
        toast.error(errData?.message);
      })
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state, action) => {
        state.user = {};
        state.token = "";
        window.location.reload();
      })
      .addMatcher(apiSlice.endpoints.logout.matchRejected, (state, action) => {
        const errData = action.payload?.data as LoginErrorResponse;
        toast.error(errData?.message);
      });
  },
});

export const { setAccessToken, logoutUser } = authSlice.actions;

export default authSlice.reducer;
