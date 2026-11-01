import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (typeof content != "string" || !content.trim()) {
      return NextResponse.json({ error: "Post content cannot be empty!" }, { status: 400 });
    }
    const result = await pool.query(
      `
        INSERT INTO posts (content, user_id)
        VALUES ($1, $2)
        RETURNING *
      `,
      [content.trim(), 1],
    );

    return NextResponse.json({ success: true, post: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post: ", error);
    return NextResponse.json({ error: "Something went wrong while creating the post" }, { status: 500 });
  }
}
