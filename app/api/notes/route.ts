import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { bad, clean, json, noDb } from "@/lib/http";
import { getPost } from "@/lib/posts";

const COLS = "id, author_name, body, quote, is_author, created_at";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("post") ?? "";
  if (!getPost(slug)) return bad("Unknown post", 404);
  const rows = await query(`SELECT ${COLS} FROM margin_notes WHERE post_slug = $1 AND approved ORDER BY created_at`, [slug]);
  if (!rows) return json({ notes: [] });
  return json({ notes: rows });
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const slug = clean(b.post, 200);
  const name = clean(b.name, 60);
  const text = clean(b.body, 1000);
  const quote = b.quote ? clean(b.quote, 300) : null;
  if (!slug || !getPost(slug)) return bad("Unknown post", 404);
  if (!name || !text) return bad("Add your name and a note.");
  const rows = await query(
    `INSERT INTO margin_notes (post_slug, author_name, body, quote) VALUES ($1, $2, $3, $4) RETURNING ${COLS}`,
    [slug, name, text, quote],
  );
  if (!rows) return noDb();
  return json({ note: rows[0] }, 201);
}
