// Applies db/migrations/*.sql in order, once each. Safe to run on every container start.
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set, skipping migrations");
  process.exit(0);
}

const dir = path.join(process.cwd(), "db", "migrations");
let client;

// The database container may still be starting: retry with a fresh client each time.
for (let attempt = 1; ; attempt++) {
  client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    break;
  } catch (err) {
    await client.end().catch(() => {});
    if (attempt >= 20) throw err;
    console.log(`[migrate] database not ready (${err.code ?? err.message}), retrying...`);
    await new Promise((r) => setTimeout(r, 1500));
  }
}

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
    await client.query("COMMIT");
    console.log(`[migrate] applied ${file}`);
  }
  console.log("[migrate] up to date");
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("[migrate] failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
