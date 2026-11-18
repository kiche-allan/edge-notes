import { getPool } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getPool();
  let db: "ok" | "down" | "not configured" = "not configured";
  if (pool) db = await pool.query("SELECT 1").then(() => "ok" as const).catch(() => "down" as const);
  return json({ status: db === "down" ? "degraded" : "ok", db, time: new Date().toISOString() }, db === "down" ? 503 : 200);
}
