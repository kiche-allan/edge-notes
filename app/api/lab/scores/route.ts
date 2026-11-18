import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { bad, clean, json, noDb } from "@/lib/http";
import { replay, roundId, tasksFor } from "@/lib/game";

export async function GET(req: NextRequest) {
  const round = req.nextUrl.searchParams.get("round") ?? roundId();
  const rows = await query(
    `SELECT handle, min(total_ms) AS total_ms FROM lab_scores
     WHERE experiment = 'place-the-task' AND round_id = $1
     GROUP BY handle ORDER BY total_ms LIMIT 10`,
    [round],
  );
  return json({ round, scores: rows ?? [] });
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const handle = clean(b.handle, 30);
  const round = roundId();
  if (!handle) return bad("Pick a handle (up to 30 characters).");
  if (b.round !== round) return bad("That round has closed. Play this week's round.");
  // The server replays the moves, so nobody can post a made-up score.
  const total = Array.isArray(b.choices) ? replay(tasksFor(round), b.choices.map(Number)) : null;
  if (total === null) return bad("Invalid moves.");
  const rows = await query("INSERT INTO lab_scores (round_id, handle, total_ms) VALUES ($1, $2, $3) RETURNING id", [round, handle, total]);
  if (!rows) return noDb();
  return json({ ok: true, round, total_ms: total }, 201);
}
