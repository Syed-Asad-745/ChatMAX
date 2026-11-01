import Image from "next/image";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface PostTypes {
  username: string;
  created_at: string;
  content: string;
  comments: number;
  likes: number;
  shares: number;
}

export default function Post({ username, created_at, content, comments, likes, shares }: PostTypes) {
  return (
    <div className="flex items-center max-w-3/4 w-full mb-6 shadow-[-4px_0px_0px_0px_#fcd62a] dark:shadow-[-4px_0px_0px_0px_#fcd62a] bg-white p-6 rounded-[16] dark:bg-gray-950 ">
      <Image
        src={"/assets/ProfilePic.jpg"}
        width={64}
        height={64}
        alt="Profile picture"
        className="rounded-full self-start"
      />
      <div className="ml-4 mt-2">
        <div>
          <span className="font-bold mr-1">{username}</span> <span className="text-gray-500">• {created_at}</span>
        </div>
        <div>
          <p className="mt-2">{content}</p>
        </div>
        <div className="flex items-center gap-12 mt-4">
          <span className="cursor-pointer">
            <ChatOutlinedIcon /> {comments}
          </span>
          <span className="cursor-pointer">
            <FavoriteIcon className="text-red-500" /> {likes}
          </span>
          <span className="cursor-pointer yellow-300">
            <SendOutlinedIcon /> {shares}
          </span>
        </div>
      </div>
    </div>
  );
}
