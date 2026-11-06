import { pool } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function isRateLimited(key: string, maxAttempts = MAX_ATTEMPTS, windowMinutes = WINDOW_MINUTES): Promise<boolean> {
  const result = await pool.query(
    `SELECT COUNT(*) FROM login_attempts
     WHERE key = $1 AND attempted_at > NOW() - make_interval(mins => $2);`,
    [key, windowMinutes],
  );
  return Number(result.rows[0].count) >= maxAttempts;
}

export async function recordAttempt(key: string) {
  await pool.query(`INSERT INTO login_attempts (key) VALUES ($1);`, [key]);
}

export async function clearAttempts(key: string) {
  await pool.query(`DELETE FROM login_attempts WHERE key = $1;`, [key]);
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
