import React from "react";
import PostInput from "../components/sub-components/PostInput";
import Post from "../components/sub-components/Post";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

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
    <div className="flex flex-col items-center flex-1 my-4 pb-16 rounded-xl min-h-[calc(100vh-32px)] h-fit border-2 border-gray-300 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 overflow-clip">
      <h1 className="sticky top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xs p-6 pl-12 font-bold z-1000">Home</h1>
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
          createdAt={String(post.created_at).split("G")[0]}
          content={post.content}
          comments={post.comments_count}
          shares={post.shares_count}
        />
      ))}
    </div>
  );
}
