"use client";

import { useState } from "react";
import Image from "next/image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";

export default function ProfilePicture() {
  function handleProfilePictureChange() {}

  const [imageSrc, setImageSrc] = useState("/assets/DefaultProfilePic.png");
  return (
    <div className="relative">
      <Image
        src={imageSrc}
        width={128}
        height={128}
        alt="Profile picture"
        className="rounded-full h-32 w-32 object-cover"
        unoptimized
      />
      <button
        onClick={handleProfilePictureChange}
        className="text-gray-300 bg-gray-600 rounded-full cursor-pointer absolute bottom-0 right-0 p-2 hover:bg-gray-500 transition"
      >
        <EditOutlinedIcon />
      </button>
    </div>
  );
}
