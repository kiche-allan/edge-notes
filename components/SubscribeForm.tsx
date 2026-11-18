"use client";
import { useState } from "react";

export default function SubscribeForm({ id = "email" }: { id?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("ok");
      setMsg(data.already ? "You're already on the list." : "You're in. The next note comes to your inbox.");
    } catch (err) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor={id} className="sr-only">Email address</label>
      <input id={id} name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
      <button type="submit" disabled={state === "busy"}>{state === "busy" ? "Subscribing…" : "Subscribe"}</button>
      {msg && <p className="form-msg" role="status">{msg}</p>}
    </form>
  );
}
