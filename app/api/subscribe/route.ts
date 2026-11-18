import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { bad, clean, EMAIL_RE, json, noDb } from "@/lib/http";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = clean(body.email, 254)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return bad("Please enter a valid email address.");
  const rows = await query<{ inserted: boolean }>(
    `INSERT INTO subscribers (email, channel) VALUES ($1, 'email')
     ON CONFLICT (email) DO UPDATE SET unsubscribed_at = NULL
     RETURNING (xmax = 0) AS inserted`,
    [email],
  );
  if (!rows) return noDb();
  return json({ ok: true, already: !rows[0].inserted }, rows[0].inserted ? 201 : 200);
}
