"use client";
import { useEffect, useState } from "react";

type Run = { label: string; illustrative: boolean; rewards: number[] };

// Drop a real run log at public/runs/reward.json ({ "label": "...", "rewards": [ ... ] }) and this page uses it.
function sample(): Run {
  const rewards = Array.from({ length: 200 }, (_, i) => -1 + 1.8 * (1 - Math.exp(-i / 45)) + Math.sin(i / 7) * 0.035 + Math.sin(i / 2.3) * 0.012);
  return { label: "Illustrative curve", illustrative: true, rewards };
}

export default function WatchItLearn() {
  const [run, setRun] = useState<Run>(sample);
  const [ep, setEp] = useState(120);
  useEffect(() => {
    fetch("/runs/reward.json").then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => {
      if (Array.isArray(d.rewards) && d.rewards.length > 1) { setRun({ label: d.label ?? "Training run", illustrative: false, rewards: d.rewards }); setEp(Math.floor(d.rewards.length * 0.6)); }
    }).catch(() => {});
  }, []);

  const r = run.rewards;
  const min = Math.min(...r), max = Math.max(...r);
  const X = (i: number) => 44 + (i / (r.length - 1)) * 376;
  const Y = (v: number) => 200 - ((v - min) / (max - min || 1)) * 160;
  const d = r.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const cur = Math.min(ep, r.length - 1);

  return (
    <div className="lab-card grow" id="watch-it-learn" style={{ flexBasis: 460 }}>
      <div className="kicker sm">Experiment 03</div>
      <h2 className="h2" style={{ fontSize: 36 }}>Watch it learn</h2>
      <p className="muted" style={{ margin: 0 }}>A training run, replayed. Scrub through the episodes and watch the reward climb as the policy gets better at placing tasks.</p>
      <svg viewBox="0 0 440 240" role="img" aria-label={`Reward curve, episode ${cur} reward ${r[cur].toFixed(2)}`} className="lab-board" style={{ width: "100%", height: "auto" }}>
        {[40, 100, 160].map((y) => <line key={y} x1="44" x2="420" y1={y} y2={y} stroke="#3A3228" />)}
        <line x1="44" x2="420" y1="200" y2="200" stroke="#6B6256" />
        <path d={d} fill="none" stroke="#E58A6C" strokeWidth="2.5" />
        <line x1={X(cur)} x2={X(cur)} y1="40" y2="200" stroke="#F6F0E4" strokeDasharray="3 4" />
        <circle cx={X(cur)} cy={Y(r[cur])} r="6" fill="#F6F0E4" />
        <text x="44" y="222" fontSize="11" fill="#BFB5A2">episode 0</text>
        <text x="420" y="222" fontSize="11" fill="#BFB5A2" textAnchor="end">{r.length - 1}</text>
      </svg>
      <label htmlFor="ep" className="dim" style={{ fontSize: 14 }}>Episode {cur} · reward {r[cur].toFixed(2)}</label>
      <input id="ep" type="range" min={0} max={r.length - 1} value={cur} onChange={(e) => setEp(Number(e.target.value))} style={{ width: "100%", accentColor: "#E58A6C" }} />
      <div className="dim" style={{ fontSize: 13 }}>{run.illustrative ? "Illustrative curve until a real run log is added." : run.label}</div>
    </div>
  );
}
