import Link from "next/link";
import type { Metadata } from "next";
import { DownloadIcon, MicIcon } from "@/components/Icons";
import { PAPERS } from "@/lib/site";

export const metadata: Metadata = { title: "Papers & demos" };

export default function WorkPage() {
  return (
    <>
      <section className="wrap stack" style={{ padding: "72px 32px 40px" }}>
        <div className="kicker">Work</div>
        <h1 className="display">Papers, explained. Demos you can touch.</h1>
      </section>

      <section className="wrap" style={{ paddingBottom: 72 }}>
        <h2 className="h2" style={{ fontSize: 36, marginBottom: 16 }}>Papers &amp; reports</h2>
        {PAPERS.map((p) => (
          <article key={p.title} className="row" style={{ borderTop: "2px solid var(--ink)", padding: "32px 0", gap: "32px 48px" }}>
            <div className="grow stack" style={{ flexBasis: 360, gap: 12 }}>
              <div className="kicker sm">{p.tag}</div>
              <h3 className="h3" style={{ fontSize: 32 }}>{p.title}</h3>
              <div className="dim" style={{ fontSize: 14 }}>{p.meta}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {p.pdf ? <a href={p.pdf} className="btn sm"><DownloadIcon />PDF</a> : <span className="chip">PDF coming</span>}
                <Link href={p.lab.href} className="btn sm soft">{p.lab.label}</Link>
              </div>
            </div>
            <div className="grow card stack" style={{ flexBasis: 420, gap: 10 }}>
              <div className="kicker sm" style={{ color: "var(--muted2)" }}>In plain words</div>
              <p className="serif" style={{ margin: 0, fontSize: 21, lineHeight: 1.55 }}>{p.plain}</p>
              <div className="kicker sm" style={{ color: "var(--muted2)", paddingTop: 6 }}>Why it matters</div>
              <p className="muted" style={{ margin: 0 }}>{p.why}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="band">
        <div className="wrap section stack" style={{ gap: 28 }}>
          <h2 className="h2" style={{ fontSize: 36 }}>Demos</h2>
          <div className="row" style={{ gap: 28 }}>
            <div id="sauti" className="grow card stack" style={{ flexBasis: 460, background: "var(--bg)", borderRadius: 14 }}>
              <div className="kicker sm" style={{ color: "var(--green)" }}>Voice · Kiswahili</div>
              <h3 className="h3" style={{ fontSize: 32 }}>Sauti ya Sheria</h3>
              <p className="muted" style={{ margin: 0 }}>Ask about Kenya&apos;s Data Protection Act 2019 in Swahili, by voice. Whisper transcribes, multilingual retrieval finds the clause, and the answer comes back as audio. It&apos;s being packaged as a WhatsApp voice-note bot.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <span className="btn" style={{ background: "var(--green)", borderColor: "var(--green)", color: "#F6F0E4", cursor: "default" }}><MicIcon />WhatsApp demo coming</span>
                <Link href="/notes/swahili-whatsapp-bot" className="btn">Read the build log</Link>
              </div>
            </div>
            <div id="compliance" className="grow card stack" style={{ flexBasis: 460, background: "var(--bg)", borderRadius: 14 }}>
              <div className="kicker sm">Retrieval · Kenyan law</div>
              <h3 className="h3" style={{ fontSize: 32 }}>Compliance RAG</h3>
              <p className="muted" style={{ margin: 0 }}>Questions on the Data Protection Act and AML/CFT rules for fintechs. Every answer shows the clause it came from, side by side.</p>
              <div className="dim" style={{ fontSize: 13 }}>FastAPI · FAISS · Ollama · Next.js · PostgreSQL</div>
              <Link href="/notes/rag-over-kenyan-law" className="btn ink" style={{ alignSelf: "flex-start" }}>Read how it works</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
