import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const postId = Number((await params).id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID!" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to like posts!" }, { status: 401 });
    }

    await pool.query(`INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`, [user.id, postId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    // 23503 = foreign key violation (post doesn't exist)
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23503") {
      return NextResponse.json({ error: "Post not found!" }, { status: 404 });
    }
    console.error("Failed to like post:", error);
    return NextResponse.json({ error: "Something went wrong while liking the post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const postId = Number((await params).id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID!" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to unlike posts!" }, { status: 401 });
    }

    await pool.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2;`, [user.id, postId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to unlike post:", error);
    return NextResponse.json({ error: "Something went wrong while unliking the post." }, { status: 500 });
  }
}
