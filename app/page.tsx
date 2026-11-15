import React from "react";
import PostInput from "../components/sub-components/PostInput";
import Post from "../components/sub-components/Post";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import MenuButton from "@/components/sub-components/MenuButton";

export default async function HomePage() {
  const user = await getCurrentUser();

  const result = await pool.query(
    `
    SELECT posts.*, users.id AS author_id, users.username,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id)::int AS like_count,
    EXISTS (
      SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = $1
    ) AS liked_by_me
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC`,
    [user?.id ?? null],
  );

  const posts = result.rows;

  return (
    <div className="flex flex-col items-center flex-1 sm:m-4 pb-10 sm:rounded-3xl min-h-dvh sm:min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
      <div className="w-full flex justify-start items-center gap-4 bg-white/50 dark:bg-black/50 py-6 px-6 font-bold">
        <span className="sm:hidden">
          <MenuButton />
        </span>
        <span>Home</span>
      </div>
      <PostInput />
      {posts.map((post) => (
        <Post
          key={`${post.id}-${user?.id ?? "guest"}`}
          currentUserId={user?.id ?? null}
          authorId={post.author_id}
          postId={post.id}
          likes={post.like_count}
          likedByMe={post.liked_by_me}
          profilePic={post.profile_pic_url}
          username={post.username}
          createdAt={String(post.created_at.toLocaleString())}
          content={post.content}
          comments={post.comments_count}
          shares={post.shares_count}
        />
      ))}
    </div>
  );
}
