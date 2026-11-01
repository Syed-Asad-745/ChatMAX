"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { closeSignUpModal, openSignUpModal } from "@/redux/slices/modalSlice";
import { openLogInModal } from "@/redux/slices/modalSlice";
import ModalComponent from "./ModalComponent";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function SignUpModal() {
  const isOpen = useSelector((state: RootState) => state.modals.signUpModalState);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch: AppDispatch = useDispatch();

  async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }

      setUsername("");
      setEmail("");
      setPassword("");

      dispatch(closeSignUpModal());
      dispatch(openLogInModal());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => dispatch(openSignUpModal())}
        className="h-12 w-32 px-4 py-2 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out bg-white rounded-full"
      >
        Sign Up
      </button>

      <ModalComponent
        open={isOpen}
        onClose={() => dispatch(closeSignUpModal())}
      >
        <div className="relative h-fit w-150 bg-white rounded-xl flex flex-col p-10 dark:bg-gray-900 dark:text-white">
          <CloseIcon
            onClick={() => dispatch(closeSignUpModal())}
            sx={{ fontSize: 48 }}
            className="self-end mt-6 mr-6 rounded-full cursor-pointer absolute -right-2 -top-2"
          />
          <form
            onSubmit={(e) => handleSignUp(e)}
            className="flex flex-col items-center w-full mb-6"
          >
            <h2 className="font-black text-3xl w-full my-6">Create your account</h2>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              maxLength={30}
              className="w-full outline-none bg-transparent mb-6 px-4 py-2 rounded-xl border-2 border-gray-300"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full outline-none bg-transparent mb-6 px-4 py-2 rounded-xl border-2 border-gray-300"
            />
            <div className="w-full flex border-2 border-gray-300 rounded-xl pr-4 items-center h-fit mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full outline-none bg-transparent px-4 py-2 rounded-xl border-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {!showPassword ? <VisibilityOutlinedIcon className="text-gray-400" /> : <VisibilityOffOutlinedIcon className="text-gray-400" />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mb-4 w-full text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="text-black bg-[#fcd62a] py-2 px-6 rounded-full cursor-pointer font-bold hover:scale-120 transition-all duration-300 ease-in-out"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <span className="mx-auto">
            already have an account?{" "}
            <span
              onClick={() => {
                dispatch(closeSignUpModal());
                dispatch(openLogInModal());
              }}
              className="underline text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </span>
        </div>
      </ModalComponent>
    </div>
  );
}
