"use client";
import React, { useEffect } from "react";
import LoginModal from "../modals/LoginModal";
import SignupModal from "../modals/SignupModal";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn, userLoggedOut } from "@/redux/slices/loggedInSlice";
import { AppDispatch, RootState } from "@/redux/store";

export default function SignUpPrompt() {
  const [isChecking, setIsChecking] = React.useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.loggedIn.userLoggedInState);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          dispatch(userLoggedIn());
        } else {
          dispatch(userLoggedOut());
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkSession();
  }, [dispatch]);

  return (
    <>
      {!isChecking && !isLoggedIn && (
        <div className="fixed bottom-0 w-full flex justify-center items-center gap-8 py-4 text-black bg-[#fcd62a]">
          <div className="text-center">
            <p className="hidden md:block">Don't miss out on the latest chatter going around</p>
            <p className="hidden md:block">Become a part of the ChatMAX community by signing up</p>
          </div>

          <div className="flex">
            <LoginModal />
            <SignupModal />
          </div>
        </div>
      )}
    </>
  );
}
