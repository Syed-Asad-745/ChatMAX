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

export default function SignupModal() {
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
        <div className="flex flex-col h-fit w-[calc(100vw-2rem)] md:max-w-lg px-6 pt-2 pb-6  mx-auto bg-white/80 text-black dark:bg-black/80 dark:text-white shadow-[0px_0px_12px_grey] rounded-3xl">
          <form
            onSubmit={(e) => handleSignUp(e)}
            className="flex flex-col items-center w-full gap-3"
          >
            <h2 className="font-extrabold text-xl w-full mt-2 text-center">Create your account</h2>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              maxLength={30}
              className="w-full outline-none px-4 py-2 rounded-full border-2 border-white/50 bg-transparent font-extralight text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full outline-none px-4 py-2 rounded-full border-2 border-white/50 bg-transparent font-extralight text-sm"
            />
            <div className="w-full flex border-white/50 rounded-full border-2 pr-4 items-center h-fit">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full outline-none bg-transparent px-4 py-2 rounded-xl border-none font-extralight text-sm"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {!showPassword ? <VisibilityOutlinedIcon className="text-[#7b7b7b]" /> : <VisibilityOffOutlinedIcon className="text-[#7b7b7b]" />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm w-full text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="text-black bg-[#fcd62a] text-sm my-2 py-2 px-6 rounded-full shadow-[0px_0px_6px_#fcd727] cursor-pointer font-bold hover:scale-120 active:bg-[#dbb700] transition-all duration-300 ease-in-out"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <span className="mx-auto mt-2 text-xs">
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
