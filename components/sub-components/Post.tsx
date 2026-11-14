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
    <div className="flex flex-col mx-4 md:mx-12 mb-4 shadow-[-4px_0px_0px_0px_#fcd62a]/80 bg-white/60 text-black p-6 rounded-4xl dark:bg-black/60 dark:text-white text-xs md:text-lg">
      <div className="flex items-center gap-2">
        <Image
          src={profilePic || "/assets/DefaultProfilePic.png"}
          width={64}
          height={64}
          alt={`${username}'s profile picture`}
          className="h-10 w-10 md:h-16 md:w-16 rounded-full self-start"
        />
        <div className="flex flex-col">
          <span className="font-bold">{username}</span> <span className="text-gray-500 text-xs">{createdAt}</span>
        </div>
        <div className="ml-auto mr-">
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
      <div className="w-full">
        <div>
          <p className="mt-2">{content}</p>
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
    </div>
  );
}
