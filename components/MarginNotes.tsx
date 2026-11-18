"use client";
import { useEffect, useState } from "react";

type Note = { id: number; author_name: string; body: string; quote: string | null; is_author: boolean; created_at: string };

export default function MarginNotes({ slug, quote, onClearQuote }: { slug: string; quote: string; onClearQuote: () => void }) {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/notes?post=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setNotes(d.notes))
      .catch(() => setNotes([]));
  }, [slug]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ post: slug, name: fd.get("name"), body: fd.get("body"), quote: quote || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not post the note");
      setNotes((n) => [...(n ?? []), data.note]);
      form.reset();
      onClearQuote();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post the note");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="margin" aria-label="Margin notes">
      <div className="kicker sm">Marginalia · {notes?.length ?? 0}</div>
      {notes?.map((n) => (
        <div key={n.id} className="mnote">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="avatar">{n.author_name.slice(0, 1).toUpperCase()}</span>
            <strong style={{ fontSize: 14 }}>{n.author_name}{n.is_author ? " (author)" : ""}</strong>
          </div>
          {n.quote && <div className="serif dim" style={{ fontStyle: "italic" }}>&ldquo;{n.quote}&rdquo;</div>}
          <div>{n.body}</div>
        </div>
      ))}
      <form onSubmit={submit} className="stack" style={{ gap: 10, borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
        {quote ? (
          <div className="serif" style={{ fontStyle: "italic", fontSize: 15 }}>
            On: &ldquo;{quote}&rdquo; <button type="button" className="link" style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontSize: 13 }} onClick={onClearQuote}>clear</button>
          </div>
        ) : (
          <div className="dim" style={{ fontSize: 14 }}>Highlight a line in the post to note on it.</div>
        )}
        <label className="sr-only" htmlFor="mn-name">Your name</label>
        <input id="mn-name" name="name" required maxLength={60} placeholder="Your name" className="field sans" style={{ minHeight: 44 }} />
        <label className="sr-only" htmlFor="mn-body">Your note</label>
        <textarea id="mn-body" name="body" required maxLength={1000} placeholder="Your note" className="field" />
        <button className="btn sm ink" disabled={busy}>{busy ? "Posting…" : "Add margin note"}</button>
        {error && <p role="alert" style={{ margin: 0, color: "var(--accent)", fontSize: 14 }}>{error}</p>}
      </form>
    </aside>
  );
}
