import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap stack" style={{ padding: "96px 32px" }}>
      <div className="kicker">404 · packet dropped</div>
      <h1 className="display">This route has no node.</h1>
      <p className="lede">The page you asked for isn&apos;t here. Try the notes, or ask.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Link href="/notes" className="btn primary">Read the notes</Link><Link href="/ask" className="btn">Ask the Notes</Link></div>
    </section>
  );
}
