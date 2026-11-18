import Link from "next/link";
import type { Metadata } from "next";
import { ask } from "@/lib/ask";
import { query } from "@/lib/db";

export const metadata: Metadata = { title: "Ask the Notes" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AskPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 500);
  const answer = q ? ask(q) : null;
  if (q && answer) {
    query("INSERT INTO questions (question, answered, sources) VALUES ($1, $2, $3)", [q, answer.answered, answer.sources.map((s) => s.href)]).catch(() => {});
  }
  const recent = (await query<{ question: string }>(
    "SELECT question FROM questions WHERE answered GROUP BY question ORDER BY max(created_at) DESC LIMIT 3",
  ).catch(() => null)) ?? [];

  return (
    <>
      <section className="wrap narrow stack" style={{ padding: "64px 32px 32px" }}>
        <div className="kicker">Ask the Notes</div>
        <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 56px)" }}>Ask anything I&apos;ve written about.</h1>
        <p className="lede" style={{ fontSize: 18 }}>Answers come only from the posts on this site. Every passage links back to where I wrote it. If I haven&apos;t written about it, it says so.</p>
        <form action="/ask" method="get" style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 8 }}>
          <label htmlFor="q" className="sr-only">Your question</label>
          <input id="q" name="q" defaultValue={q} required className="field" style={{ border: "2px solid var(--ink)", minHeight: 60 }} placeholder="How does PRISM decide where a task runs?" />
          <button className="btn ink" style={{ minHeight: 60, borderRadius: 10 }}>Ask</button>
        </form>
      </section>

      {answer?.answered && (
        <section className="wrap narrow" style={{ paddingBottom: 40 }}>
          <div className="card stack" style={{ borderRadius: 14, padding: 32 }}>
            <div className="dim" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span className="dot" style={{ background: "var(--green)" }} />Answered from {answer.sources.length} {answer.sources.length === 1 ? "note" : "notes"}
            </div>
            <div className="serif" style={{ fontSize: 21, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 14 }}>
              {answer.parts.map((p, i) => (
                <p key={i} style={{ margin: 0 }}>{p.text} <a href={answer.sources[p.cite - 1].href} style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--accent)", verticalAlign: "super" }}>[{p.cite}]</a></p>
              ))}
            </div>
            <div className="stack" style={{ gap: 10, borderTop: "1px solid var(--rule)", paddingTop: 18 }}>
              <div className="kicker sm" style={{ color: "var(--muted2)" }}>Sources</div>
              {answer.sources.map((s) => (
                <Link key={s.n} href={s.href} style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{s.n}</span>
                  <span><span className="serif" style={{ fontSize: 19 }}>{s.title}</span><span className="dim" style={{ display: "block", fontSize: 14 }}>Section: {s.section}</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {answer && !answer.answered && (
        <section className="wrap narrow" style={{ paddingBottom: 40 }}>
          <div className="stack" style={{ border: "1.5px dashed var(--muted2)", borderRadius: 14, padding: "24px 28px", gap: 10 }}>
            <div className="kicker sm" style={{ color: "var(--muted2)" }}>Not in the notes yet</div>
            <p className="serif" style={{ margin: 0, fontSize: 20 }}>I haven&apos;t written about that yet. Your question is saved to a list I read, and the good ones become posts.</p>
            <Link href="/#office-hours" className="link" style={{ alignSelf: "flex-start" }}>Or bring it to office hours</Link>
          </div>
        </section>
      )}

      <section className="wrap narrow stack" style={{ paddingBottom: 80, gap: 0 }}>
        <h2 className="kicker sm" style={{ margin: "0 0 12px" }}>{recent.length ? "Others asked" : "Try asking"}</h2>
        {(recent.length ? recent.map((r) => r.question) : ["How does the Swahili bot handle voice notes?", "What stack runs the compliance RAG?", "Where do I start with Kubernetes?"]).map((x) => (
          <Link key={x} href={`/ask?q=${encodeURIComponent(x)}`} className="serif" style={{ borderTop: "1px solid var(--rule)", padding: "14px 0", fontSize: 20 }}>{x}</Link>
        ))}
      </section>
    </>
  );
}
