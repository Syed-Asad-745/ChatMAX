//EditPostModal.tsx
"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ModalComponent from "./ModalComponent";
import { openEditPostModal, closeEditPostModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface EditPostModalProps {
  postId: number;
  content: string;
}

export default function EditPostModal({ content, postId }: EditPostModalProps) {
  const editPostId = useSelector((state: RootState) => state.modals.editPostId);

  const isOpen = editPostId === postId;

  const dispatch = useDispatch();

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  async function handleSave() {
    try {
      setIsSaving(true);

      if (!editedContent.trim()) {
        return;
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error(data.error);
        return;
      }

      dispatch(closeEditPostModal());
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setEditedContent(content);
    }
  }, [isOpen, content]);

  return (
    <div>
      <button
        onClick={() => dispatch(openEditPostModal(postId))}
        className="cursor-pointer hover:scale-140 bg-transparent transition"
      >
        <EditOutlinedIcon />
      </button>

      <ModalComponent
        open={isOpen}
        onClose={() => dispatch(closeEditPostModal())}
      >
        <div className="h-fit w-150 rounded-xl p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
          <p className="ml-6">Edit post:</p>
          <div className="flex flex-col">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="outline-none border-2 border-gray-400 w-full mt-2 rounded-2xl p-6"
              rows={4}
              maxLength={120}
            />
            <div className="flex gap-4 mt-4 self-center">
              <button
                type="button"
                onClick={() => {
                  setEditedContent(content);
                  dispatch(closeEditPostModal());
                }}
                disabled={isSaving}
                className="h-15 w-30 bg-[#fcd725] text-black rounded-full cursor-pointer hover:scale-110 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || editedContent.trim() === content.trim()}
                className="h-15 w-30 bg-green-500 text-white font-bold rounded-full cursor-pointer hover:scale-110 transition"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
