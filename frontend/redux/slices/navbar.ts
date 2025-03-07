import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
  isNavCollapsed: boolean;
  isDark: boolean;
}

const initialState: InitialStateType = {
  isNavCollapsed: false,
  isDark: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    // regular Reducers
    toggleNavbar: (state, action) => {
      state.isNavCollapsed = !state.isNavCollapsed;
    },

    toggleTheme: (state, action) => {
      state.isDark = !state.isDark;
    },
  },
});

export const { toggleNavbar, toggleTheme } = navbarSlice.actions;

export default navbarSlice.reducer;
