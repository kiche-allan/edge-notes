"use client";
import { useState } from "react";

const KEYS: [string, string][] = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["*", ""], ["0", "+"], ["#", ""]];

/** Talks to the real /api/ussd endpoint, exactly as Africa's Talking would. */
export default function Phone({ code }: { code: string }) {
  const [screen, setScreen] = useState(`Safaricom\n\n\n${code}`);
  const [inSession, setInSession] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text: string, entered: string | null) {
    setBusy(true);
    setScreen("USSD code running…");
    try {
      const res = await fetch("/api/ussd", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId: "web-sim", phoneNumber: "", serviceCode: code, text }) });
      const reply = await res.text();
      const open = reply.startsWith("CON ");
      setScreen(reply.replace(/^(CON|END) /, ""));
      setInSession(open);
      setHistory(open && entered !== null ? (h) => [...h, entered] : open ? [] : []);
      if (!open) setHistory([]);
    } catch {
      setScreen("Connection problem.\nTry again.");
      setInSession(false);
    } finally {
      setInput("");
      setBusy(false);
    }
  }

  const call = () => {
    if (busy) return;
    if (!inSession) return send("", null);
    if (!input) return;
    send([...history, input].join("*"), input);
  };
  const end = () => { setInSession(false); setHistory([]); setInput(""); setScreen(`Safaricom\n\n\n${code}`); };
  const key = (k: string) => { if (inSession && /[0-9]/.test(k)) setInput((v) => (v + k).slice(0, 3)); };

  return (
    <div className="phone">
      <div style={{ display: "flex", justifyContent: "center" }}><span style={{ width: 56, height: 6, borderRadius: 99, background: "#3A3228" }} /></div>
      <div className="screen" role="log" aria-live="polite" aria-label="Phone screen">
        <pre>{screen}</pre>
        <div style={{ borderTop: "1px solid #8A9A6A", paddingTop: 6, fontSize: 18, display: "flex", justifyContent: "space-between", gap: 8 }}>
          {inSession ? <span>Reply: {input || "_"}</span> : <span>Menu</span>}
          <span>{inSession ? "Send" : "Call"}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={call} aria-label={inSession ? "Send reply" : "Call"} style={{ flex: 1, minHeight: 48, border: 0, borderRadius: 24, background: "#3F7A4A", color: "#F6F0E4", fontWeight: 600, cursor: "pointer" }}>{inSession ? "Send" : "Call"}</button>
        <button type="button" onClick={end} aria-label="End" style={{ flex: 1, minHeight: 48, border: 0, borderRadius: 24, background: "#9A3324", color: "#F6F0E4", fontWeight: 600, cursor: "pointer" }}>End</button>
      </div>
      <div className="keypad">
        {KEYS.map(([k, sub]) => (
          <button key={k} type="button" onClick={() => key(k)} aria-label={`Key ${k}`}><b>{k}</b><small>{sub}</small></button>
        ))}
      </div>
    </div>
  );
}
