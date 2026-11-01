import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLoggedInState: false,
};

const loggedInSlice = createSlice({
  name: "loggedIn",
  initialState,
  reducers: {
    userLoggedIn: (state) => {
      state.userLoggedInState = true;
    },
    userLoggedOut: (state) => {
      state.userLoggedInState = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut } = loggedInSlice.actions;

export default loggedInSlice.reducer;
