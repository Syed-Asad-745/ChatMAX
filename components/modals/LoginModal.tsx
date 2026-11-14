"use client";

import React, { useState } from "react";
import ModalComponent from "./ModalComponent";
import { closeLogInModal, openLogInModal } from "@/redux/slices/modalSlice";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { userLoggedIn } from "@/redux/slices/loggedInSlice";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const isOpen = useSelector((state: RootState) => state.modals.logInModalState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/auth/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }

      dispatch(userLoggedIn());
      router.refresh();
      setUsername("");
      setPassword("");
      dispatch(closeLogInModal());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => dispatch(openLogInModal())}
        className="h-12 w-32 px-4 py-2 cursor-pointer hover:scale-110 hover:bg-white transition-all duration-150 ease-in-out border-3 border-white rounded-full mr-6"
      >
        Login
      </button>

      <ModalComponent
        open={isOpen}
        onClose={() => dispatch(closeLogInModal())}
      >
        <div className="relative h-fit w-150 bg-white/80 text-black dark:bg-black/80 dark:text-white shadow-[0px_0px_12px_grey] rounded-3xl flex flex-col  p-10">
          <CloseIcon
            onClick={() => dispatch(closeLogInModal())}
            sx={{ fontSize: 48 }}
            className="self-end mt-6 mr-6 rounded-full cursor-pointer absolute -right-2 -top-2"
          />
          <form
            onSubmit={(e) => {
              handleLogin(e);
            }}
            className="flex flex-col items-center w-full"
          >
            <h2 className="font-extrabold text-3xl w-full my-6">Log into your account</h2>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none mb-6 px-4 py-2 rounded-xl border border-white/50 bg-transparent"
            />
            <div className="w-full flex border-2 border-white/50 rounded-xl pr-4 items-center h-fit mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent px-4 py-2 rounded-xl border-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {!showPassword ? <VisibilityOutlinedIcon className="text-gray-400" /> : <VisibilityOffOutlinedIcon className="text-gray-400" />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mb-6">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="text-black bg-[#fcd62a] py-2 px-6 rounded-full cursor-pointer font-bold hover:scale-120 transition-all duration-300 ease-in-out"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </ModalComponent>
    </div>
  );
}
