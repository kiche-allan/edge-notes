import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __edgePool: Pool | undefined;
}

/** Shared connection pool, or null when DATABASE_URL is not configured (pages still render). */
export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!global.__edgePool) {
    global.__edgePool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  return global.__edgePool;
}

export async function query<T extends Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[] | null> {
  const pool = getPool();
  if (!pool) return null;
  const res = await pool.query(sql, params);
  return res.rows as T[];
}
