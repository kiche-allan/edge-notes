// Shared rules for "Place the Task" so the browser game and the score API agree.

export type NodeSpec = { id: string; name: string; base: number; rate: number };
export type Task = { kind: string; size: number };

export const NODES: NodeSpec[] = [
  { id: "A", name: "Roadside unit", base: 5, rate: 40 },
  { id: "B", name: "Base station", base: 15, rate: 80 },
  { id: "C", name: "Regional cloud", base: 60, rate: 220 },
];

const KINDS = ["video-frame", "sensor-batch", "map-update", "lidar-scan", "voice-clip", "telemetry"];
const SIZES: Record<string, [number, number]> = {
  "video-frame": [25, 45], "sensor-batch": [1, 4], "map-update": [8, 16], "lidar-scan": [18, 35], "voice-clip": [3, 8], telemetry: [1, 2],
};

/** Monday-based week id, e.g. 2026-W47. Everyone plays the same sequence each week. */
export function roundId(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(week).padStart(2, "0")}`;
}

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let x = Math.imul(h ^ (h >>> 15), 1 | h);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function tasksFor(round: string, n = 10): Task[] {
  const r = rng(round);
  return Array.from({ length: n }, () => {
    const kind = KINDS[Math.floor(r() * KINDS.length)];
    const [lo, hi] = SIZES[kind];
    return { kind, size: Math.round(lo + r() * (hi - lo)) };
  });
}

/** Latency in ms for sending `task` to `node` given its queued MB. Queues drain 35% each step. */
export const latency = (node: NodeSpec, queued: number, task: Task) => Math.round(node.base + ((queued + task.size) / node.rate) * 1000);
export const drain = (q: number[]) => q.map((x) => x * 0.65);

/** Replays a list of choices and returns the total latency, or null if the choices are invalid. */
export function replay(tasks: Task[], choices: number[]): number | null {
  if (choices.length !== tasks.length) return null;
  let q = NODES.map(() => 0);
  let total = 0;
  for (let i = 0; i < tasks.length; i++) {
    const c = choices[i];
    if (!Number.isInteger(c) || c < 0 || c >= NODES.length) return null;
    total += latency(NODES[c], q[c], tasks[i]);
    q[c] += tasks[i].size;
    q = drain(q);
  }
  return total;
}

/** Greedy baseline: always pick the node with the lowest latency right now. */
export function baseline(tasks: Task[]): { choices: number[]; total: number } {
  let q = NODES.map(() => 0);
  const choices: number[] = [];
  for (const t of tasks) {
    const lat = NODES.map((n, i) => latency(n, q[i], t));
    const best = lat.indexOf(Math.min(...lat));
    choices.push(best);
    q[best] += t.size;
    q = drain(q);
  }
  return { choices, total: replay(tasks, choices)! };
}
