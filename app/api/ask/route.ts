import { NextRequest } from "next/server";
import { ask } from "@/lib/ask";
import { query } from "@/lib/db";
import { bad, clean, json } from "@/lib/http";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const q = clean(b.question, 500);
  if (!q) return bad("Ask a question (up to 500 characters).");
  const answer = ask(q);
  await query("INSERT INTO questions (question, answered, sources) VALUES ($1, $2, $3)", [q, answer.answered, answer.sources.map((s) => s.href)]).catch(() => {});
  return json(answer);
}
