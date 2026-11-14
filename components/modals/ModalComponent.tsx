"use client";

import React from "react";

type ModalComponentProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ModalComponent({ open, onClose, children }: ModalComponentProps) {
  if (!open) return null;
  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-1000">
      <div
        onClick={() => onClose()}
        className="fixed top-0 left-0 h-screen w-screen bg-black/30 backdrop-blur-xs z-1001"
      ></div>
      <div className="z-1002">{children}</div>
    </div>
  );
}
