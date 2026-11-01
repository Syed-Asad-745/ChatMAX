"use client";

import React from "react";
import Image from "next/image";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/slices/loggedInSlice";
import { AppDispatch } from "@/redux/store";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch();

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      dispatch(userLoggedOut());
    }
  }

  return (
    <nav className="h-[calc(100vh-32px)] hidden sm:flex flex-col sticky top-4 m-4 rounded-xl border-2 border-gray-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700">
      <div className="mx-auto my-6">
        <Image
          src={"/assets/FullLogo.png"}
          width={999}
          height={999}
          alt="Logo"
          className="rounded-full h-12 w-fit"
        />
      </div>

      <div className="mx-6 flex flex-col gap-2 h-full">
        <SidebarLink
          icon={<HomeOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Home"
        />
        <SidebarLink
          icon={<SearchOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Explore"
        />
        <SidebarLink
          icon={<NotificationsActiveOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Notifications"
        />
        <SidebarLink
          icon={<MarkunreadOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Messages"
        />
        <SidebarLink
          icon={<BookmarksOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Bookmarks"
        />
        <SidebarLink
          icon={<AccountCircleOutlinedIcon sx={{ fontSize: 24 }} />}
          text="Profile"
        />
        <SidebarLink
          icon={<MoreHorizOutlinedIcon sx={{ fontSize: 24 }} />}
          text="More"
        />

        <div
          onClick={handleLogout}
          className="mt-auto mb-8"
        >
          <SidebarLink
            icon={<LogoutIcon sx={{ fontSize: 24 }} />}
            text="Logout"
          />
        </div>
      </div>
    </nav>
  );
}

function SidebarLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center cursor-pointer border-2 border-transparent hover:border-[#fcd62a] gap-2 px-4 py-2 rounded-xl transition duration-100">
      {icon} <span>{text}</span>
    </div>
  );
}
