//DeletePostModal
"use client";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModalComponent from "./ModalComponent";
import { openDeletePostModal, closeDeletePostModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeletePostModalProps {
  postId: number;
}

export default function DeletePostModal({ postId }: DeletePostModalProps) {
  const deletePostId = useSelector((state: RootState) => state.modals.deletePostId);

  const isOpen = deletePostId === postId;

  const dispatch = useDispatch();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      dispatch(closeDeletePostModal());
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => dispatch(openDeletePostModal(postId))}
        className="cursor-pointer hover:scale-140 bg-transparent transition"
      >
        <DeleteOutlinedIcon />
      </button>

      <ModalComponent
        open={isOpen}
        onClose={() => dispatch(closeDeletePostModal())}
      >
        <div className="flex flex-col items-center justify-center gap-3 h-fit w-[calc(100vw-2rem)] md:max-w-xl p-6 mx-auto bg-white/80 text-black dark:bg-black/80 dark:text-white shadow-[0px_0px_12px_grey] rounded-3xl">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex gap-4">
            <button
              onClick={() => dispatch(closeDeletePostModal())}
              disabled={isDeleting}
              className="px-12 py-4 rounded-full cursor-pointer hover:scale-110 transition bg-[#fcd725] shadow-[0px_0px_6px_#fcd727] text-black"
            >
              cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-12 py-4 rounded-full cursor-pointer font-bold hover:scale-110 transition bg-red-600 shadow-[0px_0px_6px_#e7000b] text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
