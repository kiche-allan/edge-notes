import type { Metadata } from "next";
import { NOW, SHELF, USES } from "@/lib/site";

export const metadata: Metadata = { title: "Now, Uses & Shelf" };

export default function NowPage() {
  return (
    <>
      <section className="wrap row" style={{ padding: "72px 32px", gap: 48 }}>
        <div className="grow stack" style={{ flexBasis: 320, gap: 16 }}>
          <div className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span className="dot" />Updated {NOW.updated}</div>
          <h1 className="display">Now</h1>
          <p className="lede" style={{ fontSize: 18 }}>What has my attention this month, work and otherwise.</p>
        </div>
        <ul style={{ flex: "2 1 520px", minWidth: 0, margin: 0, padding: 0, listStyle: "none" }}>
          {NOW.items.map((n) => (
            <li key={n.kind} style={{ borderTop: "1px solid var(--rule)", padding: "20px 0", display: "flex", flexWrap: "wrap", gap: "6px 24px" }}>
              <span className="kicker sm" style={{ flex: "0 0 120px", paddingTop: 6 }}>{n.kind}</span>
              <span className="serif" style={{ flex: "1 1 300px", fontSize: 23, lineHeight: 1.4 }}>{n.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="uses" className="band">
        <div className="wrap section stack" style={{ gap: 32 }}>
          <div className="stack" style={{ gap: 10 }}>
            <h2 className="h2">Uses</h2>
            <p className="lede" style={{ fontSize: 18 }}>The hardware and software I build with.</p>
          </div>
          <div className="grid-auto">
            {USES.map((u) => (
              <div key={u.group} className="card stack" style={{ background: "var(--bg)", gap: 10 }}>
                <div className="kicker sm">{u.group}</div>
                {u.items.map((i) => (
                  <div key={i.name} style={{ borderTop: "1px solid var(--rule)", paddingTop: 8 }}>
                    <div style={{ fontWeight: 600 }}>{i.name}</div>
                    <div className="dim" style={{ fontSize: 14 }}>{i.note}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shelf" className="top-rule">
        <div className="wrap section stack" style={{ gap: 32 }}>
          <div className="stack" style={{ gap: 10 }}>
            <h2 className="h2">Shelf</h2>
            <p className="lede" style={{ fontSize: 18 }}>Books and papers, each with the one line I&apos;d underline.</p>
          </div>
          <div className="grid-auto">
            {SHELF.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div className="spine" style={{ background: b.spine }} />
                <div className="stack" style={{ gap: 4, minWidth: 0 }}>
                  <span className="dim" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>{b.kind} · {b.status}</span>
                  <span className="serif" style={{ fontSize: 21, lineHeight: 1.25 }}>{b.title}</span>
                  <span className="serif muted" style={{ fontStyle: "italic" }}>&ldquo;{b.note}&rdquo;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
