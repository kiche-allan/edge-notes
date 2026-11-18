"use client";
import { useEffect, useMemo, useState } from "react";
import { NODES, baseline, drain, latency, roundId, tasksFor } from "@/lib/game";

type Score = { handle: string; total_ms: number };

export default function PlaceTheTask() {
  const round = useMemo(() => roundId(), []);
  const tasks = useMemo(() => tasksFor(round), [round]);
  const base = useMemo(() => baseline(tasks), [tasks]);
  const [queues, setQueues] = useState(NODES.map(() => 0));
  const [choices, setChoices] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const [board, setBoard] = useState<Score[]>([]);
  const [handle, setHandle] = useState("");
  const [sent, setSent] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const step = choices.length;
  const done = step === tasks.length;
  const task = tasks[Math.min(step, tasks.length - 1)];

  const loadBoard = () => fetch(`/api/lab/scores?round=${round}`).then((r) => r.json()).then((d) => setBoard(d.scores ?? [])).catch(() => {});
  useEffect(() => { loadBoard(); }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  function place(i: number) {
    if (done) return;
    setTotal((t) => t + latency(NODES[i], queues[i], task));
    const q = [...queues];
    q[i] += task.size;
    setQueues(drain(q));
    setChoices((c) => [...c, i]);
  }

  function reset() {
    setQueues(NODES.map(() => 0));
    setChoices([]);
    setTotal(0);
    setSent("idle");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent("busy");
    const res = await fetch("/api/lab/scores", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ round, handle, choices }) }).catch(() => null);
    setSent(res?.ok ? "ok" : "err");
    if (res?.ok) loadBoard();
  }

  return (
    <div className="lab-card" id="place-the-task" style={{ flexDirection: "row", flexWrap: "wrap", gap: 40 }}>
      <div className="grow stack" style={{ flexBasis: 320, gap: 16 }}>
        <div className="kicker sm">Experiment 01 · Round {round}</div>
        <h2 className="h2">Place the Task</h2>
        <p className="muted" style={{ margin: 0 }}>Ten tasks, three kinds of node. Send each task somewhere; lower total latency wins. Everyone plays the same ten this week. Then compare with a greedy baseline policy on the exact same sequence.</p>
        <div style={{ borderTop: "1px solid var(--night-line)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="dim" style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>This week&apos;s board</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Greedy baseline</span><span style={{ color: "var(--glow)", fontWeight: 600 }}>{base.total} ms</span></div>
          {board.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between" }}><span>{i + 1} · {s.handle}</span><span>{s.total_ms} ms</span></div>
          ))}
          {!board.length && <div className="dim" style={{ fontSize: 14 }}>No scores yet this week. Be the first.</div>}
        </div>
      </div>

      <div className="grow stack" style={{ flexBasis: 480, gap: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span className="dim" style={{ fontSize: 13 }}>Queue:</span>
          {tasks.map((t, i) => i >= step && i < step + 4 ? (
            <span key={i} className={i === step ? "task current" : "task"}>{t.kind} · {t.size} MB</span>
          ) : null)}
          {done && <span className="task">All placed</span>}
        </div>

        <div className="stack" style={{ gap: 10 }}>
          {NODES.map((n, i) => {
            const preview = done ? null : latency(n, queues[i], task);
            return (
              <button key={n.id} type="button" className="node-btn" onClick={() => place(i)} disabled={done} aria-label={`Send to ${n.name}${preview ? `, ${preview} milliseconds` : ""}`}>
                <span style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 12 }}>
                  <strong>Node {n.id} · {n.name}</strong>
                  <span className="dim">{preview !== null ? `${preview} ms if sent here` : ""}</span>
                </span>
                <span className="bar" style={{ width: "100%" }}><span style={{ width: `${Math.min(100, (queues[i] / 60) * 100)}%` }} /></span>
                <span className="dim" style={{ fontSize: 13 }}>{Math.round(queues[i])} MB queued · {n.base} ms link · {n.rate} MB/s</span>
              </button>
            );
          })}
        </div>

        <div className="between" style={{ alignItems: "center" }}>
          <span>Task {Math.min(step + 1, tasks.length)} of {tasks.length} · your total <strong>{total} ms</strong></span>
          <button type="button" className="btn sm ghost" onClick={reset}>Restart</button>
        </div>

        {done && (
          <div className="stack" style={{ gap: 12, borderTop: "1px solid var(--night-line)", paddingTop: 16 }}>
            <p className="serif" style={{ margin: 0, fontSize: 24 }}>
              {total < base.total ? `You beat the baseline by ${base.total - total} ms.` : total === base.total ? "Dead heat with the baseline." : `The baseline wins by ${total - base.total} ms.`}
            </p>
            <p className="dim" style={{ margin: 0, fontSize: 14 }}>Baseline placed: {base.choices.map((c) => NODES[c].id).join(" ")} · You placed: {choices.map((c) => NODES[c].id).join(" ")}</p>
            {sent === "ok" ? <p style={{ margin: 0 }}>Score saved.</p> : (
              <form onSubmit={submit} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <label htmlFor="handle" className="sr-only">Your handle</label>
                <input id="handle" required maxLength={30} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Your handle" className="field sans" style={{ minHeight: 48, background: "var(--night-3)", color: "var(--night-ink)", borderColor: "var(--night-line)" }} />
                <button className="btn glow" disabled={sent === "busy"}>Save my score</button>
                {sent === "err" && <span role="alert" style={{ flexBasis: "100%", fontSize: 14 }}>Couldn&apos;t save the score. Try again in a moment.</span>}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
