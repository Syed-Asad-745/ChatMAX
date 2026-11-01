import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { pool } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    await pool.query(`DELETE FROM sessions WHERE token_hash = $1;`, [tokenHash]);
  }

  cookieStore.delete("session");

  return NextResponse.json({ success: true }, { status: 200 });
}
