import type { Metadata } from "next";
import Phone from "./Phone";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "USSD mode" };

export default function UssdPage() {
  return (
    <section className="wrap row" style={{ padding: "72px 32px 96px", alignItems: "flex-start", gap: 64 }}>
      <div className="grow stack" style={{ flexBasis: 440, gap: 24 }}>
        <div className="kicker">USSD mode</div>
        <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 68px)" }}>Read the blog from a <em>kabambe</em>.</h1>
        <p className="lede" style={{ fontSize: 19 }}>No smartphone, no data bundle. Dial the code, pick a number, and get the note. The same way you check M-Pesa.</p>
        <div className="card" style={{ border: "2px solid var(--ink)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px" }}>
          <span className="kicker sm" style={{ color: "var(--muted2)" }}>Dial</span>
          <span style={{ fontFamily: "VT323, monospace", fontSize: 40, lineHeight: 1 }}>{SITE.ussdCode}</span>
          <span className="dim" style={{ fontSize: 14 }}>Safaricom · Airtel · Telkom</span>
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {[["Latest notes", "a short summary and a link for later."], ["Ask a question", "by SMS; Ask the Notes replies with a citation."], ["Subscribe by SMS", "one message per new note."], ["Kiswahili", "every menu, in Swahili."]].map(([a, b], i) => (
            <li key={a} style={{ borderTop: "1px solid var(--rule)", borderBottom: i === 3 ? "1px solid var(--rule)" : undefined, padding: "14px 0", display: "flex", gap: 16 }}>
              <span className="serif" style={{ fontSize: 24, color: "var(--accent)", lineHeight: 1.1 }}>{i + 1}</span><span><strong>{a}</strong>: {b}</span>
            </li>
          ))}
        </ol>
        <p className="dim" style={{ margin: 0, fontSize: 14 }}>Try it on the phone: press Call, type a number, press Send. It runs the same menu the real USSD code will.</p>
      </div>
      <Phone code={SITE.ussdCode} />
    </section>
  );
}
