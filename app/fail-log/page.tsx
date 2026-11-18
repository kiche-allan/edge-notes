import Link from "next/link";
import type { Metadata } from "next";
import { FAILS } from "@/lib/site";

export const metadata: Metadata = { title: "Fail log" };

const LABEL = { post: "Became a post", stuck: "Still stuck", abandoned: "Abandoned" } as const;

export default function FailLogPage() {
  return (
    <>
      <section className="wrap row" style={{ padding: "72px 32px 48px", alignItems: "flex-end", gap: 40 }}>
        <div className="stack" style={{ flex: "2 1 520px", minWidth: 0 }}>
          <div className="kicker">Fail log</div>
          <h1 className="display">Packets that <em>dropped</em>.</h1>
          <p className="lede">Experiments that didn&apos;t work, written down while it still stings. What I tried, what happened, and what I&apos;d do differently.</p>
        </div>
        <div style={{ flex: "1 1 280px", display: "flex", gap: 32 }}>
          <div><div className="serif" style={{ fontSize: 52, lineHeight: 1 }}>{FAILS.length}</div><div className="dim" style={{ fontSize: 14 }}>logged failures</div></div>
          <div><div className="serif" style={{ fontSize: 52, lineHeight: 1, color: "var(--green)" }}>{FAILS.filter((f) => f.status === "post").length}</div><div className="dim" style={{ fontSize: 14 }}>became a post</div></div>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 88 }}>
        {FAILS.map((f) => (
          <article key={f.num} className="stack" style={{ borderTop: "2px solid var(--ink)", padding: "28px 0 32px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 16px" }}>
              <span className="serif" style={{ fontSize: 20, color: "var(--accent)" }}>#{f.num}</span>
              <span className="kicker sm" style={{ color: "var(--muted2)" }}>{f.project} · {f.date}</span>
              <span className={`status ${f.status}`} style={{ marginLeft: "auto" }}>{LABEL[f.status]}</span>
            </div>
            <h2 className="h3" style={{ fontSize: 34 }}>{f.title}</h2>
            <div className="grid-auto" style={{ gap: 16 }}>
              {([["Tried", f.tried, "var(--muted2)"], ["Happened", f.happened, "var(--accent)"], ["Learned", f.learned, "var(--green)"]] as const).map(([h, body, c]) => (
                <div key={h} className="card stack" style={{ gap: 6, padding: 18 }}>
                  <span className="kicker sm" style={{ color: c }}>{h}</span><span>{body}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
        <p className="serif muted" style={{ borderTop: "1px solid var(--rule)", paddingTop: 24, fontStyle: "italic", fontSize: 20 }}>
          Failed at something similar? <Link href="/#office-hours" className="link" style={{ fontStyle: "normal", fontFamily: "var(--sans)", fontSize: 16 }}>Compare notes at office hours</Link>
        </p>
      </section>
    </>
  );
}
