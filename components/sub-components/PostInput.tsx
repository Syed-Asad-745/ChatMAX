"use client";

import React, { useState } from "react";
import Image from "next/image";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import MoodOutlinedIcon from "@mui/icons-material/MoodOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { openSignUpModal } from "@/redux/slices/modalSlice";

export default function PostInput() {
  const router = useRouter();
  const [postInputValue, setPostInputValue] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const dispatch = useDispatch();

  async function handlePost() {
    if (!postInputValue) return;

    try {
      setIsPosting(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postInputValue,
        }),
      });

      if (response.status === 401) {
        dispatch(openSignUpModal());
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setPostInputValue("");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  }

  function handlePhotoInput() {
    console.log("Photo selected!");
  }
  function handleEmojiInput() {
    console.log("Emoji/Sticker selected!");
  }
  function handlePollInput() {
    console.log("Poll selected!");
  }
  function handleReminderInput() {
    console.log("Reminder selected!");
  }
  function handleLocationInput() {
    console.log("Location selected!");
  }

  const inputFeatures = [
    { icon: <PhotoCameraOutlinedIcon />, action: handlePhotoInput },
    { icon: <MoodOutlinedIcon />, action: handleEmojiInput },
    { icon: <PollOutlinedIcon />, action: handlePollInput },
    { icon: <EventNoteOutlinedIcon />, action: handleReminderInput },
    { icon: <FmdGoodOutlinedIcon />, action: handleLocationInput },
  ];

  return (
    <div className="mb-16 w-full">
      <div className="flex items-center mx-12 mt-12 gap-4">
        <Image
          src={"/assets/Logo.png"}
          width={999}
          height={999}
          alt="Logo"
          className="rounded-xl h-14 w-14"
        />
        <input
          type="text"
          className="h-12 w-full mx-6 px-2 outline-none border-b border-gray-500 focus:border-b-2 focus:border-[#fcd726]"
          placeholder="Post a thought..."
          value={postInputValue}
          maxLength={120}
          onChange={(e) => {
            setPostInputValue(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-4 mx-12">
        {/* <div className="flex gap-4 ml-24">
          {inputFeatures.map((feature, index) => (
            <span
              key={index}
              onClick={feature.action}
              className="cursor-pointer hover:text-[#fcd726] hover:scale-150 transition"
            >
              {feature.icon}
            </span>
          ))}
        </div> */}
        <button
          onClick={handlePost}
          disabled={isPosting || !postInputValue.trim()}
          className="bg-[#fcd726] text-black w-fit px-8 py-1 text-[1.3rem] rounded-full shadow-md shadow-gray-600 ml-auto mr-6 cursor-pointer hover:scale-115 active:scale-95 transition duration-100 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
