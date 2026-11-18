"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChatIcon, DownloadIcon, MicIcon } from "./Icons";
import MarginNotes from "./MarginNotes";

type Body = { title: string; dek: string; html: string };
type Props = {
  slug: string;
  kicker: string;
  date: string;
  readMinutes: number;
  en: Body;
  sw?: Body;
  startLang: "en" | "sw";
  hops: { place: string; what: string }[];
};

const T = {
  en: { read: "min read", save: "Save for offline", saved: "Saved for offline", ask: "Ask about this post", show: "Show margin notes", hide: "Hide margin notes", trace: "Packet trace for this note", you: "You", from: "ms from Nairobi", readers: "Read" },
  sw: { read: "dakika za kusoma", save: "Hifadhi kwa nje ya mtandao", saved: "Imehifadhiwa nje ya mtandao", ask: "Uliza kuhusu makala hii", show: "Onyesha maoni", hide: "Ficha maoni", trace: "Njia ya pakiti ya makala hii", you: "Wewe", from: "ms kutoka Nairobi", readers: "Imesomwa" },
};

export default function PostReader({ slug, kicker, date, readMinutes, en, sw, startLang, hops }: Props) {
  const [lang, setLang] = useState<"en" | "sw">(startLang);
  const [saved, setSaved] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [ping, setPing] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const articleRef = useRef<HTMLDivElement>(null);
  const t = T[lang];
  const body = lang === "sw" && sw ? sw : en;

  useEffect(() => {
    // Round trip to the server in Nairobi-time: the reader's own "hop".
    const start = performance.now();
    fetch("/api/health", { cache: "no-store" }).then(() => setPing(Math.round(performance.now() - start))).catch(() => {});
    if ("caches" in window) caches.open("edge-notes-pages").then((c) => c.match(location.pathname)).then((hit) => setSaved(Boolean(hit))).catch(() => {});
  }, []);

  async function saveOffline() {
    if (!("caches" in window)) return;
    const cache = await caches.open("edge-notes-pages");
    await cache.add(location.pathname);
    setSaved(true);
  }

  function captureSelection() {
    const sel = window.getSelection()?.toString().trim() ?? "";
    if (sel && articleRef.current?.contains(window.getSelection()?.anchorNode ?? null)) setQuote(sel.slice(0, 300));
  }

  return (
    <>
      <section className="wrap article-head">
        <div className="between">
          <Link href="/notes" className="kicker">{kicker}</Link>
          {sw && (
            <div role="group" aria-label="Language" style={{ display: "inline-flex", gap: 4, border: "1.5px solid var(--rule)", borderRadius: 999, padding: 3 }}>
              <button type="button" className="btn sm" style={{ border: 0, minHeight: 38 }} aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
              <button type="button" className="btn sm" style={{ border: 0, minHeight: 38 }} aria-pressed={lang === "sw"} onClick={() => setLang("sw")}>SW</button>
            </div>
          )}
        </div>
        <h1 lang={lang}>{body.title}</h1>
        <div className="meta-row">
          <span style={{ marginRight: 8 }}>Allan · {date} · {readMinutes} {t.read}</span>
          <button type="button" className="btn sm soft" onClick={saveOffline} disabled={saved}><DownloadIcon />{saved ? t.saved : t.save}</button>
          <Link href={`/ask?q=${encodeURIComponent(en.title.split(":")[0])}`} className="btn sm soft"><MicIcon />{t.ask}</Link>
          <button type="button" className="btn sm soft" onClick={() => setShowNotes(!showNotes)}><ChatIcon />{showNotes ? t.hide : t.show}</button>
        </div>
      </section>

      <section className="wrap article-grid">
        <div ref={articleRef} className="prose" lang={lang} onMouseUp={captureSelection} onTouchEnd={captureSelection} dangerouslySetInnerHTML={{ __html: body.html }} />
        {showNotes && <MarginNotes slug={slug} quote={quote} onClearQuote={() => setQuote("")} />}
      </section>

      <section className="wrap" style={{ paddingBottom: 64 }}>
        <div className="trace">
          <div className="between">
            <div className="kicker sm">{t.trace}</div>
            <div className="dim" style={{ fontSize: 13 }}>traceroute edge-notes/{slug}</div>
          </div>
          <ol className="hops">
            {[...hops, { place: t.you, what: ping === null ? "…" : `${ping} ${t.from}`, you: true }].map((h, i) => (
              <li key={i}>
                <div className="hop-line"><i className={"you" in h ? "open" : undefined} /><b /></div>
                <div className="dim" style={{ fontSize: 12 }}>Hop {i + 1}</div>
                <div className="serif" style={{ fontSize: 22, lineHeight: 1.2 }}>{h.place}</div>
                <div className="dim" style={{ fontSize: 14 }}>{h.what}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
