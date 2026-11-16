// app/profile/ProfilePicture.tsx

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

type ProfilePictureProps = {
  profilePicUrl: string | null;
};

export default function ProfilePicture({ profilePicUrl }: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleProfilePictureChange() {
    fileInputRef.current?.click();
  }

  const [imageSrc, setImageSrc] = useState(profilePicUrl || "/assets/DefaultProfilePic.png");
  return (
    <div className="relative h-20 w-20 sm:h-30 sm:w-30">
      <Image
        src={imageSrc}
        width={120}
        height={120}
        alt="Profile picture"
        className="h-20 w-20 sm:h-30 sm:w-30 rounded-full"
      />
      <button
        onClick={handleProfilePictureChange}
        className="text-black bg-white dark:bg-black dark:text-white scale-80 rounded-full cursor-pointer absolute -bottom-2 -right-2 p-2 hover:bg-gray-400 transition"
      >
        <EditOutlinedIcon />
      </button>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        ref={fileInputRef}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const formData = new FormData();
          formData.append("image", file);
          const response = await fetch("/api/profile/picture", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setImageSrc(data.profilePicUrl);
          }
          console.log(data);
        }}
      />
    </div>
  );
}
