//modalSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  signUpModalState: boolean;
  logInModalState: boolean;
  editPostId: number | null;
  deletePostId: number | null;
}

const initialState: ModalState = {
  signUpModalState: false,
  logInModalState: false,
  editPostId: null,
  deletePostId: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openSignUpModal: (state) => {
      state.signUpModalState = true;
    },
    closeSignUpModal: (state) => {
      state.signUpModalState = false;
    },
    openLogInModal: (state) => {
      state.logInModalState = true;
    },
    closeLogInModal: (state) => {
      state.logInModalState = false;
    },
    openEditPostModal: (state, action: PayloadAction<number>) => {
      state.editPostId = action.payload;
    },
    closeEditPostModal: (state) => {
      state.editPostId = null;
    },
    openDeletePostModal: (state, action: PayloadAction<number>) => {
      state.deletePostId = action.payload;
    },
    closeDeletePostModal: (state) => {
      state.deletePostId = null;
    },
  },
});

export const { openSignUpModal, closeSignUpModal, openLogInModal, closeLogInModal, openEditPostModal, closeEditPostModal, openDeletePostModal, closeDeletePostModal } = modalSlice.actions;

export default modalSlice.reducer;
