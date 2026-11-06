"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { openSignUpModal } from "@/redux/slices/modalSlice";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  async function handleClick() {
    if (isPending) return;

    const wasLiked = liked;
    const previousLikes = likes;

    function rollback() {
      setLiked(wasLiked);
      setLikes(previousLikes);
    }

    // optimistic update: change the UI first
    setLiked(!wasLiked);
    setLikes(wasLiked ? likes - 1 : likes + 1);
    setIsPending(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: wasLiked ? "DELETE" : "POST",
      });

      if (response.status === 401) {
        rollback();
        dispatch(openSignUpModal());
        return;
      }
      if (!response.ok) {
        rollback();
      }
    } catch (error) {
      console.error(error);
      rollback();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer flex items-center gap-1 hover:scale-110 transition"
    >
      {liked ? <FavoriteIcon className="text-red-500" /> : <FavoriteBorderOutlinedIcon />}
      {likes}
    </button>
  );
}
