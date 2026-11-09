"use client";

import { useState } from "react";
import ModalComponent from "./ModalComponent";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openBioModal, closeBioModal } from "@/redux/slices/modalSlice";
import { useRouter } from "next/navigation";

interface BioModalProps {
  bio: string;
}

export default function BioModal({ bio }: BioModalProps) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modals.bioModalState);
  const [bioInput, setBioInput] = useState(bio);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  async function handleBioSave() {
    try {
      setIsSaving(true);
      const response = await fetch("/api/profile/bio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: bioInput,
        }),
      });

      if (response.ok) {
        dispatch(closeBioModal());
        setIsSaving(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <button
        onClick={() => dispatch(openBioModal())}
        className="bg-[#fcd726] text-black px-3 py-1 rounded-lg cursor-pointer font-bold mt-3 hover:scale-110 transition"
      >
        Edit bio
      </button>

      <ModalComponent
        open={isOpen}
        onClose={() => dispatch(closeBioModal())}
      >
        <div className="flex flex-col items-center h-fit w-150 bg-white text-black dark:bg-gray-900 dark:text-white rounded-xl p-8">
          <textarea
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
            rows={6}
            maxLength={160}
            className="w-full outline-none border-2 rounded-2xl p-6 border-gray-300 dark:border-gray-700"
          />
          <div className="flex gap-6 mt-8">
            <button
              onClick={() => dispatch(closeBioModal())}
              disabled={isSaving}
              className="px-8 py-3 rounded-full cursor-pointer bg-[#fcd726] text-black hover:scale-110 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBioSave}
              disabled={isSaving}
              className="px-8 py-3 rounded-full cursor-pointer bg-green-600 font-bold hover:scale-110 transition"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
