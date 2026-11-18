"use client";
import { useMemo, useState } from "react";

// A small cluster. Toggle nodes off and watch the shortest route from your phone to the cloud change.
const N = [
  { id: 0, name: "Your phone", x: 50, y: 120, fixed: true },
  { id: 1, name: "Roadside A", x: 160, y: 50 },
  { id: 2, name: "Roadside B", x: 160, y: 190 },
  { id: 3, name: "Base station", x: 280, y: 50 },
  { id: 4, name: "Edge server", x: 280, y: 190 },
  { id: 5, name: "Cloud", x: 390, y: 120, fixed: true },
];
const E: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [1, 4]];

function route(down: Set<number>): number[] | null {
  const prev = new Map<number, number>([[0, -1]]);
  const queue = [0];
  while (queue.length) {
    const at = queue.shift()!;
    if (at === 5) break;
    for (const [a, b] of E) {
      const nxt = a === at ? b : b === at ? a : -1;
      if (nxt < 0 || down.has(nxt) || prev.has(nxt)) continue;
      prev.set(nxt, at);
      queue.push(nxt);
    }
  }
  if (!prev.has(5)) return null;
  const path = [5];
  while (path[0] !== 0) path.unshift(prev.get(path[0])!);
  return path;
}

export default function BreakTheNetwork() {
  const [down, setDown] = useState<Set<number>>(new Set());
  const path = useMemo(() => route(down), [down]);
  const onPath = (a: number, b: number) => !!path && path.some((v, i) => i > 0 && ((path[i - 1] === a && v === b) || (path[i - 1] === b && v === a)));
  const toggle = (id: number) => setDown((d) => { const n = new Set(d); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="lab-card grow" id="break-the-network" style={{ flexBasis: 460 }}>
      <div className="kicker sm">Experiment 02</div>
      <h2 className="h2" style={{ fontSize: 36 }}>Break the Network</h2>
      <p className="muted" style={{ margin: 0 }}>Click a node to knock it out. The route from your phone to the cloud finds another way, until it can&apos;t.</p>
      <svg viewBox="0 0 440 240" role="img" aria-label="Network graph; the highlighted line is the current route" className="lab-board" style={{ width: "100%", height: "auto" }}>
        {E.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke={onPath(a, b) ? "var(--glow)" : "#4A4034"} strokeWidth={onPath(a, b) ? 3 : 1.5} opacity={down.has(a) || down.has(b) ? 0.25 : 1} />
        ))}
        {N.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={18} fill={down.has(n.id) ? "#1A1510" : n.fixed ? "#E58A6C" : "#2A241C"} stroke={down.has(n.id) ? "#6B6256" : "#F6F0E4"} strokeWidth="1.5" strokeDasharray={down.has(n.id) ? "3 3" : undefined} />
            <text x={n.x} y={n.y + 34} textAnchor="middle" fontSize="11" fill="#D9CFBC" fontFamily="var(--sans)">{n.name}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {N.filter((n) => !n.fixed).map((n) => (
          <button key={n.id} type="button" className="btn sm ghost" aria-pressed={down.has(n.id)} onClick={() => toggle(n.id)}>{down.has(n.id) ? `Restore ${n.name}` : `Kill ${n.name}`}</button>
        ))}
      </div>
      <div className="dim" style={{ fontSize: 15 }} role="status">
        {path ? <>Route: {path.map((i) => N[i].name).join(" → ")} · <strong style={{ color: "var(--night-ink)" }}>{path.length - 1} hops</strong></> : <strong style={{ color: "var(--glow)" }}>No route. The cloud is unreachable; this is where edge computing earns its keep.</strong>}
      </div>
    </div>
  );
}
