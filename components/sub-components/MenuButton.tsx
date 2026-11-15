"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { openSidebar, closeSidebar } from "@/redux/slices/modalSlice";

export default function MenuButton() {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div onClick={() => dispatch(openSidebar())} className="cursor-pointer">
      <MenuIcon />
    </div>
  );
}
