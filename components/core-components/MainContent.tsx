import React from "react";
import PostInput from "../sub-components/PostInput";
import Post from "../sub-components/Post";
import { pool } from "@/lib/db";

export default async function MainContent() {
  const result = await pool.query(
    `
    SELECT posts.*, users.username
    FROM posts JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC`,
  );

  const posts = result.rows;

  return (
    <div className="flex flex-col items-center flex-1 my-4 pb-16 rounded-xl min-h-[calc(100vh-32px)] h-fit border-2 border-gray-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 overflow-clip">
      <h1 className="sticky top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xs p-6 pl-12 font-bold ">Home</h1>
      <PostInput />
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.username}
          created_at={String(post.created_at).split("G")[0]}
          content={post.content}
          comments={post.comments_count}
          likes={post.likes_count}
          shares={post.shares_count}
        />
      ))}
    </div>
  );
}
