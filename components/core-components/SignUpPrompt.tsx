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
        <div className="fixed bottom-0 w-full text-black bg-[#fcd62a] h-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[1.3rem]">Don't miss out on the latest trending chatter</p>
            <p>ChatMAX has the most tea spilling community ever!</p>
          </div>

          <div className="absolute right-8 flex">
            <LoginModal />
            <SignupModal />
          </div>
        </div>
      )}
    </>
  );
}
