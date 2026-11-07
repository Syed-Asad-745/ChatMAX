import "server-only";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { pool } from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

  const result = await pool.query(
    `
    SELECT users.id, users.username, users.email, users.bio
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.token_hash = $1
    AND sessions.expires_at > NOW();`,
    [tokenHash],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}
