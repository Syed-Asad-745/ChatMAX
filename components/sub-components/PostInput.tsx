"use client";

import React, { useState } from "react";
import Image from "next/image";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import MoodOutlinedIcon from "@mui/icons-material/MoodOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { useRouter } from "next/navigation";

export default function PostInput() {
  const router = useRouter();
  const [postInputValue, setPostInputValue] = useState("");
  const [isPosting, setIsPosting] = useState(false);

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

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Backend error:", errorData);
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
          className="h-12 w-full mx-6 px-2 outline-none border-b border-gray-500 focus:border-b focus:border-yellow-400"
          placeholder="Post a thought..."
          value={postInputValue}
          onChange={(e) => {
            setPostInputValue(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-4 mx-12">
        <div className="flex gap-4 text-[2rem] px-24">
          <PostInputShortcuts icon={<PhotoCameraOutlinedIcon />} />
          <PostInputShortcuts icon={<SignalCellularAltOutlinedIcon />} />
          <PostInputShortcuts icon={<MoodOutlinedIcon />} />
          <PostInputShortcuts icon={<EventNoteOutlinedIcon />} />
          <PostInputShortcuts icon={<FmdGoodOutlinedIcon />} />
        </div>
        <button
          onClick={handlePost}
          disabled={isPosting || !postInputValue.trim()}
          className="bg-[#fcd726] text-black w-fit px-8 py-1 text-[1.3rem] rounded-full shadow-md shadow-gray-600 mr-6 cursor-pointer hover:scale-115 active:scale-95 transition duration-100 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

function PostInputShortcuts({ icon }: { icon: React.ReactNode }) {
  return <span className="text-[#fcd726] cursor-pointer hover:scale-140 transition duration-100">{icon}</span>;
}
