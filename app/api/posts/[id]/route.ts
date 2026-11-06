// app/api/posts/[id]/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const postId = Number(id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID!" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to delete posts!" }, { status: 401 });
    }

    const result = await pool.query(
      `
      DELETE FROM posts
      WHERE id = $1 AND user_id = $2
      RETURNING id`,
      [postId, user.id],
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found or you don't have permission to delete it!" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Post deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Something went wrong while deleting the post." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID!" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to edit posts!" }, { status: 401 });
    }

    const { content } = await request.json();

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Post content cannot be empty!" }, { status: 400 });
    }

    if (content.trim().length > 120) {
      return NextResponse.json({ error: "Post cannot exceed 120 characters!" }, { status: 400 });
    }

    const result = await pool.query(
      `
      UPDATE posts
      SET content = $1
      WHERE id = $2 AND user_id = $3
      RETURNING id`,
      [content.trim(), postId, user.id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found or you don't have permission to edit it!" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Post updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Something went wrong while updating the post." }, { status: 500 });
  }
}
