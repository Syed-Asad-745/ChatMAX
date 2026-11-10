import Image from "next/image";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

import EditPostModal from "../modals/EditPostModal";
import DeletePostModal from "../modals/DeletePostModal";
import LikeButton from "./LikeButton";

interface PostPropTypes {
  currentUserId: number | null;
  authorId: number;
  postId: number;
  likedByMe: boolean;
  profilePic: string | null;
  username: string;
  createdAt: string;
  content: string;
  comments: number;
  likes: number;
  shares: number;
}

export default function Post({ currentUserId, authorId, postId, likedByMe, profilePic, username, createdAt, content, likes, comments, shares }: PostPropTypes) {
  const isOwner = currentUserId === authorId;

  return (
    <div className="relative flex items-center max-w-3/4 w-full mb-6 shadow-[-4px_0px_0px_0px_#fcd62a] dark:shadow-[-4px_0px_0px_0px_#fcd62a] bg-white/60 p-6 rounded-[16] dark:bg-gray-950">
      <Image
        src={profilePic || "/assets/DefaultProfilePic.png"}
        width={96}
        height={96}
        alt={`${username}'s profile picture`}
        className="rounded-full self-start"
      />
      <div className="ml-4 mt-2 w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold">{username}</span> <span className="text-gray-500">• {createdAt}</span>
        </div>
        <div>
          <p className="mt-2 wrap-break-word max-w">{content}</p>
        </div>
        <div className="flex items-center gap-12 mt-4">
          <span className="cursor-pointer">
            <LikeButton
              postId={postId}
              initialLikes={likes}
              initialLiked={likedByMe}
            />
          </span>
          {/* <span className="cursor-pointer">
            <ChatOutlinedIcon /> {comments}
          </span>
          <span className="cursor-pointer yellow-300">
            <SendOutlinedIcon /> {shares}
          </span> */}
        </div>
      </div>
      <div className="absolute top-6 right-6">
        {isOwner && (
          <div className="flex gap-2">
            <EditPostModal
              content={content}
              postId={postId}
            />
            <DeletePostModal postId={postId} />
          </div>
        )}
      </div>
    </div>
  );
}
