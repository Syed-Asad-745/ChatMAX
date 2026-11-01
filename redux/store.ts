import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./slices/modalSlice";
import loggedInSlice from "./slices/loggedInSlice";

export const store = configureStore({
  reducer: {
    modals: modalSlice,
    loggedIn: loggedInSlice,
  },
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
