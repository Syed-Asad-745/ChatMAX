import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { isRateLimited, recordAttempt, clearAttempts, getClientIp } from "@/lib/auth/rateLimit";

export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON!" }, { status: 400 });
    }
    const { username, password } = body;

    if (!username || typeof username !== "string" || !username.trim() || username.trim().length < 3 || username.trim().length > 30) {
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 400 });
    }

    const normalizedUsername = username.trim();

    const rateLimitKey = `login:${getClientIp(request)}:${normalizedUsername.toLowerCase()}`;

    if (await isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    }

    const result = await pool.query(
      `SELECT id, username, password_hash
       FROM users
       WHERE username = $1;`,
      [normalizedUsername],
    );

    if (result.rows.length === 0) {
      await recordAttempt(rateLimitKey);
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 401 });
    }
    const user = result.rows[0];

    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      await recordAttempt(rateLimitKey);
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 401 });
    }

    await clearAttempts(rateLimitKey);

    const sessionToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at) 
       VALUES ($1, $2, $3);`,
      [user.id, tokenHash, expiresAt],
    );

    const cookieStore = await cookies();

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json({ error: "Something went wrong during login." }, { status: 500 });
  }
}
