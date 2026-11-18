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
import { useDispatch, useSelector, UseSelector } from "react-redux";
import { userLoggedOut } from "@/redux/slices/loggedInSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { closeSidebar } from "@/redux/slices/modalSlice";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch();

  const sidebarState = useSelector((state: RootState) => state.modals.sidebarState);

  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { href: "/", icon: <HomeOutlinedIcon sx={{ fontSize: 24 }} />, label: "Home" },
    { href: "/explore", icon: <SearchOutlinedIcon sx={{ fontSize: 24 }} />, label: "Explore" },
    { href: "/notifications", icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 24 }} />, label: "Notifications" },
    { href: "/messages", icon: <MarkunreadOutlinedIcon sx={{ fontSize: 24 }} />, label: "Messages" },
    { href: "/bookmarks", icon: <BookmarksOutlinedIcon sx={{ fontSize: 24 }} />, label: "Bookmarks" },
    { href: "/profile", icon: <AccountCircleOutlinedIcon sx={{ fontSize: 24 }} />, label: "Profile" },
    { href: "/more", icon: <MoreHorizOutlinedIcon sx={{ fontSize: 24 }} />, label: "More" },
  ];

  async function handleLogout() {
    const confirmedLogout = confirm("Are you sure you want to logout?");

    if (confirmedLogout) {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        dispatch(userLoggedOut());
        router.refresh();
      }
    }
  }

  return (
    <div>
      {sidebarState && (
        <div
          className="fixed top-0 right-0 h-dvh w-dvw z-1 bg-black/30 backdrop-blur-xs"
          onClick={() => dispatch(closeSidebar())}
        ></div>
      )}
      <nav
        className={`${sidebarState ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 z-2 min-h-dvh sm:min-h-[calc(100vh-32px)] min-w-fit p-6 sm:translate-x-0 flex flex-col sm:sticky sm:top-4 sm:my-4 sm:ml-4 font-extrabold sm:rounded-3xl sm:border-2 bg-white/80 sm:border-white dark:bg-black/80  dark:border-black transition-transform`}
      >
        <Image
          src={"/assets/FullLogo.png"}
          width={100}
          height={100}
          alt="Logo"
          className="sm:hidden md:hidden lg:block w-auto h-auto rounded-full mx-4 my-2"
        />
        <hr className="sm:hidden md:hidden lg:block w-full mx-auto my-4 text-gray-400 dark:text-gray-700" />

        <div className=" flex flex-col items-center min-h-full">
          {links.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`${pathname === href && "text-blue-600"} flex items-center cursor-pointer border-2 border-transparent hover:scale-110 gap-2 px-4 py-2 w-full rounded-xl transition duration-100 sm:scale-160 lg:scale-100 sm:mb-4 lg:mb-0`}
              onClick={() => dispatch(closeSidebar())}
            >
              <span className="scale-100">{icon}</span>
              <span className="sm:hidden md:hidden lg:inline">{label}</span>
            </Link>
          ))}
        </div>
        <span
          onClick={handleLogout}
          className="mt-auto mb-8 flex items-center cursor-pointer border-2 border-transparent hover:scale-110 gap-2 px-4 py-2 w-full rounded-xl transition duration-100"
        >
          <span className="sm:scale-160 lg:scale-100">
            <LogoutIcon sx={{ fontSize: 24 }} />
          </span>
          <span className="sm:hidden md:hidden lg:inline">Logout</span>
        </span>
      </nav>
    </div>
  );
}
