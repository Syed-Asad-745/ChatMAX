import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON!" }, { status: 400 });
    }
    const { username, email, password } = body;

    if (!username || typeof username !== "string" || !username.trim() || username.trim().length < 3 || username.trim().length > 30) {
      return NextResponse.json({ error: "Invalid Username!" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.trim() || email.trim().length > 300 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid Email!" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Invalid Password!" }, { status: 400 });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      `
      SELECT username, email
      FROM users
      WHERE username = $1 OR email = $2;`,
      [normalizedUsername, normalizedEmail],
    );

    const usernameExists = existingUser.rows.some((user) => user.username === normalizedUsername);
    const emailExists = existingUser.rows.some((user) => user.email === normalizedEmail);

    if (usernameExists) {
      return NextResponse.json({ error: "Username already exists!" }, { status: 409 });
    }
    if (emailExists) {
      return NextResponse.json({ error: "Email already in use!" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    await pool.query(
      `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)`,
      [normalizedUsername, normalizedEmail, hashedPassword],
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup error: ", error);
    return NextResponse.json({ error: "Something went wrong during signup." }, { status: 500 });
  }
}
