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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/slices/loggedInSlice";
import { AppDispatch } from "@/redux/store";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { href: "/", icon: <HomeOutlinedIcon sx={{ fontSize: 24 }} />, label: "Home" },
    // { href: "/explore", icon: <SearchOutlinedIcon sx={{ fontSize: 24 }} />, label: "Explore" },
    // { href: "/notifications", icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 24 }} />, label: "Notifications" },
    // { href: "/messages", icon: <MarkunreadOutlinedIcon sx={{ fontSize: 24 }} />, label: "Messages" },
    // { href: "/bookmarks", icon: <BookmarksOutlinedIcon sx={{ fontSize: 24 }} />, label: "Bookmarks" },
    { href: "/profile", icon: <AccountCircleOutlinedIcon sx={{ fontSize: 24 }} />, label: "Profile" },
    // { href: "/more", icon: <MoreHorizOutlinedIcon sx={{ fontSize: 24 }} />, label: "More" },
  ];

  const stylingClasses = "flex items-center cursor-pointer border-2 border-transparent hover:scale-110 gap-2 px-4 py-2 w-full rounded-xl transition duration-100";

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      dispatch(userLoggedOut());
      router.refresh();
    }
  }

  return (
    <nav className="h-[calc(100vh-32px)] min-w-60 flex flex-col sticky top-4 m-4 font-extrabold rounded-xl border-2 border-gray-300 bg-gray-100 dark:bg-gray-900  dark:border-gray-700">
      <Image
        src={"/assets/FullLogo.png"}
        width={999}
        height={999}
        alt="Logo"
        className="rounded-full h-12 w-fit mx-auto my-6"
      />
      <hr className="w-[80%] mx-auto text-gray-300 dark:text-gray-700 mb-6" />

      <div className="mx-6 flex flex-col items-center gap-2 h-full">
        {links.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`${pathname === href && "text-blue-600 translate-x-4 value"} ${stylingClasses}`}
          >
            {icon}
            {label}
          </Link>
        ))}

        <span
          onClick={handleLogout}
          className={`mt-auto mb-8 ${stylingClasses}`}
        >
          <LogoutIcon sx={{ fontSize: 24 }} />
          Logout
        </span>
      </div>
    </nav>
  );
}
