// app/api/posts/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Post content cannot be empty!" }, { status: 400 });
    }

    if (content.trim().length > 300) {
      return NextResponse.json({ error: "Post cannot exceed 300 characters!" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to create a post!" }, { status: 401 });
    }

    const result = await pool.query(
      `
      INSERT INTO posts (content, user_id)
      VALUES ($1, $2)
      RETURNING *`,
      [content.trim(), user.id],
    );

    return NextResponse.json({ success: true, post: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post: ", error);
    return NextResponse.json({ error: "Something went wrong while creating the post" }, { status: 500 });
  }
}
