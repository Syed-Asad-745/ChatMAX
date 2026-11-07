import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

const MAX_BIO_LENGTH = 160;

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to edit your bio!" }, { status: 401 });
    }

    const { bio } = await request.json();

    if (typeof bio !== "string") {
      return NextResponse.json({ error: "Bio must be text!" }, { status: 400 });
    }

    const trimmedBio = bio.trim();

    if (trimmedBio.length > MAX_BIO_LENGTH) {
      return NextResponse.json({ error: `Bio cannot exceed ${MAX_BIO_LENGTH} characters!` }, { status: 400 });
    }

    await pool.query(`UPDATE users SET bio = $1 WHERE id = $2;`, [trimmedBio, user.id]);

    return NextResponse.json({ success: true, bio: trimmedBio }, { status: 200 });
  } catch (error) {
    console.error("Failed to update bio:", error);
    return NextResponse.json({ error: "Something went wrong while updating your bio." }, { status: 500 });
  }
}
